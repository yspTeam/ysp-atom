import fs from 'fs-plus';
import mkdirp from 'mkdirp';
import touch from 'touch';
import path from 'path';

export default {
  createDir(filePath) {
    if (!this.isPathValid(filePath)) {
      return false;
    }

    try {
      mkdirp.sync(filePath);
      return true;
    } catch (error) {
      this.showError(error);
      return false;
    }

    return true;
  }

  createFile(filePath) {
    if (!this.isPathValid(filePath)) {
      return false;
    }

    var dir = path.dirname(filePath);

    if (!fs.existSync(dir) || !fs.statSync(dir)) {
      mkdirp.sync(dir);
    }

    touch(filePath);

    return true;
  }

  createFileAndWriteData(filePath, text) {
    if (!this.isPathValid(filePath)) {
      return false;
    }

    fs.writeFileSync(filePath, text);
    return true;
  }

  isPathValid(pathToCheck) {
    return (pathToCheck != null) && typeof pathToCheck === 'string' && pathToCheck.length > 0;
  }
}
