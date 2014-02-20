require('should');
var braceExpand = require('..');
var context = describe;
describe('rxjs-brace-expand', function() {
	context('with no braces', function() {
		it('expands to given string', function(done) {
			var pattern = ''+Math.random();
			var result = [];
			braceExpand(pattern).subscribe(
				function(string) { result.push(string) },
				function(err) { done(err) },
				function() {
					result.should.eql([pattern]);
					done();
				}
			);
		})
	})

	context('with single pair of braces', function() {
		it('combines parts', function(done) {
			var pattern = 'A{1,2}Z';
			var result = [];
			braceExpand(pattern).subscribe(
				function(string) { result.push(string) },
				function(err) { done(err) },
				function() {
					var expect = ['A1Z', 'A2Z'];
					result.should.eql(expect);
					done();
				}
			);
		})
	})
})
