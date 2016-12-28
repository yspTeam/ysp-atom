'use babel';
import path from 'path';
import fs from 'fs-plus';
import FileUtils from './file-utils';
import {Directory} from 'atom';

export default class ReloadConfig {
  constructor() {
    this.resConfig = {};
    this.listenDirs = [];

    // 监听res文件夹
    if (this.resPath() == null) {
      console.log('begin delay reloadConfig');
      var that = this;

      var interval = setInterval(function() {
        if (that.resPath() != null) {
          clearInterval(interval);
          console.log('reloadConfig clearInterval');
          that.reloadConfig();
        } else {
          console.log('Interval running');
        }
      }, 1000);

    } else {
      console.log('reloadConfig', this.resPath());
      this.listenResDirChange(this.resPath());
    }
  }

  destroy() {
    this.resConfig = {};
    this.listenDirs = [];
  }

  resPath() {
    var iosProjectPath = FileUtils.iosProjectPath();
    if (FileUtils.isPathValid(iosProjectPath)) {
      return path.join(iosProjectPath, 'res');
    }

    return null
  }

  // 刷新配置
  reloadConfig() {
    this.resConfig = {};

    var resPath = this.resPath();

    // 监听res文件夹，新增的文件夹需要加监听
    this.listenResDirChange(resPath);

    // 生成res配置
    this.generateConfig(resPath);

    // 写入config
    this.writeConfig();
  }

  // 监听文件夹变化
  listenResDirChange(resDir) {
    if (!FileUtils.isPathValid(resDir)) {
      return;
    }

    if (!fs.existsSync(resDir)) {
      return;
    }

    if (fs.isDirectorySync(resDir)) {
      if (!this.listenDirs.includes(resDir)) {
        this.listenDirs.push(resDir);

        var dir = new Directory(resDir);
        console.log('listen dir', resDir);

        var that = this;
        dir.onDidChange(function() {
          that.reloadConfig();
        });
      }

      var subFiles = fs.listSync(resDir);

      if (subFiles && subFiles.length > 0) {
        for (var i = 0; i < subFiles.length; i++) {
            var subFilePath = subFiles[i];
            this.listenResDirChange(subFilePath);
          }
        }
    }
  }

  // 生成配置
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
              if (basename === 'resConfig.json') {
                continue;
              }
              if (basename.startsWith('.')) {
                continue;
              }

              var extension = path.extname(subFilePath);
              var fileName = basename;

              if (fileName && fileName.length > 0) {
                fileName = basename.substr(0, basename.lastIndexOf('.'));

                // relativePath
                var relativePath = subFilePath.replace(FileUtils.iosProjectPath(),'');
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

                relativePath = path.join(relativeDir, fileName+extension);

                // 加上extension
                dict["path"] = relativePath;
                this.resConfig[fileName] = dict;
              }
            }
          }
        }
      }
    }

    // 写入配置
    writeConfig() {
      if (this.resConfig) {
        var configPath = path.join(FileUtils.iosProjectPath(), '/res/resConfig.json');
        if (!fs.existsSync(configPath)) {
          console.log('resConfig.json not exist');
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
            console.log(jsonString);
            try {
              var res = fs.writeFileSync(configPath, jsonString);
              console.log('write success');
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
