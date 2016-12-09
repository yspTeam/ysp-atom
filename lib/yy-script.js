'use babel';

import File from './file';
import Product  from './product';
import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,
  file:nul,
  product:null,

  activate(state) {
    //工程的File选项模块
    this.file = new File();
    //工程的Product选项模块
    this.product = new Product();

    //所有的事件订阅都放在这里，统一管理
    this.subscriptions = new CompositeDisposable();

    //run 事件
    this.subscriptEvents();

  }

  //订阅事件
  subscriptEvents(){
    this.fileOptEvent();
    this.productPtnEvent();
  }

  fileOptEvent(){
      //File选项
      //new project

      //new ysp script

      //new xib file

      //save file
  }

  productPtnEvent(){
    //Product选项
    //run
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'yy-script:run': () => this.product.run()
    }));

  }

  deactivate() {
    this.subscriptions.dispose();
  }

  serialize() {
    return {
    };
  }
};
