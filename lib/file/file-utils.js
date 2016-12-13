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
}
