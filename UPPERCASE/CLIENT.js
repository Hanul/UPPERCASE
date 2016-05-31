/*

Welcome to UPPERCASE! (http://uppercase.io)

*/

/**
 * Configuration
 */
OVERRIDE(CONFIG, function(origin) {
	'use strict';

	global.CONFIG = COMBINE([{
		
		defaultBoxName : 'UPPERCASE',
		
		title : 'UPPERCASE PROJECT',
		
		baseBackgroundColor : '#000',
		baseColor : '#fff',
		
		// maxThumbWidth
		// or
		// maxThumbHeight
		
		isMobileFullScreen : false,
		isUsingHTMLSnapshot : false
		
	}, origin]);
});

FOR_BOX(function(box) {
	'use strict';

	/**
	 * get resource's real path with version.
	 */
	box.R = METHOD(function(m) {
		
		var
		// base path
		basePath,
		
		// set base path.
		setBasePath;
		
		m.setBasePath = setBasePath = function(_basePath) {
			basePath = _basePath;
		};
		
		return {

			run : function(path, callback) {
				//REQUIRED: path
				//OPTIONAL: callback
	
				var
				// uri
				uri = box.boxName + '/R/' + path;
	
				if (CONFIG.version !== undefined) {
					uri += '?version=' + CONFIG.version;
				}
					
				if (basePath !== undefined) {
					uri = basePath + '/' + uri;
				}
				
				if (location.protocol !== 'file:') {
					uri = '/' + uri;
				}
	
				if (callback !== undefined) {
					GET(uri, callback);
				}
	
				return uri;
			}
		};
	});
});

FOR_BOX(function(box) {
	'use strict';

	/**
	 * get final resource's real path.
	 */
	box.RF = METHOD({

		run : function(path) {
			//REQUIRED: path
			
			return '/__RF/' + box.boxName + '/' + path;
		}
	});
});

/**
 * Get server time.
 */
global.SERVER_TIME = METHOD(function(m) {
	'use strict';

	var
	// diff
	diff = 0,

	// set diff.
	setDiff;

	m.setDiff = setDiff = function(_diff) {
		diff = _diff;
	};

	return {

		run : function(date) {
			//REQUIRED: date

			return new Date(date.getTime() - diff);
		}
	};
});

/**
 * Sync time. (Client-side)
 */
global.SYNC_TIME = METHOD({

	run : function() {
		'use strict';

		var
		// time sync room
		timeSyncRoom = UPPERCASE.ROOM('timeSyncRoom'),

		// now time
		now = new Date();

		timeSyncRoom.send({
			methodName : 'sync',
			data : now
		},

		function(diff) {
			
			// The local time = The server time + diff (diff: client time - server time)
			TIME.setDiff(diff);
			
			// The server time = The local time - diff (diff: client time - server time)
			SERVER_TIME.setDiff(diff);
		});
	}
});

/**
 * Get time.
 */
global.TIME = METHOD(function(m) {
	'use strict';

	var
	// diff
	diff = 0,

	// set diff.
	setDiff;

	m.setDiff = setDiff = function(_diff) {
		diff = _diff;
	};

	return {

		run : function(date) {
			//REQUIRED: date

			return new Date(date.getTime() + diff);
		}
	};
});
