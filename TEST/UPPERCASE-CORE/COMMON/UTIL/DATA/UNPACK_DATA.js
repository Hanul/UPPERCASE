TEST('UNPACK_DATA', function(check) {
	'use strict';

	var
	// data
	data,

	// packed data
	packedData,

	// unpacked data
	unpackedData;

	data = {
		now : new Date(),
		o : {
			d : new Date()
		},
		r : new RegExp('test', 'g')
	};

	packedData = PACK_DATA(data);

	unpackedData = UNPACK_DATA(packedData);

	check(CHECK_ARE_SAME([data, unpackedData]) === true);
});
