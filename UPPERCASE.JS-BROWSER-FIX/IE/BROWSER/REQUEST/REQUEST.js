global.REQUEST=REQUEST=METHOD({run:function(t,e){"use strict";var o,s,n,d,i,a=void 0===t.host?BROWSER_CONFIG.host:t.host,r=void 0===t.port?void 0===t.host?BROWSER_CONFIG.port:80:t.port,c=t.isSecure,E=t.method,p=t.uri,u=t.paramStr,v=t.data,R=t.isNotUsingLoadingBar;E=E.toUpperCase(),-1!==p.indexOf("?")&&(u=p.substring(p.indexOf("?")+1)+(void 0===u?"":"&"+u),p=p.substring(0,p.indexOf("?"))),void 0!==v&&(u=(void 0===u?"":u+"&")+"data="+encodeURIComponent(STRINGIFY(t.data))),u=(void 0===u?"":u+"&")+Date.now(),CHECK_IS_DATA(e)!==!0?o=e:(o=e.success,s=e.error),n=(c===!0?"https://":"http://")+a+":"+r+"/"+p,R!==!0&&(d=LOADING_BAR());try{i=new ActiveXObject("Msxml2.XMLHTTP")}catch(S){i=new ActiveXObject("Microsoft.XMLHTTP")}i.onreadystatechange=function(){var e;4===i.readyState&&(200===i.status?o(i.responseText):(e={code:i.status},void 0!==s?s(e):console.log("[UPPERCASE.JS-REQUEST] REQUEST FAILED:",t,e)),void 0!==d&&d.done())},"GET"===E?(i.open(E,n+"?"+u),i.send()):(i.open(E,n),i.setRequestHeader("Content-type","application/x-www-form-urlencoded"),i.send(u))}});