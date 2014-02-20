var Rx = require('rx');
module.exports = function(string) {
	var m;
	if (m = /^(.*)\{(.*)\}(.*)$/.exec(string)) {
		var prefix = m[1];
		var parts = m[2].split(',');
		var suffix = m[3];
		var obs = new Rx.Subject();
		Rx.Scheduler.timeout.schedule(function() {
			parts.forEach(function(part) {
				obs.onNext(prefix + part + suffix);
			});
			obs.onCompleted();
		});
		return obs;
	}
	return Rx.Observable.return(string);
};