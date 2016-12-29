'use babel';

import fs from 'fs-plus';
import FileUtils from './file/file-utils';
import path from 'path';

var appUpdated = false;

export default class ProjectConfig {


  static masterAppUpdated(){
      return appUpdated;
  }

  static setMasterAppUpdated(updated){
      appUpdated = updated;
  }

  static masterAppUpdateURL(){
    try {
      var projectConfigPath = path.join(FileUtils.iosProjectPath(),'/project.json')
      var configContent = fs.readFileSync(projectConfigPath);
      var json = JSON.parse(configContent);
      // Console.log('json:'+json);
      return json.masterAppUrl;

    } catch (e) {
      console.log('masterAppUpdateURL err:'+e);
    } finally {
      // return '';
    }
  }
}
