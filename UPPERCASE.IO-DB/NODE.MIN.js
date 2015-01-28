global.CONNECT_TO_DB_SERVER=METHOD(function(o){var n,i,t=[];return o.addInitDBFunc=i=function(o){void 0===n?t.push(o):o(n)},{run:function(o,i){"use strict";var E=o.username,r=o.password,d=void 0===o.host?"127.0.0.1":o.host,u=void 0===o.port?27017:o.port,c=o.name;require("mongodb").MongoClient.connect("mongodb://"+(void 0!==E&&void 0!==r?E+":"+r+"@":"")+d+":"+u+"/"+c,function(o,E){o!==TO_DELETE?console.log(CONSOLE_RED("[UPPERCASE.IO-DB] CONNECT TO DB SERVER FAILED: "+o.toString())):(n=E,EACH(t,function(o){o(n)}),t=void 0,void 0!==i&&i())})}}});FOR_BOX(function(e){"use strict";var o=require("mongodb").ObjectID;e.DB=CLASS({init:function(t,r,i){var n,a,d,c,s,E,u,_,l,v,m=[],f=[],O=[],A=[],g=[],C=[],T=[],S=[],D=function(e){return VALID.id(e)===!0?new o(e):-1},I=function(e){return void 0!==e._id&&(e.id=e._id.toString()),delete e._id,delete e.__IS_ENABLED,delete e.__RANDOM_KEY,e},H=function(e){EACH(e,function(o,t){void 0===o||o===TO_DELETE?REMOVE({data:e,name:t}):(CHECK_IS_DATA(o)===!0||CHECK_IS_ARRAY(o)===!0)&&H(o)})},h=function(e,o){var t=function(e){void 0!==e.id&&(CHECK_IS_DATA(e.id)===!0?(EACH(e.id,function(o,t){CHECK_IS_DATA(o)===!0||CHECK_IS_ARRAY(o)===!0?EACH(o,function(e,t){o[t]=D(e)}):e.id[t]=D(o)}),e._id=e.id):e._id=D(e.id),delete e.id),o!==!0&&(e.__IS_ENABLED=!0),EACH(e,function(o,t){void 0===o&&delete e[t]})};void 0!==e.$and?EACH(e.$and,function(e){t(e)}):void 0!==e.$or?EACH(e.$or,function(e){t(e)}):t(e)};CHECK_IS_DATA(i)!==!0?n=i:(n=i.name,a=i.isNotUsingHistory),r.create=d=function(e,o){m.push({data:e,callbackOrHandlers:o})},r.get=c=function(e,o){f.push({idOrParams:e,callbackOrHandlers:o})},r.update=s=function(e,o){O.push({data:e,callbackOrHandlers:o})},r.remove=E=function(e,o){A.push({id:e,callbackOrHandlers:o})},r.find=u=function(e,o){g.push({params:e,callbackOrHandlers:o})},r.count=_=function(e,o){C.push({params:e,callbackOrHandlers:o})},r.checkIsExists=l=function(e,o){T.push({params:e,callbackOrHandlers:o})},r.aggregate=v=function(e,o){S.push({params:e,callbackOrHandlers:o})},CONNECT_TO_DB_SERVER.addInitDBFunc(function(o){var t,i=o.collection(e.boxName+"."+n),N=o.collection(e.boxName+"."+n+"__HISTORY"),L=o.collection(e.boxName+"."+n+"__ERROR"),p=function(o,t,r,i){N.findOne({id:t},function(e,n){var a;e===TO_DELETE&&(a={method:o,change:r,time:i},n===TO_DELETE?N.insert({id:t,timeline:[a]},{w:0}):N.update({id:t},{$push:{timeline:a}},{w:0}))}),NODE_CONFIG.isDBLogMode===!0&&console.log("[UPPERCASE.IO-DB] `"+e.boxName+"."+n+"` DATA SAVED:",r)},R=function(o,t){o.time=new Date;try{L.insert(o,{w:0})}catch(r){}void 0!==t?t(o.errorMsg):console.log("[UPPERCASE.IO-DB] `"+e.boxName+"."+n+"` ERROR:",o)};r.create=d=function(e,o){var t,r;try{e.__IS_ENABLED=!0,e.__RANDOM_KEY=Math.random(),e.createTime=new Date,H(e),delete e._id,delete e.id,void 0!==o&&(CHECK_IS_DATA(o)!==!0?t=o:(t=o.success,r=o.error)),i.insert(e,{safe:!0},function(o,i){var n;o===TO_DELETE?(n=i[0],I(n),a!==!0&&p("create",n.id,n,n.createTime),void 0!==t&&t(n)):R({method:"create",data:e,errorMsg:o.toString()},r)})}catch(n){R({method:"create",data:e,errorMsg:n.toString()},r)}},t=function(o,t){var r,a,d,c=o.filter,s=o.sort,E=o.isIncludeRemoved;try{h(c,E),CHECK_IS_DATA(t)!==!0?r=t:(r=t.success,a=t.notExists,d=t.error),i.find(c).sort(s).limit(1).toArray(function(t,i){var s;t===TO_DELETE?i!==TO_DELETE&&i.length>0?(s=i[0],I(s),r(s)):void 0!==a?a():console.log(CONSOLE_YELLOW("[UPPERCASE.IO-DB] `"+e.boxName+"."+n+".get` NOT EXISTS."),c):R({method:"get",params:o,errorMsg:t.toString()},d)})}catch(u){R({method:"get",params:o,errorMsg:u.toString()},d)}},r.get=c=function(e,o){var r,i,n,a,d,c,s,E,u;try{CHECK_IS_DATA(e)!==!0?r=e:(r=e.id,i=e.filter,n=e.sort,a=e.isRandom,d=e.isIncludeRemoved),CHECK_IS_DATA(o)!==!0?c=o:(c=o.success,s=o.notExists,E=o.error),void 0===n&&(n={createTime:-1}),a===!0?(void 0===i&&(i={}),i.__RANDOM_KEY={$gte:u=Math.random()},n.__RANDOM_KEY=1,t({filter:i,sort:n,isIncludeRemoved:d},{error:E,notExists:function(){i.__RANDOM_KEY={$lte:u},t({filter:i,sort:n,isIncludeRemoved:d},o)},success:c})):(void 0===i&&(i={_id:D(r)}),t({filter:i,sort:n,isIncludeRemoved:d},o))}catch(_){R({method:"get",idOrParams:e,errorMsg:_.toString()},E)}},r.update=s=function(o,t){var r,d,s,E,u,_,l,v=o.id,m=o.$inc;try{d={_id:D(v),__IS_ENABLED:!0},void 0!==t&&(CHECK_IS_DATA(t)!==!0?s=t:(s=t.success,E=t.notExists,u=t.error)),EACH(o,function(e,t){"id"===t||"_id"===t||"__IS_ENABLED"===t||"createTime"===t||"$inc"===t?delete o[t]:e===TO_DELETE?(void 0===r&&(r={}),r[t]=""):l=!0}),o.lastUpdateTime=new Date,H(o),_={$set:o},void 0!==r&&(_.$unset=r),void 0!==m&&(_.$inc=m),i.update(d,_,{safe:!0},function(t,i){0===i?void 0!==E?E():console.log(CONSOLE_YELLOW("[UPPERCASE.IO-DB] `"+e.boxName+"."+n+".update` NOT EXISTS."),d):t===TO_DELETE?c({filter:d},{error:function(e){R({method:"update",data:o,errorMsg:e},u)},notExists:function(){void 0!==E?E():console.log(CONSOLE_YELLOW("[UPPERCASE.IO-DB] `"+e.boxName+"."+n+".update` NOT EXISTS."),d)},success:function(e){var t;(void 0===m||l===!0||void 0!==r)&&(t={},l===!0&&EACH(o,function(e,o){t[o]=e}),void 0!==r&&EACH(r,function(e,o){t[o]=TO_DELETE}),a!==!0&&p("update",v,t,e.lastUpdateTime)),I(e),void 0!==s&&s(e)}}):R({method:"update",data:o,errorMsg:t.toString()},u)})}catch(f){R({method:"update",data:o,errorMsg:f.toString()},u)}},r.remove=E=function(o,t){var r,d,s,E;try{r={_id:D(o),__IS_ENABLED:!0},void 0!==t&&(CHECK_IS_DATA(t)!==!0?d=t:(d=t.success,s=t.notExists,E=t.error)),c({filter:r},{error:function(e){R({method:"remove",id:o,errorMsg:e},E)},notExists:function(){void 0!==s?s():console.log(CONSOLE_YELLOW("[UPPERCASE.IO-DB] `"+e.boxName+"."+n+".remove` NOT EXISTS."),r)},success:function(t){var c;i.update(r,{$set:c={__IS_ENABLED:!1,removeTime:new Date}},{safe:!0},function(i,u){0===u?void 0!==s?s():console.log(CONSOLE_YELLOW("[UPPERCASE.IO-DB] `"+e.boxName+"."+n+".remove` NOT EXISTS."),r):i===TO_DELETE?(a!==!0&&p("remove",t.id,{removeTime:c.removeTime},c.removeTime),I(t),void 0!==d&&d(t)):R({method:"remove",id:o,errorMsg:i.toString()},E)})}})}catch(u){R({method:"remove",id:o,errorMsg:u.toString()},E)}},r.find=u=function(e,o){var t,r,n,a,d,c,s,E,u;try{void 0===o&&(o=e,e=void 0),void 0!==e&&(t=e.filter,r=e.sort,n=INTEGER(e.start),a=INTEGER(e.count),d=e.isFindAll,c=e.isIncludeRemoved),CHECK_IS_DATA(o)!==!0?s=o:(s=o.success,E=o.error),void 0===t&&(t={}),void 0===r&&(r={createTime:-1}),void 0===n&&(n=0),d!==!0&&(void 0===a||a>NODE_CONFIG.maxDataCount||isNaN(a)===!0?a=NODE_CONFIG.maxDataCount:1>a&&(a=1)),h(t),u=function(o,t){o===TO_DELETE?(t!==TO_DELETE&&EACH(t,function(e){I(e)}),s(t)):R({method:"find",params:e,errorMsg:o.toString()},E)},d===!0?i.find(t).sort(r).skip(n).toArray(u):i.find(t).sort(r).skip(n).limit(a).toArray(u)}catch(_){R({method:"find",params:e,errorMsg:_.toString()},E)}},r.count=_=function(e,o){var t,r,n,a;try{void 0===o&&(o=e,e=void 0),void 0!==e&&(t=e.filter,r=e.isIncludeRemoved),void 0===o&&(o=t,t=void 0),void 0===t&&(t={}),CHECK_IS_DATA(o)!==!0?n=o:(n=o.success,a=o.error),h(t),i.find(t).count(function(e,o){e===TO_DELETE?n(o):R({method:"count",filter:t,errorMsg:e.toString()},a)})}catch(d){R({method:"count",filter:t,errorMsg:d.toString()},a)}},r.checkIsExists=l=function(e,o){var t,r,n,a;try{void 0===o&&(o=e,e=void 0),void 0!==e&&(t=e.filter,r=e.isIncludeRemoved),void 0===o&&(o=t,t=void 0),void 0===t?t={}:CHECK_IS_DATA(t)!==!0&&(t={_id:D(t)}),CHECK_IS_DATA(o)!==!0?n=o:(n=o.success,a=o.error),h(t),i.find(t).count(function(e,o){e===TO_DELETE?n(void 0!==o&&o>0):R({method:"checkIsExists",filter:t,errorMsg:e.toString()},a)})}catch(d){R({method:"checkIsExists",filter:t,errorMsg:d.toString()},a)}},r.aggregate=v=function(e,o){var t,r;try{CHECK_IS_DATA(o)!==!0?t=o:(t=o.success,r=o.error),i.aggregate(e,function(o,i){o===TO_DELETE?t(i):R({method:"aggregate",params:e,errorMsg:o.toString()},r)})}catch(n){R({method:"aggregate",params:e,errorMsg:n.toString()},r)}},EACH(m,function(e){d(e.data,e.callbackOrHandlers)}),m=void 0,EACH(f,function(e){c(e.idOrParams,e.callbackOrHandlers)}),f=void 0,EACH(O,function(e){s(e.data,e.callbackOrHandlers)}),O=void 0,EACH(A,function(e){E(e.id,e.callbackOrHandlers)}),A=void 0,EACH(g,function(e){u(e.params,e.callbackOrHandlers)}),g=void 0,EACH(C,function(e){_(e.params,e.callbackOrHandlers)}),C=void 0,EACH(T,function(e){l(e.params,e.callbackOrHandlers)}),T=void 0,EACH(S,function(e){v(e.params,e.callbackOrHandlers)}),S=void 0})}})});FOR_BOX(function(n){"use strict";n.LOG_DB=CLASS({init:function(i,t,o){var c,u=[];t.log=c=function(n){u.push(n)},CONNECT_TO_DB_SERVER.addInitDBFunc(function(i){var e=i.collection(n.boxName+"."+o);t.log=c=function(n){n.time=new Date,e.insert(n,{w:0})},EACH(u,function(n){c(n)}),u=void 0})}})});OVERRIDE(NODE_CONFIG,function(O){global.NODE_CONFIG=COMBINE([O,{isDBLogMode:!1,maxDataCount:1e3}])});