var Rx = require('rx');
module.exports = function(string) {
	var m;
	if (m = /^(.*)\{(.*)\}(.*)$/.exec(string)) {
		var prefix = m[1];
		var parts = m[2].split(',');
		var suffix = m[3];
		var obs = new Rx.Subject();
		Rx.Scheduler.timeout.schedule(function() {
			expand(obs, parts, prefix, suffix);
		});
		return obs;
	}
	return Rx.Observable.return(string);
};
function expand(obs, parts, prefix, suffix) {
	var m;
	if (parts.length === 1 && (m = /^(-?\d+)\.\.(-?\d+)(?:\.\.-?(\d+))?$/.exec(parts[0]))) {
		expand_range(obs, m[1], m[2], +m[3] || 1, prefix, suffix);
	}
	else {
		expand_list(obs, parts, prefix, suffix);
	};
	obs.onCompleted();
}
function expand_range(obs, iStr, jStr, step, prefix, suffix) {
	var i = +iStr;
	var j = +jStr;
	var minLength = 0;
	if (iStr.charAt(0) === "0" || jStr.charAt(0) === "0") {
		minLength = Math.max(iStr.length, jStr.length);
	}
	var count = Math.floor( (j - i) / step );
	if (count < 0) {
		count = -count;
		step = -step;
	}
	count++;
	while (count--) {
		obs.onNext(prefix + pad(i, minLength) + suffix);
		i += step;
	}
}
function pad(n, minLength) {
	var nStr = String(n);
	if (nStr.length < minLength) {
		var zeroString = Math.pow(10, minLength - nStr.length).toString().substr(1);
		nStr = zeroString + nStr;
	}
	return nStr;
}
function expand_list(obs, parts, prefix, suffix) {
	parts.forEach(function(part) {
		obs.onNext(prefix + part + suffix);
	});
}
