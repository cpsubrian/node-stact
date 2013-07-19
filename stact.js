var Stac = require('stac').Stac
  , inherits = require('util').inherits;

function Stact (options) {
  var self = this;

  options = options || {};

  this._funcProp = options.funcProp || null;
  this._getFunc = options.getFunc || function (item) {
    if (self._funcProp) return item[self._funcProp];
    return item;
  };

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

  this.forEach(function (item) {
    self._getFunc(item).apply(null, args);
  });
};

Stact.prototype.runSeries = function () {
  var self = this
    , stack = this.clone()
    , results = []
    , args = Array.prototype.slice.call(arguments, 0)
    , cb = args.pop();

  function run () {
    var item = stack.shift()
      , runArgs = args.slice(0);

    runArgs.push(function (err, result) {
      if (err) return cb(err, results);
      results.push(result);
      run();
    });

    if (item) {
      self._getFunc(item).apply(null, runArgs);
    }
    else {
      cb(null, results);
    }
  }

  run();
};

module.exports = function (options) {
  return new Stact(options);
};
module.exports.Stact = Stact;
