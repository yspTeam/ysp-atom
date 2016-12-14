'use babel';

// import File from './file';
import YSPServer  from './ysp_debug_server';
import File from './file/file';
import Product  from './product/product';
import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,
  file:null,
  product:null,

  ysp_server:null,

  activate(state) {
    //工程的File选项模块
    this.file = new File();
    //工程的Product选项模块
    this.product = new Product();
    this.ysp_server = new YSPServer();
    //所有的事件订阅都放在这里，统一管理
    this.subscriptions = new CompositeDisposable();

    //自定义订阅的事件
    this.subscriptEvents();

    //处理 TextEditor的事件监听
    atom.workspace.observeTextEditors((editor)=>{
      editor.onDidSave((event) => this.file.save(event));
    });

    console.log('activate');
  },

  //订阅事件
  subscriptEvents(){
    this.fileOptEventHandle();
    this.productOptEventHandle();
  },

  //File菜单的事件
  fileOptEventHandle(){
    //new proj
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'yy-script:new project': () => this.file.createNewProject()
    }));

    // new js file
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'yy-script:new file': () => this.file.createNewFile()
    }));

    // reload config
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'yy-script:reload config': () => this.file.refreshConfig()
    }));
  },

  confirm() {
    alert('confirm');
  },

  detach() {
    alert('detach');
  },

  //Product菜单的事件
  productOptEventHandle(){
    //run
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'yy-script:run': () => this.run(),
       'yy-script:stop': () => this.stop()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  run(){
    this.ysp_server.run();
  },
  stop(){
      this.ysp_server.stop();
  },
  serialize() {
    return {
    };
  }
};
