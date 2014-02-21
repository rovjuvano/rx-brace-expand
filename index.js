var Rx = require('rx');
module.exports = function(string) {
	var m;
	if (m = /^(.*)\{(.*)\}(.*)$/.exec(string)) {
		var prefix = m[1];
		var parts = m[2].split(',');
		var suffix = m[3];
		var obs = new Rx.Subject();
		Rx.Scheduler.timeout.schedule(function() {
			if (parts.length === 1 && (m = /^(-?\d+)\.\.(-?\d+)(?:\.\.(\d+))?$/.exec(parts[0]))) {
				var i = +m[1];
				var j = +m[2];
				var step = +m[3] || 1;
				if (i < j) {
					while (i<=j) {
						obs.onNext(prefix + i + suffix);
						i += step;
					}
				}
				else  {
					while (i>=j) {
						obs.onNext(prefix + i + suffix);
						i -= step;
					}
				}
			}
			else {
				parts.forEach(function(part) {
					obs.onNext(prefix + part + suffix);
				});
			};
			obs.onCompleted();
		});
		return obs;
	}
	return Rx.Observable.return(string);
};