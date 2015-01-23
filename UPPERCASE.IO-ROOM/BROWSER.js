FOR_BOX(function(box) {
	'use strict';

	OVERRIDE(box.ROOM, function(origin) {

		/**
		 * Connection room class
		 */
		box.ROOM = CLASS({

			preset : function() {
				return origin;
			},

			init : function(inner, self, name) {
				//REQUIRED: name

				var
				// send.
				send;

				//OVERRIDE: self.send
				self.send = send = function(params, callback) {
					//REQUIRED: params
					//REQUIRED: params.methodName
					//REQUIRED: params.data
					//OPTIONAL: callback

					if (inner.checkIsExited() !== true) {

						CONNECT_TO_ROOM_SERVER.send({
							methodName : inner.getRoomName() + '/' + params.methodName,
							data : params.data
						}, callback);

					} else {
						console.log(CONSOLE_RED('[UPPERCASE.IO-ROOM] `ROOM.send` ERROR! ROOM EXITED!'));
					}
				};
			}
		});
	});
});

/*
 * connect to room server.
 */
global.CONNECT_TO_ROOM_SERVER = METHOD(function(m) {
	'use strict';

	var
	// enter room names
	enterRoomNames = [],

	// on infos
	onInfos = [],

	// waiting send infos
	waitingSendInfos = [],

	// is connected
	isConnected,

	// inner on.
	innerOn,

	// inner off.
	innerOff,

	// inner send.
	innerSend,

	// enter room.
	enterRoom,

	// on.
	on,

	// off.
	off,

	// send.
	send,

	// exit room.
	exitRoom;

	m.enterRoom = enterRoom = function(roomName) {
		//REQUIRED: roomName

		enterRoomNames.push(roomName);

		if (innerSend !== undefined) {
			innerSend({
				methodName : '__ENTER_ROOM',
				data : roomName
			});
		}
	};

	m.on = on = function(methodName, method) {
		//REQUIRED: methodName
		//REQUIRED: method

		onInfos.push({
			methodName : methodName,
			method : method
		});

		if (innerOn !== undefined) {
			innerOn(methodName, method);
		}
	};

	m.off = off = function(methodName, method) {
		//REQUIRED: methodName
		//OPTIONAL: method

		if (innerOff !== undefined) {
			innerOff(methodName, method);
		}

		if (method !== undefined) {

			REMOVE(onInfos, function(onInfo) {
				return onInfo.methodName === methodName && onInfo.method === method;
			});

		} else {

			REMOVE(onInfos, function(onInfo) {
				return onInfo.methodName === methodName;
			});
		}
	};

	m.send = send = function(params, callback) {
		//REQUIRED: params
		//REQUIRED: params.methodName
		//REQUIRED: params.data
		//OPTIONAL: callback

		if (innerSend === undefined) {

			waitingSendInfos.push({
				params : params,
				callback : callback
			});

		} else {

			innerSend(params, callback);
		}
	};

	m.exitRoom = exitRoom = function(roomName) {
		//REQUIRED: roomName

		if (innerSend !== undefined) {
			innerSend({
				methodName : '__EXIT_ROOM',
				data : roomName
			});
		}

		REMOVE({
			array : enterRoomNames,
			value : roomName
		});
	};

	return {

		run : function(params, connectionListenerOrListeners) {
			//REQUIRED: params
			//OPTIONAL: params.host
			//REQUIRED: params.port
			//OPTIONAL: params.fixRequestURI
			//REQUIRED: connectionListenerOrListeners

			var
			// connection listener
			connectionListener,

			// error listener
			errorListener;

			if (CHECK_IS_DATA(connectionListenerOrListeners) !== true) {
				connectionListener = connectionListenerOrListeners;
			} else {
				connectionListener = connectionListenerOrListeners.success;
				errorListener = connectionListenerOrListeners.error;
			}

			CONNECT_TO_WEB_SOCKET_SERVER(params, {

				error : errorListener,

				success : function(on, off, send) {

					innerOn = on;
					innerOff = off;
					innerSend = send;

					EACH(enterRoomNames, function(roomName) {

						innerSend({
							methodName : '__ENTER_ROOM',
							data : roomName
						});
					});

					EACH(onInfos, function(onInfo) {
						innerOn(onInfo.methodName, onInfo.method);
					});

					EACH(waitingSendInfos, function(sendInfo) {
						innerSend(sendInfo.params, sendInfo.callback);
					});

					waitingSendInfos = undefined;

					if (connectionListener !== undefined) {
						connectionListener(on, off, send);
					}

					// when disconnected, rewait.
					on('__DISCONNECTED', function() {

						innerOn = undefined;
						innerOff = undefined;
						innerSend = undefined;

						waitingSendInfos = [];
					});
				}
			});
		}
	};
});
