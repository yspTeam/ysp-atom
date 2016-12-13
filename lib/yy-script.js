'use babel';

// import File from './file';
import Product  from './product';
import NewProjectView from './new-project-view';
import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,
  file:null,
  product:null,
  newProjectView:null,

  activate(state) {
    //工程的File选项模块
    // this.file = new File();
    //工程的Product选项模块
    this.product = new Product();
    this.newProjectView = new NewProjectView();

    //所有的事件订阅都放在这里，统一管理
    this.subscriptions = new CompositeDisposable();
    console.log('yy-script start');

    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'yy-script:new project': () => this.newProjectView.attach()
    }));

    // this.subscriptions.add(atom.commands.add('atom-workspace', {
    //   'yy-script:run': () => this.run()
    //
    // }));
    //run 事件
    this.productPtnEvent();
  },

  //订阅事件
  subscriptEvents(){
    this.fileOptEvent();
    this.productPtnEvent();
  },

  fileOptEvent(){
    console.log('fileOptEvent!');
  },

  productPtnEvent(){
    //Product选项
    //run
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'yy-script:run': () => this.run()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
    this.newProject.destroy();
  },

  run(){
    console.log('run!');
  },

  serialize() {
    return {
    };
  }
};
