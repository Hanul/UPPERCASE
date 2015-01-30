FOR_BOX(function(o){"use strict";OVERRIDE(o.MODEL,function(){o.MODEL=CLASS({init:function(e,t,i){var r,n,s,a,d,c,u,v,E,f,l,C,O,N,A,I,S,R,_,m,D,g,h,H,L,M,T,x,K,P,p,U,b,k,y,B,V,W,X,F,Y,G,j=i.name,$=i.initData,q=i.methodConfig,w=i.isNotUsingObjectId,z=i.isNotUsingHistory,J=[],Q=[],Z=[],oe=[],ee=[],te=[],ie=[],re=[],ne=[],se=[],ae=o.DB({name:j,isNotUsingObjectId:w,isNotUsingHistory:z});void 0!==q&&(r=q.create,n=q.get,s=q.update,a=q.remove,d=q.find,c=q.count,u=q.checkIsExists,void 0!==r&&(v=r.valid,f=r.role,m=r.authKey,S=r.adminRole),void 0!==n&&(l=n.role),void 0!==s&&(E=s.valid,C=s.role,D=s.authKey,R=s.adminRole),void 0!==a&&(O=a.role,g=a.authKey,_=a.adminRole),void 0!==d&&(N=d.role),void 0!==c&&(A=c.role),void 0!==u&&(I=u.role)),void 0!==CPU_CLUSTERING.getWorkerId()&&1!==CPU_CLUSTERING.getWorkerId()||void 0===$||RUN(function(){var o=[];EACH($,function(e,t){var i={};i[t]=TO_DELETE,o.push(i)}),ae.find({filter:{$or:o},isFindAll:!0},EACH(function(o){console.log(o),EACH($,function(e,t){void 0===o[t]&&(o[t]=e)}),ae.update(o)}))}),t.getName=h=function(){return j},e.getInitData=H=function(){return $},e.getCreateValid=L=function(){return v},e.getUpdateValid=M=function(){return E},t.getDB=T=function(){return ae},e.on=x=function(o,e){"create"===o?(void 0!==e.before&&J.push(e.before),void 0!==e.after&&Q.push(e.after)):"get"===o?Z.push(e):"update"===o?(void 0!==e.before&&oe.push(e.before),void 0!==e.after&&ee.push(e.after)):"remove"===o?(void 0!==e.before&&te.push(e.before),void 0!==e.after&&ie.push(e.after)):"find"===o?re.push(e):"count"===o?ne.push(e):"checkIsExists"===o&&se.push(e)},K=function(e,t,i){var r,n;void 0!==$&&EACH($,function(o,t){e[t]=o}),void 0!==v&&(r=v.check(e)),void 0!==r&&r.checkHasError()===!0?t({validErrors:r.getErrors()}):NEXT([function(o){EACH(J,function(r){var s=r(e,t,o,i);n!==!0&&s===!1&&(n=!0)}),n!==!0&&o()},function(){return function(){ae.create(e,{error:function(o){t({errorMsg:o})},success:function(e){EACH(Q,function(o){o(e,i)}),o.BROADCAST({roomName:j+"/create",methodName:"create",data:e}),EACH(e,function(t,i){o.BROADCAST({roomName:j+"/"+i+"/"+t+"/create",methodName:"create",data:e})}),t({savedData:e})}})}}])},P=function(o,e,t){var i,r,n,s,a;CHECK_IS_DATA(o)!==!0?i=o:(i=o.id,r=o.filter,n=o.sort,s=o.isRandom),ae.get({id:i,filter:r,sort:n,isRandom:s},{error:function(o){e({errorMsg:o})},notExists:function(){e()},success:function(o){EACH(Z,function(i){var r=i(o,e,t);a!==!0&&r===!1&&(a=!0)}),a!==!0&&e({savedData:o})}})},p=function(e,t,i){var r,n,s=e.id;void 0!==E&&(r=E.checkExceptUndefined(e)),e.id=s,void 0!==r&&r.checkHasError()===!0?t({validErrors:r.getErrors()}):NEXT([function(o){EACH(oe,function(r){var s=r(e,t,o,i);n!==!0&&s===!1&&(n=!0)}),n!==!0&&o()},function(){return function(){ae.update(e,{error:function(o){t({errorMsg:o})},notExists:function(){t()},success:function(e){void 0!==e&&(EACH(ee,function(o){o(e,i)}),o.BROADCAST({roomName:j+"/"+e.id,methodName:"update",data:e}),EACH(e,function(t,i){o.BROADCAST({roomName:j+"/"+i+"/"+t+"/update",methodName:"update",data:e})})),t({savedData:e})}})}}])},U=function(e,t,i){var r;NEXT([function(o){EACH(te,function(n){var s=n(e,t,o,i);r!==!0&&s===!1&&(r=!0)}),r!==!0&&o()},function(){return function(){ae.remove(e,{error:function(o){t({errorMsg:o})},notExists:function(){t()},success:function(e){void 0!==e&&(EACH(ie,function(o){o(e,i)}),o.BROADCAST({roomName:j+"/"+e.id,methodName:"remove",data:e}),EACH(e,function(t,i){o.BROADCAST({roomName:j+"/"+i+"/"+t+"/remove",methodName:"remove",data:e})})),t({savedData:e})}})}}])},b=function(o,e,t){var i,r,n,s,a,d;void 0!==o&&(i=o.filter,r=o.sort,n=INTEGER(o.start),s=INTEGER(o.count),a=o.isFindAll),ae.find({filter:i,sort:r,start:n,count:s,isFindAll:a},{error:function(o){e({errorMsg:o})},success:function(o){EACH(re,function(i){var r=i(o,e,t);d!==!0&&r===!1&&(d=!0)}),d!==!0&&e({savedDataSet:o})}})},k=function(o,e,t){var i,r;void 0!==o&&(i=o.filter),ae.count({filter:i},{error:function(o){e({errorMsg:o})},success:function(o){EACH(ne,function(i){var n=i(o,e,t);r!==!0&&n===!1&&(r=!0)}),r!==!0&&e({count:o})}})},y=function(o,e,t){var i,r;void 0!==o&&(i=o.filter),ae.checkIsExists({filter:i},{error:function(o){e({errorMsg:o})},success:function(o){EACH(se,function(){var i=se(o,e,t);r!==!0&&i===!1&&(r=!0)}),r!==!0&&e({isExists:o})}})},t.create=B=function(e,t){var i,r,n;void 0!==t&&(CHECK_IS_DATA(t)!==!0?i=t:(i=t.success,r=t.notValid,n=t.error)),K(e,function(e){var t,s,a;void 0!==e?(t=e.errorMsg,s=e.validErrors,a=e.savedData,void 0!==t?void 0!==n?n(t):console.log(CONSOLE_RED("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+j+"/create` ERROR: "+t)):void 0!==s?void 0!==r?r(s):console.log(CONSOLE_YELLOW("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+j+"/create` NOT VALID."),s):void 0!==i&&i(a)):void 0!==i&&i()})},t.get=V=function(e,t){var i,r,n;CHECK_IS_DATA(t)!==!0?i=t:(i=t.success,r=t.notExists,n=t.error),P(e,function(t){var s,a;void 0!==t&&(s=t.errorMsg,a=t.savedData),void 0!==s?void 0!==n?n(s):console.log(CONSOLE_RED("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+j+"/get` ERROR: "+s)):void 0===a?void 0!==r?r():console.log(CONSOLE_YELLOW("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+j+"/get` NOT EXISTS."),e):i(a)})},t.update=W=function(e,t){var i,r,n,s;void 0!==t&&(CHECK_IS_DATA(t)!==!0?i=t:(i=t.success,r=t.notExists,n=t.notValid,s=t.error)),p(e,function(t){var a,d,c;void 0!==t&&(a=t.errorMsg,d=t.validErrors,c=t.savedData),void 0!==a?void 0!==s?s(a):console.log(CONSOLE_RED("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+j+"/update` ERROR: "+a)):void 0!==d?void 0!==n?n(d):console.log(CONSOLE_YELLOW("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+j+"/update` NOT VALID."),d):void 0===c?void 0!==r?r():console.log(CONSOLE_YELLOW("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+j+"/update` NOT EXISTS."),e):void 0!==i&&i(c)})},w!==!0&&(t.remove=X=function(e,t){var i,r,n;void 0!==t&&(CHECK_IS_DATA(t)!==!0?i=t:(i=t.success,r=t.notExists,n=t.error)),U(e,function(t){var s,a;void 0!==t&&(s=t.errorMsg,a=t.savedData),void 0!==s?void 0!==n?n(s):console.log(CONSOLE_RED("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+j+"/remove` ERROR: "+s)):void 0===a?void 0!==r?r():console.log(CONSOLE_YELLOW("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+j+"/remove` NOT EXISTS."),e):void 0!==i&&i(a)})}),t.find=F=function(e,t){var i,r;void 0===t&&(t=e,e=void 0),void 0!==t&&(CHECK_IS_DATA(t)!==!0?i=t:(i=t.success,r=t.error)),b(e,function(e){var t=e.errorMsg,n=e.savedDataSet;void 0!==t?void 0!==r?r(t):console.log(CONSOLE_RED("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+j+"/find` ERROR: "+t)):i(n)})},t.count=Y=function(e,t){var i,r;void 0===t&&(t=e,e=void 0),void 0!==t&&(CHECK_IS_DATA(t)!==!0?i=t:(i=t.success,r=t.error)),k(e,function(e){var t=e.errorMsg,n=e.count;void 0!==t?void 0!==r?r(t):console.log(CONSOLE_RED("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+j+"/count` ERROR: "+t)):i(n)})},t.checkIsExists=G=function(e,t){var i,r;void 0===t&&(t=e,e=void 0),void 0!==t&&(CHECK_IS_DATA(t)!==!0?i=t:(i=t.success,r=t.error)),y(e,function(e){var t=e.errorMsg,n=e.isExists;void 0!==t?void 0!==r?r(t):console.log(CONSOLE_RED("[UPPERCASE.IO-MODEL] `"+o.boxName+"."+j+"/checkIsExists` ERROR: "+t)):i(n)})},o.ROOM(j,function(o,e){r!==!1&&e("create",function(e,t){void 0!==S?void 0===f||void 0!==o.roles&&CHECK_IS_IN({data:o.roles,value:S})===!0?K(e,t,o):t({isNotAuthed:!0}):void 0===f||void 0!==o.roles&&CHECK_IS_IN({data:o.roles,value:f})===!0?(void 0!==m&&(e[m]=o.authKey),K(e,t,o)):t({isNotAuthed:!0})}),n!==!1&&e("get",function(e,t){void 0===l||void 0!==o.roles&&CHECK_IS_IN({data:o.roles,value:l})===!0?P(e,t,o):t({isNotAuthed:!0})}),s!==!1&&e("update",function(e,t){void 0===C||void 0!==o.roles&&(CHECK_IS_IN({data:o.roles,value:C})===!0||CHECK_IS_IN({data:o.roles,value:R})===!0)?void 0!==D&&(void 0!==o.roles&&CHECK_IS_IN({data:o.roles,value:R})===!0)!=!0?ae.get(e.id,{error:function(o){t({errorMsg:o})},notExists:function(){t()},success:function(i){i[D]===o.authKey?(e[D]=o.authKey,p(e,t,o)):t({isNotAuthed:!0})}}):p(e,t,o):t({isNotAuthed:!0})}),a!==!1&&w!==!0&&e("remove",function(e,t){void 0===O||void 0!==o.roles&&(CHECK_IS_IN({data:o.roles,value:O})===!0||CHECK_IS_IN({data:o.roles,value:_})===!0)?void 0!==g&&(void 0!==o.roles&&CHECK_IS_IN({data:o.roles,value:_})===!0)!=!0?ae.get(e,{error:function(o){t({errorMsg:o})},notExists:function(){t()},success:function(i){i[g]===o.authKey?U(e,t,o):t({isNotAuthed:!0})}}):void 0===g&&void 0!==_?void 0!==o.roles&&CHECK_IS_IN({data:o.roles,value:_})===!0?U(e,t,o):t({isNotAuthed:!0}):U(e,t,o):t({isNotAuthed:!0})}),d!==!1&&e("find",function(e,t){void 0===N||void 0!==o.roles&&CHECK_IS_IN({data:o.roles,value:N})===!0?(void 0!==e&&delete e.isFindAll,b(e,t,o)):t({isNotAuthed:!0})}),c!==!1&&e("count",function(e,t){void 0===A||void 0!==o.roles&&CHECK_IS_IN({data:o.roles,value:A})===!0?k(e,t,o):t({isNotAuthed:!0})}),u!==!1&&e("checkIsExists",function(e,t){void 0===I||void 0!==o.roles&&CHECK_IS_IN({data:o.roles,value:I})===!0?y(e,t,o):t({isNotAuthed:!0})})})}})})});