var Stac = require('stac').Stac
  , inherits = require('util').inherits
  , setImmediate = setImmediate || process.nextTick;

function Stact (options) {
  var self = this;

  options = options || {};

  if (typeof options === 'function') {
    options = {
      func: options
    };
  }

  this._func = options.func || null;
  this._funcProp = options.funcProp || null;
  this._getFunc = options.getFunc || function getFunc (item) {
    if (typeof self._func === 'function') return self._func;
    if (self._funcProp) return item[self._funcProp];
    return item;
  };

  Stac.call(this, options);
}
inherits(Stact, Stac);

Stact.prototype.run = function () {
  var self = this
    , results = []
    , count = 0
    , args = Array.prototype.slice.call(arguments, 0)
    , cb = args.pop()
    , end = args.length
    , abort = false;

  if (!this.length) return cb();

  function finish (i) {
    return (function runFinish (err, result) {
      if (abort) return;
      if (err) {
        abort = true;
        return cb(err, results);
      }
      results[i] = result;
      if (++count >= self.length) {
        cb(null, results);
      }
    });
  }

  this.forEach(function iterator (item, i) {
    args[end] = finish(i);
    self._getFunc(item).apply(item, args);
  });
};

Stact.prototype.runSeries = function () {
  var self = this
    , items = this.items()
    , results = []
    , args = Array.prototype.slice.call(arguments, 0)
    , cb = args.pop();

  if (!this.length) return cb();

  function run () {
    var item = items.shift()
      , runArgs = args.slice(0);

    if (item) {
      runArgs.push(function runNext (err, result) {
        if (err) return cb(err, results);
        results.push(result);
        if (results.length % 100 === 0) {
          setImmediate(run);
        }
        else {
          run();
        }
      });
      self._getFunc(item).apply(item, runArgs);
    }
    else {
      cb(null, results);
    }
  }

  run();
};

Stact.prototype.runWaterfall = function () {
  var self = this
    , items = this.items()
    , count = 0
    , args = Array.prototype.slice.call(arguments, 0)
    , cb = args.pop();

  if (!this.length) return cb();

  function run () {
    var runArgs = Array.prototype.slice.call(arguments, 0)
      , err = runArgs.shift()
      , item = items.shift();

    if (err) return cb(err);

    if (item) {
      runArgs.push(function runNext () {
        if (++count % 100 === 0) {
          setImmediate.apply(null, [run].concat(Array.prototype.slice.call(arguments, 0)));
        }
        else {
          run.apply(null, arguments);
        }
      });
      self._getFunc(item).apply(item, runArgs);
    }
    else {
      runArgs.unshift(null);
      cb.apply(null, runArgs);
    }
  }

  args.unshift(null);
  run.apply(null, args);
};

module.exports = function (options) {
  return new Stact(options);
};
module.exports.Stact = Stact;
