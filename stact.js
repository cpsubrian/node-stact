var Stac = require('stac')
  , inherits = require('util').inherits;

function Stact (options) {
  Stac.call(this, options);
}
inherits(Stact, Stac);

Stact.prototype.run = function (cb) {
  var self = this, results = [];

  function end(err, result) {
    if (err) return cb(err, results);
    results.push(result);
    if (results.length >= self.length) {
      cb(null, results);
    }
  }

  this.forEach(function (func) {
    func(end);
  });
};

Stact.prototype.runSeries = function (cb) {
  var self = this, results = [];
  function next () {
    var func = self.shift();
    if (func) {
      func(function (err, result) {
        if (err) return cb(err, results);
        results.push(result);
        next();
      });
    }
    else {
      cb(null, results);
    }
  }
  next();
};

module.exports = Stact;