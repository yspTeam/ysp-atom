'use babel';
import NewProjectView from './new-project-view';
import ReloadConfig from './reload-config';

export default class File {

  constructor(serializedState) {
    // Create root element
    this.newProjectView = new NewProjectView();
    this.reloadConfig = new ReloadConfig();
  }

  newProject(){
    this.newProjectView.attach();
  }

  refreshConfig() {
    this.reloadConfig.reloadConfig();
  }

  save(event){
    console.log(event)
      console.log('hahahahevent');
  }

}
