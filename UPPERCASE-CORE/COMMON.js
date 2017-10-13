'use strict';

/*

Welcome to UPPERCASE-CORE! (http://uppercase.io)

*/

/*
 * 기본 설정
 */
global.CONFIG = {
	
	// 개발 모드 설정
	isDevMode : false
};

/*
 * 메소드를 생성합니다.
 */
global.METHOD = (define) => {
	//REQUIRED: define		메소드 정의 구문
	//REQUIRED: define.run	메소드 실행 구문

	let funcs;
	let run;

	let m = (params, funcs) => {
		//OPTIONAL: params
		//OPTIONAL: funcs

		if (run !== undefined) {
			return run(params, funcs);
		}
	};
	
	m.type = METHOD;
	
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

/*
 * DB의 update 기능을 사용할 때, 데이터의 특정 값에 TO_DELETE를 지정하게 되면 해당 값이 삭제됩니다.
 * 자세한 것은 DB의 update 예제를 살펴보시기 바랍니다.
 *
 * 참고로 UPPERCASE 기반 프로젝트에서 이 TO_DELETE만이 null이 될 수 있는 유일한 변수입니다.
 * 다른 변수에서는 null을 사용하지 않고 undefined를 사용해 주시기 바랍니다.
 */
global.TO_DELETE = null;

/*
 * BOX를 생성합니다.
 */
global.BOX = METHOD((m) => {

	let boxes = {};
	
	let getAllBoxes = m.getAllBoxes = () => {
		return boxes;
	};

	return {

		run : (boxName) => {
			//REQUIRED: boxName

			let box = (packName) => {
				//REQUIRED: packName

				let packNameSps = packName.split('.');
				
				let pack;

				EACH(packNameSps, (packNameSp) => {

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

			global[boxName] = boxes[boxName] = box;
			
			if (CONFIG[boxName] === undefined) {
				CONFIG[boxName] = {};
			}

			FOR_BOX.inject(box);

			return box;
		}
	};
});

/*
 * 모든 박스를 대상으로 하는 메소드와 클래스, 싱글톤 객체를 선언할 때 사용합니다.
 */
global.FOR_BOX = METHOD((m) => {

	let funcs = [];
	
	let inject = m.inject = (box) => {
		EACH(funcs, (func) => {
			func(box);
		});
	};

	return {

		run : (func) => {
			//REQUIRED: func

			EACH(BOX.getAllBoxes(), (box) => {
				func(box);
			});

			funcs.push(func);
		}
	};
});

/*
 * 콘솔에 오류 메시지를 출력합니다.
 */
global.SHOW_ERROR = (tag, errorMsg, params) => {
	//REQUIRED: tag
	//REQUIRED: errorMsg
	//OPTIONAL: params
	
	let cal = CALENDAR();
		
	console.error(cal.getYear() + '-' + cal.getMonth(true) + '-' + cal.getDate(true) + ' ' + cal.getHour(true) + ':' + cal.getMinute(true) + ':' + cal.getSecond(true) + ' [' + tag + '] 오류가 발생했습니다. 오류 메시지: ' + errorMsg);
	
	if (params !== undefined) {
		console.error('다음은 오류를 발생시킨 파라미터입니다.');
		console.error(JSON.stringify(params, TO_DELETE, 4));
	}
};
/*
 * 콘솔에 경고 메시지를 출력합니다.
 */
global.SHOW_WARNING = (tag, warningMsg, params) => {
	//REQUIRED: tag
	//REQUIRED: warningMsg
	//OPTIONAL: params
	
	let cal = CALENDAR();
	
	console.warn(cal.getYear() + '-' + cal.getMonth(true) + '-' + cal.getDate(true) + ' ' + cal.getHour(true) + ':' + cal.getMinute(true) + ':' + cal.getSecond(true) + ' [' + tag + '] 경고가 발생했습니다. 경고 메시지: ' + warningMsg);
	
	if (params !== undefined) {
		console.warn('다음은 경고를 발생시킨 파라미터입니다.');
		console.warn(JSON.stringify(params, TO_DELETE, 4));
	}
};
/**
 * [js-sha256]{@link https://github.com/emn178/js-sha256}
 *
 * @version 0.6.0
 * @author Chen, Yi-Cyuan [emn178@gmail.com]
 * @copyright Chen, Yi-Cyuan 2014-2017
 * @license MIT
 */
/*jslint bitwise: true */
(function () {
  'use strict';

  var ERROR = 'input is invalid type';
  var root = typeof window === 'object' ? window : {};
  var NODE_JS = !root.JS_SHA256_NO_NODE_JS && typeof process === 'object' && process.versions && process.versions.node;
  if (NODE_JS) {
    root = global;
  }
  var COMMON_JS = !root.JS_SHA256_NO_COMMON_JS && typeof module === 'object' && module.exports;
  var AMD = typeof define === 'function' && define.amd;
  var ARRAY_BUFFER = typeof ArrayBuffer !== 'undefined';
  var HEX_CHARS = '0123456789abcdef'.split('');
  var EXTRA = [-2147483648, 8388608, 32768, 128];
  var SHIFT = [24, 16, 8, 0];
  var K = [
    0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
    0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
    0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
    0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
    0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
    0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
    0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
    0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
  ];
  var OUTPUT_TYPES = ['hex', 'array', 'digest', 'arrayBuffer'];

  var blocks = [];

  if (root.JS_SHA256_NO_NODE_JS || !Array.isArray) {
    Array.isArray = function (obj) {
      return Object.prototype.toString.call(obj) === '[object Array]';
    };
  }

  var createOutputMethod = function (outputType, is224) {
    return function (message) {
      return new Sha256(is224, true).update(message)[outputType]();
    };
  };

  var createMethod = function (is224) {
    var method = createOutputMethod('hex', is224);
    if (NODE_JS) {
      method = nodeWrap(method, is224);
    }
    method.create = function () {
      return new Sha256(is224);
    };
    method.update = function (message) {
      return method.create().update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createOutputMethod(type, is224);
    }
    return method;
  };

  var nodeWrap = function (method, is224) {
    var crypto = require('crypto');
    var Buffer = require('buffer').Buffer;
    var algorithm = is224 ? 'sha224' : 'sha256';
    var nodeMethod = function (message) {
      if (typeof message === 'string') {
        return crypto.createHash(algorithm).update(message, 'utf8').digest('hex');
      } else {
        if (message === null || message === undefined) {
          throw ERROR;
        } else if (message.constructor === ArrayBuffer) {
          message = new Uint8Array(message);
        }
      }
      if (Array.isArray(message) || ArrayBuffer.isView(message) ||
        message.constructor === Buffer) {
        return crypto.createHash(algorithm).update(new Buffer(message)).digest('hex');
      } else {
        return method(message);
      }
    };
    return nodeMethod;
  };

  var createHmacOutputMethod = function (outputType, is224) {
    return function (key, message) {
      return new HmacSha256(key, is224, true).update(message)[outputType]();
    };
  };

  var createHmacMethod = function (is224) {
    var method = createHmacOutputMethod('hex', is224);
    method.create = function (key) {
      return new HmacSha256(key, is224);
    };
    method.update = function (key, message) {
      return method.create(key).update(message);
    };
    for (var i = 0; i < OUTPUT_TYPES.length; ++i) {
      var type = OUTPUT_TYPES[i];
      method[type] = createHmacOutputMethod(type, is224);
    }
    return method;
  };

  function Sha256(is224, sharedMemory) {
    if (sharedMemory) {
      blocks[0] = blocks[16] = blocks[1] = blocks[2] = blocks[3] =
      blocks[4] = blocks[5] = blocks[6] = blocks[7] =
      blocks[8] = blocks[9] = blocks[10] = blocks[11] =
      blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      this.blocks = blocks;
    } else {
      this.blocks = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    }

    if (is224) {
      this.h0 = 0xc1059ed8;
      this.h1 = 0x367cd507;
      this.h2 = 0x3070dd17;
      this.h3 = 0xf70e5939;
      this.h4 = 0xffc00b31;
      this.h5 = 0x68581511;
      this.h6 = 0x64f98fa7;
      this.h7 = 0xbefa4fa4;
    } else { // 256
      this.h0 = 0x6a09e667;
      this.h1 = 0xbb67ae85;
      this.h2 = 0x3c6ef372;
      this.h3 = 0xa54ff53a;
      this.h4 = 0x510e527f;
      this.h5 = 0x9b05688c;
      this.h6 = 0x1f83d9ab;
      this.h7 = 0x5be0cd19;
    }

    this.block = this.start = this.bytes = 0;
    this.finalized = this.hashed = false;
    this.first = true;
    this.is224 = is224;
  }

  Sha256.prototype.update = function (message) {
    if (this.finalized) {
      return;
    }
    var notString = typeof message !== 'string';
    if (notString) {
      if (message === null || message === undefined) {
        throw ERROR;
      } else if (message.constructor === root.ArrayBuffer) {
        message = new Uint8Array(message);
      }
    }
    var length = message.length;
    if (notString) {
      if (typeof length !== 'number' ||
        !Array.isArray(message) && 
        !(ARRAY_BUFFER && ArrayBuffer.isView(message))) {
        throw ERROR;
      }
    }
    var code, index = 0, i, blocks = this.blocks;

    while (index < length) {
      if (this.hashed) {
        this.hashed = false;
        blocks[0] = this.block;
        blocks[16] = blocks[1] = blocks[2] = blocks[3] =
        blocks[4] = blocks[5] = blocks[6] = blocks[7] =
        blocks[8] = blocks[9] = blocks[10] = blocks[11] =
        blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
      }

      if (notString) {
        for (i = this.start; index < length && i < 64; ++index) {
          blocks[i >> 2] |= message[index] << SHIFT[i++ & 3];
        }
      } else {
        for (i = this.start; index < length && i < 64; ++index) {
          code = message.charCodeAt(index);
          if (code < 0x80) {
            blocks[i >> 2] |= code << SHIFT[i++ & 3];
          } else if (code < 0x800) {
            blocks[i >> 2] |= (0xc0 | (code >> 6)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else if (code < 0xd800 || code >= 0xe000) {
            blocks[i >> 2] |= (0xe0 | (code >> 12)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          } else {
            code = 0x10000 + (((code & 0x3ff) << 10) | (message.charCodeAt(++index) & 0x3ff));
            blocks[i >> 2] |= (0xf0 | (code >> 18)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 12) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | ((code >> 6) & 0x3f)) << SHIFT[i++ & 3];
            blocks[i >> 2] |= (0x80 | (code & 0x3f)) << SHIFT[i++ & 3];
          }
        }
      }

      this.lastByteIndex = i;
      this.bytes += i - this.start;
      if (i >= 64) {
        this.block = blocks[16];
        this.start = i - 64;
        this.hash();
        this.hashed = true;
      } else {
        this.start = i;
      }
    }
    return this;
  };

  Sha256.prototype.finalize = function () {
    if (this.finalized) {
      return;
    }
    this.finalized = true;
    var blocks = this.blocks, i = this.lastByteIndex;
    blocks[16] = this.block;
    blocks[i >> 2] |= EXTRA[i & 3];
    this.block = blocks[16];
    if (i >= 56) {
      if (!this.hashed) {
        this.hash();
      }
      blocks[0] = this.block;
      blocks[16] = blocks[1] = blocks[2] = blocks[3] =
      blocks[4] = blocks[5] = blocks[6] = blocks[7] =
      blocks[8] = blocks[9] = blocks[10] = blocks[11] =
      blocks[12] = blocks[13] = blocks[14] = blocks[15] = 0;
    }
    blocks[15] = this.bytes << 3;
    this.hash();
  };

  Sha256.prototype.hash = function () {
    var a = this.h0, b = this.h1, c = this.h2, d = this.h3, e = this.h4, f = this.h5, g = this.h6,
      h = this.h7, blocks = this.blocks, j, s0, s1, maj, t1, t2, ch, ab, da, cd, bc;

    for (j = 16; j < 64; ++j) {
      // rightrotate
      t1 = blocks[j - 15];
      s0 = ((t1 >>> 7) | (t1 << 25)) ^ ((t1 >>> 18) | (t1 << 14)) ^ (t1 >>> 3);
      t1 = blocks[j - 2];
      s1 = ((t1 >>> 17) | (t1 << 15)) ^ ((t1 >>> 19) | (t1 << 13)) ^ (t1 >>> 10);
      blocks[j] = blocks[j - 16] + s0 + blocks[j - 7] + s1 << 0;
    }

    bc = b & c;
    for (j = 0; j < 64; j += 4) {
      if (this.first) {
        if (this.is224) {
          ab = 300032;
          t1 = blocks[0] - 1413257819;
          h = t1 - 150054599 << 0;
          d = t1 + 24177077 << 0;
        } else {
          ab = 704751109;
          t1 = blocks[0] - 210244248;
          h = t1 - 1521486534 << 0;
          d = t1 + 143694565 << 0;
        }
        this.first = false;
      } else {
        s0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
        s1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
        ab = a & b;
        maj = ab ^ (a & c) ^ bc;
        ch = (e & f) ^ (~e & g);
        t1 = h + s1 + ch + K[j] + blocks[j];
        t2 = s0 + maj;
        h = d + t1 << 0;
        d = t1 + t2 << 0;
      }
      s0 = ((d >>> 2) | (d << 30)) ^ ((d >>> 13) | (d << 19)) ^ ((d >>> 22) | (d << 10));
      s1 = ((h >>> 6) | (h << 26)) ^ ((h >>> 11) | (h << 21)) ^ ((h >>> 25) | (h << 7));
      da = d & a;
      maj = da ^ (d & b) ^ ab;
      ch = (h & e) ^ (~h & f);
      t1 = g + s1 + ch + K[j + 1] + blocks[j + 1];
      t2 = s0 + maj;
      g = c + t1 << 0;
      c = t1 + t2 << 0;
      s0 = ((c >>> 2) | (c << 30)) ^ ((c >>> 13) | (c << 19)) ^ ((c >>> 22) | (c << 10));
      s1 = ((g >>> 6) | (g << 26)) ^ ((g >>> 11) | (g << 21)) ^ ((g >>> 25) | (g << 7));
      cd = c & d;
      maj = cd ^ (c & a) ^ da;
      ch = (g & h) ^ (~g & e);
      t1 = f + s1 + ch + K[j + 2] + blocks[j + 2];
      t2 = s0 + maj;
      f = b + t1 << 0;
      b = t1 + t2 << 0;
      s0 = ((b >>> 2) | (b << 30)) ^ ((b >>> 13) | (b << 19)) ^ ((b >>> 22) | (b << 10));
      s1 = ((f >>> 6) | (f << 26)) ^ ((f >>> 11) | (f << 21)) ^ ((f >>> 25) | (f << 7));
      bc = b & c;
      maj = bc ^ (b & d) ^ cd;
      ch = (f & g) ^ (~f & h);
      t1 = e + s1 + ch + K[j + 3] + blocks[j + 3];
      t2 = s0 + maj;
      e = a + t1 << 0;
      a = t1 + t2 << 0;
    }

    this.h0 = this.h0 + a << 0;
    this.h1 = this.h1 + b << 0;
    this.h2 = this.h2 + c << 0;
    this.h3 = this.h3 + d << 0;
    this.h4 = this.h4 + e << 0;
    this.h5 = this.h5 + f << 0;
    this.h6 = this.h6 + g << 0;
    this.h7 = this.h7 + h << 0;
  };

  Sha256.prototype.hex = function () {
    this.finalize();

    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5,
      h6 = this.h6, h7 = this.h7;

    var hex = HEX_CHARS[(h0 >> 28) & 0x0F] + HEX_CHARS[(h0 >> 24) & 0x0F] +
      HEX_CHARS[(h0 >> 20) & 0x0F] + HEX_CHARS[(h0 >> 16) & 0x0F] +
      HEX_CHARS[(h0 >> 12) & 0x0F] + HEX_CHARS[(h0 >> 8) & 0x0F] +
      HEX_CHARS[(h0 >> 4) & 0x0F] + HEX_CHARS[h0 & 0x0F] +
      HEX_CHARS[(h1 >> 28) & 0x0F] + HEX_CHARS[(h1 >> 24) & 0x0F] +
      HEX_CHARS[(h1 >> 20) & 0x0F] + HEX_CHARS[(h1 >> 16) & 0x0F] +
      HEX_CHARS[(h1 >> 12) & 0x0F] + HEX_CHARS[(h1 >> 8) & 0x0F] +
      HEX_CHARS[(h1 >> 4) & 0x0F] + HEX_CHARS[h1 & 0x0F] +
      HEX_CHARS[(h2 >> 28) & 0x0F] + HEX_CHARS[(h2 >> 24) & 0x0F] +
      HEX_CHARS[(h2 >> 20) & 0x0F] + HEX_CHARS[(h2 >> 16) & 0x0F] +
      HEX_CHARS[(h2 >> 12) & 0x0F] + HEX_CHARS[(h2 >> 8) & 0x0F] +
      HEX_CHARS[(h2 >> 4) & 0x0F] + HEX_CHARS[h2 & 0x0F] +
      HEX_CHARS[(h3 >> 28) & 0x0F] + HEX_CHARS[(h3 >> 24) & 0x0F] +
      HEX_CHARS[(h3 >> 20) & 0x0F] + HEX_CHARS[(h3 >> 16) & 0x0F] +
      HEX_CHARS[(h3 >> 12) & 0x0F] + HEX_CHARS[(h3 >> 8) & 0x0F] +
      HEX_CHARS[(h3 >> 4) & 0x0F] + HEX_CHARS[h3 & 0x0F] +
      HEX_CHARS[(h4 >> 28) & 0x0F] + HEX_CHARS[(h4 >> 24) & 0x0F] +
      HEX_CHARS[(h4 >> 20) & 0x0F] + HEX_CHARS[(h4 >> 16) & 0x0F] +
      HEX_CHARS[(h4 >> 12) & 0x0F] + HEX_CHARS[(h4 >> 8) & 0x0F] +
      HEX_CHARS[(h4 >> 4) & 0x0F] + HEX_CHARS[h4 & 0x0F] +
      HEX_CHARS[(h5 >> 28) & 0x0F] + HEX_CHARS[(h5 >> 24) & 0x0F] +
      HEX_CHARS[(h5 >> 20) & 0x0F] + HEX_CHARS[(h5 >> 16) & 0x0F] +
      HEX_CHARS[(h5 >> 12) & 0x0F] + HEX_CHARS[(h5 >> 8) & 0x0F] +
      HEX_CHARS[(h5 >> 4) & 0x0F] + HEX_CHARS[h5 & 0x0F] +
      HEX_CHARS[(h6 >> 28) & 0x0F] + HEX_CHARS[(h6 >> 24) & 0x0F] +
      HEX_CHARS[(h6 >> 20) & 0x0F] + HEX_CHARS[(h6 >> 16) & 0x0F] +
      HEX_CHARS[(h6 >> 12) & 0x0F] + HEX_CHARS[(h6 >> 8) & 0x0F] +
      HEX_CHARS[(h6 >> 4) & 0x0F] + HEX_CHARS[h6 & 0x0F];
    if (!this.is224) {
      hex += HEX_CHARS[(h7 >> 28) & 0x0F] + HEX_CHARS[(h7 >> 24) & 0x0F] +
        HEX_CHARS[(h7 >> 20) & 0x0F] + HEX_CHARS[(h7 >> 16) & 0x0F] +
        HEX_CHARS[(h7 >> 12) & 0x0F] + HEX_CHARS[(h7 >> 8) & 0x0F] +
        HEX_CHARS[(h7 >> 4) & 0x0F] + HEX_CHARS[h7 & 0x0F];
    }
    return hex;
  };

  Sha256.prototype.toString = Sha256.prototype.hex;

  Sha256.prototype.digest = function () {
    this.finalize();

    var h0 = this.h0, h1 = this.h1, h2 = this.h2, h3 = this.h3, h4 = this.h4, h5 = this.h5,
      h6 = this.h6, h7 = this.h7;

    var arr = [
      (h0 >> 24) & 0xFF, (h0 >> 16) & 0xFF, (h0 >> 8) & 0xFF, h0 & 0xFF,
      (h1 >> 24) & 0xFF, (h1 >> 16) & 0xFF, (h1 >> 8) & 0xFF, h1 & 0xFF,
      (h2 >> 24) & 0xFF, (h2 >> 16) & 0xFF, (h2 >> 8) & 0xFF, h2 & 0xFF,
      (h3 >> 24) & 0xFF, (h3 >> 16) & 0xFF, (h3 >> 8) & 0xFF, h3 & 0xFF,
      (h4 >> 24) & 0xFF, (h4 >> 16) & 0xFF, (h4 >> 8) & 0xFF, h4 & 0xFF,
      (h5 >> 24) & 0xFF, (h5 >> 16) & 0xFF, (h5 >> 8) & 0xFF, h5 & 0xFF,
      (h6 >> 24) & 0xFF, (h6 >> 16) & 0xFF, (h6 >> 8) & 0xFF, h6 & 0xFF
    ];
    if (!this.is224) {
      arr.push((h7 >> 24) & 0xFF, (h7 >> 16) & 0xFF, (h7 >> 8) & 0xFF, h7 & 0xFF);
    }
    return arr;
  };

  Sha256.prototype.array = Sha256.prototype.digest;

  Sha256.prototype.arrayBuffer = function () {
    this.finalize();

    var buffer = new ArrayBuffer(this.is224 ? 28 : 32);
    var dataView = new DataView(buffer);
    dataView.setUint32(0, this.h0);
    dataView.setUint32(4, this.h1);
    dataView.setUint32(8, this.h2);
    dataView.setUint32(12, this.h3);
    dataView.setUint32(16, this.h4);
    dataView.setUint32(20, this.h5);
    dataView.setUint32(24, this.h6);
    if (!this.is224) {
      dataView.setUint32(28, this.h7);
    }
    return buffer;
  };

  function HmacSha256(key, is224, sharedMemory) {
    var notString = typeof key !== 'string';
    if (notString) {
      if (key === null || key === undefined) {
        throw ERROR;
      } else if (key.constructor === root.ArrayBuffer) {
        key = new Uint8Array(key);
      }
    }
    var length = key.length;
    if (notString) {
      if (typeof length !== 'number' ||
        !Array.isArray(key) && 
        !(ARRAY_BUFFER && ArrayBuffer.isView(key))) {
        throw ERROR;
      }
    } else {
      var bytes = [], length = key.length, index = 0, code;
      for (var i = 0; i < length; ++i) {
        code = key.charCodeAt(i);
        if (code < 0x80) {
          bytes[index++] = code;
        } else if (code < 0x800) {
          bytes[index++] = (0xc0 | (code >> 6));
          bytes[index++] = (0x80 | (code & 0x3f));
        } else if (code < 0xd800 || code >= 0xe000) {
          bytes[index++] = (0xe0 | (code >> 12));
          bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
          bytes[index++] = (0x80 | (code & 0x3f));
        } else {
          code = 0x10000 + (((code & 0x3ff) << 10) | (key.charCodeAt(++i) & 0x3ff));
          bytes[index++] = (0xf0 | (code >> 18));
          bytes[index++] = (0x80 | ((code >> 12) & 0x3f));
          bytes[index++] = (0x80 | ((code >> 6) & 0x3f));
          bytes[index++] = (0x80 | (code & 0x3f));
        }
      }
      key = bytes;
    }

    if (key.length > 64) {
      key = (new Sha256(is224, true)).update(key).array();
    }

    var oKeyPad = [], iKeyPad = [];
    for (var i = 0; i < 64; ++i) {
      var b = key[i] || 0;
      oKeyPad[i] = 0x5c ^ b;
      iKeyPad[i] = 0x36 ^ b;
    }

    Sha256.call(this, is224, sharedMemory);

    this.update(iKeyPad);
    this.oKeyPad = oKeyPad;
    this.inner = true;
    this.sharedMemory = sharedMemory;
  }
  HmacSha256.prototype = new Sha256();

  HmacSha256.prototype.finalize = function () {
    Sha256.prototype.finalize.call(this);
    if (this.inner) {
      this.inner = false;
      var innerHash = this.array();
      Sha256.call(this, this.is224, this.sharedMemory);
      this.update(this.oKeyPad);
      this.update(innerHash);
      Sha256.prototype.finalize.call(this);
    }
  };

  var exports = createMethod();
  exports.sha256 = exports;
  exports.sha224 = createMethod(true);
  exports.sha256.hmac = createHmacMethod();
  exports.sha224.hmac = createHmacMethod(true);

  /*if (COMMON_JS) {
    module.exports = exports;
  } else {
    root.sha256 = exports.sha256;
    root.sha224 = exports.sha224;
    if (AMD) {
      define(function () {
        return exports;
      });
    }
  }*/
  global.__SHA256_LIB = exports.sha256;
})();

/*
 * 클래스를 생성합니다.
 */
global.CLASS = METHOD((m) => {

	let instanceCount = 0;

	let getNextInstanceId = m.getNextInstanceId = () => {

		instanceCount += 1;

		return instanceCount - 1;
	};

	return {

		run : (define) => {
			//REQUIRED: define	클래스 정의 구문

			let funcs;
			
			let preset;
			let init;
			let _params;
			let afterInit;
			
			let cls = (params, funcs) => {
				//OPTIONAL: params
				//OPTIONAL: funcs

				// inner (protected)
				let inner = {};

				// self (public)
				let self = {
					
					type : cls,
					
					id : getNextInstanceId(),
					
					checkIsInstanceOf : (checkCls) => {
	
						let targetCls = cls;
	
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

			cls.type = CLASS;
			cls.id = getNextInstanceId();

			let innerInit = cls.innerInit = (inner, self, params, funcs) => {
				//REQUIRED: inner
				//REQUIRED: self
				//OPTIONAL: params
				//OPTIONAL: funcs
				
				// mom (parent class)
				let mom;
				
				let paramValue;

				let extend = (params, tempParams) => {

					EACH(tempParams, (value, name) => {

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

						let tempParams = _params(cls);

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

						// when mom's type is OBJECT
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

			let innerAfterInit = cls.innerAfterInit = (inner, self, params, funcs) => {
				//REQUIRED: inner
				//REQUIRED: self
				//OPTIONAL: params
				//OPTIONAL: funcs

				let mom = cls.mom;

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

/*
 * 모든 정의된 싱글톤 객체의 초기화를 수행합니다.
 */
global.INIT_OBJECTS = METHOD({

	run : () => {

		OBJECT.initObjects();
	}
});

/*
 * 싱글톤 객체를 생성합니다.
 */
global.OBJECT = METHOD((m) => {

	let readyObjects = [];
	let isInited = false;

	let initObject = (object) => {
		//REQUIRED: object	초기화 할 싱글톤 객체

		let cls = object.type;
		let inner = {};
		let params = {};

		// set id.
		object.id = CLASS.getNextInstanceId();

		cls.innerInit(inner, object, params);
		cls.innerAfterInit(inner, object, params);
	};

	let addReadyObject = (object) => {
		//REQUIRED: object	초기화를 대기시킬 싱글톤 객체

		if (isInited === true) {
			initObject(object);
		} else {
			readyObjects.push(object);
		}
	};

	let removeReadyObject = m.removeReadyObject = (object) => {
		//REQUIRED: object	대기열에서 삭제할 싱글톤 객체
		
		REMOVE({
			array : readyObjects,
			value : object
		});
	};

	let initObjects = m.initObjects = () => {

		// init all objects.
		EACH(readyObjects, (object) => {
			initObject(object);
		});

		isInited = true;
	};

	return {

		run : (define) => {
			//REQUIRED: define	클래스 정의 구문

			let cls = CLASS(define);

			let self = {
				
				type : cls,
				
				checkIsInstanceOf : (checkCls) => {

					let targetCls = cls;
	
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

/*
 * 주어진 비동기 함수들을 순서대로 실행합니다.
 */
global.NEXT = METHOD({

	run : (countOrArray, funcOrFuncs) => {
		//OPTIONAL: countOrArray
		//REQUIRED: funcOrFuncs

		let count;
		let array;
		
		let f;
		
		if (funcOrFuncs === undefined) {
			funcOrFuncs = countOrArray;
			countOrArray = undefined;
		}

		if (countOrArray !== undefined) {
			if (CHECK_IS_ARRAY(countOrArray) !== true) {
				count = countOrArray;
			} else {
				array = countOrArray;
			}
		}
		
		let funcs;
		if (CHECK_IS_ARRAY(funcOrFuncs) !== true) {
			funcs = [funcOrFuncs];
		} else {
			funcs = funcOrFuncs;
		}
		
		REPEAT({
			start : funcs.length - 1,
			end : 0
		}, (i) => {

			let next;

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
					next = () => {
						// ignore.
					};
				}

				f = funcs[i];

				if (count !== undefined) {
					
					let i = -1;

					RUN((self) => {

						i += 1;

						if (i + 1 < count) {
							f(i, self);
						} else {
							f(i, next);
						}
					});
				}
				
				else if (array !== undefined) {

					let length = array.length;

					if (length === 0) {
						next();
					}
					
					else {
						
						let i = -1;

						RUN((self) => {

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
				}
				
				else {
					f(next);
				}
			}
		});
	}
});

/*
 * 오버라이딩을 수행합니다.
 */
global.OVERRIDE = METHOD({

	run : (origin, func) => {
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

/*
 * 주어진 비동기 함수들을 병렬로 실행합니다.
 */
global.PARALLEL = METHOD({

	run : (dataOrArrayOrCount, funcs) => {
		//OPTIONAL: dataOrArrayOrCount
		//REQUIRED: funcs
		
		let doneCount = 0;

		// only funcs
		if (funcs === undefined) {
			funcs = dataOrArrayOrCount;
			
			let length = funcs.length - 1;

			EACH(funcs, (func, i) => {

				if (i < length) {

					func(() => {

						doneCount += 1;

						if (doneCount === length) {
							funcs[length]();
						}
					});
				}
			});
		}
		
		else if (dataOrArrayOrCount === undefined) {
			funcs[1]();
		}
		
		else if (CHECK_IS_DATA(dataOrArrayOrCount) === true) {
			
			let propertyCount = COUNT_PROPERTIES(dataOrArrayOrCount);

			if (propertyCount === 0) {
				funcs[1]();
			} else {

				EACH(dataOrArrayOrCount, (value, name) => {

					funcs[0](value, () => {

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

				EACH(dataOrArrayOrCount, (value, i) => {

					funcs[0](value, () => {

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

				REPEAT(dataOrArrayOrCount, (i) => {

					funcs[0](i, () => {

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

/*
 * JSON 문자열을 원래 데이터나 배열, 값으로 변환합니다.
 */
global.PARSE_STR = METHOD({

	run : (dataStr) => {
		//REQUIRED: dataStr
		
		try {

			let data = JSON.parse(dataStr);
			
			if (CHECK_IS_DATA(data) === true) {
				return UNPACK_DATA(data);
			}
			
			else if (CHECK_IS_ARRAY(data) === true) {
				
				let array = [];
				
				EACH(data, (data) => {
					array.push(UNPACK_DATA(data));
				});
				
				return array;
			}
			
			else {
				return data;
			}

		} catch(e) {

			// when error, return undefined.
			return undefined;
		}
	}
});

/*
 * 알파벳 대, 소문자와 숫자로 이루어진 임의의 문자열을 생성합니다.
 */
global.RANDOM_STR = METHOD(() => {
	
	const CHARACTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	
	return {
	
		run : (length) => {
			//REQUIRED: length
	
			let randomStr = '';
	
			REPEAT(length, () => {
	
				// add random character to random string.
				randomStr += CHARACTERS.charAt(RANDOM({
					limit : CHARACTERS.length
				}));
			});
	
			return randomStr;
		}
	};
});

/*
 * 비밀번호를 주어진 키를 이용하여 HMAC SHA256 알고리즘으로 암호화 합니다.
 */
global.SHA256 = METHOD({

	run : (params) => {
		//REQUIRED: params
		//REQUIRED: params.password
		//REQUIRED: params.key

		let password = String(params.password);
		let key = String(params.key);
		
		let hash = __SHA256_LIB.hmac.create(key);
		hash.update(password);

		return hash.hex();
	}
});

/*
 * 데이터나 배열, 값을 JSON 문자열로 변환합니다.
 */
global.STRINGIFY = METHOD({

	run : (data) => {
		//REQUIRED: data
		
		if (CHECK_IS_DATA(data) === true) {
			return JSON.stringify(PACK_DATA(data));
		}
		
		else if (CHECK_IS_ARRAY(data) === true) {
			
			let f = (array) => {
				
				let newArray = [];
				
				EACH(array, (data) => {
					if (CHECK_IS_DATA(data) === true) {
						newArray.push(PACK_DATA(data));
					} else if (CHECK_IS_ARRAY(data) === true) {
						newArray.push(f(data));
					} else {
						newArray.push(data);
					}
				});
				
				return newArray;
			};
			
			return JSON.stringify(f(data));
		}
		
		else {
			return JSON.stringify(data);
		}
	}
});

/*
 * 테스트용 메소드입니다.
 * 
 * 테스트에 성공하거나 실패하면 콘솔에 메시지를 출력합니다.
 */
global.TEST = METHOD((m) => {

	let errorCount = 0;

	return {

		run : (name, test) => {
			//REQUIRED: name
			//REQUIRED: test

			test((bool) => {
				//REQUIRED: bool

				let temp = {};
				let line;
				
				if (bool === true) {
					console.log(MSG({
						ko : '[' + name + ' 테스트] 테스트를 통과하였습니다. 총 ' + errorCount + '개의 오류가 있습니다.'
					}));
				} else {

					temp.__THROW_ERROR_$$$ = () => {
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

					console.log(MSG({
						ko : '[' + name + ' 테스트] ' + line + '에서 오류가 발견되었습니다. 총 ' + errorCount + '개의 오류가 있습니다.'
					}));
				}
			});
		}
	};
});

/*
 * URI가 주어진 포맷에 맞는지 확인하는 URI_MATCHER 클래스
 * 
 * 포맷에 파라미터 구간을 지정할 수 있어 URI로부터 파라미터 값을 가져올 수 있습니다.
 */
global.URI_MATCHER = CLASS({

	init : (inner, self, format) => {
		//REQUIRED: format

		let Check = CLASS({

			init : (inner, self, uri) => {
				//REQUIRED: uri

				let uriParts = uri.split('/');
				
				let isMatched;
				let uriParams = {};

				let find = (format) => {

					let formatParts = format.split('/');

					return EACH(uriParts, (uriPart, i) => {

						let formatPart = formatParts[i];

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
				};

				if (CHECK_IS_ARRAY(format) === true) {
					isMatched = EACH(format, (format) => {
						return find(format) !== true;
					}) !== true;
				} else {
					isMatched = find(format);
				}

				let checkIsMatched = self.checkIsMatched = () => {
					return isMatched;
				};

				let getURIParams = self.getURIParams = () => {
					return uriParams;
				};
			}
		});
		
		let check = self.check = (uri) => {
			return Check(uri);
		};
	}
});

/*
 * 데이터를 검증하고, 어떤 부분이 잘못되었는지 오류를 확인할 수 있는 VALID 클래스
 */
global.VALID = CLASS((cls) => {
	
	let notEmpty = cls.notEmpty = (value) => {
		//REQUIRED: value

		let str = (value === undefined || value === TO_DELETE) ? '' : String(value);

		return CHECK_IS_ARRAY(value) === true || str.trim() !== '';
	};

	let regex = cls.regex = (params) => {
		//REQUIRED: params
		//REQUIRED: params.value
		//REQUIRED: params.pattern

		let str = String(params.value);
		let pattern = params.pattern;
		
		let result = str.match(pattern);

		return result !== TO_DELETE && str === result[0];
	};

	let size = cls.size = (params) => {
		//REQUIRED: params
		//REQUIRED: params.value
		//OPTIONAL: params.min
		//REQUIRED: params.max
		
		let str = String(params.value);
		let min = params.min;
		let max = params.max;
		
		if (min === undefined) {
			min = 0;
		}

		return min <= str.trim().length && (max === undefined || str.length <= max);
	};

	let integer = cls.integer = (value) => {
		//REQUIRED: value

		let str = String(value);

		return notEmpty(str) === true && str.match(/^(?:-?(?:0|[1-9][0-9]*))$/) !== TO_DELETE;
	};

	let real = cls.real = (value) => {
		//REQUIRED: value
		
		let str = String(value);

		return notEmpty(str) === true && str.match(/^(?:-?(?:0|[1-9][0-9]*))?(?:\.[0-9]*)?$/) !== TO_DELETE;
	};

	let bool = cls.bool = (value) => {
		//REQUIRED: value
		
		let str = String(value);

		return str === 'true' || str === 'false';
	};

	let date = cls.date = (value) => {
		//REQUIRED: value

		let str = String(value);
		let date = Date.parse(str);

		return isNaN(date) === false;
	};

	let min = cls.min = (params) => {
		//REQUIRED: params
		//REQUIRED: params.value
		//REQUIRED: params.min
		
		let value = params.value;
		let min = params.min;

		return real(value) === true && min <= value;
	};

	let max = cls.max = (params) => {
		//REQUIRED: params
		//REQUIRED: params.value
		//REQUIRED: params.max
		
		let value = params.value;
		let max = params.max;

		return real(value) === true && max >= value;
	};

	let email = cls.email = (value) => {
		//REQUIRED: value

		return typeof value === 'string' && notEmpty(value) === true && value.match(/^(?:[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+\.)*[\w\!\#\$\%\&\'\*\+\-\/\=\?\^\`\{\|\}\~]+@(?:(?:(?:[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!\.)){0,61}[a-zA-Z0-9]?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9\-](?!$)){0,61}[a-zA-Z0-9]?)|(?:\[(?:(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\.){3}(?:[01]?\d{1,2}|2[0-4]\d|25[0-5])\]))$/) !== TO_DELETE;
	};

	let png = cls.png = (value) => {
		//REQUIRED: value

		return typeof value === 'string' && notEmpty(value) === true && value.match(/^data:image\/png;base64,/) !== TO_DELETE;
	};

	let url = cls.url = (value) => {
		//REQUIRED: value

		return typeof value === 'string' && notEmpty(value) === true && value.match(/^(?:(?:ht|f)tp(?:s?)\:\/\/|~\/|\/)?(?:\w+:\w+@)?((?:(?:[-\w\d{1-3}]+\.)+(?:com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|edu|co\.uk|ac\.uk|it|fr|tv|museum|asia|local|travel|[a-z]{2}))|((\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)(\.(\b25[0-5]\b|\b[2][0-4][0-9]\b|\b[0-1]?[0-9]?[0-9]\b)){3}))(?::[\d]{1,5})?(?:(?:(?:\/(?:[-\w~!$+|.,=]|%[a-f\d]{2})+)+|\/)+|\?|#)?(?:(?:\?(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)(?:&(?:[-\w~!$+|.,*:]|%[a-f\d{2}])+=?(?:[-\w~!$+|.,*:=]|%[a-f\d]{2})*)*)*(?:#(?:[-\w~!$ |\/.,*:;=]|%[a-f\d]{2})*)?$/i) !== TO_DELETE && value.length <= 2083;
	};

	let username = cls.username = (value) => {
		//REQUIRED: value

		return typeof value === 'string' && notEmpty(value) === true && value.match(/^[_a-zA-Z0-9\-]+$/) !== TO_DELETE;
	};

	// check is mongo id.
	let mongoId = cls.mongoId = (value) => {
		//REQUIRED: value

		return typeof value === 'string' && notEmpty(value) === true && value.match(/[0-9a-f]{24}/) !== TO_DELETE && value.length === 24;
	};

	let one = cls.one = (params) => {
		//REQUIRED: params
		//REQUIRED: params.value
		//REQUIRED: params.array

		let value = params.value;
		let array = params.array;

		return EACH(array, (_value) => {
			if (value === _value) {
				return false;
			}
		}) === false;
	};

	let array = cls.array = (value) => {
		//REQUIRED: value

		return CHECK_IS_ARRAY(value) === true;
	};

	let data = cls.data = (value) => {
		//REQUIRED: value

		return CHECK_IS_DATA(value) === true;
	};

	let element = cls.element = (params) => {
		//REQUIRED: params
		//REQUIRED: params.array
		//REQUIRED: params.validData
		//OPTIONAL: params.isToWash
		
		let array = params.array;

		let valid = VALID({
			_ : params.validData
		});
		
		let isToWash = params.isToWash;
		
		return EACH(array, (value) => {
			if ((isToWash === true ? valid.checkAndWash : valid.check)({
				_ : value
			}).checkHasError() === true) {
				return false;
			}
		}) === true;
	};

	let property = cls.property = (params) => {
		//REQUIRED: params
		//REQUIRED: params.data
		//REQUIRED: params.validData
		//OPTIONAL: params.isToWash

		let data = params.data;

		let valid = VALID({
			_ : params.validData
		});
		
		let isToWash = params.isToWash;
		
		return EACH(data, (value) => {
			if ((isToWash === true ? valid.checkAndWash : valid.check)({
				_ : value
			}).checkHasError() === true) {
				return false;
			}
		}) === true;
	};

	let detail = cls.detail = (params) => {
		//REQUIRED: params
		//REQUIRED: params.data
		//REQUIRED: params.validDataSet
		//OPTIONAL: params.isToWash
		
		let data = params.data;
		let valid = VALID(params.validDataSet);
		let isToWash = params.isToWash;
		
		return (isToWash === true ? valid.checkAndWash : valid.check)(data).checkHasError() !== true;
	};

	let equal = cls.equal = (params) => {
		//REQUIRED: params
		//REQUIRED: params.value
		//REQUIRED: params.validValue

		let str = String(params.value);
		let validStr = String(params.validValue);

		return str === validStr;
	};

	return {

		init : (inner, self, validDataSet) => {
			//REQUIRED: validDataSet

			let Check = CLASS({

				init : (inner, self, params) => {
					//REQUIRED: params
					//REQUIRED: params.data
					//OPTIONAL: params.isToWash
					//OPTIONAL: params.isForUpdate

					let data = params.data;
					let isToWash = params.isToWash;
					let isForUpdate = params.isForUpdate;

					let hasError = false;
					let errors = {};

					EACH(validDataSet, (validData, attr) => {

						// when valid data is true, pass
						if (validData !== true) {

							EACH(validData, (validParams, name) => {

								let value = data[attr];
								
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

									if (cls[name === 'id' ? 'mongoId' : name](value) === false) {

										hasError = true;
										errors[attr] = {
											type : name,
											value : value
										};

										// break.
										return false;
									}
								}

								if (typeof value === 'string') {
									
									value = value.trim();
									
									if (notEmpty(value) === true) {
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
										} else {
											data[attr] = value;
										}
									}
									
									else {
										data[attr] = value;
									}
								}
							});
						}
					});

					if (isToWash === true) {
						
						EACH(data, (value, attr) => {
							if (validDataSet[attr] === undefined) {
								delete data[attr];
							}
						});
					}

					let checkHasError = self.checkHasError = () => {
						return hasError;
					};

					let getErrors = self.getErrors = () => {
						return errors;
					};
				}
			});

			let check = self.check = (data) => {
				return Check({
					data : data
				});
			};

			let checkAndWash = self.checkAndWash = (data) => {
				return Check({
					data : data,
					isToWash : true
				});
			};

			let checkForUpdate = self.checkForUpdate = (data) => {
				return Check({
					data : data,
					isToWash : true,
					isForUpdate : true
				});
			};
			
			let getValidDataSet = self.getValidDataSet = () => {
				return validDataSet;
			};
		}
	};
});

/*
 * 배열 안의 모든 요소들이 동일한지 확인합니다.
 */
global.CHECK_ARE_SAME = METHOD({

	run : (array) => {
		//REQUIRED: array

		let areSame = false;

		let checkTwoSame = (a, b) => {

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
				return EACH(a, (value, name) => {
					return checkTwoSame(value, b[name]);
				});
			}

			// when a, b are array
			else if (CHECK_IS_ARRAY(a) === true && CHECK_IS_ARRAY(b) === true) {
				return EACH(a, (value, i) => {
					return checkTwoSame(value, b[i]);
				});
			}

			// when a, b are value
			else {
				return a === b;
			}
		};

		if (array.length > 1) {

			areSame = REPEAT(array.length, (i) => {
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

/*
 * target이 배열인지 확인합니다.
 */
global.CHECK_IS_ARRAY = METHOD({

	run : (target) => {
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

/*
 * target이 데이터인지 확인합니다.
 */
global.CHECK_IS_DATA = METHOD({

	run : (target) => {
		//OPTIONAL: target

		if (
		target !== undefined &&
		target !== TO_DELETE &&
		CHECK_IS_ARRAY(target) !== true &&
		target instanceof Date !== true &&
		target instanceof RegExp !== true &&
		typeof target === 'object') {
			return true;
		}

		return false;
	}
});

/*
 * 데이터가 아무런 값이 없는 빈 데이터({})인지 확인합니다.
 */
global.CHECK_IS_EMPTY_DATA = METHOD({

	run : (data) => {
		//REQUIRED: data

		return CHECK_ARE_SAME([data, {}]);
	}
});

/*
 * 데이터 내 값들의 개수를 반환합니다.
 */
global.COUNT_PROPERTIES = METHOD({

	run : (data) => {
		//OPTIONAL: data

		let count = 0;
		
		EACH(data, () => {
			count += 1;
		});
		
		return count;
	}
});

/*
 * 주어진 데이터의 값들 중 Date형은 정수형태로, RegExp형은 문자열 형태로 변환한 데이터를 반환합니다.
 */
global.PACK_DATA = METHOD({

	run : (data) => {
		//REQUIRED: data

		let result = COPY(data);
		let dateNames = [];
		let regexNames = [];

		EACH(result, (value, name) => {

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

				EACH(value, (v, i) => {

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

/*
 * PACK_DATA가 적용된 데이터의 값들 중 정수형태로 변환된 Date형과 문자열 형태로 변환된 RegExp형을 원래대로 되돌린 데이터를 반환합니다.
 */
global.UNPACK_DATA = METHOD({

	run : (packedData) => {
		//REQUIRED: packedData	PACK_DATA가 적용된 데이터

		let result = COPY(packedData);

		// when date property names exists
		if (result.__D !== undefined) {

			// change timestamp integer to Date type.
			EACH(result.__D, (dateName, i) => {
				result[dateName] = new Date(result[dateName]);
			});
			
			delete result.__D;
		}
		
		// when regex property names exists
		if (result.__R !== undefined) {

			// change string to RegExp type.
			EACH(result.__R, (regexName, i) => {
				
				let pattern = result[regexName];
				let flags;
				
				for (let j = pattern.length - 1; j >= 0; j -= 1) {
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

		EACH(result, (value, name) => {

			if (CHECK_IS_DATA(value) === true) {
				result[name] = UNPACK_DATA(value);
			}

			else if (CHECK_IS_ARRAY(value) === true) {

				EACH(value, (v, i) => {

					if (CHECK_IS_DATA(v) === true) {
						value[i] = UNPACK_DATA(v);
					}
				});
			}
		});

		return result;
	}
});

/*
 * 특정 값이 데이터나 배열에 존재하는지 확인합니다.
 */
global.CHECK_IS_IN = METHOD({

	run : (params) => {
		//REQUIRED: params
		//OPTIONAL: params.data
		//OPTIONAL: params.array
		//REQUIRED: params.value	존재하는지 확인 할 값

		let data = params.data;
		let array = params.array;
		let value = params.value;

		if (data !== undefined) {
			return EACH(data, (_value, name) => {
				if (CHECK_ARE_SAME([_value, value]) === true) {
					return false;
				}
			}) !== true;
		}

		if (array !== undefined) {
			return EACH(array, (_value, key) => {
				if (CHECK_ARE_SAME([_value, value]) === true) {
					return false;
				}
			}) !== true;
		}
	}
});

/*
 * 데이터들이나 배열들을 하나의 데이터나 배열로 합칩니다.
 */
global.COMBINE = METHOD({

	run : (dataSetOrArrays) => {
		//REQUIRED: dataSetOrArrays

		let result;

		if (dataSetOrArrays.length > 0) {

			let first = dataSetOrArrays[0];

			if (CHECK_IS_DATA(first) === true) {

				result = {};

				EACH(dataSetOrArrays, (data) => {
					EXTEND({
						origin : result,
						extend : data
					});
				});
			}

			else if (CHECK_IS_ARRAY(first) === true) {

				result = [];

				EACH(dataSetOrArrays, (array) => {
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

/*
 * 데이터나 배열을 복제합니다.
 */
global.COPY = METHOD({

	run : (dataOrArray) => {
		//REQUIRED: dataOrArray
		
		let copy;
		
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

/*
 * 데이터나 배열을 덧붙혀 확장합니다.
 */
global.EXTEND = METHOD({

	run : (params) => {
		//REQUIRED: params
		//REQUIRED: params.origin	기존 데이터나 배열
		//REQUIRED: params.extend	덧붙힐 데이터나 배열

		let origin = params.origin;
		let extend = params.extend;

		if (CHECK_IS_DATA(origin) === true) {

			EACH(extend, (value, name) => {
				
				if ( value instanceof Date === true) {
					origin[name] = new Date(value.getTime());
				}
				
				else if ( value instanceof RegExp === true) {
					
					let pattern = value.toString();
					let flags;
					
					for (let i = pattern.length - 1; i >= 0; i -= 1) {
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

			EACH(extend, (value) => {

				if ( value instanceof Date === true) {
					origin.push(new Date(value.getTime()));
				}
				
				else if ( value instanceof RegExp === true) {
					
					let pattern = value.toString();
					let flags;
					
					for (let i = pattern.length - 1; i >= 0; i -= 1) {
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

/*
 * 데이터나 배열의 특정 값을 찾아, 데이터인 경우 그 값에 해당하는 이름을, 배열인 경우 그 값에 해당하는 키(index)를 반환합니다.
 */
global.FIND = METHOD({

	run : (dataOrArrayOrParams, filter) => {
		//REQUIRED: dataOrArrayOrParams
		//OPTIONAL: dataOrArrayOrParams.data
		//OPTIONAL: dataOrArrayOrParams.array
		//REQUIRED: dataOrArrayOrParams.value	찾을 값
		//OPTIONAL: filter

		let ret;

		if (filter !== undefined) {

			if (CHECK_IS_DATA(dataOrArrayOrParams) === true) {

				EACH(dataOrArrayOrParams, (value, name) => {

					// value passed filter.
					if (filter(value, name) === true) {
						ret = value;
						return false;
					}
				});
			}

			else if (CHECK_IS_ARRAY(dataOrArrayOrParams) === true) {

				EACH(dataOrArrayOrParams, (value, key) => {

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
			let data = dataOrArrayOrParams.data;
			let array = dataOrArrayOrParams.array;
			let value = dataOrArrayOrParams.value;

			if (data !== undefined) {

				EACH(data, (_value, name) => {
					if (_value === value) {
						ret = name;
						return false;
					}
				});
			}

			if (array !== undefined) {

				EACH(array, (_value, key) => {
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

/*
 * 데이터나 배열의 특정 값을 삭제합니다.
 */
global.REMOVE = METHOD({

	run : (dataOrArrayOrParams, filter) => {
		//REQUIRED: dataOrArrayOrParams
		//OPTIONAL: dataOrArrayOrParams.data
		//OPTIONAL: dataOrArrayOrParams.array
		//OPTIONAL: dataOrArrayOrParams.name	데이터에서 삭제할 값의 이름
		//OPTIONAL: dataOrArrayOrParams.key		배열에서 삭제할 값의 키 (index)
		//OPTIONAL: dataOrArrayOrParams.value	삭제할 값, 이 값을 찾아 삭제합니다.
		//OPTIONAL: filter
		
		if (filter !== undefined) {

			if (CHECK_IS_DATA(dataOrArrayOrParams) === true) {

				EACH(dataOrArrayOrParams, (value, name) => {

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

				EACH(dataOrArrayOrParams, (value, key) => {

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
			let data = dataOrArrayOrParams.data;
			let array = dataOrArrayOrParams.array;
			let name = dataOrArrayOrParams.name;
			let key = dataOrArrayOrParams.key;
			let value = dataOrArrayOrParams.value;

			if (name !== undefined) {
				delete data[name];
			}

			if (key !== undefined) {
				array.splice(key, 1);
			}

			if (value !== undefined) {

				if (data !== undefined) {

					EACH(data, (_value, name) => {

						if (CHECK_ARE_SAME([_value, value]) === true) {

							REMOVE({
								data : data,
								name : name
							});
						}
					});
				}

				if (array !== undefined) {

					EACH(array, (_value, key) => {

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

/*
 * 날짜를 처리할 때 Date형을 좀 더 쓰기 편하도록 개선한 CALENDAR 클래스
 */
global.CALENDAR = CLASS({

	init : (inner, self, date) => {
		//OPTIONAL: date	입력하지 않으면 현재 시각을 기준으로 생성합니다.

		if (date === undefined) {
			date = new Date();
		}

		let getYear = self.getYear = () => {
			return date.getFullYear();
		};

		let getMonth = self.getMonth = (isFormal) => {
			//OPTIONAL: isFormal	true로 설정하면 10보다 작은 수일 경우 앞에 0을 붙힌 문자열을 반환합니다. ex) 01, 04, 09
			
			let month = date.getMonth() + 1;
			
			if (isFormal === true) {
				return month < 10 ? '0' + month : '' + month;
			} else {
				return month;
			}
		};

		let getDate = self.getDate = (isFormal) => {
			//OPTIONAL: isFormal	true로 설정하면 10보다 작은 수일 경우 앞에 0을 붙힌 문자열을 반환합니다. ex) 01, 04, 09
			
			let d = date.getDate();
			
			if (isFormal === true) {
				return d < 10 ? '0' + d : '' + d;
			} else {
				return d;
			}
		};

		let getDay = self.getDay = () => {
			return date.getDay();
		};

		let getHour = self.getHour = (isFormal) => {
			//OPTIONAL: isFormal	true로 설정하면 10보다 작은 수일 경우 앞에 0을 붙힌 문자열을 반환합니다. ex) 01, 04, 09
			
			let hour = date.getHours();
			
			if (isFormal === true) {
				return hour < 10 ? '0' + hour : '' + hour;
			} else {
				return hour;
			}
		};

		let getMinute = self.getMinute = (isFormal) => {
			//OPTIONAL: isFormal	true로 설정하면 10보다 작은 수일 경우 앞에 0을 붙힌 문자열을 반환합니다. ex) 01, 04, 09
			
			let minute = date.getMinutes();
			
			if (isFormal === true) {
				return minute < 10 ? '0' + minute : '' + minute;
			} else {
				return minute;
			}
		};

		let getSecond = self.getSecond = (isFormal) => {
			//OPTIONAL: isFormal	true로 설정하면 10보다 작은 수일 경우 앞에 0을 붙힌 문자열을 반환합니다. ex) 01, 04, 09
			
			let second = date.getSeconds();
			
			if (isFormal === true) {
				return second < 10 ? '0' + second : '' + second;
			} else {
				return second;
			}
		};
	}
});

/*
 * Date형 값을 생성합니다.
 */
global.CREATE_DATE = METHOD({

	run : (params) => {
		//REQUIRED: params
		//OPTIONAL: params.year		년
		//OPTIONAL: params.month	월
		//OPTIONAL: params.date		일
		//OPTIONAL: params.hour		시
		//OPTIONAL: params.minute	분
		//OPTIONAL: params.second	초
		
		let year = params.year;
		let month = params.month;
		let date = params.date;
		let hour = params.hour;
		let minute = params.minute;
		let second = params.second;
		
		let nowCal = CALENDAR(new Date());
		
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

/*
 * 주어진 초가 흐른 뒤에 함수를 실행하는 DELAY 클래스
 */
global.DELAY = CLASS({

	init : (inner, self, seconds, func) => {
		//REQUIRED: seconds
		//OPTIONAL: func

		if (func === undefined) {
			func = seconds;
			seconds = 0;
		}
		
		let milliseconds;
		
		let startTime = Date.now();
		
		let remaining = milliseconds = seconds * 1000;
		
		let timeout;
		
		let resume = self.resume = RAR(() => {
			
			if (timeout === undefined) {
				
				timeout = setTimeout(() => {
					func();
					remove();
				}, remaining);
			}
		});
		
		let pause = self.pause = () => {
			
			remaining = milliseconds - (Date.now() - startTime);
			
			clearTimeout(timeout);
			timeout = undefined;
		};
		
		let remove = self.remove = () => {
			pause();
		};
	}
});

/*
 * 주어진 초 마다 함수를 반복해서 실행하는 INTERVAL 클래스
 */
global.INTERVAL = CLASS({

	init : (inner, self, seconds, func) => {
		//REQUIRED: seconds
		//OPTIONAL: func

		if (func === undefined) {
			func = seconds;
			seconds = 0;
		}

		let milliseconds;
		
		let startTime = Date.now();
		
		let remaining = milliseconds = seconds === 0 ? 1 : seconds * 1000;
		
		let interval;
		
		let count = 0;
		
		let resume = self.resume = RAR(() => {
			
			if (interval === undefined) {
				
				interval = setInterval(() => {
					
					count += 1;
					
					if (func(self, count) === false) {
						remove();
					}
					
					startTime = Date.now();
					
				}, remaining);
			}
		});
		
		let pause = self.pause = () => {
			
			remaining = milliseconds - (Date.now() - startTime);
			
			clearInterval(interval);
			interval = undefined;
		};
		
		let remove = self.remove = () => {
			pause();
		};
	}
});

/*
 * 아주 짧은 시간동안 반복해서 실행하는 로직을 작성할때 사용하는 LOOP 클래스
 */
global.LOOP = CLASS((cls) => {
	
	let animationInterval;
	let loopInfos = [];
	let runs = [];

	let fire = () => {

		if (animationInterval === undefined) {

			let beforeTime = Date.now() / 1000;

			animationInterval = INTERVAL(() => {

				let time = Date.now() / 1000;
				let deltaTime = time - beforeTime;
				
				if (deltaTime > 0) {

					for (let i = 0; i < loopInfos.length; i += 1) {

						let loopInfo = loopInfos[i];

						if (loopInfo.fps !== undefined && loopInfo.fps > 0) {

							if (loopInfo.timeSigma === undefined) {
								loopInfo.timeSigma = 0;
								loopInfo.countSigma = 0;
							}

							// calculate count.
							let count = parseInt(loopInfo.fps * deltaTime * (loopInfo.timeSigma / deltaTime + 1), 10) - loopInfo.countSigma;

							// start.
							if (loopInfo.start !== undefined) {
								loopInfo.start();
							}

							// run interval.
							let interval = loopInfo.interval;
							for (j = 0; j < count; j += 1) {
								interval(loopInfo.fps);
							}

							// end.
							if (loopInfo.end !== undefined) {
								loopInfo.end(deltaTime);
							}

							loopInfo.countSigma += count;

							loopInfo.timeSigma += deltaTime;
							if (loopInfo.timeSigma > 1000) {
								loopInfo.timeSigma = undefined;
							}
						}
					}

					// run runs.
					for (let i = 0; i < runs.length; i += 1) {
						runs[i](deltaTime);
					}

					beforeTime = time;
				}
			});
		}
	};
	
	let stop = () => {

		if (loopInfos.length <= 0 && runs.length <= 0) {

			animationInterval.remove();
			animationInterval = undefined;
		}
	};

	return {

		init : (inner, self, fpsOrRun, intervalOrFuncs) => {
			//OPTIONAL: fpsOrRun
			//OPTIONAL: intervalOrFuncs
			//OPTIONAL: intervalOrFuncs.start
			//REQUIRED: intervalOrFuncs.interval
			//OPTIONAL: intervalOrFuncs.end

			let run;
			let start;
			let interval;
			let end;

			let info;

			if (intervalOrFuncs !== undefined) {

				// init intervalOrFuncs.
				if (CHECK_IS_DATA(intervalOrFuncs) !== true) {
					interval = intervalOrFuncs;
				} else {
					start = intervalOrFuncs.start;
					interval = intervalOrFuncs.interval;
					end = intervalOrFuncs.end;
				}
			
				let resume = self.resume = RAR(() => {
					
					loopInfos.push( info = {
						fps : fpsOrRun,
						start : start,
						interval : interval,
						end : end
					});
					
					fire();
				});

				let pause = self.pause = () => {

					REMOVE({
						array : loopInfos,
						value : info
					});

					stop();
				};

				let changeFPS = self.changeFPS = (fps) => {
					//REQUIRED: fps

					info.fps = fps;
				};

				let remove = self.remove = () => {
					pause();
				};
			}

			// when fpsOrRun is run
			else {
				
				let resume = self.resume = RAR(() => {
					
					runs.push(run = fpsOrRun);
					
					fire();
				});

				let pause = self.pause = () => {

					REMOVE({
						array : runs,
						value : run
					});

					stop();
				};

				let remove = self.remove = () => {
					pause();
				};
			}
		}
	};
});

/*
 * 주어진 함수를 즉시 실행하고, 함수를 반환합니다.
 * 
 * 선언과 동시에 실행되어야 하는 함수를 선언할 때 유용합니다.
 */
global.RAR = METHOD({

	run : (params, func) => {
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

/*
 * 주어진 함수를 즉시 실행합니다.
 */
global.RUN = METHOD({

	run : (func) => {
		//REQUIRED: func
		
		let f = () => {
			return func(f);
		};

		return f();
	}
});

/*
 * 정수 문자열을 정수 값으로 변환합니다.
 */
global.INTEGER = METHOD({

	run : (integerString) => {
		//OPTIONAL: integerString

		return integerString === undefined ? undefined : parseInt(integerString, 10);
	}
});

/*
 * 임의의 정수를 생성합니다.
 */
global.RANDOM = METHOD({

	run : (limitOrParams) => {
		//REQUIRED: limitOrParams
		//OPTIONAL: limitOrParams.min	생성할 정수 범위 최소값, 이 값 이상인 값만 생성합니다.
		//OPTIONAL: limitOrParams.max	생성할 정수 범위 최대값, 이 값 이하인 값만 생성합니다.
		//OPTIONAL: limitOrParams.limit	생성할 정수 범위 제한값, 이 값 미만인 값만 생성합니다.

		let min;
		let max
		let limit;

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

/*
 * 실수 문자열을 실수 값으로 변환합니다.
 */
global.REAL = METHOD({

	run : (realNumberString) => {
		//OPTIONAL: realNumberString

		return realNumberString === undefined ? undefined : parseFloat(realNumberString);
	}
});

/*
 * 데이터나 배열, 문자열의 각 요소를 순서대로 대입하여 주어진 함수를 실행합니다.
 */
global.EACH = METHOD({

	run : (dataOrArrayOrString, func) => {
		//OPTIONAL: dataOrArrayOrString
		//REQUIRED: func
		
		if (dataOrArrayOrString === undefined) {
			return false;
		}

		else if (CHECK_IS_DATA(dataOrArrayOrString) === true) {

			for (let name in dataOrArrayOrString) {
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

			return (dataOrArrayOrString) => {
				return EACH(dataOrArrayOrString, func);
			};
		}

		// when dataOrArrayOrString is array or string
		else {

			let length = dataOrArrayOrString.length;

			for (let i = 0; i < length; i += 1) {

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

/*
 * 주어진 함수를 주어진 횟수만큼 반복해서 실행합니다.
 */
global.REPEAT = METHOD({

	run : (countOrParams, func) => {
		//OPTIONAL: countOrParams
		//REQUIRED: countOrParams.start
		//OPTIONAL: countOrParams.end
		//OPTIONAL: countOrParams.limit
		//OPTIONAL: countOrParams.step
		//REQUIRED: func

		let count;
		let start;
		let end;
		let limit;
		let step;
		
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

			for (let i = 0; i < parseInt(count, 10); i += 1) {
				if (func(i) === false) {
					return false;
				}
			}
		}

		// end mode
		else if (end !== undefined && start > end) {

			for (let i = start; i >= end; i -= step) {
				if (func(i) === false) {
					return false;
				}
			}

		}

		// limit mode
		else if (limit !== undefined) {

			for (let i = start; i < limit; i += step) {
				if (func(i) === false) {
					return false;
				}
			}
		}
		
		// func mode
		else {
			
			return (countOrParams) => {
				return REPEAT(countOrParams, func);
			};
		}

		return true;
	}
});

/*
 * 데이터나 배열, 문자열의 각 요소를 역순으로 대입하여 주어진 함수를 실행합니다.
 */
global.REVERSE_EACH = METHOD({

	run : (arrayOrString, func) => {
		//OPTIONAL: arrayOrString
		//REQUIRED: func
		
		if (arrayOrString === undefined) {
			return false;
		}

		// when arrayOrString is func
		else if (func === undefined) {

			func = arrayOrString;
			arrayOrString = undefined;

			return (arrayOrString) => {
				return REVERSE_EACH(arrayOrString, func);
			};
		}

		// when arrayOrString is array or string
		else {

			let length = arrayOrString.length;

			for (let i = length - 1; i >= 0; i -= 1) {

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
