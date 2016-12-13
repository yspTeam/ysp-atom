'use babel';
import NewProjectView from './new-project-view';

export default class File {

  constructor(serializedState) {
    // Create root element
    this.newProjectView = new NewProjectView();

  }

  newProject(){
    this.newProjectView.attach();
  }

  save(event){
    console.log(event)
  }

}
