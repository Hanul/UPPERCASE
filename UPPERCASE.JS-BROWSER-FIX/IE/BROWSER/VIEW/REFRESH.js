OVERRIDE(REFRESH,function(){"use strict";global.REFRESH=REFRESH=METHOD({run:function(){var E=location.hash;EVENT_ONCE({name:"hashchange"},function(){DELAY(function(){location.href=""===E?"#":E})}),location.href="#__REFRESING"}})});