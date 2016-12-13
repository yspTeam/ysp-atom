'use babel';

import File from './file';
import Product  from './product';
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
    //所有的事件订阅都放在这里，统一管理
    this.subscriptions = new CompositeDisposable();
    //active 插件是否处于激活转态
    this.active = false;

    //统一订阅的事件
    this.subscriptEvents();

    atom.workspace.observeTextEditors((editor)=>{
      console.log('Saved! #{editor.getPath()}')
    });
  },

  //订阅事件
  subscriptEvents(){
    this.fileOptEvent();
    this.productPtnEvent();
  },

  //File菜单的事件
  fileOptEvent(){

  },

  //Product菜单的事件
  productPtnEvent(){
    //run
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'yy-script:run': () => this.product.run()
    }));
  },

  toggle(){
    console.log('toggle')
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {
    };
  }
};
