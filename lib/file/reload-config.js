'use babel';
import path from 'path';
import fs from 'fs-plus';
import FileUtils from './file-utils';
import {Directory, File} from 'atom';

export default class ReloadConfig {
  constructor() {
    this.resConfig = {};

    // 监听res文件夹
    this.listenResDirChange(this.resPath());
  }

  rootPath() {
    var pathList = atom.project.getPaths();
    if (pathList.length > 0) {
      var rootPath = pathList[0];
      return rootPath;
    }

    return null;
  }

  resPath() {
    var rootPath = this.rootPath();
    if (FileUtils.isPathValid(rootPath)) {
      return path.join(rootPath, 'res');
    }

    return null
  }

  reloadConfig() {
    this.resConfig = {};

    var resPath = this.resPath();

    // 生成res配置
    this.generateConfig(resPath);

    // 写入config
    this.writeConfig();
  }

  listenResDirChange(resDir) {
    if (!FileUtils.isPathValid(resDir)) {
      return;
    }

    if (!fs.existsSync(resDir)) {
      return;
    }

    if (fs.isDirectorySync(resDir)) {
      var dir = new Directory(resDir);
      console.log('listen dir', resDir);

      var that = this;
      dir.onDidChange(function() {
        that.reloadConfig();
      });

      var subFiles = fs.listSync(resDir);

      if (subFiles && subFiles.length > 0) {
        for (var i = 0; i < subFiles.length; i++) {
            var subFilePath = subFiles[i];
            this.listenResDirChange(subFilePath);
          }
        }
    }
  }

  generateConfig(filePath) {
    if (!FileUtils.isPathValid(filePath)) {
      return;
    }

    if (fs.existsSync(filePath)) {
      var subFiles = fs.listSync(filePath);

      if (subFiles && subFiles.length > 0) {
        for (var i = 0; i < subFiles.length; i++) {
            var subFilePath = subFiles[i];
            // dir
            if (fs.isDirectorySync(subFilePath)) {
              this.generateConfig(subFilePath);
            } else if (fs.isFileSync(subFilePath)) {
              // file
              var basename = path.basename(subFilePath);

              if (basename.startsWith('.')) {
                continue;
              }

              var extension = path.extname(subFilePath);
              var fileName = basename;

              if (extension && extension.length > 0) {
                fileName = basename.substr(0, basename.lastIndexOf('.'));
              }

              if (fileName && fileName.length > 0) {
                // relativePath
                var relativePath = subFilePath.replace(this.rootPath(),'');
                var relativeDir = path.dirname(relativePath);

                var dict = {};

                if (extension === '.png') {
                  // remove @2x @3x
                  if (fileName.endsWith('@2x')) {
                    fileName = fileName.replace('@2x','');
                    dict["scale"] = true;
                  } else if (fileName.endsWith('@3x')) {
                    fileName = fileName.replace('@3x','');
                    dict["scale"] = true;
                  } else {
                    dict["scale"] = false;
                  }
                } else {
                  dict["scale"] = false;
                }

                relativePath = path.join(relativeDir, fileName + extension);

                // 加上extension
                dict["path"] = relativePath;
                this.resConfig[fileName] = dict;
              }
            }
          }
        }
      }
    }

    writeConfig() {
      if (this.resConfig) {
        var configPath = path.join(this.rootPath(), 'config.json');
        if (!fs.existsSync(configPath)) {
          console.log('config.json not exist');
          return;
        }

        try {
          var configContent = fs.readFileSync(configPath);
          var configString = configContent.toString();
          var config = {};

          if (!configString || configString.length == 0 || typeof configString !== 'string') {
            config = {};
          } else {
            try {
              config = JSON.parse(configString);
            } catch (e) {
              console.log(e);
            }
          }

          // 更新res
          config["resourceList"] = this.resConfig;
          try {
            jsonString = JSON.stringify(config);
            try {
              var res = fs.writeFileSync(configPath, jsonString);
              console.log('write success',res);
            } catch (e) {
              console.log(e);
            }
          } catch (e) {
            console.log(e);
          }
        } catch (e) {
          console.log(e);
        }
      }
    }
}
