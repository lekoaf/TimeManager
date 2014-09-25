var moment = require('moment');
exports.months = function(month, time){
	if (month == 'this'){
		console.log('this');
		var data = [];

		for (var i = 0; i < time.length; i++){
			var dbMonth = time[i].date.split("-");
			var nowMonth = moment().format('YYYY-MM-DD').split("-");
			if (dbMonth[0] == nowMonth[0] && dbMonth[1] == nowMonth[1]){
				data.push(time[i]);
			}
		}
		return data;
	}

	if (month == 'last'){
		console.log('last');
		var data = [];

		var beginningOfLastMonth = moment().subtract(1,'months').date(1).hour(0).minute(0).second(0);
		var endOfLastMonth = beginningOfLastMonth.clone().add(1,'months');

		for (var i=0; i<time.length; i++){
			var someDate = moment(time[i].date);
			if (someDate.isAfter(beginningOfLastMonth) && someDate.isBefore(endOfLastMonth)){
				data.push(time[i]);
			}
		}
		return data;
	}
}