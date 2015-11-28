// load UJS.
require('../../../UJS-COMMON.js');
require('../../../UJS-NODE.js');

// load UPPERCASE-DB.
require('../../../UPPERCASE-DB/NODE.js');

TEST('DB', function(ok) {
	'use strict';

	BOX('TestBox');

	INIT_OBJECTS();

	CONNECT_TO_DB_SERVER({
		name : 'test'
	}, function() {

		var
		// db
		db = TestBox.DB('test');
		
		// find data cahced
		db.find({
			filter : {
				msg : 'test'
			},
			isToCache : true
		}, function(savedDataSet) {
			console.log('Find cached data set successed!', savedDataSet);
		});
		
		// create data test
		db.create({
			msg : 'test',
			count : 0
		}, function(savedData) {
			
			console.log('Create data successed!', savedData);
			
			// find data cahced
			db.find({
				filter : {
					msg : 'test'
				},
				isToCache : true
			}, function(savedDataSet) {
				console.log('Find cached data set successed!', savedDataSet);
			});
		});
		
		DELAY(3, function() {
			
			var
			// start
			start = new Date().getTime();
			
			PARALLEL(10000, [
			function(i, done) {
				
				// find data cahced
				db.find({
					filter : {
						msg : 'test'
					}
				}, function(savedDataSet) {
					done();
				});
			},
			
			function() {
				
				console.log(new Date().getTime() - start);
				
				// restart
				start = new Date().getTime();
			
				PARALLEL(10000, [
				function(i, done) {
					
					// find data cahced
					db.find({
						filter : {
							msg : 'test'
						},
						isToCache : true
					}, function(savedDataSet) {
						done();
					});
				},
				
				function() {
					console.log(new Date().getTime() - start);
				}]);
			}]);
		});
	});
});
