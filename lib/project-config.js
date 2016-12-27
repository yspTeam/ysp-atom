'use babel';

var appUpdated = false;

export default class ProjectConfig {

  static masterAppUpdated(){
      return appUpdated;
  }

  static setMasterAppUpdated(updated){
      appUpdated = updated;
  }
};
