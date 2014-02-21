require('should');
var braceExpand = require('..');
var context = describe;
var _it = it;
it = function(message, pattern, expected) {
	if (!expected) {
		expected = [pattern];
	}
	_it(message, function(done) {
		var result = [];
		braceExpand(pattern).subscribe(
			function(string) { result.push(string) },
			function(err) { done(err) },
			function() {
				result.should.eql(expected);
				done();
			}
		);
	});
};
describe('rxjs-brace-expand', function() {
	context('with no braces', function() {
		it('expands to given string', ''+Math.random());
	})

	describe('{,}', function() {
		it('expands for each string in list', 'A{1,2,3}Z', ['A1Z', 'A2Z', 'A3Z']);
	});

	describe('{..}', function() {
		it('expands for each integer in range', 'A{1..3}Z', ['A1Z', 'A2Z', 'A3Z']);
	});
})
