/**
 * ImageMagick을 사용해 이미지의 크기를 조절하여 새 파일로 저장합니다.
 */
global.IMAGEMAGICK_RESIZE = METHOD(function() {
	'use strict';

	var
	//IMPORT: path
	_path = require('path');

	return {

		run : function(params, callbackOrHandlers) {
			//REQUIRED: params.srcPath
			//REQUIRED: params.distPath
			//OPTIONAL: params.width
			//OPTIONAL: params.height
			//OPTIONAL: callbackOrHandlers

			var
			// src path
			srcPath = params.srcPath,

			// dist path
			distPath = params.distPath,

			// width
			width = params.width,

			// height
			height = params.height,

			// callback.
			callback,

			// error handler.
			errorHandler;

			if (callbackOrHandlers !== undefined) {
				if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
					callback = callbackOrHandlers;
				} else {
					callback = callbackOrHandlers.success;
					errorHandler = callbackOrHandlers.error;
				}
			}

			CREATE_FOLDER(_path.dirname(distPath), {
				error : errorHandler,
				success : function() {

					IMAGEMAGICK_IDENTIFY(srcPath, {
						error : errorHandler,
						success : function(features) {

							if (width === undefined) {
								width = height / features.height * features.width;
							}

							if (height === undefined) {
								height = width / features.width * features.height;
							}

							IMAGEMAGICK_CONVERT([srcPath, '-resize', width + 'x' + height + '\!', distPath], callbackOrHandlers);
						}
					});
				}
			});
		}
	};
});
