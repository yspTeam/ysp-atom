// Generated by CoffeeScript 1.12.0
(function() {
  var path;

  path = require("path");

  module.exports = {
    repoForPath: function(goalPath) {
      var i, j, len, projectPath, ref;
      ref = atom.project.getPaths();
      for (i = j = 0, len = ref.length; j < len; i = ++j) {
        projectPath = ref[i];
        if (goalPath === projectPath || goalPath.indexOf(projectPath + path.sep) === 0) {
          return atom.project.getRepositories()[i];
        }
      }
      return null;
    },
    getStyleObject: function(el) {
      var camelizedAttr, property, styleObject, styleProperties, value;
      styleProperties = window.getComputedStyle(el);
      styleObject = {};
      for (property in styleProperties) {
        value = styleProperties.getPropertyValue(property);
        camelizedAttr = property.replace(/\-([a-z])/g, function(a, b) {
          return b.toUpperCase();
        });
        styleObject[camelizedAttr] = value;
      }
      return styleObject;
    },
    getFullExtension: function(filePath) {
      var extension, fullExtension;
      fullExtension = '';
      while (extension = path.extname(filePath)) {
        fullExtension = extension + fullExtension;
        filePath = path.basename(filePath, extension);
      }
      return fullExtension;
    },
    rootPath: function() {
      var pathList, rootPath;
      pathList = atom.project.getPaths();
      if (pathList.length > 0) {
        rootPath = pathList[0];
        return rootPath;
      }
    }
  };

}).call(this);
