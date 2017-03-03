/*
 * 디스크 사용률을 반환합니다.
 */
global.DISK_USAGE = METHOD(() => {

	let diskspace = require('diskspace');

	return {

		run : (drive, callbackOrHandlers) => {
			//OPTIONAL: drive	확인할 디스크 드라이브
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success
			
			let errorHandler;
			let callback;

			if (callbackOrHandlers === undefined) {
				callbackOrHandlers = drive;
				drive = undefined;
			}
			
			if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
				callback = callbackOrHandlers;
			} else {
				errorHandler = callbackOrHandlers.error;
				callback = callbackOrHandlers.success;
			}
			
			if (drive === undefined) {
				if (process.platform === 'win32') {
					drive = 'c:';
				} else {
					drive = '/';
				}
			}
			
			diskspace.check(drive, (err, total, free, status) => {
				if (status === 'READY') {
					callback((1 - free / total) * 100);
				} else if (errorHandler !== undefined) {
					errorHandler(status);
				} else {
					SHOW_ERROR('DISK_USAGE', status);
				}
			});
		}
	};
});
