global.CONNECT_TO_DB_SERVER=CONNECT_TO_DB_SERVER=METHOD(function(t){var o,r,i=[];return t.addInitDBFunc=r=function(t){void 0===o?i.push(t):t(o)},{run:function(t,r){"use strict";var e=t.username,n=t.password,a=void 0===t.host?"127.0.0.1":t.host,c=void 0===t.port?27017:t.port,d=t.name;require("mongodb").MongoClient.connect("mongodb://"+(void 0!==e&&void 0!==n?e+":"+n+"@":"")+a+":"+c+"/"+d,function(t,e){t!==TO_DELETE?console.log(CONSOLE_RED("[UPPERCASE.IO-DB] CONNECT TO DB SERVER FAILED: "+t.toString())):(o=e,EACH(i,function(t){t(o)}),i=void 0,void 0!==r&&r())})}}}),FOR_BOX(function(t){"use strict";var o=require("mongodb").ObjectID,r=function(t){return new o(t)},i=function(t){return void 0!==t._id&&(t.id=t._id.toString()),delete t._id,delete t.__IS_ENABLED,delete t.__RANDOM_KEY,t},e=function(t){EACH(t,function(o,r){o===TO_DELETE?REMOVE({data:t,key:r}):(CHECK_IS_DATA(o)===!0||CHECK_IS_ARRAY(o)===!0)&&e(o)})},n=function(t){var o=function(t){void 0!==t.id&&(CHECK_IS_DATA(t.id)===!0?(EACH(t.id,function(o,i){CHECK_IS_DATA(o)===!0||CHECK_IS_ARRAY(o)===!0?EACH(o,function(t,i){o[i]=r(t)}):t.id[i]=r(o)}),t._id=t.id):t._id=r(id),delete t.id),t.__IS_ENABLED=!0,EACH(t,function(o,r){void 0===o&&delete t[r]})};void 0!==t.$and?EACH(t.$and,function(t){o(t)}):void 0!==t.$or?EACH(t.$or,function(t){o(t)}):o(t)};t.DB=CLASS({init:function(o,a,c){var d,s,E,_,u,f,l,v=[],C=[],D=[],A=[],O=[],m=[],T=[];a.create=d=function(t,o){v.push({data:t,callbackOrHandlers:o})},a.get=s=function(t,o){C.push({idOrParams:t,callbackOrHandlers:o})},a.update=E=function(t,o){D.push({data:t,callbackOrHandlers:o})},a.remove=_=function(t,o){A.push({id:t,callbackOrHandlers:o})},a.find=u=function(t,o){O.push({params:t,callbackOrHandlers:o})},a.count=f=function(t,o){m.push({filter:t,callbackOrHandlers:o})},a.checkIsExists=l=function(t,o){T.push({filter:t,callbackOrHandlers:o})},CONNECT_TO_DB_SERVER.addInitDBFunc(function(o){var g,S=o.collection(t.boxName+"."+c),h=o.collection(t.boxName+"."+c+"__BACKUP"),H=o.collection(t.boxName+"."+c+"__ERROR"),N=function(o){var r=o.method,i=o.data,e=new Date,n={method:r,time:e,data:i};h.insert(n,{w:0}),NODE_CONFIG.isDBLogMode===!0&&console.log("[UPPERCASE.IO-DB] `"+t.boxName+"."+c+"` DATA SAVED:",n)},I=function(o,r){o.time=new Date,H.insert(o,{w:0}),void 0!==r?r(o.errorMsg):console.log("[UPPERCASE.IO-DB] `"+t.boxName+"."+c+"` ERROR:",o)};a.create=d=function(t,o){var r,n;try{t.__IS_ENABLED=!0,t.__RANDOM_KEY=Math.random(),t.createTime=new Date,e(t),void 0!==o&&(CHECK_IS_DATA(o)!==!0?r=o:(r=o.success,n=o.error)),S.insert(t,{safe:!0},function(o,e){var a=e[0];o===TO_DELETE?(N({method:"create",data:a}),i(a),void 0!==r&&r(a)):I({method:"create",data:t,errorMsg:o.toString()},n)})}catch(a){I({method:"create",data:t,errorMsg:a.toString()},n)}},g=function(t,o){var r,e,a,c=t.filter,d=t.sort;try{n(c),CHECK_IS_DATA(o)!==!0?r=o:(r=o.success,e=o.notExists,a=o.error),S.find(c).sort(d).limit(1).toArray(function(o,n){var c;o===TO_DELETE?n!==TO_DELETE&&n.length>0?(c=n[0],i(c),r(c)):void 0!==e&&e():I({method:"get",params:t,errorMsg:o.toString()},a)})}catch(s){I({method:"get",params:t,errorMsg:s.toString()},a)}},a.get=s=function(t,o){var i,e,n,a,c,d,s;void 0===o&&(o=t,t=void 0),CHECK_IS_DATA(o)!==!0?a=o:(a=o.success,c=o.notExists,d=o.error);try{CHECK_IS_DATA(t)===!0?(i=t.filter,e=t.sort,n=t.isRandom):i=void 0!==t?{_id:r(t)}:{},void 0===i&&(i={}),void 0===e&&(e={createTime:-1}),n===!0?(i.__RANDOM_KEY={$gte:s=Math.random()},e.__RANDOM_KEY=1,g({filter:i,sort:e},{error:d,notExists:function(){i.__RANDOM_KEY={$lte:s},g({filter:i,sort:e},o)},success:a})):g({filter:i,sort:e},o)}catch(E){I({method:"get",idOrParams:t,errorMsg:E.toString()},d)}},a.update=E=function(t,o){var e,n,a,c,d=t.id,E=t.$inc,_={};try{e={_id:r(d),__IS_ENABLED:!0},void 0!==o&&(CHECK_IS_DATA(o)!==!0?n=o:(n=o.success,a=o.notExists,c=o.error)),EACH(t,function(o,r){"id"===r||"_id"===r||"__IS_ENABLED"===r||"createTime"===r||"$inc"===r?delete t[r]:o===TO_DELETE&&(_[r]="")}),t.lastUpdateTime=new Date,S.update(e,void 0===E?{$set:t,$unset:_}:{$set:t,$unset:_,$inc:E},{safe:!0},function(o,r){0===r?void 0!==a&&a():o===TO_DELETE?s({filter:e},{error:function(o){I({method:"update",data:t,errorMsg:o},c)},notExists:function(){void 0!==a&&a()},success:function(o){CHECK_IS_EMPTY_DATA(t)!==!0&&N({method:"update",data:o}),i(o),void 0!==n&&n(o)}}):I({method:"update",data:t,errorMsg:o.toString()},c)})}catch(u){I({method:"update",data:t,errorMsg:u.toString()},c)}},a.remove=_=function(t,o){var e,n,a,c;try{e={_id:r(t),__IS_ENABLED:!0},void 0!==o&&(CHECK_IS_DATA(o)!==!0?n=o:(n=o.success,a=o.notExists,c=o.error)),s({filter:e},{error:function(o){I({method:"remove",id:t,errorMsg:o},c)},notExists:function(){void 0!==a&&a()},success:function(o){S.update(e,{$set:{__IS_ENABLED:!1,removeTime:new Date}},{safe:!0},function(r,e){0===e?void 0!==a&&a():r===TO_DELETE?(N({method:"remove",data:o}),i(o),void 0!==n&&n(o)):I({method:"remove",id:t,errorMsg:r.toString()},c)})}})}catch(d){I({method:"remove",id:t,errorMsg:d.toString()},c)}},a.find=u=function(t,o){var r,e,a,c,d,s,E,_;try{void 0===o&&(o=t,t=void 0),void 0!==t&&(r=t.filter,e=t.sort,a=INTEGER(t.start),c=INTEGER(t.count),d=t.isFindAll),CHECK_IS_DATA(o)!==!0?s=o:(s=o.success,E=o.error),void 0===r&&(r={}),void 0===e&&(e={createTime:-1}),void 0===a&&(a=0),d!==!0&&(void 0===c||c>NODE_CONFIG.maxDataCount||isNaN(c)===!0?c=NODE_CONFIG.maxDataCount:1>c&&(c=1)),n(r),_=function(o,r){o===TO_DELETE?(r!==TO_DELETE&&EACH(r,function(t){i(t)}),s(r)):I({method:"find",params:t,errorMsg:o.toString()},E)},d===!0?S.find(r).sort(e).skip(a).toArray(_):S.find(r).sort(e).skip(a).limit(c).toArray(_)}catch(u){I({method:"find",params:t,errorMsg:u.toString()},E)}},a.count=f=function(t,o){var r,i;try{void 0===o&&(o=t,t=void 0),void 0===t&&(t={}),CHECK_IS_DATA(o)!==!0?r=o:(r=o.success,i=o.error),n(t),S.find(t).count(function(o,e){o===TO_DELETE?r(e):I({method:"count",filter:t,errorMsg:o.toString()},i)})}catch(e){I({method:"count",filter:t,errorMsg:e.toString()},i)}},a.checkIsExists=l=function(t,o){var i,e;try{void 0===o&&(o=t,t=void 0),void 0===t?t={}:CHECK_IS_DATA(t)!==!0&&(t={_id:r(t)}),CHECK_IS_DATA(o)!==!0?i=o:(i=o.success,e=o.error),n(t),S.find(t).count(function(o,r){o===TO_DELETE?i(void 0!==r&&r>0):I({method:"checkIsExists",filter:t,errorMsg:o.toString()},e)})}catch(a){I({method:"checkIsExists",filter:t,errorMsg:a.toString()},e)}},EACH(v,function(t){d(t.data,t.callbackOrHandlers)}),v=void 0,EACH(C,function(t){s(t.idOrParams,t.callbackOrHandlers)}),C=void 0,EACH(D,function(t){E(t.data,t.callbackOrHandlers)}),D=void 0,EACH(A,function(t){_(t.id,t.callbackOrHandlers)}),A=void 0,EACH(O,function(t){u(t.params,t.callbackOrHandlers)}),O=void 0,EACH(m,function(t){f(t.filter,t.callbackOrHandlers)}),m=void 0,EACH(T,function(t){l(t.filter,t.callbackOrHandlers)}),T=void 0})}})}),FOR_BOX(function(t){"use strict";t.LOG_DB=CLASS({init:function(o,r,i){var e,n=CONNECT_TO_DB_SERVER.getNativeDB(),a=n.collection(t.boxName+"."+i);r.log=e=function(t){t.time=new Date,a.insert(t,{w:0})}}})}),OVERRIDE(NODE_CONFIG,function(t){global.NODE_CONFIG=NODE_CONFIG=COMBINE([t,{isDBLogMode:!1,maxDataCount:1e3}])});