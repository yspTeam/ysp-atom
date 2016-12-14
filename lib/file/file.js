'use babel';
import NewProject from './new-project';
import NewFile from './new-file';
import ReloadConfig from './reload-config';

export default class File {

  constructor(serializedState) {
    // Create root element
    this.newProject = new NewProject();
    this.reloadConfig = new ReloadConfig();
    this.newFile = new NewFile();
  }

  createNewProject(){
    this.newFile.detach();
    this.newProject.attach();
  }

  createNewFile() {
    this.newProject.detach()
    this.newFile.attach();
  }

  refreshConfig() {
    this.reloadConfig.reloadConfig();
  }

  save(event){
    console.log(event)
  }

}