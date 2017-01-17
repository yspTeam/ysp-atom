'use babel';
import fs from 'fs-plus';
import path from 'path';
import FileUtils from './file-utils.js';
import mkdirp from 'mkdirp';

var exec = require('child_process').execSync;

class Template {
  createAndroidProject(projectPath, packageName) {
    if (!FileUtils.isPathValid(projectPath)) {
      return;
    }

    if (!packageName || typeof packageName !== 'string' || packageName.length === 0) {
      return;
    }

    console.log('__dirname',__dirname);
    var templateDir = path.join(__dirname, 'template');
    var templatePath = path.join(__dirname, 'template/demo');
    if (!fs.existsSync(templatePath)) {
      console.log('not exist templatePath', templatePath);
    } else {
      console.log('templatePath exist');
      // 创建android目录
      var projectName = path.basename(projectPath);
      var androidPath = path.join(projectPath, `android`);

      var packagePath = packageName.replace(/\./g, '/');
      console.log('packagePath', packagePath);
      packagePath = path.join(androidPath, 'demo/src/main/java/'+packagePath);

      console.log('androidPath',androidPath);

      if (fs.existsSync(androidPath)) {
        fs.removeSync(androidPath);
      }

      mkdirp.sync(androidPath);

      fs.copySync(templatePath, androidPath);

      var javaPath = path.join(androidPath, 'demo/src/main/java');
      // 在src/main/java下建包名文件夹
      if (!fs.existsSync(packagePath)) {
        mkdirp.sync(packagePath);
      }

      fs.copyFileSync(javaPath+'/DemoMainActivity.java', packagePath+'/DemoMainActivity.java');
      fs.copyFileSync(javaPath+'/PluginEntryPoint.java', packagePath+'/PluginEntryPoint.java');

      fs.removeSync(javaPath+'/DemoMainActivity.java');
      fs.removeSync(javaPath+'/PluginEntryPoint.java');

      fs.moveSync(path.join(androidPath, 'demo'), path.join(androidPath, projectName));

      // 替换包名
      this.replacePackageName(androidPath, projectName, packageName);
    }
  }

  replacePackageName(rootPath, projectName, packageName) {
    if (!FileUtils.isPathValid(rootPath)) {
      return;
    }

    if (!packageName || typeof packageName !== 'string' || packageName.length === 0) {
      return;
    }

    if (!projectName || typeof projectName !== 'string' || projectName.length === 0) {
      return;
    }

    var subFiles = fs.listSync(rootPath);

    if (subFiles && subFiles.length > 0) {
      for (var i = 0; i < subFiles.length; i++) {
          var subFilePath = subFiles[i];

          if (path.basename(subFilePath).startsWith('.')) {
            continue;
          }

          if (fs.isDirectorySync(subFilePath)) {
            this.replacePackageName(subFilePath, projectName, packageName);
          } else if (fs.isFileSync(subFilePath)) {
            var content = fs.readFileSync(subFilePath).toString();

            if (content && content.length > 0) {
              console.log('subFilePath',subFilePath);

              if (content.includes('${package_name}$') || content.includes('${project_name}$')) {
                console.log('replace file', subFilePath);
                content = content.replace(/\${package_name}\$/g, packageName);
                content = content.replace(/\${project_name}\$/g, projectName);

                fs.writeFileSync(subFilePath, content);
              }
            }
          }
        }
      }
  }
}

module.exports = new Template();
