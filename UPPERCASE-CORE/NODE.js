/*

Welcome to UPPERCASE-CORE! (http://uppercase.io)

*/

/**
 * 기본 설정
 */
global.CONFIG = {
	
	// 개발 모드 설정
	isDevMode : false
};

/**
 * 메소드를 생성합니다.
 */
global.METHOD = function(define) {
	'use strict';
	//REQUIRED: define		메소드 정의 구문
	//REQUIRED: define.run	메소드 실행 구문

	var
	// funcs
	funcs,

	// run.
	run,

	// method.
	m = function(params, funcs) {
		//OPTIONAL: params
		//OPTIONAL: funcs

		if (run !== undefined) {
			return run(params, funcs);
		}
	};

	// set type.
	m.type = METHOD;

	// when define is function
	if (typeof define === 'function') {
		funcs = define(m);
	}

	// when define is function set
	else {
		funcs = define;
	}

	// init funcs.
	if (funcs !== undefined) {
		run = funcs.run;
	}

	return m;
};

/**
 * DB의 update 기능을 사용할 때, 데이터의 특정 값에 TO_DELETE를 지정하게 되면 해당 값이 삭제됩니다.
 * 자세한 것은 DB의 update 예제를 살펴보시기 바랍니다.
 *
 * 참고로 UPPERCASE 기반 프로젝트에서 이 TO_DELETE만이 null이 될 수 있는 유일한 변수입니다.
 * 다른 변수에서는 null을 사용하지 않고 undefined를 사용해 주시기 바랍니다.
 */
global.TO_DELETE = null;

/**
 * BOX를 생성합니다.
 */
global.BOX = METHOD(function(m) {
	'use strict';

	var
	// boxes
	boxes = {},

	// get all boxes.
	getAllBoxes;

	m.getAllBoxes = getAllBoxes = function() {
		return boxes;
	};

	return {

		run : function(boxName) {
			//REQUIRED: boxName

			var
			// box name splits
			boxNameSplits = boxName.split('.'),

			// before box split
			beforeBoxSplit = global,

			// before box name splits str
			beforeBoxNameSplitsStr = '',
			
			// box.
			box = function(packName) {
				//REQUIRED: packName

				var
				// packNameSps
				packNameSps = packName.split('.'),

				// pack
				pack;

				EACH(packNameSps, function(packNameSp) {

					if (pack === undefined) {

						if (box[packNameSp] === undefined) {
							box[packNameSp] = {};
						}
						
						pack = box[packNameSp];
					}
					
					else {

						if (pack[packNameSp] === undefined) {
							pack[packNameSp] = {};
						}
						
						pack = pack[packNameSp];
					}
				});

				return pack;
			};

			box.type = BOX;
			box.boxName = boxName;

			boxes[boxName] = box;

			EACH(boxNameSplits, function(boxNameSplit, i) {

				beforeBoxNameSplitsStr += (beforeBoxNameSplitsStr === '' ? '' : '.') + boxNameSplit;

				if (i < boxNameSplits.length - 1) {

					if (beforeBoxSplit[boxNameSplit] !== undefined) {
						beforeBoxSplit = beforeBoxSplit[boxNameSplit];
					} else {
						beforeBoxSplit = beforeBoxSplit[boxNameSplit] = {};
					}

				} else {

					beforeBoxSplit[boxNameSplit] = box;
				}
			});

			FOR_BOX.inject(box);

			return box;
		}
	};
});

/**
 * 모든 박스를 대상으로 하는 메소드와 클래스, 싱글톤 객체를 선언할 때 사용합니다.
 */
global.FOR_BOX = METHOD(function(m) {
	'use strict';

	var
	// funcs
	funcs = [],

	// inject.
	inject;

	m.inject = inject = function(box) {
		EACH(funcs, function(func) {
			func(box);
		});
	};

	return {

		run : function(func) {
			//REQUIRED: func

			EACH(BOX.getAllBoxes(), function(box) {
				func(box);
			});

			funcs.push(func);
		}
	};
});

/**
 * 클래스를 생성합니다.
 */
global.CLASS = METHOD(function(m) {
	'use strict';

	var
	// instance count
	instanceCount = 0,

	// get next instance id.
	getNextInstanceId;

	m.getNextInstanceId = getNextInstanceId = function() {

		instanceCount += 1;

		return instanceCount - 1;
	};

	return {

		run : function(define) {
			//REQUIRED: define	클래스 정의 구문

			var
			// funcs
			funcs,

			// preset.
			preset,

			// init.
			init,

			// params.
			_params,

			// after init.
			afterInit,

			// cls.
			cls,

			// inner init.
			innerInit,

			// inner after init.
			innerAfterInit;
			
			cls = function(params, funcs) {
				//OPTIONAL: params
				//OPTIONAL: funcs

				var
				// inner (protected)
				inner = {},

				// self (public)
				self = {
					
					type : cls,
					
					id : getNextInstanceId(),
					
					checkIsInstanceOf : function(checkCls) {
	
						var
						// target cls
						targetCls = cls;
	
						// check moms.
						while (targetCls !== undefined) {
	
							if (targetCls === checkCls) {
								return true;
							}
	
							targetCls = targetCls.mom;
						}
	
						return false;
					}
				};
				
				params = innerInit(inner, self, params, funcs);

				innerAfterInit(inner, self, params, funcs);

				return self;
			};
			
			if ( typeof define === 'function') {
				funcs = define(cls);
			} else {
				funcs = define;
			}

			if (funcs !== undefined) {
				preset = funcs.preset;
				init = funcs.init;
				_params = funcs.params;
				afterInit = funcs.afterInit;
			}

			// set type.
			cls.type = CLASS;

			cls.innerInit = innerInit = function(inner, self, params, funcs) {
				//OPTIONAL: params
				//OPTIONAL: funcs

				var
				// mom (parent class)
				mom,

				// temp params
				tempParams,

				// param value
				paramValue,

				// extend.
				extend = function(params, tempParams) {

					EACH(tempParams, function(value, name) {

						if (params[name] === undefined) {
							params[name] = value;
						} else if (CHECK_IS_DATA(params[name]) === true && CHECK_IS_DATA(value) === true) {
							extend(params[name], value);
						}
					});
				};

				// init params.
				if (_params !== undefined) {

					if (params === undefined) {
						params = _params(cls);
					}
					
					else if (CHECK_IS_DATA(params) === true) {

						tempParams = _params(cls);

						if (tempParams !== undefined) {
							extend(params, tempParams);
						}
					}
					
					else {
						paramValue = params;
						params = _params(cls);
					}
				}

				if (preset !== undefined) {

					mom = preset(params, funcs);

					if (mom !== undefined) {

						cls.mom = mom;

						// when mom's type is CLASS
						if (mom.type === CLASS) {
							mom.innerInit(inner, self, params, funcs);
						}

						// when mon's type is OBJECT
						else {
							mom.type.innerInit(inner, self, params, funcs);
						}
					}
				}

				if (init !== undefined) {
					init(inner, self, paramValue === undefined ? params : paramValue, funcs);
				}

				return params;
			};

			cls.innerAfterInit = innerAfterInit = function(inner, self, params, funcs) {
				//OPTIONAL: params
				//OPTIONAL: funcs

				var
				// mom
				mom = cls.mom;

				// when mom exists, run mom's after init.
				if (mom !== undefined) {

					// when mom's type is CLASS
					if (mom.type === CLASS) {
						mom.innerAfterInit(inner, self, params, funcs);
					}

					// when mon's type is OBJECT
					else {
						mom.type.innerAfterInit(inner, self, params, funcs);
					}
				}

				if (afterInit !== undefined) {
					afterInit(inner, self, params, funcs);
				}
			};

			return cls;
		}
	};
});

/**
 * 모든 정의된 싱글톤 객체의 초기화를 수행합니다.
 */
global.INIT_OBJECTS = METHOD({

	run : function() {
		'use strict';

		OBJECT.initObjects();
	}
});

/**
 * 실글톤 객체를 생성합니다.
 */
global.OBJECT = METHOD(function(m) {
	'use strict';

	var
	// ready objects
	readyObjects = [],

	// is inited
	isInited = false,

	// init object.
	initObject,

	// add ready object.
	addReadyObject,

	// remove ready object.
	removeReadyObject,

	// init objects.
	initObjects;

	initObject = function(object) {
		//REQUIRED: object	초기화 할 싱글톤 객체

		var
		// cls
		cls = object.type,

		// inner (protected)
		inner = {},

		// params
		params = {};

		// set id.
		object.id = CLASS.getNextInstanceId();

		cls.innerInit(inner, object, params);
		cls.innerAfterInit(inner, object, params);
	};

	addReadyObject = function(object) {
		//REQUIRED: object	초기화를 대기시킬 싱글톤 객체

		if (isInited === true) {
			initObject(object);
		} else {
			readyObjects.push(object);
		}
	};

	m.removeReadyObject = removeReadyObject = function(object) {
		//REQUIRED: object	대기열에서 삭제할 싱글톤 객체
		
		REMOVE({
			array : readyObjects,
			value : object
		});
	};

	m.initObjects = initObjects = function() {

		// init all objects.
		EACH(readyObjects, function(object) {
			initObject(object);
		});

		isInited = true;
	};

	return {

		run : function(define) {
			//REQUIRED: define	클래스 정의 구문

			var
			// cls
			cls = CLASS(define),

			// self
			self = {
				
				type : cls,
				
				checkIsInstanceOf : function(checkCls) {

					var
					// target cls
					targetCls = cls;
	
					// check moms.
					while (targetCls !== undefined) {
	
						if (targetCls === checkCls) {
							return true;
						}
	
						targetCls = targetCls.mom;
					}
	
					return false;
				}
			};
			
			addReadyObject(self);

			return self;
		}
	};
});

/**
 * 주어진 비동기 함수들을 순서대로 실행합니다.
 */
global.NEXT = METHOD({

	run : function(countOrArray, funcs) {
		'use strict';
		//OPTIONAL: countOrArray
		//REQUIRED: funcs

		var
		// count
		count,

		// array
		array,

		// f.
		f;

		if (funcs === undefined) {
			funcs = countOrArray;
			countOrArray = undefined;
		}

		if (countOrArray !== undefined) {
			if (CHECK_IS_ARRAY(countOrArray) !== true) {
				count = countOrArray;
			} else {
				array = countOrArray;
			}
		}

		REPEAT({
			start : funcs.length - 1,
			end : 0
		}, function(i) {

			var
			// next.
			next;

			// get last function.
			if (i !== 0 && f === undefined) {
				f = funcs[i]();
			}

			// pass next function.
			else if (i > 0) {

				next = f;

				f = funcs[i](next);

				f.next = next;
			}

			// run first function.
			else {

				next = f;

				// when next not exists, next is empty function.
				if (next === undefined) {
					next = function() {
						// ignore.
					};
				}

				f = funcs[i];

				if (count !== undefined) {

					RUN(function() {

						var
						// i
						i = -1;

						RUN(function(self) {

							i += 1;

							if (i + 1 < count) {
								f(i, self);
							} else {
								f(i, next);
							}
						});
					});

				} else if (array !== undefined) {

					RUN(function() {

						var
						// length
						length = array.length,

						// i
						i = -1;

						if (length === 0) {
							next();
						} else {

							RUN(function(self) {

								i += 1;

								if (i + 1 < length) {

									// if shrink
									if (array.length === length - 1) {
										i -= 1;
										length -= 1;
									}

									f(array[i], self, i);

								} else {
									f(array[i], next, i);
								}
							});
						}
					});

				} else {

					f(next);
				}
			}
		});
	}
});

/**
 * 오버라이딩을 수행합니다.
 */
global.OVERRIDE = METHOD({

	run : function(origin, func) {
		'use strict';
		//REQUIRED: origin	오버라이드 할 대상
		//REQUIRED: func

		// when origin is OBJECT.
		if (origin.type !== undefined && origin.type.type === CLASS) {

			// remove origin from init ready objects.
			OBJECT.removeReadyObject(origin);
		}

		func(origin);
	}
});

/**
 * 주어진 비동기 함수들을 병렬로 실행합니다.
 */
global.PARALLEL = METHOD({

	run : function(dataOrArrayOrCount, funcs) {
		'use strict';
		//OPTIONAL: dataOrArrayOrCount
		//REQUIRED: funcs

		var
		// property count
		propertyCount,
		
		// done count
		doneCount = 0;

		// only funcs
		if (funcs === undefined) {
			funcs = dataOrArrayOrCount;
			
			RUN(function() {

				var
				// length
				length = funcs.length - 1;

				EACH(funcs, function(func, i) {

					if (i < length) {

						func(function() {

							doneCount += 1;

							if (doneCount === length) {
								funcs[length]();
							}
						});
					}
				});
			});
		}
		
		else if (dataOrArrayOrCount === undefined) {
			funcs[1]();
		}
		
		else if (CHECK_IS_DATA(dataOrArrayOrCount) === true) {
			
			propertyCount = COUNT_PROPERTIES(dataOrArrayOrCount);

			if (propertyCount === 0) {
				funcs[1]();
			} else {

				EACH(dataOrArrayOrCount, function(value, name) {

					funcs[0](value, function() {

						doneCount += 1;

						if (doneCount === propertyCount) {
							funcs[1]();
						}
					}, name);
				});
			}
		}
		
		else if (CHECK_IS_ARRAY(dataOrArrayOrCount) === true) {
	
			if (dataOrArrayOrCount.length === 0) {
				funcs[1]();
			} else {

				EACH(dataOrArrayOrCount, function(value, i) {

					funcs[0](value, function() {

						doneCount += 1;

						if (doneCount === dataOrArrayOrCount.length) {
							funcs[1]();
						}
					}, i);
				});
			}
		}
		
		// when dataOrArrayOrCount is count
		else {
	
			if (dataOrArrayOrCount === 0) {
				funcs[1]();
			} else {

				REPEAT(dataOrArrayOrCount, function(i) {

					funcs[0](i, function() {

						doneCount += 1;

						if (doneCount === dataOrArrayOrCount) {
							funcs[1]();
						}
					});
				});
			}
		}
	}
});

/**
 * JSON 문자열을 원래 데이터나 배열, 값으로 변환합니다.
 */
global.PARSE_STR = METHOD({

	run : function(dataStr) {
		'use strict';
		//REQUIRED: dataStr

		var
		// data
		data;

		try {

			data = JSON.parse(dataStr);

			return CHECK_IS_DATA(data) === true ? UNPACK_DATA(data) : data;

		} catch(e) {

			// when error, return undefined.
			return undefined;
		}
	}
});

/**
 * 알파벳 대, 소문자와 숫자로 이루어진 임의의 문자열을 생성합니다.
 */
global.RANDOM_STR = METHOD({

	run : function(length) {
		'use strict';
		//REQUIRED: length

		var
		// random string
		randomStr = '',

		// characters
		characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',

		// i
		i;

		REPEAT(length, function() {

			// add random character to random string.
			randomStr += characters.charAt(RANDOM({
				limit : characters.length
			}));
		});

		return randomStr;
	}
});

/**
 * 데이터나 배열, 값을 JSON 문자열로 변환합니다.
 */
global.STRINGIFY = METHOD({

	run : function(data) {
		'use strict';
		//REQUIRED: data

		return JSON.stringify(CHECK_IS_DATA(data) === true ? PACK_DATA(data) : data);
	}
});

/**
 * 테스트용 메소드입니다.
 * 
 * 테스트에 성공하거나 실패하면 콘솔에 메시지를 출력합니다.
 */
global.TEST = METHOD(function(m) {
	'use strict';

	var
	// error count
	errorCount = 0;

	return {

		run : function(name, test) {
			//REQUIRED: name
			//REQUIRED: test

			test(function(bool) {
				//REQUIRED: bool

				var
				// temp
				temp = {},

				// line
				line,

				// throw error.
				throwError;

				if (bool === true) {
					console.log('[' + name + ' 테스트] 테스트를 통과하였습니다. 총 ' + errorCount + '개의 오류가 있습니다.');
				} else {

					temp.__THROW_ERROR_$$$ = function() {
						try {
							throw Error();
						} catch(error) {
							return error;
						}
					};

					line = temp.__THROW_ERROR_$$$().stack;

					if (line !== undefined) {
						line = line.substring(line.indexOf('__THROW_ERROR_$$$'));
						line = line.split('\n')[2];
						line = line.substring(line.indexOf('at '));
					}

					errorCount += 1;

					console.log('[' + name + ' 테스트] ' + line + '에서 오류가 발견되었습니다. 총 ' + errorCount + '개의 오류가 있습니다.');
				}
			});
		}
	};
});

/**
 * URI가 주어진 포맷에 맞는지 확인하는 URI_MATCHER 클래스
 * 
 * 포맷에 파라미터 구간을 지정할 수 있어 URI로부터 파라미터 값을 가져올 수 있습니다.
 */
global.URI_MATCHER = CLASS({

	init : function(inner, self, format) {
		'use strict';
		//REQUIRED: format

		var
		// Check class
		Check = CLASS({

			init : function(inner, self, uri) {
				//REQUIRED: uri

				var
				// uri parts
				uriParts = uri.split('/'),

				// is matched
				isMatched,

				// uri parmas
				uriParams = {},

				// find.
				find = function(format) {

					var
					// format parts
					formatParts = format.split('/');

					return EACH(uriParts, function(uriPart, i) {

						var
						// format part
						formatPart = formatParts[i];

						if (formatPart === '**') {
							isMatched = true;
							return false;
						}

						if (formatPart === undefined) {
							return false;
						}

						// find params.
						if (uriPart !== '' && formatPart.charAt(0) === '{' && formatPart.charAt(formatPart.length - 1) === '}') {
							uriParams[formatPart.substring(1, formatPart.length - 1)] = uriPart;
						} else if (formatPart !== '*' && formatPart !== uriPart) {
							return false;
						}

						if (i === uriParts.length - 1 && i < formatParts.length - 1 && formatParts[formatParts.length - 1] !== '') {
							return false;
						}

					}) === true || isMatched === true;
				},

				// check is matched.
				checkIsMatched,

				// get uri params.
				getURIParams;

				if (CHECK_IS_ARRAY(format) === true) {
					isMatched = EACH(format, function(format) {
						return find(format) !== true;
					}) !== true;
				} else {
					isMatched = find(format);
				}

				self.checkIsMatched = checkIsMatched = function() {
					return isMatched;
				};

				self.getURIParams = getURIParams = function() {
					return uriParams;
				};
			}
		}),

		// check.
		check;

		self.check = check = function(uri) {
			return Check(uri);
		};
	}
});

/**
 * 데이터를 검증하고, 어떤 부분이 잘못되었는지 오류를 확인할 수 있는 VALID 클래스
 */
global.VALID = CLASS(function(cls) {
	'use strict';

	var
	// not empty.
	notEmpty,

	// regex.
	regex,

	// size.
	size,

	// integer.
	integer,

	// real.
	real,

	// bool.
	bool,

	// date.
	date,

	// min.
	min,

	// max.
	max,

	// email.
	email,

	// png.
	png,

	// url.
	url,

	// username.
	username,

	// id.
	id,

	// one.
	one,

	// array.
	array,

	// data.
	data,

	// element.
	element,

	// property.
	property,

	// detail.
	detail,

	// equal.
	equal;

	cls.notEmpty = notEmpty = function(value) {
		//REQUIRED: value

		var
		// string
		str = (value === undefined || value === TO_DELETE) ? '' : String(value);

		return CHECK_IS_ARRAY(value) === true || str.trim() !== '';
	};

	cls.regex = regex = function(params) {
		//REQUIRED: params
		//REQUIRED: params.value
		//REQUIRED: params.pattern

		var
		// string
		str = String(params.value),
		
		// pattern
		pattern = params.pattern;

		return str === str.match(pattern)[0];
	};

	cls.size = size = function(params) {
		//REQUIRED: params
		//REQUIRED: params.value
		//OPTIONAL: params.min
		//REQUIRED: params.max

		var
		// string
		str = String(params.value),
		
		// min
		min = params.min,

		// max
		max = params.max;
		
		if (min === undefined) {
			min = 0;
		}

		return min <= str.trim().length && (max === undefined || str.length <= max);
	};

	cls.integer = integer = function(value) {
		//REQUIRED: value

		var
		// string
		str = String(value);

		return notEmpty(str) === true && str.match(/^(?:-?(?:0|[1-9][0-9]*))$/) !== TO_DELETE;
	};

	cls.real = real = function(value) {
		//REQUIRED: value

		var
		// string
		str = String(value);

		return notEmpty(str) === true && str.match(/^(?:-?(?:0|[1-9][0-9]*))?(?:\.[0-9]*)?$/) !== TO_DELETE;
	};

	cls.bool = bool = function(value) {
		//REQUIRED: value

		var
		// string
		str = String(value);

		return str === 'true' || str === 'false';
	};

	cls.date = date = function(value) {
		//REQUIRED: value

		var
		// string
		str = String(value),

		// date
		date = Date.parse(str);

		return isNaN(date) === false;
	};

	cls.min = min = function(params) {
		//REQUIRED: params
		//REQUIRED: params.value
		//REQUIRED: params.min

		var
		// value
		value = params.value,
		
		// min
		min = params.min;

		return real(value) === true && min <= value;
	};

	cls.max = max = function(params) {
		//REQUIRED: params
		//REQUIRED: params.value
		//REQUIRED: params.max

		var
		// value
		value = params.value,
		
		// max
		max = params.max;

		return real(value) === true && max >= value;
	};

	cls.email = email = function(value) {
		//REQUIRED: value

		return typeof value === 'string' && notEmpty(value) === true && value.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/) !== TO_DELETE;
	};

	cls.png = png = function(value) {
		//REQUIRED: value

		return typeof value === 'string' && notEmpty(value) === true && value.match(/^data:image\/png;base64,/) !== TO_DELETE;
	};

	cls.url = url = function(value) {
		//REQUIRED: value

		return typeof value === 'string' && notEmpty(value) === true && value.match(/^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2}))|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/i) !== TO_DELETE && value.length <= 2083;
	};

	cls.username = username = function(value) {
		//REQUIRED: value

		return typeof value === 'string' && notEmpty(value) === true && value.match(/^[_a-zA-Z0-9\-]+$/) !== TO_DELETE;
	};

	// mongodb id check
	cls.id = id = function(value) {
		//REQUIRED: value

		return typeof value === 'string' && notEmpty(value) === true && value.match(/[0-9a-f]{24}/) !== TO_DELETE && value.length === 24;
	};

	cls.one = one = function(params) {
		//REQUIRED: params
		//REQUIRED: params.value
		//REQUIRED: params.array

		var
		// value
		value = params.value,
		
		// array
		array = params.array;

		return EACH(array, function(_value) {
			if (value === _value) {
				return false;
			}
		}) === false;
	};

	cls.array = array = function(value) {
		//REQUIRED: value

		return CHECK_IS_ARRAY(value) === true;
	};

	cls.data = data = function(value) {
		//REQUIRED: value

		return CHECK_IS_DATA(value) === true;
	};

	cls.element = element = function(params) {
		//REQUIRED: params
		//REQUIRED: params.array
		//REQUIRED: params.validData
		//OPTIONAL: params.isToWash

		var
		// array
		array = params.array,

		// valid
		valid = VALID({
			_ : params.validData
		}),
		
		// is to wash
		isToWash = params.isToWash;
		
		return EACH(array, function(value) {
			if ((isToWash === true ? valid.checkAndWash : valid.check)({
				_ : value
			}).checkHasError() === true) {
				return false;
			}
		}) === true;
	};

	cls.property = property = function(params) {
		//REQUIRED: params
		//REQUIRED: params.data
		//REQUIRED: params.validData
		//OPTIONAL: params.isToWash

		var
		// array
		data = params.data,

		// valid
		valid = VALID({
			_ : params.validData
		}),
		
		// is to wash
		isToWash = params.isToWash;
		
		return EACH(data, function(value) {
			if ((isToWash === true ? valid.checkAndWash : valid.check)({
				_ : value
			}).checkHasError() === true) {
				return false;
			}
		}) === true;
	};

	cls.detail = detail = function(params) {
		//REQUIRED: params
		//REQUIRED: params.data
		//REQUIRED: params.validDataSet
		//OPTIONAL: params.isToWash

		var
		// data
		data = params.data,

		// valid
		valid = VALID(params.validDataSet),
		
		// is to wash
		isToWash = params.isToWash;
		
		return (isToWash === true ? valid.checkAndWash : valid.check)(data).checkHasError() !== true;
	};

	cls.equal = equal = function(params) {
		//REQUIRED: params
		//REQUIRED: params.value
		//REQUIRED: params.validValue

		var
		// value
		value = params.value,

		// string
		str = String(value),

		// valid value
		validValue = params.validValue,

		// valid str
		validStr = String(validValue);

		return str === validStr;
	};

	return {

		init : function(inner, self, validDataSet) {
			//REQUIRED: validDataSet

			var
			// Check class
			Check = CLASS({

				init : function(inner, self, params) {
					//REQUIRED: params
					//REQUIRED: params.data
					//OPTIONAL: params.isToWash
					//OPTIONAL: params.isForUpdate

					var
					// data
					data = params.data,

					// is to wash
					isToWash = params.isToWash,
					
					// is for update
					isForUpdate = params.isForUpdate,

					// has error
					hasError = false,

					// errors
					errors = {},

					// check has error.
					checkHasError,

					// get errors.
					getErrors;

					EACH(validDataSet, function(validData, attr) {

						// when valid data is true, pass
						if (validData !== true) {

							EACH(validData, function(validParams, name) {

								var
								// value
								value = data[attr];
								
								if (isForUpdate === true && value === undefined) {

									// break.
									return false;
								}

								if (isToWash === true && name !== 'notEmpty' && notEmpty(value) !== true) {
									
									data[attr] = isForUpdate === true ? TO_DELETE : undefined;
									
									// continue.
									return true;
								}

								// one
								if (name === 'one') {

									if (one({
										array : validParams,
										value : value
									}) === false) {

										hasError = true;
										errors[attr] = {
											type : name,
											array : validParams,
											value : value
										};

										// break.
										return false;
									}
								}

								// element
								else if (name === 'element') {

									if (element({
										validData : validParams,
										array : value,
										isToWash : isToWash
									}) === false) {

										hasError = true;
										errors[attr] = {
											type : name,
											validData : validParams,
											array : value
										};

										// break.
										return false;
									}
								}

								// property
								else if (name === 'property') {

									if (property({
										validData : validParams,
										data : value,
										isToWash : isToWash
									}) === false) {

										hasError = true;
										errors[attr] = {
											type : name,
											validData : validParams,
											data : value
										};

										// break.
										return false;
									}
								}

								// detail
								else if (name === 'detail') {

									if (detail({
										validDataSet : validParams,
										data : value,
										isToWash : isToWash
									}) === false) {

										hasError = true;
										errors[attr] = {
											type : name,
											validDataSet : validParams,
											data : value
										};

										// break.
										return false;
									}
								}

								// need params
								else if (name === 'size') {

									if (cls[name](CHECK_IS_DATA(validParams) === true ? COMBINE([validParams, {
										value : value
									}]) : COMBINE([{
										min : validParams,
										max : validParams
									}, {
										value : value
									}])) === false) {

										hasError = true;
										errors[attr] = {
											type : name,
											validParams : validParams,
											value : value
										};

										// break.
										return false;
									}
								}

								// regex
								else if (name === 'regex') {

									if (cls[name]({
										pattern : validParams,
										value : value
									}) === false) {

										hasError = true;
										errors[attr] = {
											type : name,
											validParam : validParams,
											value : value
										};

										// break.
										return false;
									}
								}

								// min
								else if (name === 'min') {

									if (cls[name]({
										min : validParams,
										value : value
									}) === false) {

										hasError = true;
										errors[attr] = {
											type : name,
											validParam : validParams,
											value : value
										};

										// break.
										return false;
									}
								}

								// max
								else if (name === 'max') {

									if (cls[name]({
										max : validParams,
										value : value
									}) === false) {

										hasError = true;
										errors[attr] = {
											type : name,
											validParam : validParams,
											value : value
										};

										// break.
										return false;
									}
								}

								// equal
								else if (name === 'equal') {

									if (cls[name]({
										value : value,
										validValue : validParams
									}) === false) {

										hasError = true;
										errors[attr] = {
											type : name,
											validParam : validParams,
											value : value
										};

										// break.
										return false;
									}
								}

								// need value
								else if (validParams === true) {

									if (cls[name](value) === false) {

										hasError = true;
										errors[attr] = {
											type : name,
											value : value
										};

										// break.
										return false;
									}
								}

								if (notEmpty(value) === true && typeof value === 'string') {
									if (name === 'integer') {
										data[attr] = INTEGER(value);
									} else if (name === 'real') {
										data[attr] = REAL(value);
									} else if (name === 'bool') {
										data[attr] = value === 'true';
									} else if (name === 'date') {
										data[attr] = new Date(value);
									} else if (name === 'username') {
										data[attr] = value.toLowerCase();
									}
								}
							});
						}
					});

					if (isToWash === true) {
						
						EACH(data, function(value, attr) {
							if (validDataSet[attr] === undefined) {
								delete data[attr];
							}
						});
					}

					self.checkHasError = checkHasError = function() {
						return hasError;
					};

					self.getErrors = getErrors = function() {
						return errors;
					};
				}
			}),

			// check.
			check,

			// check and wash.
			checkAndWash,
			
			// check for update.
			checkForUpdate,
			
			// get valid data set.
			getValidDataSet;

			self.check = check = function(data) {
				return Check({
					data : data
				});
			};

			self.checkAndWash = checkAndWash = function(data) {
				return Check({
					data : data,
					isToWash : true
				});
			};

			self.checkForUpdate = checkForUpdate = function(data) {
				return Check({
					data : data,
					isToWash : true,
					isForUpdate : true
				});
			};
			
			self.getValidDataSet = getValidDataSet = function() {
				return validDataSet;
			};
		}
	};
});

/**
 * target이 JavaScript arguments인지 확인합니다.
 */
global.CHECK_IS_ARGUMENTS = METHOD({

	run : function(target) {'use strict';
		//OPTIONAL: target

		if (
		target !== undefined &&
		target !== TO_DELETE &&
		typeof target === 'object' &&
		(
			Object.prototype.toString.call(target) === '[object Arguments]' ||
			(
				target.callee !== undefined &&
				typeof target.callee === 'function'
			)
		)) {
			return true;
		}

		return false;
	}
});

/**
 * 배열 안의 모든 요소들이 동일한지 확인합니다.
 */
global.CHECK_ARE_SAME = METHOD({

	run : function(array) {
		'use strict';
		//REQUIRED: array

		var
		// are same
		areSame = false,

		// check two same.
		checkTwoSame = function(a, b) {

			// when a, b are date
			if ( a instanceof Date === true && b instanceof Date === true) {
				return a.getTime() === b.getTime();
			}
			
			// when a, b are regex
			else if ( a instanceof RegExp === true && b instanceof RegExp === true) {
				return a.toString() === b.toString();
			}

			// when a, b are data (JS object)
			else if (CHECK_IS_DATA(a) === true && CHECK_IS_DATA(b) === true) {
				return EACH(a, function(value, name) {
					return checkTwoSame(value, b[name]);
				});
			}

			// when a, b are array
			else if (CHECK_IS_ARRAY(a) === true && CHECK_IS_ARRAY(b) === true) {
				return EACH(a, function(value, i) {
					return checkTwoSame(value, b[i]);
				});
			}

			// when a, b are value
			else {
				return a === b;
			}
		};

		if (array.length > 1) {

			areSame = REPEAT(array.length, function(i) {
				if (i < array.length - 1) {
					return checkTwoSame(array[i], array[i + 1]);
				} else {
					return checkTwoSame(array[i], array[0]);
				}
			});
		}

		return areSame;
	}
});

/**
 * target이 배열인지 확인합니다.
 */
global.CHECK_IS_ARRAY = METHOD({

	run : function(target) {
		'use strict';
		//OPTIONAL: target

		if (
		target !== undefined &&
		target !== TO_DELETE &&
		typeof target === 'object' &&
		Object.prototype.toString.call(target) === '[object Array]') {
			return true;
		}

		return false;
	}
});

/**
 * target이 데이터인지 확인합니다.
 */
global.CHECK_IS_DATA = METHOD({

	run : function(target) {
		'use strict';
		//OPTIONAL: target

		if (
		target !== undefined &&
		target !== TO_DELETE &&
		CHECK_IS_ARGUMENTS(target) !== true &&
		CHECK_IS_ARRAY(target) !== true &&
		target instanceof Date !== true &&
		target instanceof RegExp !== true &&
		typeof target === 'object') {
			return true;
		}

		return false;
	}
});

/**
 * 데이터가 아무런 값이 없는 빈 데이터({})인지 확인합니다.
 */
global.CHECK_IS_EMPTY_DATA = METHOD({

	run : function(data) {
		'use strict';
		//REQUIRED: data

		return CHECK_ARE_SAME([data, {}]);
	}
});

/**
 * 데이터 내 값들의 개수를 반환합니다.
 */
global.COUNT_PROPERTIES = METHOD({

	run : function(data) {
		'use strict';
		//OPTIONAL: data

		var
		// count
		count = 0;
		
		EACH(data, function() {
			count += 1;
		});
		
		return count;
	}
});

/**
 * 주어진 데이터의 값들 중 Date형은 정수형태로, RegExp형은 문자열 형태로 변환한 데이터를 반환합니다.
 */
global.PACK_DATA = METHOD({

	run : function(data) {
		'use strict';
		//REQUIRED: data

		var
		// result
		result = COPY(data),

		// date property names
		dateNames = [],
		
		// regex property names
		regexNames = [];

		EACH(result, function(value, name) {

			if (value instanceof Date === true) {

				// change to timestamp integer.
				result[name] = INTEGER(value.getTime());
				dateNames.push(name);
			}
			
			else if (value instanceof RegExp === true) {

				// change to string.
				result[name] = value.toString();
				regexNames.push(name);
			}

			else if (CHECK_IS_DATA(value) === true) {
				result[name] = PACK_DATA(value);
			}

			else if (CHECK_IS_ARRAY(value) === true) {

				EACH(value, function(v, i) {

					if (CHECK_IS_DATA(v) === true) {
						value[i] = PACK_DATA(v);
					}
				});
			}
		});

		result.__D = dateNames;
		result.__R = regexNames;

		return result;
	}
});

/**
 * PACK_DATA가 적용된 데이터의 값들 중 정수형태로 변환된 Date형과 문자열 형태로 변환된 RegExp형을 원래대로 되돌린 데이터를 반환합니다.
 */
global.UNPACK_DATA = METHOD({

	run : function(packedData) {
		'use strict';
		//REQUIRED: packedData	PACK_DATA가 적용된 데이터

		var
		// result
		result = COPY(packedData);

		// when date property names exists
		if (result.__D !== undefined) {

			// change timestamp integer to Date type.
			EACH(result.__D, function(dateName, i) {
				result[dateName] = new Date(result[dateName]);
			});
			
			delete result.__D;
		}
		
		// when regex property names exists
		if (result.__R !== undefined) {

			// change string to RegExp type.
			EACH(result.__R, function(regexName, i) {
				
				var
				// pattern
				pattern = result[regexName],
				
				// flags
				flags,
				
				// j
				j;
				
				for (j = pattern.length - 1; j >= 0; j -= 1) {
					if (pattern[j] === '/') {
						flags = pattern.substring(j + 1);
						pattern = pattern.substring(1, j);
						break;
					}
				}
				
				result[regexName] = new RegExp(pattern, flags);
			});
			
			delete result.__R;
		}

		EACH(result, function(value, name) {

			if (CHECK_IS_DATA(value) === true) {
				result[name] = UNPACK_DATA(value);
			}

			else if (CHECK_IS_ARRAY(value) === true) {

				EACH(value, function(v, i) {

					if (CHECK_IS_DATA(v) === true) {
						value[i] = UNPACK_DATA(v);
					}
				});
			}
		});

		return result;
	}
});

/**
 * 특정 값이 데이터나 배열에 존재하는지 확인합니다.
 */
global.CHECK_IS_IN = METHOD({

	run : function(params) {
		'use strict';
		//REQUIRED: params
		//OPTIONAL: params.data
		//OPTIONAL: params.array
		//REQUIRED: params.value	존재하는지 확인 할 값

		var
		// data
		data = params.data,

		// array
		array = params.array,

		// value
		value = params.value;

		if (data !== undefined) {
			return EACH(data, function(_value, name) {
				if (CHECK_ARE_SAME([_value, value]) === true) {
					return false;
				}
			}) !== true;
		}

		if (array !== undefined) {
			return EACH(array, function(_value, key) {
				if (CHECK_ARE_SAME([_value, value]) === true) {
					return false;
				}
			}) !== true;
		}
	}
});

/**
 * 데이터들이나 배열들을 하나의 데이터나 배열로 합칩니다.
 */
global.COMBINE = METHOD({

	run : function(dataSetOrArrays) {
		'use strict';
		//REQUIRED: dataSetOrArrays

		var
		// first
		first,

		// result
		result;

		if (dataSetOrArrays.length > 0) {

			first = dataSetOrArrays[0];

			if (CHECK_IS_DATA(first) === true) {

				result = {};

				EACH(dataSetOrArrays, function(data) {
					EXTEND({
						origin : result,
						extend : data
					});
				});
			}

			else if (CHECK_IS_ARRAY(first) === true) {

				result = [];

				EACH(dataSetOrArrays, function(array) {
					EXTEND({
						origin : result,
						extend : array
					});
				});
			}
		}

		return result;
	}
});

/**
 * 데이터나 배열을 복제합니다.
 */
global.COPY = METHOD({

	run : function(dataOrArray) {
		'use strict';
		//REQUIRED: dataOrArray

		var
		// copy
		copy;

		if (CHECK_IS_DATA(dataOrArray) === true) {

			copy = {};

			EXTEND({
				origin : copy,
				extend : dataOrArray
			});
		}

		else if (CHECK_IS_ARRAY(dataOrArray) === true) {

			copy = [];

			EXTEND({
				origin : copy,
				extend : dataOrArray
			});
		}

		return copy;
	}
});

/**
 * 데이터나 배열을 덧붙혀 확장합니다.
 */
global.EXTEND = METHOD({

	run : function(params) {
		'use strict';
		//REQUIRED: params
		//REQUIRED: params.origin	기존 데이터나 배열
		//REQUIRED: params.extend	덧붙힐 데이터나 배열

		var
		// origin
		origin = params.origin,

		// extend
		extend = params.extend;

		if (CHECK_IS_DATA(origin) === true) {

			EACH(extend, function(value, name) {
				
				var
				// pattern
				pattern,
				
				// flags
				flags,
				
				// i
				i;
				
				if ( value instanceof Date === true) {
					origin[name] = new Date(value.getTime());
				}
				
				else if ( value instanceof RegExp === true) {
					
					pattern = value.toString();
					
					for (i = pattern.length - 1; i >= 0; i -= 1) {
						if (pattern[i] === '/') {
							flags = pattern.substring(i + 1);
							pattern = pattern.substring(1, i);
							break;
						}
					}
					
					origin[name] = new RegExp(pattern, flags);
				}
				
				else if (CHECK_IS_DATA(value) === true || CHECK_IS_ARRAY(value) === true) {
					origin[name] = COPY(value);
				}
				
				else {
					origin[name] = value;
				}
			});
		}

		else if (CHECK_IS_ARRAY(origin) === true) {

			EACH(extend, function(value) {
				
				var
				// pattern
				pattern,
				
				// flags
				flags,
				
				// i
				i;

				if ( value instanceof Date === true) {
					origin.push(new Date(value.getTime()));
				}
				
				else if ( value instanceof RegExp === true) {
					
					pattern = value.toString();
					
					for (i = pattern.length - 1; i >= 0; i -= 1) {
						if (pattern[i] === '/') {
							flags = pattern.substring(i + 1);
							pattern = pattern.substring(1, i);
							break;
						}
					}
					
					origin.push(new RegExp(pattern, flags));
				}
				
				else if (CHECK_IS_DATA(value) === true || CHECK_IS_ARRAY(value) === true) {
					origin.push(COPY(value));
				}
				
				else {
					origin.push(value);
				}
			});
		}

		return origin;
	}
});

/**
 * 데이터나 배열의 특정 값을 찾아, 데이터인 경우 그 값에 해당하는 이름을, 배열인 경우 그 값에 해당하는 키(index)를 반환합니다.
 */
global.FIND = METHOD({

	run : function(dataOrArrayOrParams, filter) {
		'use strict';
		//REQUIRED: dataOrArrayOrParams
		//OPTIONAL: dataOrArrayOrParams.data
		//OPTIONAL: dataOrArrayOrParams.array
		//REQUIRED: dataOrArrayOrParams.value	찾을 값
		//OPTIONAL: filter

		var
		// data
		data,

		// array
		array,

		// value
		value,

		// ret
		ret;

		if (filter !== undefined) {

			if (CHECK_IS_DATA(dataOrArrayOrParams) === true) {

				EACH(dataOrArrayOrParams, function(value, name) {

					// value passed filter.
					if (filter(value, name) === true) {
						ret = value;
						return false;
					}
				});
			}

			else if (CHECK_IS_ARRAY(dataOrArrayOrParams) === true) {

				EACH(dataOrArrayOrParams, function(value, key) {

					// value passed filter.
					if (filter(value, key) === true) {
						ret = value;
						return false;
					}
				});
			}
		}

		else {

			// init params.
			data = dataOrArrayOrParams.data;
			array = dataOrArrayOrParams.array;
			value = dataOrArrayOrParams.value;

			if (data !== undefined) {

				EACH(data, function(_value, name) {
					if (_value === value) {
						ret = name;
						return false;
					}
				});
			}

			if (array !== undefined) {

				EACH(array, function(_value, key) {
					if (_value === value) {
						ret = key;
						return false;
					}
				});
			}
		}

		return ret;
	}
});

/**
 * 데이터나 배열의 특정 값을 삭제합니다.
 */
global.REMOVE = METHOD({

	run : function(dataOrArrayOrParams, filter) {
		'use strict';
		//REQUIRED: dataOrArrayOrParams
		//OPTIONAL: dataOrArrayOrParams.data
		//OPTIONAL: dataOrArrayOrParams.array
		//OPTIONAL: dataOrArrayOrParams.name	데이터에서 삭제할 값의 이름
		//OPTIONAL: dataOrArrayOrParams.key		배열에서 삭제할 값의 키 (index)
		//OPTIONAL: dataOrArrayOrParams.value	삭제할 값, 이 값을 찾아 삭제합니다.
		//OPTIONAL: filter

		var
		// data
		data,

		// array
		array,

		// name
		name,

		// key
		key,

		// value
		value;
		
		if (filter !== undefined) {

			if (CHECK_IS_DATA(dataOrArrayOrParams) === true) {

				EACH(dataOrArrayOrParams, function(value, name) {

					// remove value passed filter.
					if (filter(value, name) === true) {

						REMOVE({
							data : dataOrArrayOrParams,
							name : name
						});
					}
				});
			}

			else if (CHECK_IS_ARRAY(dataOrArrayOrParams) === true) {

				EACH(dataOrArrayOrParams, function(value, key) {

					// remove value passed filter.
					if (filter(value, key) === true) {

						REMOVE({
							array : dataOrArrayOrParams,
							key : key
						});
					}
				});
			}
		}

		else {

			// init params.
			data = dataOrArrayOrParams.data;
			array = dataOrArrayOrParams.array;
			name = dataOrArrayOrParams.name;
			key = dataOrArrayOrParams.key;
			value = dataOrArrayOrParams.value;

			if (name !== undefined) {
				delete data[name];
			}

			if (key !== undefined) {
				array.splice(key, 1);
			}

			if (value !== undefined) {

				if (data !== undefined) {

					EACH(data, function(_value, name) {

						if (CHECK_ARE_SAME([_value, value]) === true) {

							REMOVE({
								data : data,
								name : name
							});
						}
					});
				}

				if (array !== undefined) {

					EACH(array, function(_value, key) {

						if (CHECK_ARE_SAME([_value, value]) === true) {

							REMOVE({
								array : array,
								key : key
							});
						}
					});
				}
			}
		}
	}
});

/**
 * 날짜를 처리할 때 Date형을 좀 더 쓰기 편하도록 개선한 CALENDAR 클래스
 */
global.CALENDAR = CLASS({

	init : function(inner, self, date) {
		'use strict';
		//OPTIONAL: date	입력하지 않으면 현재 시각을 기준으로 생성합니다.

		var
		// get year.
		getYear,

		// get month.
		getMonth,

		// get date.
		getDate,

		// get day.
		getDay,

		// get hour.
		getHour,

		// get minute
		getMinute,

		// get second.
		getSecond;

		if (date === undefined) {
			date = new Date();
		}

		self.getYear = getYear = function() {
			return date.getFullYear();
		};

		self.getMonth = getMonth = function(isFormal) {
			//OPTIONAL: isFormal	true로 설정하면 10보다 작은 수일 경우 앞에 0을 붙힌 문자열을 반환합니다. ex) 01, 04, 09
			
			var
			// month
			month = date.getMonth() + 1;
			
			if (isFormal === true) {
				if (month < 10) {
					return '0' + month;
				} else {
					return '' + month;
				}
			} else {
				return month;
			}
		};

		self.getDate = getDate = function(isFormal) {
			//OPTIONAL: isFormal	true로 설정하면 10보다 작은 수일 경우 앞에 0을 붙힌 문자열을 반환합니다. ex) 01, 04, 09
			
			var
			// date
			d = date.getDate();
			
			if (isFormal === true) {
				if (d < 10) {
					return '0' + d;
				} else {
					return '' + d;
				}
			} else {
				return d;
			}
		};

		self.getDay = getDay = function() {
			return date.getDay();
		};

		self.getHour = getHour = function(isFormal) {
			//OPTIONAL: isFormal	true로 설정하면 10보다 작은 수일 경우 앞에 0을 붙힌 문자열을 반환합니다. ex) 01, 04, 09
			
			var
			// hour
			hour = date.getHours();
			
			if (isFormal === true) {
				if (hour < 10) {
					return '0' + hour;
				} else {
					return '' + hour;
				}
			} else {
				return hour;
			}
		};

		self.getMinute = getMinute = function(isFormal) {
			//OPTIONAL: isFormal	true로 설정하면 10보다 작은 수일 경우 앞에 0을 붙힌 문자열을 반환합니다. ex) 01, 04, 09
			
			var
			// minute
			minute = date.getMinutes();
			
			if (isFormal === true) {
				if (minute < 10) {
					return '0' + minute;
				} else {
					return '' + minute;
				}
			} else {
				return minute;
			}
		};

		self.getSecond = getSecond = function(isFormal) {
			//OPTIONAL: isFormal	true로 설정하면 10보다 작은 수일 경우 앞에 0을 붙힌 문자열을 반환합니다. ex) 01, 04, 09
			
			var
			// second
			second = date.getSeconds();
			
			if (isFormal === true) {
				if (second < 10) {
					return '0' + second;
				} else {
					return '' + second;
				}
			} else {
				return second;
			}
		};
	}
});

/**
 * Date형 값을 생성합니다.
 */
global.CREATE_DATE = METHOD({

	run : function(params) {
		'use strict';
		//REQUIRED: params
		//OPTIONAL: params.year
		//OPTIONAL: params.month
		//OPTIONAL: params.date
		//OPTIONAL: params.hour
		//OPTIONAL: params.minute
		//OPTIONAL: params.second
		
		var
		// year
		year = params.year,
		
		// month
		month = params.month,
		
		// date
		date = params.date,
		
		// hour
		hour = params.hour,
		
		// minute
		minute = params.minute,
		
		// second
		second = params.second,
		
		// now cal
		nowCal = CALENDAR(new Date());
		
		if (year === undefined) {
			year = nowCal.getYear();
		}
		
		if (month === undefined) {
			month = date === undefined ? 0 : nowCal.getMonth();
		}
		
		if (date === undefined) {
			date = hour === undefined ? 0 : nowCal.getDate();
		}
		
		if (hour === undefined) {
			hour = minute === undefined ? 0 : nowCal.getHour();
		}
		
		if (minute === undefined) {
			minute = second === undefined ? 0 : nowCal.getMinute();
		}
		
		if (second === undefined) {
			second = 0;
		}

		return new Date(year, month - 1, date, hour, minute, second);
	}
});

/**
 * 주어진 초가 흐른 뒤에 함수를 실행하는 DELAY 클래스
 */
global.DELAY = CLASS({

	init : function(inner, self, seconds, func) {
		'use strict';
		//REQUIRED: seconds
		//OPTIONAL: func

		var
		// milliseconds
		milliseconds,
		
		// start time
		startTime = Date.now(),
		
		// remaining
		remaining,
		
		// timeout
		timeout,

		// resume.
		resume,
		
		// pause.
		pause,
		
		// remove.
		remove;

		if (func === undefined) {
			func = seconds;
			seconds = 0;
		}
		
		remaining = milliseconds = seconds * 1000;
		
		self.resume = resume = RAR(function() {
			
			if (timeout === undefined) {
				
				timeout = setTimeout(function() {
					func();
				}, remaining);
			}
		});
		
		self.pause = pause = function() {
			
			remaining = milliseconds - (Date.now() - startTime);
			
			clearTimeout(timeout);
			timeout = undefined;
		};
		
		self.remove = remove = function() {
			pause();
		};
	}
});

/**
 * 주어진 초 마다 함수를 반복해서 실행하는 INTERVAL 클래스
 */
global.INTERVAL = CLASS({

	init : function(inner, self, seconds, func) {
		'use strict';
		//REQUIRED: seconds
		//OPTIONAL: func

		var
		// milliseconds
		milliseconds,
		
		// start time
		startTime = Date.now(),
		
		// remaining
		remaining,
		
		// interval
		interval,
		
		// resume.
		resume,
		
		// pause.
		pause,

		// remove.
		remove;

		if (func === undefined) {
			func = seconds;
			seconds = 0;
		}
		
		remaining = milliseconds = seconds === 0 ? 1 : seconds * 1000;
		
		self.resume = resume = RAR(function() {
			
			if (interval === undefined) {
				
				interval = setInterval(function() {
					
					if (func(self) === false) {
						remove();
					}
					
					startTime = Date.now();
					
				}, remaining);
			}
		});
		
		self.pause = pause = function() {
			
			remaining = milliseconds - (Date.now() - startTime);
			
			clearInterval(interval);
			interval = undefined;
		};
		
		self.remove = remove = function() {
			pause();
		};
	}
});

/**
 * 아주 짧은 시간동안 반복해서 실행하는 로직을 작성할때 사용하는 LOOP 클래스 (게임 개발 등에 사용됩니다.)
 */
global.LOOP = CLASS(function(cls) {
	'use strict';

	var
	// before time
	beforeTime,

	// animation interval
	animationInterval,

	// loop infos
	loopInfos = [],

	// runs
	runs = [],

	// fire.
	fire = function() {

		if (animationInterval === undefined) {

			beforeTime = Date.now();

			animationInterval = INTERVAL(function() {

				var
				// time
				time = Date.now(),

				// times
				times = time - beforeTime,

				// loop info
				loopInfo,

				// count
				count,

				// interval
				interval,

				// i, j
				i, j;

				if (times > 0) {

					for (i = 0; i < loopInfos.length; i += 1) {

						loopInfo = loopInfos[i];

						if (loopInfo.fps !== undefined && loopInfo.fps > 0) {

							if (loopInfo.timeSigma === undefined) {
								loopInfo.timeSigma = 0;
								loopInfo.countSigma = 0;
							}

							// calculate count.
							count = parseInt(loopInfo.fps / (1000 / times) * (loopInfo.timeSigma / times + 1), 10) - loopInfo.countSigma;

							// start.
							if (loopInfo.start !== undefined) {
								loopInfo.start();
							}

							// run interval.
							interval = loopInfo.interval;
							for (j = 0; j < count; j += 1) {
								interval(loopInfo.fps);
							}

							// end.
							if (loopInfo.end !== undefined) {
								loopInfo.end(times);
							}

							loopInfo.countSigma += count;

							loopInfo.timeSigma += times;
							if (loopInfo.timeSigma > 1000) {
								loopInfo.timeSigma = undefined;
							}
						}
					}

					// run runs.
					for (i = 0; i < runs.length; i += 1) {
						runs[i](times);
					}

					beforeTime = time;
				}
			});
		}
	},

	// stop.
	stop = function() {

		if (loopInfos.length <= 0 && runs.length <= 0) {

			animationInterval.remove();
			animationInterval = undefined;
		}
	};

	return {

		init : function(inner, self, fpsOrRun, intervalOrFuncs) {
			//OPTIONAL: fpsOrRun
			//OPTIONAL: intervalOrFuncs
			//OPTIONAL: intervalOrFuncs.start
			//REQUIRED: intervalOrFuncs.interval
			//OPTIONAL: intervalOrFuncs.end

			var
			// run.
			run,

			// start.
			start,

			// interval.
			interval,

			// end.
			end,

			// info
			info,
			
			// resume.
			resume,
			
			// pause.
			pause,

			// change fps.
			changeFPS,

			// remove.
			remove;

			if (intervalOrFuncs !== undefined) {

				// init intervalOrFuncs.
				if (CHECK_IS_DATA(intervalOrFuncs) !== true) {
					interval = intervalOrFuncs;
				} else {
					start = intervalOrFuncs.start;
					interval = intervalOrFuncs.interval;
					end = intervalOrFuncs.end;
				}
			
				self.resume = resume = RAR(function() {
					
					loopInfos.push( info = {
						fps : fpsOrRun,
						start : start,
						interval : interval,
						end : end
					});
					
					fire();
				});

				self.pause = pause = function() {

					REMOVE({
						array : loopInfos,
						value : info
					});

					stop();
				};

				self.changeFPS = changeFPS = function(fps) {
					//REQUIRED: fps

					info.fps = fps;
				};

				self.remove = remove = function() {
					pause();
				};
			}

			// when fpsOrRun is run
			else {
				
				self.resume = resume = RAR(function() {
					
					runs.push(run = fpsOrRun);
					
					fire();
				});

				self.pause = pause = function() {

					REMOVE({
						array : runs,
						value : run
					});

					stop();
				};

				self.remove = remove = function() {
					pause();
				};
			}
		}
	};
});

/**
 * 주어진 함수를 즉시 실행하고, 함수를 반환합니다.
 * 
 * 선언과 동시에 실행되어야 하는 함수를 선언할 때 유용합니다.
 */
global.RAR = METHOD({

	run : function(params, func) {
		'use strict';
		//OPTIONAL: params
		//REQUIRED: func

		// if func is undefined, func is params.
		if (func === undefined) {
			func = params;
			params = undefined;
		}

		func(params);

		return func;
	}
});

/**
 * 주어진 함수를 즉시 실행합니다.
 * 
 * 새로운 코드 블록이 필요할 때 사용합니다.
 */
global.RUN = METHOD({

	run : function(func) {
		'use strict';
		//REQUIRED: func

		var
		// f.
		f = function() {
			return func(f);
		};

		return f();
	}
});

/**
 * 정수 문자열을 정수 값으로 변환합니다.
 */
global.INTEGER = METHOD({

	run : function(integerString) {
		'use strict';
		//OPTIONAL: integerString

		return integerString === undefined ? undefined : parseInt(integerString, 10);
	}
});

/**
 * 임의의 정수를 생성합니다.
 */
global.RANDOM = METHOD({

	run : function(limitOrParams) {
		'use strict';
		//REQUIRED: limitOrParams
		//OPTIONAL: limitOrParams.min	생성할 정수 범위 최소값, 이 값 이상인 값만 생성합니다.
		//OPTIONAL: limitOrParams.max	생성할 정수 범위 최대값, 이 값 이하인 값만 생성합니다.
		//OPTIONAL: limitOrParams.limit	생성할 정수 범위 제한값, 이 값 미만인 값만 생성합니다.

		var
		// min
		min,

		// max
		max,

		// limit
		limit;

		// init limitOrParams.
		if (CHECK_IS_DATA(limitOrParams) !== true) {
			limit = limitOrParams;
		} else {
			min = limitOrParams.min;
			max = limitOrParams.max;
			limit = limitOrParams.limit;
		}

		if (min === undefined) {
			min = 0;
		}

		if (limit !== undefined) {
			max = limit - 1;
		}

		return Math.floor(Math.random() * (max - min + 1) + min);
	}
});

/**
 * 실수 문자열을 실수 값으로 변환합니다.
 */
global.REAL = METHOD({

	run : function(realNumberString) {
		'use strict';
		//OPTIONAL: realNumberString

		return realNumberString === undefined ? undefined : parseFloat(realNumberString);
	}
});

/**
 * 데이터나 배열, 문자열의 각 요소를 순서대로 대입하여 주어진 함수를 실행합니다.
 */
global.EACH = METHOD({

	run : function(dataOrArrayOrString, func) {
		'use strict';
		//OPTIONAL: dataOrArrayOrString
		//REQUIRED: func

		var
		// length
		length,

		// name
		name,

		// extras
		i;

		if (dataOrArrayOrString === undefined) {
			return false;
		}

		else if (CHECK_IS_DATA(dataOrArrayOrString) === true) {

			for (name in dataOrArrayOrString) {
				if (dataOrArrayOrString.hasOwnProperty === undefined || dataOrArrayOrString.hasOwnProperty(name) === true) {
					if (func(dataOrArrayOrString[name], name) === false) {
						return false;
					}
				}
			}
		}

		else if (func === undefined) {

			func = dataOrArrayOrString;
			dataOrArrayOrString = undefined;

			return function(dataOrArrayOrString) {
				return EACH(dataOrArrayOrString, func);
			};
		}

		// when dataOrArrayOrString is array or arguments or string
		else {

			length = dataOrArrayOrString.length;

			for ( i = 0; i < length; i += 1) {

				if (func(dataOrArrayOrString[i], i) === false) {
					return false;
				}

				// when shrink
				if (dataOrArrayOrString.length < length) {
					i -= length - dataOrArrayOrString.length;
					length -= length - dataOrArrayOrString.length;
				}

				// when stretch
				else if (dataOrArrayOrString.length > length) {
					length += dataOrArrayOrString.length - length;
				}
			}
		}

		return true;
	}
});

/**
 * 주어진 함수를 주어진 횟수만큼 반복해서 실행합니다.
 */
global.REPEAT = METHOD({

	run : function(countOrParams, func) {
		'use strict';
		//OPTIONAL: countOrParams
		//REQUIRED: countOrParams.start
		//OPTIONAL: countOrParams.end
		//OPTIONAL: countOrParams.limit
		//OPTIONAL: countOrParams.step
		//REQUIRED: func

		var
		// count
		count,

		// start
		start,

		// end
		end,

		// limit
		limit,

		// step
		step,

		// extras
		i;
		
		if (func === undefined) {
			func = countOrParams;
			countOrParams = undefined;
		}

		if (countOrParams !== undefined) {
			if (CHECK_IS_DATA(countOrParams) !== true) {
				count = countOrParams;
			} else {
				start = countOrParams.start;
				end = countOrParams.end;
				limit = countOrParams.limit;
				step = countOrParams.step;
			}
		}

		if (limit === undefined && end !== undefined) {
			limit = end + 1;
		}

		if (step === undefined) {
			step = 1;
		}

		// count mode
		if (count !== undefined) {

			for ( i = 0; i < parseInt(count, 10); i += 1) {
				if (func(i) === false) {
					return false;
				}
			}
		}

		// end mode
		else if (end !== undefined && start > end) {

			for ( i = start; i >= end; i -= step) {
				if (func(i) === false) {
					return false;
				}
			}

		}

		// limit mode
		else if (limit !== undefined) {

			for ( i = start; i < limit; i += step) {
				if (func(i) === false) {
					return false;
				}
			}
		}
		
		// func mode
		else {
			
			return function(countOrParams) {
				return REPEAT(countOrParams, func);
			};
		}

		return true;
	}
});

/**
 * 데이터나 배열, 문자열의 각 요소를 역순으로 대입하여 주어진 함수를 실행합니다.
 */
global.REVERSE_EACH = METHOD({

	run : function(arrayOrString, func) {
		'use strict';
		//OPTIONAL: arrayOrString
		//REQUIRED: func

		var
		// length
		length,

		// name
		name,

		// extras
		i;

		if (arrayOrString === undefined) {
			return false;
		}

		// when arrayOrString is func
		else if (func === undefined) {

			func = arrayOrString;
			arrayOrString = undefined;

			return function(arrayOrString) {
				return REVERSE_EACH(arrayOrString, func);
			};
		}

		// when arrayOrString is array or arguments or string
		else {

			length = arrayOrString.length;

			for ( i = length - 1; i >= 0; i -= 1) {

				if (func(arrayOrString[i], i) === false) {
					return false;
				}
				
				// when shrink
				if (arrayOrString.length < length) {
					i += length - arrayOrString.length;
				}
			}
		}

		return true;
	}
});

/*
 * 콘솔에 표시할 텍스트를 파란색으로 설정합니다.
 */
global.CONSOLE_BLUE = METHOD({

	run : function(text) {
		'use strict';
		//REQUIRED: text

		return '[36m' + text + '[0m';
	}
});

/*
 * 콘솔에 표시할 텍스트를 초록색으로 설정합니다.
 */
global.CONSOLE_GREEN = METHOD({

	run : function(text) {
		'use strict';
		//REQUIRED: text

		return '[32m' + text + '[0m';
	}
});

/*
 * 콘솔에 표시할 텍스트를 빨간색으로 설정합니다.
 */
global.CONSOLE_RED = METHOD({

	run : function(text) {
		'use strict';
		//REQUIRED: text

		return '[31m' + text + '[0m';
	}
});

/*
 * 콘솔에 표시할 텍스트를 노란색으로 설정합니다.
 */
global.CONSOLE_YELLOW = METHOD({

	run : function(text) {
		'use strict';
		//REQUIRED: text

		return '[33m' + text + '[0m';
	}
});

/*
 * 콘솔에 에러 메시지를 붉은색으로 출력합니다.
 */
global.SHOW_ERROR = function(tag, errorMsg, params) {
	//REQUIRED: tag
	//REQUIRED: errorMsg
	//OPTIONAL: params
	
	console.log(CONSOLE_RED('[' + tag + '] 오류가 발생했습니다. 오류 메시지: ' + errorMsg));
	
	if (params !== undefined) {
		console.log(CONSOLE_RED('다음은 오류를 발생시킨 파라미터입니다.'));
		console.log(CONSOLE_RED(JSON.stringify(params, TO_DELETE, 4)));
	}
};
/**
 * 지정된 경로에 파일이나 폴더가 존재하는지 확인합니다.
 */
global.CHECK_IS_EXISTS_FILE = METHOD(function() {
	'use strict';

	var
	//IMPORT: fs
	fs = require('fs');

	return {

		run : function(pathOrParams, callback) {
			//REQUIRED: pathOrParams
			//REQUIRED: pathOrParams.path	확인할 경로
			//OPTIONAL: pathOrParams.isSync	true로 설정하면 callback을 실행하지 않고 즉시 실행하여 결과를 반환합니다. 이 설정은 명령이 끝날때 까지 프로그램이 멈추게 되므로 필요한 경우에만 사용합니다.
			//OPTIONAL: callback

			var
			// path
			path,

			// is sync
			isSync;

			// init params.
			if (CHECK_IS_DATA(pathOrParams) !== true) {
				path = pathOrParams;
			} else {
				path = pathOrParams.path;
				isSync = pathOrParams.isSync;
			}

			// when normal mode
			if (isSync !== true) {
				fs.exists(path, callback);
			}

			// when sync mode
			else {
				return fs.existsSync(path);
			}
		}
	};
});

/**
 * 지정된 경로가 (파일이 아닌) 폴더인지 확인합니다.
 */
global.CHECK_IS_FOLDER = METHOD(function() {
	'use strict';

	var
	//IMPORT: fs
	fs = require('fs');

	return {

		run : function(pathOrParams, callbackOrHandlers) {
			//REQUIRED: pathOrParams
			//REQUIRED: pathOrParams.path	확인할 경로
			//OPTIONAL: pathOrParams.isSync	true로 설정하면 callback을 실행하지 않고 즉시 실행하여 결과를 반환합니다. 이 설정은 명령이 끝날때 까지 프로그램이 멈추게 되므로 필요한 경우에만 사용합니다.
			//OPTIONAL: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//OPTIONAL: callbackOrHandlers.success

			var
			// path
			path,

			// is sync
			isSync,

			// error handler.
			errorHandler,
			
			// callback.
			callback;

			// init params.
			if (CHECK_IS_DATA(pathOrParams) !== true) {
				path = pathOrParams;
			} else {
				path = pathOrParams.path;
				isSync = pathOrParams.isSync;
			}
			
			if (callbackOrHandlers !== undefined) {
				if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
					callback = callbackOrHandlers;
				} else {
					errorHandler = callbackOrHandlers.error;
					callback = callbackOrHandlers.success;
				}
			}

			// when normal mode
			if (isSync !== true) {
				
				fs.stat(path, function(error, stat) {
					
					var
					// error msg
					errorMsg;

					if (error !== TO_DELETE) {

						errorMsg = error.toString();

						if (errorHandler !== undefined) {
							errorHandler(errorMsg);
						} else {
							SHOW_ERROR('CHECK_IS_FOLDER', errorMsg);
						}

					} else if (callback !== undefined) {
						callback(stat.isDirectory());
					}
				});
			}

			// when sync mode
			else {
				return fs.statSync(path).isDirectory();
			}
		}
	};
});

/**
 * 파일을 복사합니다.
 */
global.COPY_FILE = METHOD(function() {
	'use strict';

	var
	//IMPORT: fs
	fs = require('fs'),

	//IMPORT: path
	_path = require('path');

	return {

		run : function(params, callbackOrHandlers) {
			//REQUIRED: params
			//REQUIRED: params.from		복사할 파일의 위치
			//REQUIRED: params.to		파일을 복사할 위치
			//OPTIONAL: params.isSync	true로 설정하면 callback을 실행하지 않고 즉시 실행합니다. 이 설정은 명령이 끝날때 까지 프로그램이 멈추게 되므로 필요한 경우에만 사용합니다.
			//OPTIONAL: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.notExistsHandler
			//OPTIONAL: callbackOrHandlers.error
			//OPTIONAL: callbackOrHandlers.success

			var
			// from
			from = params.from,

			// to
			to = params.to,

			// is sync
			isSync = params.isSync,

			// not exists handler.
			notExistsHandler,

			// error handler.
			errorHandler,

			// callback.
			callback;

			if (callbackOrHandlers !== undefined) {
				if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
					callback = callbackOrHandlers;
				} else {
					notExistsHandler = callbackOrHandlers.notExists;
					errorHandler = callbackOrHandlers.error;
					callback = callbackOrHandlers.success;
				}
			}

			CREATE_FOLDER({
				path : _path.dirname(to),
				isSync : isSync
			}, {

				error : errorHandler,

				success : function() {

					// when normal mode
					if (isSync !== true) {

						CHECK_IS_EXISTS_FILE(from, function(isExists) {

							var
							// reader
							reader;

							if (isExists === true) {

								reader = fs.createReadStream(from);

								reader.pipe(fs.createWriteStream(to));

								reader.on('error', function(error) {

									var
									// error msg
									errorMsg = error.toString();

									if (errorHandler !== undefined) {
										errorHandler(errorMsg);
									} else {
										SHOW_ERROR('COPY_FILE', errorMsg);
									}
								});

								reader.on('end', function() {
									if (callback !== undefined) {
										callback();
									}
								});

							} else {

								if (notExistsHandler !== undefined) {
									notExistsHandler(from);
								} else {
									console.log(CONSOLE_YELLOW('[COPY_FILE] 파일이 존재하지 않습니다. 경로: ' + from));
								}
							}
						});
					}

					// when sync mode
					else {

						RUN(function() {

							var
							// error msg
							errorMsg;

							try {

								if (CHECK_IS_EXISTS_FILE({
									path : from,
									isSync : true
								}) === true) {

									fs.writeFileSync(to, fs.readFileSync(from));

								} else {

									if (notExistsHandler !== undefined) {
										notExistsHandler(from);
									} else {
										console.log(CONSOLE_YELLOW('[COPY_FILE] 파일이 존재하지 않습니다. 경로: ' + from));
									}

									// do not run callback.
									return;
								}

							} catch(error) {

								if (error !== TO_DELETE) {

									errorMsg = error.toString();

									if (errorHandler !== undefined) {
										errorHandler(errorMsg);
									} else {
										SHOW_ERROR('COPY_FILE', errorMsg);
									}
								}
							}

							if (callback !== undefined) {
								callback();
							}
						});
					}
				}
			});
		}
	};
});

/**
 * 폴더를 생성합니다.
 */
global.CREATE_FOLDER = METHOD(function() {
	'use strict';

	var
	//IMPORT: fs
	fs = require('fs'),

	//IMPORT: path
	_path = require('path');

	return {

		run : function(pathOrParams, callbackOrHandlers) {
			//REQUIRED: pathOrParams
			//REQUIRED: pathOrParams.path	폴더를 생성할 경로
			//OPTIONAL: pathOrParams.isSync	true로 설정하면 callback을 실행하지 않고 즉시 실행합니다. 이 설정은 명령이 끝날때 까지 프로그램이 멈추게 되므로 필요한 경우에만 사용합니다.
			//OPTIONAL: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//OPTIONAL: callbackOrHandlers.success

			var
			// path
			path,

			// is sync
			isSync,

			// folder path
			folderPath,

			// error handler.
			errorHandler,

			// callback.
			callback;

			// init params.
			if (CHECK_IS_DATA(pathOrParams) !== true) {
				path = pathOrParams;
			} else {
				path = pathOrParams.path;
				isSync = pathOrParams.isSync;
			}

			if (callbackOrHandlers !== undefined) {
				if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
					callback = callbackOrHandlers;
				} else {
					errorHandler = callbackOrHandlers.error;
					callback = callbackOrHandlers.success;
				}
			}

			// when normal mode
			if (isSync !== true) {

				CHECK_IS_EXISTS_FILE(path, function(isExists) {

					if (isExists === true) {

						if (callback !== undefined) {
							callback();
						}

					} else {

						folderPath = _path.dirname(path);

						CHECK_IS_EXISTS_FILE(folderPath, function(isExists) {

							if (isExists === true) {

								fs.mkdir(path, function(error) {

									var
									// error msg
									errorMsg;

									if (error !== TO_DELETE) {

										errorMsg = error.toString();

										if (errorHandler !== undefined) {
											errorHandler(errorMsg);
										} else {
											SHOW_ERROR('CREATE_FOLDER', errorMsg);
										}

									} else {
										callback();
									}
								});

							} else {

								CREATE_FOLDER(folderPath, function() {

									// retry.
									CREATE_FOLDER(path, callback);
								});
							}
						});
					}
				});
			}

			// when sync mode
			else {

				RUN(function() {

					var
					// error msg
					errorMsg;

					try {

						if (CHECK_IS_EXISTS_FILE({
							path : path,
							isSync : true
						}) !== true) {

							folderPath = _path.dirname(path);

							if (CHECK_IS_EXISTS_FILE({
								path : folderPath,
								isSync : true
							}) === true) {
								fs.mkdirSync(path);
							} else {

								CREATE_FOLDER({
									path : folderPath,
									isSync : true
								});

								// retry.
								CREATE_FOLDER({
									path : path,
									isSync : true
								});
							}
						}

					} catch(error) {

						if (error !== TO_DELETE) {

							errorMsg = error.toString();

							if (errorHandler !== undefined) {
								errorHandler(errorMsg);
							} else {
								SHOW_ERROR('CREATE_FOLDER', errorMsg);
							}
						}
					}

					if (callback !== undefined) {
						callback();
					}
				});
			}
		}
	};
});

/**
 * 지정된 경로에 위치한 파일들의 이름 목록을 불러옵니다.
 */
global.FIND_FILE_NAMES = METHOD(function() {
	'use strict';

	var
	//IMPORT: fs
	fs = require('fs'),

	//IMPORT: path
	_path = require('path');

	return {

		run : function(pathOrParams, callbackOrHandlers) {
			//REQUIRED: pathOrParams
			//REQUIRED: pathOrParams.path	파일들이 위치한 경로
			//OPTIONAL: pathOrParams.isSync	true로 설정하면 callback을 실행하지 않고 즉시 실행하여 결과를 반환합니다. 이 설정은 명령이 끝날때 까지 프로그램이 멈추게 되므로 필요한 경우에만 사용합니다.
			//OPTIONAL: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.notExistsHandler
			//OPTIONAL: callbackOrHandlers.error
			//OPTIONAL: callbackOrHandlers.success

			var
			// path
			path,

			// is sync
			isSync,

			// not exists handler.
			notExistsHandler,

			// error handler.
			errorHandler,

			// callback.
			callback,

			// file names
			fileNames = [];

			// init params.
			if (CHECK_IS_DATA(pathOrParams) !== true) {
				path = pathOrParams;
			} else {
				path = pathOrParams.path;
				isSync = pathOrParams.isSync;
			}

			if (callbackOrHandlers !== undefined) {
				if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
					callback = callbackOrHandlers;
				} else {
					notExistsHandler = callbackOrHandlers.notExists;
					errorHandler = callbackOrHandlers.error;
					callback = callbackOrHandlers.success;
				}
			}

			// when normal mode
			if (isSync !== true) {

				CHECK_IS_EXISTS_FILE(path, function(isExists) {

					if (isExists === true) {

						fs.readdir(path, function(error, names) {

							var
							// error msg
							errorMsg;

							if (error !== TO_DELETE) {

								errorMsg = error.toString();

								if (errorHandler !== undefined) {
									errorHandler(errorMsg);
								} else {
									SHOW_ERROR('FIND_FILE_NAMES', errorMsg);
								}

							} else if (callback !== undefined) {

								PARALLEL(names, [
								function(name, done) {

									if (name[0] !== '.') {

										fs.stat(path + '/' + name, function(error, stats) {

											var
											// error msg
											errorMsg;

											if (error !== TO_DELETE) {

												errorMsg = error.toString();

												if (errorHandler !== undefined) {
													errorHandler(errorMsg);
												} else {
													SHOW_ERROR('FIND_FILE_NAMES', errorMsg);
												}

											} else {

												if (stats.isDirectory() !== true) {
													fileNames.push(name);
												}

												done();
											}
										});

									} else {
										done();
									}
								},

								function() {
									if (callback !== undefined) {
										callback(fileNames);
									}
								}]);
							}
						});

					} else {

						if (notExistsHandler !== undefined) {
							notExistsHandler(path);
						} else {
							console.log(CONSOLE_YELLOW('[FIND_FOLDER_NAMES] 폴더가 존재하지 않습니다. 경로: ' + path));
						}
					}
				});
			}

			// when sync mode
			else {

				return RUN(function() {

					var
					// names
					names,

					// error msg
					errorMsg;

					try {

						if (CHECK_IS_EXISTS_FILE({
							path : path,
							isSync : true
						}) === true) {

							names = fs.readdirSync(path);

							EACH(names, function(name) {
								if (name[0] !== '.' && fs.statSync(path + '/' + name).isDirectory() !== true) {
									fileNames.push(name);
								}
							});

						} else {

							if (notExistsHandler !== undefined) {
								notExistsHandler(path);
							} else {
								console.log(CONSOLE_YELLOW('[FIND_FILE_NAMES] 폴더가 존재하지 않습니다. 경로: ' + path));
							}

							// do not run callback.
							return;
						}

					} catch(error) {

						if (error !== TO_DELETE) {

							errorMsg = error.toString();

							if (errorHandler !== undefined) {
								errorHandler(errorMsg);
							} else {
								SHOW_ERROR('FIND_FILE_NAMES', errorMsg);
							}
						}
					}

					if (callback !== undefined) {
						callback(fileNames);
					}

					return fileNames;
				});
			}
		}
	};
});

/**
 * 지정된 경로에 위치한 폴더들의 이름 목록을 불러옵니다.
 */
global.FIND_FOLDER_NAMES = METHOD(function() {
	'use strict';

	var
	//IMPORT: fs
	fs = require('fs'),

	//IMPORT: path
	_path = require('path');

	return {

		run : function(pathOrParams, callbackOrHandlers) {
			//REQUIRED: pathOrParams
			//REQUIRED: pathOrParams.path	폴더들이 위치한 경로
			//OPTIONAL: pathOrParams.isSync	true로 설정하면 callback을 실행하지 않고 즉시 실행하여 결과를 반환합니다. 이 설정은 명령이 끝날때 까지 프로그램이 멈추게 되므로 필요한 경우에만 사용합니다.
			//OPTIONAL: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.notExistsHandler
			//OPTIONAL: callbackOrHandlers.error
			//OPTIONAL: callbackOrHandlers.success

			var
			// path
			path,

			// is sync
			isSync,

			// not exists handler.
			notExistsHandler,

			// error handler.
			errorHandler,

			// callback.
			callback,

			// file names
			folderNames = [];

			// init params.
			if (CHECK_IS_DATA(pathOrParams) !== true) {
				path = pathOrParams;
			} else {
				path = pathOrParams.path;
				isSync = pathOrParams.isSync;
			}

			if (callbackOrHandlers !== undefined) {
				if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
					callback = callbackOrHandlers;
				} else {
					notExistsHandler = callbackOrHandlers.notExists;
					errorHandler = callbackOrHandlers.error;
					callback = callbackOrHandlers.success;
				}
			}

			// when normal mode
			if (isSync !== true) {

				CHECK_IS_EXISTS_FILE(path, function(isExists) {

					if (isExists === true) {

						fs.readdir(path, function(error, names) {

							var
							// error msg
							errorMsg;

							if (error !== TO_DELETE) {

								errorMsg = error.toString();

								if (errorHandler !== undefined) {
									errorHandler(errorMsg);
								} else {
									SHOW_ERROR('FIND_FOLDER_NAMES', errorMsg);
								}

							} else if (callback !== undefined) {

								PARALLEL(names, [
								function(name, done) {

									if (name[0] !== '.') {

										fs.stat(path + '/' + name, function(error, stats) {

											var
											// error msg
											errorMsg;

											if (error !== TO_DELETE) {

												errorMsg = error.toString();

												if (errorHandler !== undefined) {
													errorHandler(errorMsg);
												} else {
													SHOW_ERROR('FIND_FOLDER_NAMES', errorMsg);
												}

											} else {

												if (stats.isDirectory() === true) {
													folderNames.push(name);
												}

												done();
											}
										});

									} else {
										done();
									}
								},

								function() {
									if (callback !== undefined) {
										callback(folderNames);
									}
								}]);
							}
						});

					} else {

						if (notExistsHandler !== undefined) {
							notExistsHandler(path);
						} else {
							console.log(CONSOLE_YELLOW('[FIND_FOLDER_NAMES] 폴더가 존재하지 않습니다. 경로: ' + path));
						}
					}
				});
			}

			// when sync mode
			else {

				return RUN(function() {

					var
					// names
					names,

					// error msg
					errorMsg;

					try {

						if (CHECK_IS_EXISTS_FILE({
							path : path,
							isSync : true
						}) === true) {

							names = fs.readdirSync(path);

							EACH(names, function(name) {
								if (name[0] !== '.' && fs.statSync(path + '/' + name).isDirectory() === true) {
									folderNames.push(name);
								}
							});

						} else {

							if (notExistsHandler !== undefined) {
								notExistsHandler(path);
							} else {
								console.log(CONSOLE_YELLOW('[FIND_FOLDER_NAMES] 폴더가 존재하지 않습니다. 경로: ' + path));
							}

							// do not run callback.
							return;
						}

					} catch(error) {

						if (error !== TO_DELETE) {

							errorMsg = error.toString();

							if (errorHandler !== undefined) {
								errorHandler(errorMsg);
							} else {
								SHOW_ERROR('FIND_FOLDER_NAMES', errorMsg);
							}
						}
					}

					if (callback !== undefined) {
						callback(folderNames);
					}

					return folderNames;
				});
			}
		}
	};
});

/**
 * 파일의 정보를 불러옵니다.
 * 
 * 파일의 크기(size), 생성 시간(createTime), 최종 수정 시간(lastUpdateTime)을 불러옵니다.
 */
global.GET_FILE_INFO = METHOD(function() {
	'use strict';

	var
	//IMPORT: fs
	fs = require('fs');

	return {

		run : function(pathOrParams, callbackOrHandlers) {
			//REQUIRED: pathOrParams
			//REQUIRED: pathOrParams.path	불러올 파일의 경로
			//OPTIONAL: pathOrParams.isSync	true로 설정하면 callback을 실행하지 않고 즉시 실행하여 결과를 반환합니다. 이 설정은 명령이 끝날때 까지 프로그램이 멈추게 되므로 필요한 경우에만 사용합니다.
			//OPTIONAL: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.notExists
			//OPTIONAL: callbackOrHandlers.error
			//OPTIONAL: callbackOrHandlers.success

			var
			// path
			path,

			// is sync
			isSync,

			// not eixsts handler.
			notExistsHandler,

			// error handler.
			errorHandler,

			// callback.
			callback;

			// init params.
			if (CHECK_IS_DATA(pathOrParams) !== true) {
				path = pathOrParams;
			} else {
				path = pathOrParams.path;
				isSync = pathOrParams.isSync;
			}

			if (callbackOrHandlers !== undefined) {
				if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
					callback = callbackOrHandlers;
				} else {
					notExistsHandler = callbackOrHandlers.notExists;
					errorHandler = callbackOrHandlers.error;
					callback = callbackOrHandlers.success;
				}
			}

			// when normal mode
			if (isSync !== true) {

				CHECK_IS_EXISTS_FILE(path, function(isExists) {

					if (isExists === true) {

						fs.stat(path, function(error, stat) {

							var
							// error msg
							errorMsg;

							if (error !== TO_DELETE) {

								errorMsg = error.toString();

								if (errorHandler !== undefined) {
									errorHandler(errorMsg);
								} else {
									SHOW_ERROR('GET_FILE_INFO', errorMsg);
								}

							} else if (stat.isDirectory() === true) {

								if (notExistsHandler !== undefined) {
									notExistsHandler(path);
								} else {
									console.log(CONSOLE_YELLOW('[GET_FILE_INFO] 파일이 존재하지 않습니다. 경로: ' + path));
								}

							} else if (callback !== undefined) {
								callback({
									size : stat.size,
									createTime : stat.birthtime,
									lastUpdateTime : stat.mtime
								});
							}
						});

					} else {

						if (notExistsHandler !== undefined) {
							notExistsHandler(path);
						} else {
							console.log(CONSOLE_YELLOW('[GET_FILE_INFO] 파일이 존재하지 않습니다. 경로: ' + path));
						}
					}
				});
			}

			// when sync mode
			else {

				return RUN(function() {

					var
					// error msg
					errorMsg,

					// stat
					stat;

					try {

						if (CHECK_IS_EXISTS_FILE({
							path : path,
							isSync : true
						}) === true) {
							
							stat = fs.statSync(path);

							if (stat.isDirectory() === true) {

								if (notExistsHandler !== undefined) {
									notExistsHandler(path);
								} else {
									console.log(CONSOLE_YELLOW('[GET_FILE_INFO] 파일이 존재하지 않습니다. 경로: ' + path));
								}
								
							} else {
								
								if (callback !== undefined) {
									callback({
										size : stat.size,
										createTime : stat.birthtime,
										lastUpdateTime : stat.mtime
									});
								}
								
								return {
									size : stat.size,
									createTime : stat.birthtime,
									lastUpdateTime : stat.mtime
								};
							}

						} else {

							if (notExistsHandler !== undefined) {
								notExistsHandler(path);
							} else {
								console.log(CONSOLE_YELLOW('[GET_FILE_INFO] 파일이 존재하지 않습니다. 경로: ' + path));
							}
						}

					} catch(error) {

						if (error !== TO_DELETE) {

							errorMsg = error.toString();

							if (errorHandler !== undefined) {
								errorHandler(errorMsg);
							} else {
								SHOW_ERROR('GET_FILE_INFO', errorMsg);
							}
						}
					}

					// do not run callback.
					return;
				});
			}
		}
	};
});

/**
 * 파일의 위치를 이동시킵니다.
 */
global.MOVE_FILE = METHOD({

	run : function(params, callbackOrHandlers) {
		'use strict';
		//REQUIRED: params
		//REQUIRED: params.from		파일의 원래 위치
		//REQUIRED: params.to		파일을 옮길 위치
		//OPTIONAL: params.isSync	true로 설정하면 callback을 실행하지 않고 즉시 실행합니다. 이 설정은 명령이 끝날때 까지 프로그램이 멈추게 되므로 필요한 경우에만 사용합니다.
		//REQUIRED: callbackOrHandlers
		//OPTIONAL: callbackOrHandlers.notExistsHandler
		//OPTIONAL: callbackOrHandlers.error
		//REQUIRED: callbackOrHandlers.success

		var
		// from
		from = params.from,

		// is sync
		isSync = params.isSync,

		// not exists handler.
		notExistsHandler,

		// error handler.
		errorHandler,

		// callback.
		callback;

		if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
			callback = callbackOrHandlers;
		} else {
			notExistsHandler = callbackOrHandlers.notExists;
			errorHandler = callbackOrHandlers.error;
			callback = callbackOrHandlers.success;
		}

		COPY_FILE(params, {
			error : errorHandler,
			notExists : notExistsHandler,
			success : function() {

				REMOVE_FILE({
					path : from,
					isSync : isSync
				}, {
					error : errorHandler,
					notExists : notExistsHandler,
					success : callback
				});
			}
		});
	}
});

/**
 * 파일의 내용을 불러옵니다.
 * 
 * 내용을 Buffer형으로 불러오기 때문에, 내용을 문자열로 불러오려면 toString 함수를 이용하시기 바랍니다.
 */
global.READ_FILE = METHOD(function() {
	'use strict';

	var
	//IMPORT: fs
	fs = require('fs');

	return {

		run : function(pathOrParams, callbackOrHandlers) {
			//REQUIRED: pathOrParams
			//REQUIRED: pathOrParams.path	불러올 파일의 경로
			//OPTIONAL: pathOrParams.isSync	true로 설정하면 callback을 실행하지 않고 즉시 실행하여 결과를 반환합니다. 이 설정은 명령이 끝날때 까지 프로그램이 멈추게 되므로 필요한 경우에만 사용합니다.
			//OPTIONAL: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.notExists
			//OPTIONAL: callbackOrHandlers.error
			//OPTIONAL: callbackOrHandlers.success

			var
			// path
			path,

			// is sync
			isSync,

			// not eixsts handler.
			notExistsHandler,

			// error handler.
			errorHandler,

			// callback.
			callback;

			// init params.
			if (CHECK_IS_DATA(pathOrParams) !== true) {
				path = pathOrParams;
			} else {
				path = pathOrParams.path;
				isSync = pathOrParams.isSync;
			}

			if (callbackOrHandlers !== undefined) {
				if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
					callback = callbackOrHandlers;
				} else {
					notExistsHandler = callbackOrHandlers.notExists;
					errorHandler = callbackOrHandlers.error;
					callback = callbackOrHandlers.success;
				}
			}

			// when normal mode
			if (isSync !== true) {

				CHECK_IS_EXISTS_FILE(path, function(isExists) {

					if (isExists === true) {

						fs.stat(path, function(error, stat) {

							var
							// error msg
							errorMsg;

							if (error !== TO_DELETE) {

								errorMsg = error.toString();

								if (errorHandler !== undefined) {
									errorHandler(errorMsg);
								} else {
									SHOW_ERROR('READ_FILE', errorMsg);
								}

							} else if (stat.isDirectory() === true) {

								if (notExistsHandler !== undefined) {
									notExistsHandler(path);
								} else {
									console.log(CONSOLE_YELLOW('[READ_FILE] 파일이 존재하지 않습니다. 경로: ' + path));
								}

							} else {

								fs.readFile(path, function(error, buffer) {

									var
									// error msg
									errorMsg;

									if (error !== TO_DELETE) {

										errorMsg = error.toString();

										if (errorHandler !== undefined) {
											errorHandler(errorMsg);
										} else {
											SHOW_ERROR('READ_FILE', errorMsg);
										}

									} else if (callback !== undefined) {
										callback(buffer);
									}
								});
							}
						});

					} else {

						if (notExistsHandler !== undefined) {
							notExistsHandler(path);
						} else {
							console.log(CONSOLE_YELLOW('[READ_FILE] 파일이 존재하지 않습니다. 경로: ' + path));
						}
					}
				});
			}

			// when sync mode
			else {

				return RUN(function() {

					var
					// error msg
					errorMsg,

					// buffer
					buffer;

					try {

						if (CHECK_IS_EXISTS_FILE({
							path : path,
							isSync : true
						}) === true) {

							if (fs.statSync(path).isDirectory() === true) {

								if (notExistsHandler !== undefined) {
									notExistsHandler(path);
								} else {
									console.log(CONSOLE_YELLOW('[READ_FILE] 파일이 존재하지 않습니다. 경로: ' + path));
								}
								
							} else {
								
								buffer = fs.readFileSync(path);
			
								if (callback !== undefined) {
									callback(buffer);
								}
			
								return buffer;
							}

						} else {

							if (notExistsHandler !== undefined) {
								notExistsHandler(path);
							} else {
								console.log(CONSOLE_YELLOW('[READ_FILE] 파일이 존재하지 않습니다. 경로: ' + path));
							}
						}

					} catch(error) {

						if (error !== TO_DELETE) {

							errorMsg = error.toString();

							if (errorHandler !== undefined) {
								errorHandler(errorMsg);
							} else {
								SHOW_ERROR('READ_FILE', errorMsg);
							}
						}
					}

					// do not run callback.
					return;
				});
			}
		}
	};
});

/**
 * 파일을 삭제합니다.
 */
global.REMOVE_FILE = METHOD(function() {
	'use strict';

	var
	//IMPORT: fs
	fs = require('fs');

	return {

		run : function(pathOrParams, callbackOrHandlers) {
			//REQUIRED: pathOrParams
			//REQUIRED: pathOrParams.path	삭제할 파일의 경로
			//OPTIONAL: pathOrParams.isSync	true로 설정하면 callback을 실행하지 않고 즉시 실행합니다. 이 설정은 명령이 끝날때 까지 프로그램이 멈추게 되므로 필요한 경우에만 사용합니다.
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.notExists
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success

			var
			// path
			path,

			// is sync
			isSync,

			// not eixsts handler.
			notExistsHandler,

			// error handler.
			errorHandler,

			// callback.
			callback;

			// init params.
			if (CHECK_IS_DATA(pathOrParams) !== true) {
				path = pathOrParams;
			} else {
				path = pathOrParams.path;
				isSync = pathOrParams.isSync;
			}

			if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
				callback = callbackOrHandlers;
			} else {
				notExistsHandler = callbackOrHandlers.notExists;
				errorHandler = callbackOrHandlers.error;
				callback = callbackOrHandlers.success;
			}

			// when normal mode
			if (isSync !== true) {

				CHECK_IS_EXISTS_FILE(path, function(isExists) {

					if (isExists === true) {

						fs.unlink(path, function(error) {

							var
							// error msg
							errorMsg;

							if (error !== TO_DELETE) {

								errorMsg = error.toString();

								if (errorHandler !== undefined) {
									errorHandler(errorMsg);
								} else {
									SHOW_ERROR('REMOVE_FILE', errorMsg);
								}

							} else {

								if (callback !== undefined) {
									callback();
								}
							}
						});

					} else {

						if (notExistsHandler !== undefined) {
							notExistsHandler(path);
						} else {
							console.log(CONSOLE_YELLOW('[REMOVE_FILE] 파일이 존재하지 않습니다. 경로: ' + path));
						}
					}
				});
			}

			// when sync mode
			else {

				RUN(function() {

					var
					// error msg
					errorMsg;

					try {

						if (CHECK_IS_EXISTS_FILE({
							path : path,
							isSync : true
						}) === true) {

							fs.unlinkSync(path);

						} else {

							if (notExistsHandler !== undefined) {
								notExistsHandler(path);
							} else {
								console.log(CONSOLE_YELLOW('[REMOVE_FILE] 파일이 존재하지 않습니다. 경로: ' + path));
							}

							// do not run callback.
							return;
						}

					} catch(error) {

						if (error !== TO_DELETE) {

							errorMsg = error.toString();

							if (errorHandler !== undefined) {
								errorHandler(errorMsg);
							} else {
								SHOW_ERROR('REMOVE_FILE', errorMsg);
							}
						}
					}

					if (callback !== undefined) {
						callback();
					}
				});
			}
		}
	};
});

/**
 * 폴더를 삭제합니다.
 * 
 * 폴더 내의 모든 파일 및 폴더를 삭제하므로, 주의해서 사용해야 합니다.
 */
global.REMOVE_FOLDER = METHOD(function() {
	'use strict';

	var
	//IMPORT: fs
	fs = require('fs');

	return {

		run : function(pathOrParams, callbackOrHandlers) {
			//REQUIRED: pathOrParams
			//REQUIRED: pathOrParams.path	삭제할 폴더의 경로
			//OPTIONAL: pathOrParams.isSync	true로 설정하면 callback을 실행하지 않고 즉시 실행합니다. 이 설정은 명령이 끝날때 까지 프로그램이 멈추게 되므로 필요한 경우에만 사용합니다.
			//REQUIRED: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.notExists
			//OPTIONAL: callbackOrHandlers.error
			//REQUIRED: callbackOrHandlers.success

			var
			// path
			path,

			// is sync
			isSync,

			// not eixsts handler.
			notExistsHandler,

			// error handler.
			errorHandler,

			// callback.
			callback;

			// init params.
			if (CHECK_IS_DATA(pathOrParams) !== true) {
				path = pathOrParams;
			} else {
				path = pathOrParams.path;
				isSync = pathOrParams.isSync;
			}

			if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
				callback = callbackOrHandlers;
			} else {
				notExistsHandler = callbackOrHandlers.notExists;
				errorHandler = callbackOrHandlers.error;
				callback = callbackOrHandlers.success;
			}

			// when normal mode
			if (isSync !== true) {

				CHECK_IS_EXISTS_FILE(path, function(isExists) {

					if (isExists === true) {
						
						NEXT([
						function(next) {
							
							FIND_FILE_NAMES(path, function(fileNames) {
								
								PARALLEL(fileNames, [
								function(fileName, done) {
									REMOVE_FILE(path + '/' + fileName, done);
								},
								
								function() {
									next();
								}]);
							});
						},
						
						function(next) {
							return function() {
								
								FIND_FOLDER_NAMES(path, function(folderNames) {
									
									PARALLEL(folderNames, [
									function(folderName, done) {
										REMOVE_FOLDER(path + '/' + folderName, done);
									},
									
									function() {
										next();
									}]);
								});
							};
						},
						
						function(next) {
							return function() {
								
								fs.rmdir(path, function(error) {
									
									var
									// error msg
									errorMsg;
									
									if (error !== TO_DELETE) {
										
										errorMsg = error.toString();
										
										if (errorHandler !== undefined) {
											errorHandler(errorMsg);
										} else {
											SHOW_ERROR('REMOVE_FOLDER', errorMsg);
										}
		
									} else {
		
										if (callback !== undefined) {
											callback();
										}
									}
								});
							};
						}]);

					} else {

						if (notExistsHandler !== undefined) {
							notExistsHandler(path);
						} else {
							console.log(CONSOLE_YELLOW('[REMOVE_FOLDER] 폴더가 존재하지 않습니다. 경로: ' + path));
						}
					}
				});
			}

			// when sync mode
			else {

				RUN(function() {

					var
					// error msg
					errorMsg;

					try {

						if (CHECK_IS_EXISTS_FILE({
							path : path,
							isSync : true
						}) === true) {
							
							FIND_FILE_NAMES({
								path : path,
								isSync : true
							}, EACH(function(fileName) {
								
								REMOVE_FILE({
									path : path + '/' + fileName,
									isSync : true
								});
							}));
							
							FIND_FOLDER_NAMES({
								path : path,
								isSync : true
							}, EACH(function(folderName) {
								
								REMOVE_FOLDER({
									path : path + '/' + folderName,
									isSync : true
								});
							}));
							
							fs.rmdirSync(path);

						} else {

							if (notExistsHandler !== undefined) {
								notExistsHandler(path);
							} else {
								console.log(CONSOLE_YELLOW('[REMOVE_FOLDER] 폴더가 존재하지 않습니다. 경로: ' + path));
							}

							// do not run callback.
							return;
						}

					} catch(error) {
						
						if (error !== TO_DELETE) {
							
							errorMsg = error.toString();
	
							if (errorHandler !== undefined) {
								errorHandler(errorMsg);
							} else {
								SHOW_ERROR('REMOVE_FOLDER', errorMsg);
							}
						}
					}

					if (callback !== undefined) {
						callback();
					}
				});
			}
		}
	};
});

/**
 * 파일을 작성합니다.
 * 
 * 파일이 없으면 파일을 생성하고, 파일이 이미 있으면 내용을 덮어씁니다.
 */
global.WRITE_FILE = METHOD(function() {
	'use strict';

	var
	//IMPORT: fs
	fs = require('fs'),

	//IMPORT: path
	_path = require('path');

	return {

		run : function(params, callbackOrHandlers) {
			//REQUIRED: params
			//REQUIRED: params.path		작성할 파일의 경로
			//OPTIONAL: params.content	파일에 작성할 내용 (문자열)
			//OPTIONAL: params.buffer	파일에 작성할 내용 (Buffer)
			//OPTIONAL: params.isSync	true로 설정하면 callback을 실행하지 않고 즉시 실행합니다. 이 설정은 명령이 끝날때 까지 프로그램이 멈추게 되므로 필요한 경우에만 사용합니다.
			//OPTIONAL: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.error
			//OPTIONAL: callbackOrHandlers.success

			var
			// path
			path = params.path,

			// content
			content = params.content,

			// buffer
			buffer = params.buffer,

			// is sync
			isSync = params.isSync,

			// error handler.
			errorHandler,

			// callback.
			callback;

			if (callbackOrHandlers !== undefined) {
				if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
					callback = callbackOrHandlers;
				} else {
					errorHandler = callbackOrHandlers.error;
					callback = callbackOrHandlers.success;
				}
			}

			CREATE_FOLDER({
				path : _path.dirname(path),
				isSync : isSync
			}, function() {

				// when normal mode
				if (isSync !== true) {

					fs.writeFile(path, buffer !== undefined ? buffer : content, function(error) {
						
						var
						// error msg
						errorMsg;
						
						if (error !== TO_DELETE) {
							
							errorMsg = error.toString();

							if (errorHandler !== undefined) {
								errorHandler(errorMsg);
							} else {
								SHOW_ERROR('WRITE_FILE', errorMsg);
							}

						} else if (callback !== undefined) {
							callback();
						}
					});
				}

				// when sync mode
				else {

					RUN(function() {

						var
						// error msg
						errorMsg;

						try {

							fs.writeFileSync(path, buffer !== undefined ? buffer : content);

						} catch(error) {
							
							if (error !== TO_DELETE) {
								
								errorMsg = error.toString();
									
								if (errorHandler !== undefined) {
									errorHandler(errorMsg);
								} else {
									SHOW_ERROR('WRITE_FILE', errorMsg);
								}
							}
						}

						if (callback !== undefined) {
							callback();
						}
					});
				}
			});
		}
	};
});

/**
 * CSS 코드를 압축합니다.
 */
global.MINIFY_CSS = METHOD(function() {
	'use strict';

	var
	// sqwish
	sqwish = require('sqwish');

	return {

		run : function(code) {
			//REQUIRED: code

			return sqwish.minify(code.toString());
		}
	};
});

/**
 * JavaScript 코드를 압축합니다.
 */
global.MINIFY_JS = METHOD(function() {
	'use strict';

	var
	// uglify-js
	uglifyJS = require('uglify-js');

	return {

		run : function(code) {
			//REQUIRED: code

			return uglifyJS.minify(code.toString(), {
				fromString : true,
				mangle : true,
				output : {
					comments : /@license|@preserve|^!/
				}
			}).code;
		}
	};
});

/**
 * HTTP DELETE 요청을 보냅니다.
 */
global.DELETE = METHOD({

	run : function(params, responseListenerOrListeners) {
		'use strict';
		//REQUIRED: urlOrParams
		//OPTIONAL: urlOrParams.isSecure	HTTPS 프로토콜인지 여부
		//OPTIONAL: urlOrParams.host
		//OPTIONAL: urlOrParams.port
		//OPTIONAL: urlOrParams.uri
		//OPTIONAL: urlOrParams.url			요청을 보낼 URL입니다. url을 입력하면 isSecure, host, port, uri를 입력할 필요가 없습니다.
		//OPTIONAL: urlOrParams.paramStr	a=1&b=2&c=3과 같은 형태의 파라미터 문자열
		//OPTIONAL: urlOrParams.params		데이터 형태({...})로 표현한 파라미터 목록
		//OPTIONAL: urlOrParams.data		요청을 UPPERCASE기반 서버로 보내는 경우 데이터를 직접 전송할 수 있습니다.
		//OPTIONAL: urlOrParams.headers		요청 헤더
		//OPTIONAL: responseListenerOrListeners
		//OPTIONAL: responseListenerOrListeners.error
		//OPTIONAL: responseListenerOrListeners.success
		
		if (CHECK_IS_DATA(urlOrParams) !== true) {
			urlOrParams = {
				url : urlOrParams
			}
		}
		
		REQUEST(COMBINE([{
			method : 'DELETE'
		}, urlOrParams]), responseListenerOrListeners);
	}
});

/**
 * HTTP 리소스를 다운로드합니다.
 */
global.DOWNLOAD = METHOD(function() {
	'use strict';

	var
	//IMPORT: HTTP
	HTTP = require('http'),

	//IMPORT: HTTPS
	HTTPS = require('https'),
	
	//IMPORT: URL
	URL = require('url'),
	
	//IMPORT: Querystring
	Querystring = require('querystring');

	return {

		run : function(params, callbackOrHandlers) {
			//REQUIRED: params
			//REQUIRED: params.method
			//OPTIONAL: params.isSecure	HTTPS 프로토콜인지 여부
			//OPTIONAL: params.host
			//OPTIONAL: params.port
			//OPTIONAL: params.uri
			//OPTIONAL: params.url		요청을 보낼 URL입니다. url을 입력하면 isSecure, host, port, uri를 입력할 필요가 없습니다.
			//OPTIONAL: params.paramStr	a=1&b=2&c=3과 같은 형태의 파라미터 문자열
			//OPTIONAL: params.params	데이터 형태({...})로 표현한 파라미터 목록
			//OPTIONAL: params.data		요청을 UPPERCASE기반 서버로 보내는 경우 데이터를 직접 전송할 수 있습니다.
			//OPTIONAL: params.headers	요청 헤더
			//REQUIRED: params.path		리소스를 다운로드하여 저장할 경로
			//OPTIONAL: callbackOrHandlers
			//OPTIONAL: callbackOrHandlers.success
			//OPTIONAL: callbackOrHandlers.error

			var
			// method
			method = params.method,
			
			// is secure
			isSecure = params.isSecure,
			
			// host
			host = params.host,

			// port
			port = params.port,

			// uri
			uri = params.uri,
			
			// url
			url = params.url,

			// param str
			paramStr = params.paramStr,

			// params
			params = params.params,

			// data
			data = params.data,
			
			// headers
			headers = params.headers,
			
			// path
			path = params.path,

			// error handler.
			errorHandler,

			// callback.
			callback,
			
			// url data
			urlData,

			// http request
			req;
			
			if (url !== undefined) {
				urlData = URL.parse(url);
				
				host = urlData.hostname === TO_DELETE ? undefined : urlData.hostname,
				port = urlData.port === TO_DELETE ? undefined : INTEGER(urlData.port),
				isSecure = urlData.protocol === 'https:',
				uri = urlData.pathname === TO_DELETE ? undefined : urlData.pathname.substring(1),
				paramStr = urlData.query === TO_DELETE ? undefined : urlData.query
			}
			
			if (port === undefined) {
				port = isSecure !== true ? 80 : 443;
			}

			if (uri !== undefined && uri.indexOf('?') !== -1) {
				paramStr = uri.substring(uri.indexOf('?') + 1) + (paramStr === undefined ? '' : '&' + paramStr);
				uri = uri.substring(0, uri.indexOf('?'));
			}
			
			if (params !== undefined) {
				paramStr = (paramStr === undefined ? '' : paramStr + '&') + Querystring.stringify(params);
			}

			if (data !== undefined) {
				paramStr = (paramStr === undefined ? '' : paramStr + '&') + '__DATA=' + encodeURIComponent(STRINGIFY(data));
			}
			
			paramStr = (paramStr === undefined ? '' : paramStr + '&') + Date.now();

			if (callbackOrHandlers !== undefined) {
				if (CHECK_IS_DATA(callbackOrHandlers) !== true) {
					callback = callbackOrHandlers;
				} else {
					errorHandler = callbackOrHandlers.error;
					callback = callbackOrHandlers.success;
				}
			}

			req = (isSecure !== true ? HTTP : HTTPS).get({
				hostname : host,
				port : port,
				path : '/' + (uri === undefined ? '' : uri) + '?' + paramStr,
				headers : headers
			}, function(httpResponse) {
				
				var
				// data
				data;
				
				// redirect.
				if (httpResponse.statusCode === 301 || httpResponse.statusCode === 302) {
					
					DOWNLOAD({
						url : httpResponse.headers.location,
						path : path
					}, {
						error : errorHandler,
						success : callback
					});
					
					httpResponse.destroy();
					
				} else {
				
					data = [];
	
					httpResponse.on('data', function(chunk) {
						data.push(chunk);
					});
					httpResponse.on('end', function() {
						
						WRITE_FILE({
							path : path,
							buffer : Buffer.concat(data)
						}, {
							error : errorHandler,
							success : callback
						});
					});
				}
			});

			req.on('error', function(error) {

				var
				// error msg
				errorMsg = error.toString();

				if (errorHandler !== undefined) {
					errorHandler(errorMsg);
				} else {
					SHOW_ERROR('DOWNLOAD', errorMsg, params);
				}
			});
		}
	};
});

/**
 * HTTP GET 요청을 보냅니다.
 */
global.GET = METHOD({
	
	run : function(urlOrParams, responseListenerOrListeners) {
		'use strict';
		//REQUIRED: urlOrParams
		//OPTIONAL: urlOrParams.isSecure	HTTPS 프로토콜인지 여부
		//OPTIONAL: urlOrParams.host
		//OPTIONAL: urlOrParams.port
		//OPTIONAL: urlOrParams.uri
		//OPTIONAL: urlOrParams.url			요청을 보낼 URL입니다. url을 입력하면 isSecure, host, port, uri를 입력할 필요가 없습니다.
		//OPTIONAL: urlOrParams.paramStr	a=1&b=2&c=3과 같은 형태의 파라미터 문자열
		//OPTIONAL: urlOrParams.params		데이터 형태({...})로 표현한 파라미터 목록
		//OPTIONAL: urlOrParams.data		요청을 UPPERCASE기반 서버로 보내는 경우 데이터를 직접 전송할 수 있습니다.
		//OPTIONAL: urlOrParams.headers		요청 헤더
		//OPTIONAL: responseListenerOrListeners
		//OPTIONAL: responseListenerOrListeners.error
		//OPTIONAL: responseListenerOrListeners.success
		
		if (CHECK_IS_DATA(urlOrParams) !== true) {
			urlOrParams = {
				url : urlOrParams
			}
		}
		
		REQUEST(COMBINE([{
			method : 'GET'
		}, urlOrParams]), responseListenerOrListeners);
	}
});

/**
 * HTTP POST 요청을 보냅니다.
 */
global.POST = METHOD({

	run : function(params, responseListenerOrListeners) {
		'use strict';
		//REQUIRED: urlOrParams
		//OPTIONAL: urlOrParams.isSecure	HTTPS 프로토콜인지 여부
		//OPTIONAL: urlOrParams.host
		//OPTIONAL: urlOrParams.port
		//OPTIONAL: urlOrParams.uri
		//OPTIONAL: urlOrParams.url			요청을 보낼 URL입니다. url을 입력하면 isSecure, host, port, uri를 입력할 필요가 없습니다.
		//OPTIONAL: urlOrParams.paramStr	a=1&b=2&c=3과 같은 형태의 파라미터 문자열
		//OPTIONAL: urlOrParams.params		데이터 형태({...})로 표현한 파라미터 목록
		//OPTIONAL: urlOrParams.data		요청을 UPPERCASE기반 서버로 보내는 경우 데이터를 직접 전송할 수 있습니다.
		//OPTIONAL: urlOrParams.headers		요청 헤더
		//OPTIONAL: responseListenerOrListeners
		//OPTIONAL: responseListenerOrListeners.error
		//OPTIONAL: responseListenerOrListeners.success
		
		if (CHECK_IS_DATA(urlOrParams) !== true) {
			urlOrParams = {
				url : urlOrParams
			}
		}
		
		REQUEST(COMBINE([{
			method : 'POST'
		}, urlOrParams]), responseListenerOrListeners);
	}
});

/**
 * HTTP PUT 요청을 보냅니다.
 */
global.PUT = METHOD({

	run : function(params, responseListenerOrListeners) {
		'use strict';
		//REQUIRED: urlOrParams
		//OPTIONAL: urlOrParams.isSecure	HTTPS 프로토콜인지 여부
		//OPTIONAL: urlOrParams.host
		//OPTIONAL: urlOrParams.port
		//OPTIONAL: urlOrParams.uri
		//OPTIONAL: urlOrParams.url			요청을 보낼 URL입니다. url을 입력하면 isSecure, host, port, uri를 입력할 필요가 없습니다.
		//OPTIONAL: urlOrParams.paramStr	a=1&b=2&c=3과 같은 형태의 파라미터 문자열
		//OPTIONAL: urlOrParams.params		데이터 형태({...})로 표현한 파라미터 목록
		//OPTIONAL: urlOrParams.data		요청을 UPPERCASE기반 서버로 보내는 경우 데이터를 직접 전송할 수 있습니다.
		//OPTIONAL: urlOrParams.headers		요청 헤더
		//OPTIONAL: responseListenerOrListeners
		//OPTIONAL: responseListenerOrListeners.error
		//OPTIONAL: responseListenerOrListeners.success
		
		if (CHECK_IS_DATA(urlOrParams) !== true) {
			urlOrParams = {
				url : urlOrParams
			}
		}
		
		REQUEST(COMBINE([{
			method : 'PUT'
		}, urlOrParams]), responseListenerOrListeners);
	}
});

/**
 * HTTP 요청을 보냅니다.
 */
global.REQUEST = METHOD(function(m) {
	'use strict';

	var
	//IMPORT: HTTP
	HTTP = require('http'),

	//IMPORT: HTTPS
	HTTPS = require('https'),
	
	//IMPORT: URL
	URL = require('url'),
	
	//IMPORT: Querystring
	Querystring = require('querystring');

	return {

		run : function(params, responseListenerOrListeners) {
			//REQUIRED: params
			//REQUIRED: params.method	요청 메소드 입니다. GET, POST, PUT, DELETE를 설정할 수 있습니다.
			//OPTIONAL: params.isSecure	HTTPS 프로토콜인지 여부
			//OPTIONAL: params.host
			//OPTIONAL: params.port
			//OPTIONAL: params.uri
			//OPTIONAL: params.url		요청을 보낼 URL입니다. url을 입력하면 isSecure, host, port, uri를 입력할 필요가 없습니다.
			//OPTIONAL: params.paramStr	a=1&b=2&c=3과 같은 형태의 파라미터 문자열
			//OPTIONAL: params.params	데이터 형태({...})로 표현한 파라미터 목록
			//OPTIONAL: params.data		요청을 UPPERCASE기반 서버로 보내는 경우 데이터를 직접 전송할 수 있습니다.
			//OPTIONAL: params.headers	요청 헤더
			//OPTIONAL: responseListenerOrListeners
			//OPTIONAL: responseListenerOrListeners.error
			//OPTIONAL: responseListenerOrListeners.success

			var
			// method
			method = params.method,
			
			// is secure
			isSecure = params.isSecure,
			
			// host
			host = params.host,

			// port
			port = params.port,

			// uri
			uri = params.uri,
			
			// url
			url = params.url,

			// param str
			paramStr = params.paramStr,

			// params
			params = params.params,

			// data
			data = params.data,
			
			// headers
			headers = params.headers,

			// error listener.
			errorListener,

			// response listener.
			responseListener,
			
			// url data
			urlData,

			// http request
			req;

			method = method.toUpperCase();
			
			if (url !== undefined) {
				urlData = URL.parse(url);
				
				host = urlData.hostname === TO_DELETE ? undefined : urlData.hostname,
				port = urlData.port === TO_DELETE ? undefined : INTEGER(urlData.port),
				isSecure = urlData.protocol === 'https:',
				uri = urlData.pathname === TO_DELETE ? undefined : urlData.pathname.substring(1),
				paramStr = urlData.query === TO_DELETE ? undefined : urlData.query
			}
			
			if (port === undefined) {
				port = isSecure !== true ? 80 : 443;
			}

			if (uri !== undefined && uri.indexOf('?') !== -1) {
				paramStr = uri.substring(uri.indexOf('?') + 1) + (paramStr === undefined ? '' : '&' + paramStr);
				uri = uri.substring(0, uri.indexOf('?'));
			}
			
			if (params !== undefined) {
				paramStr = (paramStr === undefined ? '' : paramStr + '&') + Querystring.stringify(params);
			}

			if (data !== undefined) {
				paramStr = (paramStr === undefined ? '' : paramStr + '&') + '__DATA=' + encodeURIComponent(STRINGIFY(data));
			}
			
			if (paramStr === undefined) {
				paramStr = '';
			}
			
			if (responseListenerOrListeners !== undefined) {
				if (CHECK_IS_DATA(responseListenerOrListeners) !== true) {
					responseListener = responseListenerOrListeners;
				} else {
					errorListener = responseListenerOrListeners.error;
					responseListener = responseListenerOrListeners.success;
				}
			}

			// GET request.
			if (method === 'GET') {

				req = (isSecure !== true ? HTTP : HTTPS).get({
					hostname : host,
					port : port,
					path : '/' + (uri === undefined ? '' : uri) + '?' + paramStr,
					headers : headers
				}, function(httpResponse) {

					var
					// content
					content;
					
					// redirect.
					if (httpResponse.statusCode === 301 || httpResponse.statusCode === 302) {
						
						GET(httpResponse.headers.location, {
							error : errorListener,
							success : responseListener
						});
						
						httpResponse.destroy();
						
					} else {
						
						content = '';

						httpResponse.setEncoding('utf-8');
						httpResponse.on('data', function(str) {
							content += str;
						});
						httpResponse.on('end', function() {
							if (responseListener !== undefined) {
								responseListener(content, httpResponse.headers);
							}
						});
					}
				});
			}

			// other request.
			else {

				req = (isSecure !== true ? HTTP : HTTPS).request({
					hostname : host,
					port : port,
					path : '/' + (uri === undefined ? '' : uri),
					method : method,
					headers : headers
				}, function(httpResponse) {

					var
					// content
					content = '';

					httpResponse.setEncoding('utf-8');
					httpResponse.on('data', function(str) {
						content += str;
					});
					httpResponse.on('end', function() {
						if (responseListener !== undefined) {
							responseListener(content, httpResponse.headers);
						}
					});
				});

				req.write(paramStr);
				req.end();
			}

			req.on('error', function(error) {

				var
				// error msg
				errorMsg = error.toString();

				if (errorListener !== undefined) {
					errorListener(errorMsg);
				} else {
					SHOW_ERROR('REQUEST', errorMsg, params);
				}
			});
		}
	};
});