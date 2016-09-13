TEST('METHOD', function(ok) {
	'use strict';

	// test with one parameter method.
	RUN(function() {

		var
		// Method
		Method = METHOD(function(m) {

			var
			// static value
			staticText = 'static text.',

			// get static text.
			getStaticText;

			m.getStaticText = getStaticText = function() {
				return staticText;
			};

			return {
				run : function(value) {
					ok(value === 'this is value.');
				}
			};
		});

		// run.
		Method('this is value.');

		// check is method.
		ok(Method.type === METHOD);

		// static value
		ok(Method.getStaticText() === 'static text.');
	});

	// test with multiple parameters method.
	RUN(function() {

		var
		// Method
		Method = METHOD({
			run : function(params) {
				ok(params.name === 'Hanul');
				ok(params.age === 27);
			}
		});

		// run.
		Method({
			name : 'Hanul',
			age : 27
		});
	});

	// test with one function method.
	RUN(function() {

		var
		// Method
		Method = METHOD({
			run : function(func) {
				func('ok');
			}
		});

		// run!
		Method(function(msg) {
			ok(msg === 'ok');
		});
	});

	// test with multiple functions method.
	RUN(function() {

		var
		// Method
		Method = METHOD({
			run : function(funcs) {
				funcs.f1('ok');
				funcs.f2('ok');
			}
		});

		// run.
		Method({
			f1 : function(msg) {
				ok(msg === 'ok');
			},
			f2 : function(msg) {
				ok(msg === 'ok');
			}
		});
	});

	// test with complex method.
	RUN(function() {

		var
		// Method
		Method = METHOD({
			run : function(params, funcs) {
				funcs.f1(params.age);
			}
		});

		// run.
		Method({
			name : 'Hanul',
			age : 27
		}, {
			f1 : function(msg) {
				ok(msg === 27);
			},
			f2 : function(msg) {
				ok(msg === 27);
			}
		});
	});
});
