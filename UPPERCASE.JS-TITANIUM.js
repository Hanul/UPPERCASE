global.CONNECT_TO_SOCKET_SERVER=CONNECT_TO_SOCKET_SERVER=METHOD({run:function(o,t){"use strict";var e,n,E,r,i,T,c,s,u,a=o.host,d=o.port,S={},C=0,O="";CHECK_IS_DATA(t)!==!0?e=t:(e=t.success,n=t.error),u=function(o,t,e){var n=S[o];void 0!==n&&EACH(n,function(o){o(t,function(o){void 0!==s&&void 0!==e&&s({methodName:"__CALLBACK_"+e,data:o})})})},E=Ti.Network.Socket.createTCP({host:a,port:d,connected:function(o){Ti.Stream.pump(o.socket,function(o){if(o.bytesProcessed<0)return i!==!0&&u("__DISCONNECTED"),void E.close();if(o.buffer){var t,e,n;for(O+=o.buffer.toString();-1!==(e=O.indexOf("\n"));)t=O.substring(0,e),n=PARSE_STR(t),void 0!==n&&u(n.methodName,n.data,n.sendKey),O=O.substring(e+1)}},1024,!0),r=!0,e(T=function(o,t){var e=S[o];void 0===e&&(e=S[o]=[]),e.push(t)},c=function(o,t){var e=S[o];void 0!==e&&(void 0!==t?REMOVE({array:e,value:t}):delete S[o])},s=function(t,e){var n="__CALLBACK_"+C;t.sendKey=C,C+=1,o.socket.write(Ti.createBuffer({value:STRINGIFY(t)+"\n"})),void 0!==e&&T(n,function(o){e(o),c(n)})},function(){i=!0,E.close()})},error:function(o){var t=o.error.toString();r!==!0?(console.log(CONSOLE_RED("[UPPERCASE.JS-CONNECT_TO_SOCKET_SERVER] CONNECT TO SOCKET SERVER FAILED: "+t)),void 0!==n&&n(t)):u("__ERROR",t)}}),E.connect()}}),global.DELETE=DELETE=METHOD({run:function(o,t){"use strict";REQUEST(COMBINE([o,{method:"DELETE"}]),t)}}),global.GET=GET=METHOD({run:function(o,t){"use strict";REQUEST(COMBINE([o,{method:"GET"}]),t)}}),global.POST=POST=METHOD({run:function(o,t){"use strict";REQUEST(COMBINE([o,{method:"POST"}]),t)}}),global.PUT=PUT=METHOD({run:function(o,t){"use strict";REQUEST(COMBINE([o,{method:"PUT"}]),t)}}),global.REQUEST=REQUEST=METHOD({run:function(o,t){"use strict";var e,n,E,r=o.host,i=o.port,T=o.isSecure,c=o.method,s=o.uri,u=void 0!==o.data?"data="+encodeURIComponent(STRINGIFY(o.data)):o.paramStr,a=(T===!0?"https://":"http://")+r+":"+i+"/"+s;CHECK_IS_DATA(t)!==!0?e=t:(e=t.success,n=t.error),u=(void 0===u?"":u+"&")+Date.now(),E=Ti.Network.createHTTPClient({onload:function(){e(this.responseText)},onerror:function(t){var e=t.error;console.log("[UPPERCASE.JS-REQUEST] REQUEST FAILED:",o,e),void 0!==n&&n(e)}}),c=c.toUpperCase(),"GET"===c?(E.open(c,a+"?"+u),E.send()):(E.open(c,a),E.setRequestHeader("Content-type","application/x-www-form-urlencoded"),E.send(u))}});