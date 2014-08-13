/*
 * connect to web socket server.
 */
global.CONNECT_TO_WEB_SOCKET_SERVER = CONNECT_TO_WEB_SOCKET_SERVER = METHOD({

	run : function(params, connectionListenerOrListeners) {
		'use strict';
		//REQUIRED: params
		//OPTIONAL: params.host
		//REQUIRED: params.port
		//OPTIONAL: params.fixRequestURI
		//REQUIRED: connectionListenerOrListeners
		//REQUIRED: connectionListenerOrListeners.success
		//OPTIONAL: connectionListenerOrListeners.error

		var
		// host
		host = params.host === undefined ? global.location.hostname : params.host,

		// port
		port = params.port,

		// connection listener
		connectionListener,

		// error listener
		errorListener,

		// connection
		conn,

		// is connected
		isConnected,

		// method map
		methodMap = {},

		// send key
		sendKey = 0,

		// is force disconnecting
		isForceDisconnecting,

		// on.
		on,

		// off.
		off,

		// send.
		send,

		// run methods.
		runMethods;

		if (CHECK_IS_DATA(connectionListenerOrListeners) !== true) {
			connectionListener = connectionListenerOrListeners;
		} else {
			connectionListener = connectionListenerOrListeners.success;
			errorListener = connectionListenerOrListeners.error;
		}

		runMethods = function(methodName, data, sendKey) {

			var
			// methods
			methods = methodMap[methodName];

			if (methods !== undefined) {

				EACH(methods, function(method) {

					// run method.
					method(data,

					// ret.
					function(retData) {

						if (send !== undefined && sendKey !== undefined) {

							send({
								methodName : '__CALLBACK_' + sendKey,
								data : retData
							});
						}
					});
				});
			}
		};

		conn = new WebSocket('ws://' + host + ':' + port);

		conn.onopen = function() {

			isConnected = true;

			connectionListener(

			// on.
			on = function(methodName, method) {
				//REQUIRED: methodName
				//REQUIRED: method

				var
				// methods
				methods = methodMap[methodName];

				if (methods === undefined) {
					methods = methodMap[methodName] = [];
				}

				methods.push(method);
			},

			// off.
			off = function(methodName, method) {
				//REQUIRED: methodName
				//OPTIONAL: method

				var
				// methods
				methods = methodMap[methodName];

				if (methods !== undefined) {

					if (method !== undefined) {

						REMOVE({
							array : methods,
							value : method
						});

					} else {
						delete methodMap[methodName];
					}
				}
			},

			// send to server.
			send = function(params, callback) {
				//REQUIRED: params
				//REQUIRED: params.methodName
				//REQUIRED: params.data
				//OPTIONAL: callback

				var
				// callback name
				callbackName = '__CALLBACK_' + sendKey;

				params.sendKey = sendKey;

				sendKey += 1;

				conn.send(STRINGIFY(params));

				if (callback !== undefined) {

					// on callback.
					on(callbackName, function(data) {

						// run callback.
						callback(data);

						// off callback.
						off(callbackName);
					});
				}
			},

			// disconnect.
			function() {

				isForceDisconnecting = true;

				conn.close();
			});
		};

		// receive data.
		conn.onmessage = function(e) {

			var
			// params
			params = PARSE_STR(e.data);

			if (params !== undefined) {
				runMethods(params.methodName, params.data, params.sendKey);
			}
		};

		// when disconnected
		conn.onclose = function() {

			if (isForceDisconnecting !== true) {
				runMethods('__DISCONNECTED');
			}
		};

		// when error
		conn.onerror = function(error) {

			var
			// error msg
			errorMsg = error.toString();

			if (isConnected !== true) {

				console.log('[UPPERCASE.IO-CONNECT_TO_WEB_SOCKET_SERVER] CONNECT TO WEB SOCKET SERVER FAILED: ' + errorMsg);

				if (errorListener !== undefined) {
					errorListener(errorMsg);
				}

			} else {
				runMethods('__ERROR', errorMsg);
			}
		};
	}
});
