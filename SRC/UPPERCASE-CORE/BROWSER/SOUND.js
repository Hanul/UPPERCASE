/*
 * 사운드 파일을 재생하는 SOUND 클래스
 */
global.SOUND = CLASS((cls) => {

	let audioContext;

	return {

		init : (inner, self, params) => {
			//REQUIRED: params
			//OPTIONAL: params.ogg
			//OPTIONAL: params.mp3
			//OPTIONAL: params.isLoop
			//OPTIONAL: params.gain

			let ogg = params.ogg;
			let mp3 = params.mp3;
			let isLoop = params.isLoop;
			let gain = params.gain;
			
			if (gain === undefined) {
				gain = 0.5;
			}
			
			let buffer;
			let source;
			let gainNode;
			
			let startedAt = 0;
			let pausedAt = 0;
			
			let delayed;
			
			// init audioContext.
			if (audioContext === undefined) {
				audioContext = new AudioContext();
			}
			
			let request = new XMLHttpRequest();
			request.open('GET', new Audio().canPlayType('audio/ogg') !== '' ? ogg : mp3, true);
			request.responseType = 'arraybuffer';

			request.onload = () => {

				audioContext.decodeAudioData(request.response, (_buffer) => {

					gainNode = audioContext.createGain();

					buffer = _buffer;
					
					gainNode.connect(audioContext.destination);
					gainNode.gain.value = gain;

					if (delayed !== undefined) {
						delayed();
					}
				});
			};
			request.send();

			let play = self.play = () => {

				delayed = () => {

					source = audioContext.createBufferSource();
					source.buffer = buffer;
					source.connect(gainNode);
					source.loop = isLoop;
					
					startedAt = Date.now() - pausedAt;
					source.start(0, pausedAt / 1000);
					
					delayed = undefined;
				};

				if (buffer !== undefined) {
					delayed();
				}

				return self;
			};
			
			let pause = self.pause = () => {
				
				if (source !== undefined) {
					source.stop(0);
					pausedAt = Date.now() - startedAt;
				}
				
				delayed = undefined;
			};

			let stop = self.stop = () => {
				
				if (source !== undefined) {
					source.stop(0);
					pausedAt = 0;
					
					source = undefined;
				}
				
				delayed = undefined;
			};
			
			let setGain = self.setGain = (_gain) => {
				gain = _gain;
				
				if (gainNode !== undefined) {
					gainNode.gain.value = gain;
				}
			};
		}
	};
});
