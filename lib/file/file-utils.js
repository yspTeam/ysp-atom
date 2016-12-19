'use babel';

import fs from 'fs-plus';
import mkdirp from 'mkdirp';
import touch from 'touch';
import path from 'path';

export default class FileUtils {

  static createDir(filePath) {
    var resolvedPath = fs.resolveHome(filePath);
    if (!this.isPathValid(resolvedPath)) {
      return false;
    }

    if (fs.existsSync(resolvedPath)) {
      return true;
    }

    mkdirp.sync(resolvedPath);

    return true;
  }

  static createFile(filePath) {
    return this.createFileAndWriteData(filePath,'');
  }

  static createFileAndWriteData(filePath, text) {
    var resolvedPath = fs.resolveHome(filePath);

    if (!this.isPathValid(resolvedPath)) {
      return false;
    }

    fs.writeFileSync(resolvedPath, text);
    return true;
  }

  static isPathValid(pathToCheck) {
    return (pathToCheck != null) && typeof pathToCheck === 'string' && pathToCheck.length > 0;
  }

  static resolvedPath(filePath) {
    var resolvedPath = fs.resolveHome(filePath);
    return resolvedPath;
  }

  static rootPath() {
    var pathList = atom.project.getPaths();
    if (pathList.length > 0) {
      var rootPath = pathList[0];
      return rootPath;
    }

    return null;
  }

  static iosProjectPath() {
    var pathList = atom.project.getPaths();
    if (pathList.length > 0) {
      var rootPath = pathList[0];
      return path.join(rootPath, 'ios');
    }

    return null;
  }

  static getTreeViewSelectedPath() {
    if (atom.packages.isPackageLoaded('tree-view') === true) {
      treeView = atom.packages.getLoadedPackage('tree-view');
      treeView = require(treeView.mainModulePath);
      packageObj = treeView.serialize();
    }
    if (typeof packageObj !== 'undefined' && packageObj !== null) {
      if (packageObj.selectedPath) {
        return packageObj.selectedPath;
      }
    }

    return null;
  }

  static fileNameWithoutExt(filePath) {
    if (!this.isPathValid(filePath)) {
      return null;
    }

    var basename = path.basename(filePath);
    var extension = path.extname(filePath);
    var fileName = basename;

    if (extension && extension.length > 0) {
      fileName = basename.substr(0, basename.lastIndexOf('.'));
    }

    return fileName;
  }
}
