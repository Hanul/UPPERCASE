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
