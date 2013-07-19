var Stac = require('stac')
  , inherits = require('util').inherits;

function Stact (options) {
  Stac.call(this, options);
}
inherits(Stact, Stac);

Stact.prototype.run = function () {
  var self = this
    , results = []
    , args = Array.prototype.slice.call(arguments, 0)
    , cb = args.pop();

  function end(err, result) {
    if (err) return cb(err, results);
    results.push(result);
    if (results.length >= self.length) {
      cb(null, results);
    }
  }

  args.push(end);

  this.forEach(function (func) {
    func.apply(null, args);
  });
};

Stact.prototype.runSeries = function () {
  var self = this
    , results = []
    , args = Array.prototype.slice.call(arguments, 0)
    , cb = args.pop();

  function run () {
    var func = self.shift()
      , runArgs = args.slice(0);

    runArgs.push(function (err, result) {
      if (err) return cb(err, results);
      results.push(result);
      run();
    });

    if (func) {
      func.apply(null, runArgs);
    }
    else {
      cb(null, results);
    }
  }

  run();
};

module.exports = Stact;