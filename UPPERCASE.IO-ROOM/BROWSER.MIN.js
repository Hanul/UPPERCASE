FOR_BOX(function(O){"use strict";OVERRIDE(O.ROOM,function(R){O.ROOM=CLASS({preset:function(){return R},init:function(O,R){var e;R.send=e=function(R,e){O.checkIsExited()!==!0?CONNECT_TO_ROOM_SERVER.send({methodName:O.getRoomName()+"/"+R.methodName,data:R.data},e):console.log(CONSOLE_RED("[UPPERCASE.IO-ROOM] `ROOM.send` ERROR! ROOM EXITED!"))}}})})});global.CONNECT_TO_ROOM_SERVER=METHOD(function(o){"use strict";var n,t,e,a,i,E,d,u,c=[],m=[],r=[];return o.enterRoom=a=function(o){c.push(o),void 0!==e&&e({methodName:"__ENTER_ROOM",data:o})},o.on=i=function(o,t){m.push({methodName:o,method:t}),void 0!==n&&n(o,t)},o.off=E=function(o,n){void 0!==t&&t(o,n),void 0!==n?REMOVE(m,function(t){return t.methodName===o&&t.method===n}):REMOVE(m,function(n){return n.methodName===o})},o.send=d=function(o,n){void 0===e?r.push({params:o,callback:n}):e(o,n)},o.exitRoom=u=function(o){void 0!==e&&e({methodName:"__EXIT_ROOM",data:o}),REMOVE({array:c,value:o})},{run:function(o,a){var i,E;CHECK_IS_DATA(a)!==!0?i=a:(i=a.success,E=a.error),CONNECT_TO_WEB_SOCKET_SERVER(o,{error:E,success:function(o,a,E){n=o,t=a,e=E,EACH(c,function(o){e({methodName:"__ENTER_ROOM",data:o})}),EACH(m,function(o){n(o.methodName,o.method)}),EACH(r,function(o){e(o.params,o.callback)}),r=void 0,void 0!==i&&i(o,a,E),o("__DISCONNECTED",function(){n=void 0,t=void 0,e=void 0,r=[]})}})}}});