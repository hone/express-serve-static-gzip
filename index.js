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
          res.setHeader('Cache-Control', 'public, max-age=512000');
          req.url = `${req.url}.gz`;

          var type = mime.lookup(`${assetPath}/${originalPath}`);
          if (typeof type != 'undefined') {
            var charset = mime.charsets.lookup(type);
            res.setHeader('Content-Type', type + (charset ? '; charset=' + charset : ''));
          }
        }
      } catch(e) {
      }
    }
    next();
  }
};
