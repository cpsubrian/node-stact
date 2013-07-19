var Stact = require('../');

describe('basic test', function () {
  var stack, func;

  beforeEach(function () {
    stack = new Stact();
    results = [];
  });

  func = function (letter, cb) {
    // Make it async.
    setTimeout(function () {
      cb(null, letter);
    }, Math.random() * 10);
  };

  it('can run functions in parallel', function (done) {
    stack.add(func.bind(null, 'A'));
    stack.add(func.bind(null, 'B'));
    stack.add(func.bind(null, 'C'));

    stack.run(function (err, results) {
      assert.ifError(err);
      assert.equal(results.length, 3);
      done();
    });
  });

  it('can run functions in series', function (done) {
    stack.add(func.bind(null, 'B'));
    stack.add(func.bind(null, 'C'));
    stack.add(func.bind(null, 'D'));
    stack.first(func.bind(null, 'A'));

    stack.runSeries(function (err, results) {
      assert.ifError(err);
      assert.equal(results.length, 4);
      assert.equal(results[0], 'A');
      assert.equal(results[3], 'D');
      done();
    });
  });

  it('stops running if it hits an error', function (done) {
    stack.add(func.bind(null, 'A'));
    stack.add(func.bind(null, 'B'));
    stack.add(function (cb) {
      setTimeout(function () {
        cb(new Error('this is an error'));
      }, 30);
    });
    stack.add(func.bind(null, 'C'));
    stack.add(func.bind(null, 'D'));

    stack.runSeries(function (err, results) {
      assert(err);
      assert.equal(results.length, 2);
      done();
    });
  });

  it('can run function in parallel with arbitrary arguments', function (done) {
    stack.add(func);
    stack.add(func);
    stack.add(func);

    stack.run('A', function (err, results) {
      assert.ifError(err);
      assert.deepEqual(results, ['A', 'A', 'A']);
      done();
    });
  });

  it('can run function in series with arbitrary arguments', function (done) {
    stack.add(func);
    stack.add(func);
    stack.add(func);

    stack.runSeries('A', function (err, results) {
      assert.ifError(err);
      assert.deepEqual(results, ['A', 'A', 'A']);
      done();
    });
  });
});