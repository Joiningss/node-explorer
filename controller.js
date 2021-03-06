var colors = require('colors');
var fs = require('fs');
var path = require('path');
var _ = require('lodash');

function getFiles(req, res, dir) {
  var currentDir =  dir;
  var query = req.query.path || '';
  var up = req.query.up;

  if (query) {
    currentDir = path.resolve(dir, query);
  }

  if (up) {
    currentDir = query;
  }

  console.log('Browsing: '.green, currentDir.cyan);

  fs.readdir(currentDir, function (err, files) {
    if (err) {
      throw err;
    }

    var data = [];

    files.filter(function (file) {
      console.log(file);
      return file != '.DS_Store';
    })
      .forEach(function (file) {
        try {
          data.push({
            name: file,
            isDirectory: fs.statSync(path.join(currentDir, file)).isDirectory(),
            path:  path.relative(dir,path.join(query, file)),
            ext: path.extname(file)
          });
        }
        catch(e) {
          console.log('Error: ' + e);
        }

      });
    data = _.sortBy(data, function(f) { return f.Name; });
    data.push(currentDir);
    data.push(dir);
    res.json(data);
  });
}

module.exports.getFiles = getFiles;