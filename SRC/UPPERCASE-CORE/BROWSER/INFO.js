/*
 * 웹 브라우저 정보를 담고 있는 객체
 */
global.INFO = OBJECT({

	init : (inner, self) => {

		let isTouchMode = ('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch;
		let isTouching;

		let getLang = self.getLang = () => {

			let lang = STORE('__INFO').get('lang');

			if (lang === undefined) {
				lang = navigator.language.toLowerCase();
			}

			return lang;
		};

		let setLang = self.setLang = (lang) => {
			//REQUIRED: lang

			STORE('__INFO').save({
				name : 'lang',
				value : lang
			});
		};

		let changeLang = self.changeLang = (lang) => {
			//REQUIRED: lang

			setLang(lang);

			location.reload();
		};

		let checkIsTouchMode = self.checkIsTouchMode = () => {
			return isTouchMode;
		};

		let getOSName = self.getOSName = () => {
			// using bowser. (https://github.com/ded/bowser)
			return bowser.osname;
		};

		let getBrowserName = self.getBrowserName = () => {
			// using bowser. (https://github.com/ded/bowser)
			return bowser.name;
		};

		let getBrowserVersion = self.getBrowserVersion = () => {
			// using bowser. (https://github.com/ded/bowser)
			return REAL(bowser.version);
		};
		
		EVENT_LOW('mousemove', () => {
			if (isTouching !== true) {
				isTouchMode = false;
			}
		});
		
		EVENT_LOW('touchstart', () => {
			isTouchMode = true;
			isTouching = true;
		});
		
		EVENT_LOW('touchend', () => {
			DELAY(() => {
				isTouching = false;
			});
		});
	}
});
