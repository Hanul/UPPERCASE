/*
 * 콘솔에 경고 메시지를 출력합니다.
 */
global.SHOW_WARNING = (tag, warningMsg, params) => {
	//REQUIRED: tag
	//REQUIRED: warningMsg
	//OPTIONAL: params

	let cal = CALENDAR();

	console.error(CONSOLE_YELLOW(cal.getYear() + '-' + cal.getMonth(true) + '-' + cal.getDate(true) + ' ' + cal.getHour(true) + ':' + cal.getMinute(true) + ':' + cal.getSecond(true) + ' [' + tag + '] 경고가 발생했습니다. 경고 메시지: ' + warningMsg));

	if (params !== undefined) {
		console.error(CONSOLE_YELLOW('다음은 경고를 발생시킨 파라미터입니다.'));
		console.error(CONSOLE_YELLOW(JSON.stringify(params, TO_DELETE, 4)));
	}
};

FOR_BOX((box) => {

	box.SHOW_WARNING = METHOD({

		run: (tag, warningMsg, params) => {
			//REQUIRED: tag
			//REQUIRED: warningMsg
			//OPTIONAL: params

			SHOW_WARNING(box.boxName + '.' + tag, warningMsg, params);
		}
	});
});