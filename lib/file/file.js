'use babel';

// workspace
import NewProject from './new-project';
import NewFile from './new-file';
import ReloadConfig from './reload-config';
import QuickImport from './quick-import';

export default class File {

  constructor(serializedState) {
    // Create root element
    this.newProject = new NewProject();
    this.reloadConfig = new ReloadConfig();
    this.newFile = new NewFile();
    this.quickImp = new QuickImport();
  }

  createNewProject(){
    this.newFile.detach();
    this.newProject.attach();
  }

  createProtocol() {
   this.newProject.detach()
    this.newFile.attach(2);
  }

  createNewFile() {
    this.newProject.detach()
    this.newFile.attach(1);
  }

  refreshConfig() {
    this.reloadConfig.reloadConfig();
  }

  quickImport() {
    this.quickImp.import();
    // console.log('sssss');
  }

  save(event){
    console.log(event)
  }



}
