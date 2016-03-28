var mime = require('mime');
var fs = require('fs');

module.exports = function(assetPath) {
  return function(req, res, next) {
    var acceptEncodingsString = req.get('Accept-Encoding');
    var originalPath = req.path;
    if (typeof acceptEncodingsString != 'undefined') {
      var acceptEncodings = acceptEncodingsString.split(", ");
      try {
        var stats = fs.statSync(`${assetPath}/${req.path}.gz`);

        if (acceptEncodings.indexOf('gzip') >= 0 && stats.isFile()) {
          res.append('Content-Encoding', 'gzip');
          res.setHeader('Vary', 'Accept-Encoding');
          req.url = `${req.url}.gz`;
        }
      } catch(e) {
      }
    }
    next();
    var type = mime.lookup(`${assetPath}/${originalPath}`);
    if (type) {
      var charset = mime.charsets.lookup(type);
      res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
    }
  }
};
