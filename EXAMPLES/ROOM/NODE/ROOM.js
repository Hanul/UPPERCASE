// load UPPERCASE.JS.
require('../../../UPPERCASE.JS-COMMON.js');
require('../../../UPPERCASE.JS-NODE.js');

// load UPPERCASE.IO-TRANSPORT.
require('../../../UPPERCASE.IO-TRANSPORT/NODE.js');

// load UPPERCASE.IO-ROOM.
require('../../../UPPERCASE.IO-ROOM/NODE.js');

TEST('ROOM', function(ok) {
	'use strict';

	CPU_CLUSTERING(function(workerData) {

		var
		// web socket fix request
		webSocketFixRequest,

		// web server
		webServer = WEB_SERVER(9127, function(requestInfo, response, onDisconnected) {

			// serve web socket fix request
			if (requestInfo.uri === '__WEB_SOCKET_FIX') {

				webSocketFixRequest(requestInfo, {
					response : response,
					onDisconnected : onDisconnected
				});
			}
		});

		webSocketFixRequest = LAUNCH_ROOM_SERVER({
			socketServerPort : 9126,
			webServer : webServer,
			isCreateWebSocketFixRequestManager : true
		}).getWebSocketFixRequest();

		BOX('TestBox');

		TestBox.ROOM('testRoom', function(clientInfo, on, off) {

			on('msg', function(data, ret) {

				console.log(data);
				
				// ignore undefined data attack.
				if (data !== undefined) {
	
					TestBox.BROADCAST({
						roomName : 'testRoom',
						methodName : 'msg',
						data : {
							result : 'good!',
							test : new Date()
						}
					});
	
					ret({
						result : 'good!'
					});
				}
			});
		});

		INIT_OBJECTS();
	});
});
