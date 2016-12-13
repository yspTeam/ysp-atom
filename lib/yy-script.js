'use babel';

import File from './file/file';
import Product  from './product/product';
import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,
  file:null,
  product:null,

  activate(state) {
    //工程的File选项模块
    this.file = new File();
    //工程的Product选项模块
    this.product = new Product();
    //
    //所有的事件订阅都放在这里，统一管理
    this.subscriptions = new CompositeDisposable();

    //自定义订阅的事件
    this.subscriptEvents();

    //处理 TextEditor的事件监听
    atom.workspace.observeTextEditors((editor)=>{
      editor.onDidSave((event) => this.file.save(event));
    });
  },

  //订阅事件
  subscriptEvents(){
    this.fileOptEvent();
    this.productPtnEvent();
  },

  //File菜单的事件
  fileOptEvent(){
    //new proj
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'yy-script:new project': () => this.file.newProject()
    }));

  },

  //Product菜单的事件
  productPtnEvent(){
    //run
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'yy-script:run': () => this.product.run()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {
    };
  }
};
