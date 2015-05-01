FOR_BOX(function(o){"use strict";o.MODEL=CLASS({init:function(t,e,n){var i,r,c,d,u,v,a,s,E,O,A,f,C,R,l,N,g,m,h,D,x,I,M,S,P,T,H,U,L=n.name,p=n.initData,_=n.methodConfig,b=(n.isNotUsingObjectId,o.ROOM(L));void 0!==_&&(i=_.create,r=_.get,c=_.update,d=_.remove,u=_.find,v=_.count,a=_.checkIsExists,void 0!==i&&(s=i.valid),void 0!==c&&(E=c.valid)),e.getName=O=function(){return L},e.getInitData=A=function(){return p},e.getCreateValid=f=function(){return s},e.getUpdateValid=C=function(){return E},e.getRoom=R=function(){return b},i!==!1&&(e.create=l=function(t,e){var n,i,r,c,d;void 0!==e&&(CHECK_IS_DATA(e)!==!0?n=e:(n=e.success,i=e.notValid,r=e.notAuthed,c=e.error)),void 0!==p&&EACH(p,function(o,e){t[e]=o}),void 0!==s&&(d=s.check(t)),void 0!==d&&d.checkHasError()===!0?void 0!==i?i(d.getErrors()):console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+L+"/create` NOT VALID!: ",d.getErrors()):b.send({methodName:"create",data:t},function(t){var e,d,u,v;void 0!==t?(e=t.errorMsg,d=t.validErrors,u=t.isNotAuthed,v=t.savedData,void 0!==e?void 0!==c?c(e):console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+L+"/create` ERROR: "+e):void 0!==d?void 0!==i?i(d):console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+L+"/create` NOT VALID!: ",d):u===!0?void 0!==r?r():console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+L+"/create` NOT AUTHED!"):void 0!==n&&n(v)):void 0!==n&&n()})}),r!==!1&&(e.get=N=function(t,e){var n,i,r,c;CHECK_IS_DATA(e)!==!0?n=e:(n=e.success,i=e.notExists,r=e.notAuthed,c=e.error),b.send({methodName:"get",data:t},function(t){var e,d,u;void 0!==t&&(e=t.errorMsg,d=t.isNotAuthed,u=t.savedData),void 0!==e?void 0!==c?c(e):console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+L+"/get` ERROR: "+e):d===!0?void 0!==r?r():console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+L+"/get` NOT AUTHED!"):void 0===u?void 0!==i?i():console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+L+"/get` NOT EXISTS!"):void 0!==n&&n(u)})},e.getWatching=g=function(t,n){var i,r,c,d,u,v;return CHECK_IS_DATA(n)!==!0?i=n:(i=n.success,r=n.notExists,c=n.notAuthed,d=n.error),e.get(t,{success:function(t){var e;u!==!0&&void 0!==i&&(v=o.ROOM(L+"/"+t.id),i(t,function(o){v.on("update",o)},function(o){v.on("remove",function(t){o(t),e()})},e=function(){void 0!==v&&(v.exit(),v=void 0)}))},notExists:r,notAuthed:c,error:d}),OBJECT({init:function(o,t){var e;t.exit=e=function(){void 0!==v&&v.exit(),u=!0}}})}),c!==!1&&(e.update=m=function(t,e){var n,i,r,c,d,u,v,a,s,O,A=t.id,f=t.$inc,C=t.$push,R=t.$pull;void 0!==e&&(CHECK_IS_DATA(e)!==!0?n=e:(n=e.success,i=e.notValid,r=e.notExists,c=e.notAuthed,d=e.error)),void 0!==E&&(u=E.checkForUpdate(t),void 0!==f&&(v=E.checkForUpdate(f)),void 0!==C&&(a=E.checkForUpdate(RUN(function(){var o={};return EACH(C,function(t,e){o[e]=[t]}),o}))),void 0!==R&&(s=E.checkForUpdate(RUN(function(){var o={};return EACH(R,function(t,e){o[e]=[t]}),o})))),t.id=A,t.$inc=f,t.$push=C,t.$pull=R,void 0!==E&&(u.checkHasError()===!0||void 0!==v&&v.checkHasError()===!0||void 0!==a&&a.checkHasError()===!0||void 0!==s&&s.checkHasError()===!0)?(O=COMBINE([u.getErrors(),void 0===v?{}:v.getErrors(),void 0===a?{}:a.getErrors(),void 0===s?{}:s.getErrors()]),void 0!==i?i(O):console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+L+"/update` NOT VALID!: ",O)):b.send({methodName:"update",data:t},function(t){var e,u,v,a,s;void 0!==t&&(e=t.errorMsg,u=t.validErrors,v=t.isNotAuthed,a=t.savedData,s=t.originData),void 0!==e?void 0!==d?d(e):console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+L+"/update` ERROR: "+e):void 0!==u?void 0!==i?i(u):console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+L+"/update` NOT VALID!: ",u):v===!0?void 0!==c?c():console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+L+"/update` NOT AUTHED!"):void 0===a?void 0!==r?r():console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+L+"/update` NOT EXISTS!"):void 0!==n&&n(a,s)})}),d!==!1&&(e.remove=h=function(t,e){var n,i,r,c;void 0!==e&&(CHECK_IS_DATA(e)!==!0?n=e:(n=e.success,i=e.notExists,r=e.notAuthed,c=e.error)),b.send({methodName:"remove",data:t},function(t){var e,d,u;void 0!==t&&(e=t.errorMsg,d=t.isNotAuthed,u=t.originData),void 0!==e?void 0!==c?c(e):console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+L+"/remove` ERROR: "+e):d===!0?void 0!==r?r():console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+L+"/remove` NOT AUTHED!"):void 0===u?void 0!==i?i():console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+L+"/remove` NOT EXISTS!"):void 0!==n&&n(u)})}),u!==!1&&(e.find=D=function(t,e){var n,i,r;void 0===e&&(e=t,t=void 0),CHECK_IS_DATA(e)!==!0?n=e:(n=e.success,i=e.notAuthed,r=e.error),b.send({methodName:"find",data:t},function(t){var e=t.errorMsg,c=t.isNotAuthed,d=t.savedDataSet;void 0!==e?void 0!==r?r(e):console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+L+"/find` ERROR: "+e):c===!0?void 0!==i?i():console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+L+"/find` NOT AUTHED!"):void 0!==n&&n(d)})},e.findWatching=x=function(t,n){var i,r,c,d,u={};return void 0===n&&(n=t,t=void 0),CHECK_IS_DATA(n)!==!0?i=n:(i=n.success,r=n.notAuthed,c=n.error),e.find(t,{success:function(t){var e;d!==!0&&void 0!==i&&(EACH(t,function(t){var e=t.id;u[e]=o.ROOM(L+"/"+e)}),i(t,function(o,t){u[o].on("update",t)},function(o,t){u[o].on("remove",function(n){t(n),e(o)})},e=function(o){void 0!==u[o]&&(u[o].exit(),delete u[o])}))},notAuthed:r,error:c}),OBJECT({init:function(o,t){var e;t.exit=e=function(){EACH(u,function(o){o.exit()}),d=!0}}})}),v!==!1&&(e.count=I=function(t,e){var n,i,r;void 0===e&&(e=t,t=void 0),CHECK_IS_DATA(e)!==!0?n=e:(n=e.success,i=e.notAuthed,r=e.error),b.send({methodName:"count",data:t},function(t){var e=t.errorMsg,c=t.isNotAuthed,d=t.count;void 0!==e?void 0!==r?r(e):console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+L+"/count` ERROR: "+e):c===!0?void 0!==i?i():console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+L+"/count` NOT AUTHED!"):void 0!==n&&n(d)})}),a!==!1&&(e.checkIsExists=M=function(t,e){var n,i,r;void 0===e&&(e=t,t=void 0),CHECK_IS_DATA(e)!==!0?n=e:(n=e.success,i=e.notAuthed,r=e.error),b.send({methodName:"checkIsExists",data:t},function(t){var e=t.errorMsg,c=t.isNotAuthed,d=t.isExists;void 0!==e?void 0!==r?r(e):console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+L+"/checkIsExists` ERROR: "+e):c===!0?void 0!==i?i():console.log("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+L+"/checkIsExists` NOT AUTHED!"):void 0!==n&&n(d)})}),e.onNew=S=function(t,e){var n;return void 0===e?(e=t,(n=o.ROOM(L+"/create")).on("create",e)):void 0===t?(n=o.ROOM(L+"/create")).on("create",e):EACH(t,function(i,r){return(n=o.ROOM(L+"/"+r+"/"+i+"/create")).on("create",function(o){EACH(t,function(t,e){return o[e]!==t?!1:void 0})===!0&&e(o)}),!1}),OBJECT({init:function(o,t){var e;t.exit=e=function(){void 0!==n&&n.exit()}}})},e.onNewWatching=P=function(t,e){var n,i=[],r=function(t){var n,r,c=t.id;i.push(n=o.ROOM(L+"/"+c)),e(t,function(o){n.on("update",o)},function(o){n.on("remove",function(t){o(t),r()})},r=function(){n.exit(),REMOVE({array:i,value:n})})};return void 0===e?(e=t,(n=o.ROOM(L+"/create")).on("create",function(o){r(o)})):void 0===t?(n=o.ROOM(L+"/create")).on("create",function(o){r(o)}):EACH(t,function(e,i){return(n=o.ROOM(L+"/"+i+"/"+e+"/create")).on("create",function(o){EACH(t,function(t,e){return o[e]!==t?!1:void 0})===!0&&r(o)}),!1}),OBJECT({init:function(o,t){var e;t.exit=e=function(){void 0!==n&&n.exit(),EACH(i,function(o){o.exit()})}}})},u!==!1&&(e.onNewAndFind=T=function(o,t){var e,n,i,r,c,d,u,v,a;return void 0===t&&(t=o,o=void 0),void 0!==o&&(e=o.properties,n=o.filter,i=o.sort,r=o.start,c=o.count),CHECK_IS_DATA(t)!==!0?u=t:(u=t.success,v=t.notAuthed,a=t.error),void 0!==n||void 0!==i||void 0!==r&&0!==r||(d=S(e,u)),D({filter:COMBINE([e,n]),sort:i,start:r,count:c},{success:REVERSE_EACH(u),notAuthed:v,error:a}),OBJECT({init:function(o,t){var e;t.exit=e=function(){void 0!==d&&d.exit()}}})},e.onNewAndFindWatching=H=function(o,t){var e,n,i,r,c,d,u,v,a,s;return void 0===t&&(t=o,o=void 0),void 0!==o&&(e=o.properties,n=o.filter,i=o.sort,r=o.start,c=o.count),CHECK_IS_DATA(t)!==!0?v=t:(v=t.success,a=t.notAuthed,s=t.error),void 0!==n||void 0!==i||void 0!==r&&0!==r||(d=P(e,v)),u=x({filter:COMBINE([e,n]),sort:i,start:r,count:c},{success:function(o,t,e){REVERSE_EACH(o,function(o){v(o,function(e){t(o.id,e)},function(t){e(o.id,t)})})},notAuthed:a,error:s}),OBJECT({init:function(o,t){var e;t.exit=e=function(){void 0!==d&&d.exit(),u.exit()}}})}),e.onRemove=U=function(t,e){var n;return void 0===e?(e=t,(n=o.ROOM(L+"/remove")).on("remove",e)):EACH(t,function(i,r){return(n=o.ROOM(L+"/"+r+"/"+i+"/remove")).on("remove",function(o){EACH(t,function(t,e){return o[e]!==t?!1:void 0})===!0&&e(o)}),!1}),OBJECT({init:function(o,t){var e;t.exit=e=function(){void 0!==n&&n.exit()}}})}}})});