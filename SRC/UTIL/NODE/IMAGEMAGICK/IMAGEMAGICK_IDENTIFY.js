/**
 * ImageMagick® identify.
 */
global.IMAGEMAGICK_IDENTIFY = METHOD(function() {
	'use strict';

	var
	//IMPORT: imagemagick
	imagemagick = require('imagemagick');

	return {

		run : function(path, callbackOrHandlers) {
			//REQUIRED: path
			//REQUIRED: callbackOrHandlers

			var
			// callback.
			callback,

			// error handler.
			errorHandler;

			if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
				callback = callbackOrHandlers;
			} else {
				callback = callbackOrHandlers.success;
				errorHandler = callbackOrHandlers.error;
			}

			imagemagick.identify(path, function(error, features) {

				var
				// error msg
				errorMsg;

				if (error !== TO_DELETE) {

					errorMsg = error.toString();

					if (errorHandler !== undefined) {
						errorHandler(errorMsg);
					} else {
						console.log(CONSOLE_RED('[UPPERCASE-IMAGEMAGICK_IDENTIFY] ERROR: ' + errorMsg));
					}

				} else {
					callback(features);
				}
			});
		}
	};
});
