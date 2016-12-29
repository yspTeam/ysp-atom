'use babel';

import fs from 'fs-plus';
import FileUtils from './file/file-utils';
import path from 'path';

export default class ProjectConfig {


  static masterAppUpdated(){
    var updated = atom.config.get('ysp.masterAppUpdated');
    if (updated == 1) {
      return true;
    }else{
      return false;
    }
  }

  static setMasterAppUpdated(updated){
    var value;
    if (updated == true) {
      value = 1;
    }else{
      value = 0;
    }
    
    atom.config.set('ysp.masterAppUpdated',value);

  }

  static masterAppUpdateURL(){
    try {
      var projectConfigPath = path.join(FileUtils.rootPath(),'project.json')
      var configContent = fs.readFileSync(projectConfigPath);
      var json = JSON.parse(configContent);

      return json.masterAppUrl;

    } catch (e) {
      console.log('masterAppUpdateURL err:'+e);
    } finally {
//
    }
  }
}
