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
		expand_range(obs, +m[1], +m[2], +m[3] || 1, prefix, suffix);
	}
	else {
		expand_list(obs, parts, prefix, suffix);
	};
	obs.onCompleted();
}
function expand_range(obs, i, j, step, prefix, suffix) {
	var count = Math.floor( (j - i) / step );
	if (count < 0) {
		count = -count;
		step = -step;
	}
	count++;
	while (count--) {
		obs.onNext(prefix + i + suffix);
		i += step;
	}
}
function expand_list(obs, parts, prefix, suffix) {
	parts.forEach(function(part) {
		obs.onNext(prefix + part + suffix);
	});
}
