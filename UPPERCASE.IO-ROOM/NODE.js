FOR_BOX(function(a){"use strict";a.BROADCAST=METHOD({run:function(o){var m=a.boxName+"/"+o.roomName,t=o.methodName,d=o.data;LAUNCH_ROOM_SERVER.broadcast({roomName:m,methodName:t,data:d}),void 0!==CPU_CLUSTERING.broadcast&&CPU_CLUSTERING.broadcast({methodName:"__LAUNCH_ROOM_SERVER__MESSAGE",data:{roomName:m,methodName:t,data:d}}),void 0!==SERVER_CLUSTERING.broadcast&&SERVER_CLUSTERING.broadcast({methodName:"__LAUNCH_ROOM_SERVER__MESSAGE",data:{roomName:m,methodName:t,data:d}})}})});FOR_BOX(function(n){"use strict";n.ROOM=METHOD({run:function(O,R){LAUNCH_ROOM_SERVER.addInitRoomFunc(n.boxName+"/"+O,R)}})});global.LAUNCH_ROOM_SERVER=LAUNCH_ROOM_SERVER=CLASS(function(t){"use strict";var o,n,E={},_={};return t.addInitRoomFunc=o=function(t,o){void 0===E[t]&&(E[t]=[]),E[t].push(o)},t.broadcast=n=function(t){var o=t.roomName,n=_[o];void 0!==n&&EACH(n,function(n){n({methodName:o+"/"+t.methodName,data:t.data})})},{init:function(t,o,e){var R,a;void 0!==CPU_CLUSTERING.on&&CPU_CLUSTERING.on("__LAUNCH_ROOM_SERVER__MESSAGE",n),void 0!==SERVER_CLUSTERING.on&&SERVER_CLUSTERING.on("__LAUNCH_ROOM_SERVER__MESSAGE",function(t){n(t),void 0!==CPU_CLUSTERING.broadcast&&CPU_CLUSTERING.broadcast({methodName:"__LAUNCH_ROOM_SERVER__MESSAGE",data:t})}),R=MULTI_PROTOCOL_SOCKET_SERVER(e,function(t,o,n,e){var R={};o("__ENTER_ROOM",function(a){var i=E[a],d=_[a];void 0===R[a]?(R[a]=1,void 0!==i&&EACH(i,function(E){E(t,function(t,n){o(a+"/"+t,n)},function(t,o){n(a+"/"+t,o)},function(t,o){e({methodName:a+"/"+t.methodName,data:t.data},o)})}),void 0===d&&(d=_[a]=[]),d.push(e)):R[a]+=1}),o("__EXIT_ROOM",function(t){void 0!==R[t]&&(R[t]-=1,0===R[t]&&(REMOVE({array:_[t],value:e}),0===_[t].length&&delete _[t],delete R[t]))}),o("__DISCONNECTED",function(){EACH(R,function(t,o){REMOVE({array:_[o],value:e}),0===_[o].length&&delete _[o]}),R=void 0})}),o.getWebSocketFixRequest=a=function(){return R.getWebSocketFixRequest()}}}});