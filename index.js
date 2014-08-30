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
		var minLength = padSize(m[1], m[2]);
		expand_range(obs, +m[1], +m[2], +m[3] || 1, minLength, prefix, suffix);
	}
	else {
		expand_list(obs, parts, prefix, suffix);
	};
	obs.onCompleted();
}
function expand_range(obs, i, j, step, minLength, prefix, suffix) {
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
function padSize(iStr, jStr) {
	var mi;
	mi = /^-?((0)?.*)$/.exec(iStr);
	mj = /^-?((0)?.*)$/.exec(jStr);
	return (mi[2] || mj[2])
		 ? Math.max(mi[1].length, mj[1].length)
		 : 0;
}
function pad(n, minLength) {
	var str = String(Math.abs(n));
	if (str.length < minLength) {
		var zeroString = Math.pow(10, minLength - str.length).toString().substr(1);
		str = zeroString + str;
	}
	if (n < 0) {
		str = '-' + str;
	}
	return str;
}
function expand_list(obs, parts, prefix, suffix) {
	parts.forEach(function(part) {
		obs.onNext(prefix + part + suffix);
	});
}
