// load UJS.
require('../../../UJS-NODE.js');

// load UPPERCASE-DB.
require('../../../UPPERCASE-DB/NODE.js');

TEST('LOG_DB', function(ok) {
	'use strict';

	BOX('TestBox');

	INIT_OBJECTS();

	CONNECT_TO_DB_SERVER({
		name : 'test'
	}, function() {

		var
		// log db
		logDB = TestBox.LOG_DB('testLog');

		// log.
		logDB.log({
			ok : true
		});
	});
});
