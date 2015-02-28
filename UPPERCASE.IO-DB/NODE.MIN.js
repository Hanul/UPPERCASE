global.CONNECT_TO_DB_SERVER=METHOD(function(o){var n,i,t=[];return o.addInitDBFunc=i=function(o){void 0===n?t.push(o):o(n)},{run:function(o,i){"use strict";var E=o.username,r=o.password,d=void 0===o.host?"127.0.0.1":o.host,u=void 0===o.port?27017:o.port,c=o.name;require("mongodb").MongoClient.connect("mongodb://"+(void 0!==E&&void 0!==r?E+":"+r+"@":"")+d+":"+u+"/"+c,function(o,E){o!==TO_DELETE?console.log(CONSOLE_RED("[UPPERCASE.IO-DB] CONNECT TO DB SERVER FAILED: "+o.toString())):(n=E,EACH(t,function(o){o(n)}),t=void 0,void 0!==i&&i())})}}});FOR_BOX(function(t){"use strict";var r=require("mongodb").ObjectID,e=require("sift");t.DB=CLASS({init:function(o,i,n){var a,c,d,s,u,E,f,l,v,A,_,S,m,C,O=[],T=[],g=[],H=[],I=[],h=[],D=[],p=[],R=[],N=[],L=[],x=function(t){return c===!0?t:VALID.id(t)===!0?new r(t):-1},M=function(t){void 0!==t._id&&(t.id=t._id.toString()),delete t._id,delete t.__RANDOM_KEY},b=function(t){EACH(t,function(r,e){void 0===r||r===TO_DELETE?REMOVE({data:t,name:e}):(CHECK_IS_DATA(r)===!0||CHECK_IS_ARRAY(r)===!0)&&b(r)})},k=function(t){var r=function(t){void 0!==t.id&&(CHECK_IS_DATA(t.id)===!0?(EACH(t.id,function(r,e){CHECK_IS_DATA(r)===!0||CHECK_IS_ARRAY(r)===!0?EACH(r,function(t,e){r[e]=x(t)}):t.id[e]=x(r)}),t._id=t.id):t._id=x(t.id),delete t.id),EACH(t,function(r,e){void 0===r&&delete t[e]})};void 0!==t.$and?EACH(t.$and,function(t){r(t)}):void 0!==t.$or?EACH(t.$or,function(t){r(t)}):r(t)},K=function(t){var e={},o=function(t,e){void 0!==e._id&&(e._id instanceof r==!0?t.id=e._id.toString():CHECK_IS_DATA(e.id)===!0?(t.id={},EACH(e._id,function(r,e){CHECK_IS_DATA(r)===!0?(t.id[e]={},EACH(r,function(r,o){t.id[e][o]=r.toString()})):CHECK_IS_ARRAY(r)===!0?(t.id[e]=[],EACH(r,function(r){t.id[e].push(r.toString())})):t.id[e]=r.toString()})):t.id=e._id),EACH(e,function(r,e){"_id"!==e&&(t[e]=r)})};return void 0!==t.$and?(e.$and=[],EACH(t.$and,function(t){var r={};e.$and.push(r),o(r,t)})):void 0!==t.$or?(e.$or=[],EACH(t.$or,function(t){var r={};e.$or.push(r),o(r,t)})):o(e,t),e};CHECK_IS_DATA(n)!==!0?a=n:(a=n.name,c=n.isNotUsingObjectId,d=n.isNotUsingHistory),i.create=s=function(t,r){O.push({data:t,callbackOrHandlers:r})},i.get=u=function(t,r){T.push({idOrParams:t,callbackOrHandlers:r})},i.update=E=function(t,r){g.push({data:t,callbackOrHandlers:r})},c!==!0&&(i.remove=f=function(t,r){H.push({id:t,callbackOrHandlers:r})}),i.find=l=function(t,r){I.push({params:t,callbackOrHandlers:r})},i.count=v=function(t,r){h.push({params:t,callbackOrHandlers:r})},i.checkIsExists=A=function(t,r){D.push({params:t,callbackOrHandlers:r})},i.aggregate=_=function(t,r){p.push({params:t,callbackOrHandlers:r})},i.createIndex=S=function(t,r){R.push({keys:t,callbackOrHandlers:r})},i.removeIndex=m=function(t,r){N.push({index:t,callbackOrHandlers:r})},i.findAllIndexes=C=function(t){L.push({callbackOrHandlers:t})},CONNECT_TO_DB_SERVER.addInitDBFunc(function(r){var o,n=r.collection(t.boxName+"."+a),L=r.collection(t.boxName+"."+a+"__HISTORY"),P=r.collection(t.boxName+"."+a+"__ERROR"),Y=t.SHARED_STORE("cachedGetStore"),y=t.SHARED_STORE("cachedFindStore"),$=t.SHARED_STORE("cachedCountStore"),F=function(r,e,o,i){L.findOne({_id:e},function(t,n){var a;t===TO_DELETE&&(a={method:r,time:i},void 0!==o&&(a.change=o),n===TO_DELETE?L.insert({_id:e,timeline:[a]},{w:0}):L.update({_id:e},{$push:{timeline:a}},{w:0}))}),NODE_CONFIG.isDBLogMode===!0&&("remove"===r?console.log("[UPPERCASE.IO-DB] `"+t.boxName+"."+a+"` DATA("+e+") REMOVED."):console.log("[UPPERCASE.IO-DB] `"+t.boxName+"."+a+"` DATA("+e+") SAVED:",o))},B=function(r,e){r.time=new Date;try{P.insert(r,{w:0})}catch(o){}void 0!==e?e(r.errorMsg):console.log(CONSOLE_RED("[UPPERCASE.IO-DB] `"+t.boxName+"."+a+"` ERROR:"),r)},G=function(t,r,e,o){PARALLEL([function(r){PARALLEL(t,[function(t,r){var e=t.paramsStr;u(PARSE_STR(e),{notExists:function(){Y.remove(e),r()},error:function(){Y.remove(e),r()},success:function(o){Y.save({name:e,value:{filter:t.filter,data:o}}),r()}})},function(){r()}])},function(t){PARALLEL(r,[function(t,r){var e=t.paramsStr;l(PARSE_STR(e),{error:function(){y.remove(e),r()},success:function(o){y.save({name:e,value:{filter:t.filter,dataSet:o}}),r()}})},function(){t()}])},function(t){PARALLEL(e,[function(t,r){var e=t.paramsStr;v(PARSE_STR(e),{error:function(){$.remove(e),r()},success:function(o){$.save({name:e,value:{filter:t.filter,count:o}}),r()}})},function(){t()}])},function(){o()}])},U=function(t,r){var o=[],i=[],n=[];EACH(Y.list(),function(r,i){var n=r.filter;e(n)(t)===!0&&o.push({filter:n,paramsStr:i})}),EACH(y.list(),function(r,o){var n=r.filter;e(n)(t)===!0&&i.push({filter:n,paramsStr:o})}),EACH($.list(),function(r,o){var i=r.filter;e(i)(t)===!0&&n.push({filter:i,paramsStr:o})}),G(o,i,n,r)},w=function(t,r,o){var i=[],n=[],a=[];EACH(Y.list(),function(o,n){var a=o.filter;(e(a)(t)===!0||e(a)(r)===!0)&&i.push({filter:a,paramsStr:n})}),EACH(y.list(),function(o,i){var a=o.filter;(e(a)(t)===!0||e(a)(r)===!0)&&n.push({filter:a,paramsStr:i})}),EACH($.list(),function(o,i){var n=o.filter;(e(n)(t)===!0||e(n)(r)===!0)&&a.push({filter:n,paramsStr:i})}),G(i,n,a,o)};i.create=s=function(t,r){var e,o;try{t.__RANDOM_KEY=Math.random(),t.createTime=new Date,b(t),delete t._id,c===!0&&(t._id=t.id),delete t.id,void 0!==r&&(CHECK_IS_DATA(r)!==!0?e=r:(e=r.success,o=r.error)),n.insert(t,{safe:!0},function(r,i){var n;r===TO_DELETE?(n=i[0],M(n),d!==!0&&F("create",n.id,n,n.createTime),U(n,function(){void 0!==e&&e(n)})):B({method:"create",data:t,errorMsg:r.toString()},o)})}catch(i){B({method:"create",data:t,errorMsg:i.toString()},o)}},o=function(r,e){var o,i,c,d,s,u=r.filter,E=r.sort,f=r.isToCache;try{k(u),CHECK_IS_DATA(e)!==!0?o=e:(o=e.success,i=e.notExists,c=e.error),f===!0&&(d=K(u),s=Y.get(STRINGIFY({filter:d,sort:E}))),void 0!==s?o(s.data):n.find(u).sort(E).limit(1).toArray(function(e,n){var s;e===TO_DELETE?n.length>0?(s=n[0],M(s),f===!0&&Y.save({name:STRINGIFY({filter:d,sort:E}),value:{filter:d,data:s}}),o(s)):void 0!==i?i():console.log(CONSOLE_YELLOW("[UPPERCASE.IO-DB] `"+t.boxName+"."+a+".get` NOT EXISTS."),u):B({method:"get",params:r,errorMsg:e.toString()},c)})}catch(l){B({method:"get",params:r,errorMsg:l.toString()},c)}},i.get=u=function(t,r){var e,i,n,a,c,d,s,u,E;try{CHECK_IS_DATA(t)!==!0?e=t:(e=t.id,i=t.filter,n=t.sort,a=t.isRandom,c=t.isToCache),CHECK_IS_DATA(r)!==!0?d=r:(d=r.success,s=r.notExists,u=r.error),void 0===n&&(n={createTime:-1}),a===!0?(void 0===i&&(i={}),i.__RANDOM_KEY={$gte:E=Math.random()},n.__RANDOM_KEY=1,o({filter:i,sort:n},{error:u,notExists:function(){i.__RANDOM_KEY={$lte:E},o({filter:i,sort:n},r)},success:d})):(void 0===i&&(i={_id:x(e)}),o({filter:i,sort:n,isToCache:c},r))}catch(f){B({method:"get",idOrParams:t,errorMsg:f.toString()},u)}},i.update=E=function(r,e){var o,i,c,s,E,f,l,v=r.id,A=r.$inc;try{i={_id:x(v)},void 0!==e&&(CHECK_IS_DATA(e)!==!0?c=e:(c=e.success,s=e.notExists,E=e.error)),EACH(r,function(t,e){"id"===e||"_id"===e||"createTime"===e||"$inc"===e?delete r[e]:t===TO_DELETE?(void 0===o&&(o={}),o[e]=""):l=!0}),r.lastUpdateTime=new Date,b(r),f={$set:r},void 0!==o&&(f.$unset=o),void 0!==A&&(f.$inc=A),u({filter:i},{error:function(t){B({method:"update",data:r,errorMsg:t},E)},notExists:function(){void 0!==s?s():console.log(CONSOLE_YELLOW("[UPPERCASE.IO-DB] `"+t.boxName+"."+a+".update` NOT EXISTS."),i)},success:function(e){n.update(i,f,{safe:!0},function(n,f){0===f?void 0!==s?s():console.log(CONSOLE_YELLOW("[UPPERCASE.IO-DB] `"+t.boxName+"."+a+".update` NOT EXISTS."),i):n===TO_DELETE?u({filter:i},{error:function(t){B({method:"update",data:r,errorMsg:t},E)},notExists:function(){void 0!==s?s():console.log(CONSOLE_YELLOW("[UPPERCASE.IO-DB] `"+t.boxName+"."+a+".update` NOT EXISTS."),i)},success:function(t){var i;(void 0===A||l===!0||void 0!==o)&&(i={},l===!0&&EACH(r,function(t,r){i[r]=t}),void 0!==o&&EACH(o,function(t,r){i[r]=TO_DELETE}),d!==!0&&F("update",v,i,t.lastUpdateTime)),w(e,t,function(){void 0!==c&&c(t,e)})}}):B({method:"update",data:r,errorMsg:n.toString()},E)})}})}catch(_){B({method:"update",data:r,errorMsg:_.toString()},E)}},c!==!0&&(i.remove=f=function(r,e){var o,i,c,s;try{o={_id:x(r)},void 0!==e&&(CHECK_IS_DATA(e)!==!0?i=e:(i=e.success,c=e.notExists,s=e.error)),u({filter:o},{error:function(t){B({method:"remove",id:r,errorMsg:t},s)},notExists:function(){void 0!==c?c():console.log(CONSOLE_YELLOW("[UPPERCASE.IO-DB] `"+t.boxName+"."+a+".remove` NOT EXISTS."),o)},success:function(e){n.remove(o,{safe:!0},function(n,u){0===u?void 0!==c?c():console.log(CONSOLE_YELLOW("[UPPERCASE.IO-DB] `"+t.boxName+"."+a+".remove` NOT EXISTS."),o):n===TO_DELETE?(d!==!0&&F("remove",r,void 0,new Date),U(e,function(){void 0!==i&&i(e)})):B({method:"remove",id:r,errorMsg:n.toString()},s)})}})}catch(E){B({method:"remove",id:r,errorMsg:E.toString()},s)}}),i.find=l=function(t,r){var e,o,i,a,c,d,s,u,E,f,l;try{void 0===r&&(r=t,t=void 0),void 0!==t&&(e=t.filter,o=t.sort,i=INTEGER(t.start),a=INTEGER(t.count),c=t.isFindAll,d=t.isToCache),CHECK_IS_DATA(r)!==!0?s=r:(s=r.success,u=r.error),void 0===e&&(e={}),void 0===o&&(o={createTime:-1}),(void 0===i||0>i)&&(i=0),c!==!0&&(void 0===a||a>NODE_CONFIG.maxDataCount||isNaN(a)===!0?a=NODE_CONFIG.maxDataCount:1>a&&(a=1)),k(e),d===!0&&(E=K(e),f=y.get(STRINGIFY({filter:E,sort:o,start:i,count:a,isFindAll:c}))),void 0!==f?s(f.dataSet):(l=function(r,e){r===TO_DELETE?(EACH(e,function(t){M(t)}),d===!0&&y.save({name:STRINGIFY({filter:E,sort:o,start:i,count:a,isFindAll:c}),value:{filter:E,dataSet:e}}),s(e)):B({method:"find",params:t,errorMsg:r.toString()},u)},c===!0?n.find(e).sort(o).skip(i).toArray(l):n.find(e).sort(o).skip(i).limit(a).toArray(l))}catch(v){B({method:"find",params:t,errorMsg:v.toString()},u)}},i.count=v=function(t,r){var e,o,i,a,c,d;try{void 0===r&&(r=t,t=void 0),void 0!==t&&(e=t.filter,o=t.isToCache),void 0===r&&(r=e,e=void 0),void 0===e&&(e={}),CHECK_IS_DATA(r)!==!0?i=r:(i=r.success,a=r.error),k(e),o===!0&&(c=K(e),d=$.get(STRINGIFY({filter:c}))),void 0!==d?i(d.count):n.find(e).count(function(t,r){t===TO_DELETE?(o===!0&&$.save({name:STRINGIFY({filter:c}),value:{filter:c,count:r}}),i(r)):B({method:"count",filter:e,errorMsg:t.toString()},a)})}catch(s){B({method:"count",filter:e,errorMsg:s.toString()},a)}},i.checkIsExists=A=function(t,r){var e,o,i,a,c,d,s;try{void 0===r&&(r=t,t=void 0),void 0!==t&&(e=t.filter,o=t.isToCache),void 0===r&&(r=e,e=void 0),void 0===e?e={}:CHECK_IS_DATA(e)!==!0&&(e={_id:x(e)}),CHECK_IS_DATA(r)!==!0?i=r:(i=r.success,a=r.error),k(e),o===!0&&(c=K(e),d=$.get(STRINGIFY({filter:c}))),void 0!==d?(s=d.count,i(void 0!==s&&s>0)):n.find(e).count(function(t,r){t===TO_DELETE?(o===!0&&$.save({name:STRINGIFY({filter:c}),value:{filter:c,count:r}}),i(void 0!==r&&r>0)):B({method:"checkIsExists",filter:e,errorMsg:t.toString()},a)})}catch(u){B({method:"checkIsExists",filter:e,errorMsg:u.toString()},a)}},i.aggregate=_=function(t,r){var e,o;try{CHECK_IS_DATA(r)!==!0?e=r:(e=r.success,o=r.error),n.aggregate(t,function(r,i){r===TO_DELETE?e(i):B({method:"aggregate",params:t,errorMsg:r.toString()},o)})}catch(i){B({method:"aggregate",params:t,errorMsg:i.toString()},o)}},i.createIndex=S=function(t,r){var e,o;try{void 0!==r&&(CHECK_IS_DATA(r)!==!0?e=r:(e=r.success,o=r.error)),n.ensureIndex(t,{safe:!0},function(r){r===TO_DELETE?void 0!==e&&e():B({method:"createIndex",keys:t,errorMsg:r.toString()},o)})}catch(i){B({method:"createIndex",keys:t,errorMsg:i.toString()},o)}},i.removeIndex=m=function(t,r){var e,o;try{void 0!==r&&(CHECK_IS_DATA(r)!==!0?e=r:(e=r.success,o=r.error)),n.dropIndex(t,{safe:!0},function(r){r===TO_DELETE?void 0!==e&&e():B({method:"removeIndex",index:t,errorMsg:r.toString()},o)})}catch(i){B({method:"removeIndex",index:t,errorMsg:i.toString()},o)}},i.findAllIndexes=C=function(t){var r,e;try{CHECK_IS_DATA(t)!==!0?r=t:(r=t.success,e=t.error),n.indexInformation(function(t,o){var i;t===TO_DELETE?(i=[],EACH(o,function(t){var r={};EACH(t,function(t){r[t[0]]=t[1]}),i.push(r)}),r(i)):B({method:"findAllIndexes",errorMsg:t.toString()},e)})}catch(o){B({method:"findAllIndexes",errorMsg:o.toString()},e)}},EACH(O,function(t){s(t.data,t.callbackOrHandlers)}),O=void 0,EACH(T,function(t){u(t.idOrParams,t.callbackOrHandlers)}),T=void 0,EACH(g,function(t){E(t.data,t.callbackOrHandlers)}),g=void 0,EACH(H,function(t){f(t.id,t.callbackOrHandlers)}),H=void 0,EACH(I,function(t){l(t.params,t.callbackOrHandlers)}),I=void 0,EACH(h,function(t){v(t.params,t.callbackOrHandlers)}),h=void 0,EACH(D,function(t){A(t.params,t.callbackOrHandlers)}),D=void 0,EACH(p,function(t){_(t.params,t.callbackOrHandlers)}),p=void 0,EACH(R,function(t){S(t.keys,t.callbackOrHandlers)}),R=void 0,EACH(N,function(t){m(t.index,t.callbackOrHandlers)}),N=void 0})}})});FOR_BOX(function(n){"use strict";n.LOG_DB=CLASS({init:function(i,t,o){var c,u=[];t.log=c=function(n){u.push(n)},CONNECT_TO_DB_SERVER.addInitDBFunc(function(i){var e=i.collection(n.boxName+"."+o);t.log=c=function(n){n.time=new Date,e.insert(n,{w:0})},EACH(u,function(n){c(n)}),u=void 0})}})});OVERRIDE(NODE_CONFIG,function(O){global.NODE_CONFIG=COMBINE([O,{isDBLogMode:!1,maxDataCount:1e3}])});