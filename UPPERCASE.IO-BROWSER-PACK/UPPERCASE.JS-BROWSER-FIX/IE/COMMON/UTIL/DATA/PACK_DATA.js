OVERRIDE(PACK_DATA,function(){"use strict";global.PACK_DATA=PACK_DATA=METHOD({run:function(A){var n=function(A){var t=COPY(A),_=[];return EACH(t,function(A,C){A instanceof Date==!0?(t[C]=parseInt(A.getTime()),_.push(C)):CHECK_IS_DATA(A)===!0?t[C]=n(A):CHECK_IS_ARRAY(A)===!0&&EACH(A,function(t,_){CHECK_IS_DATA(t)===!0&&(A[_]=n(t))})}),t.__DATE_ATTR_NAMES=_,t};return n(A)}})});