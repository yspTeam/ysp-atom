'use babel';

// import File from './file';
import File from './file/file';
import Product from './product/product';
import XibHelper from './xib/xib-tools-helper';
import provider from './autocomplete/provider';

import {
    CompositeDisposable
} from 'atom';

export default {
    subscriptions: null,
    file: null,
    product: null,
    xib: null,
    provider: null,
    config: require('./config-schema').config,

    activate(state) {

        //工程的File选项模块
        this.file = new File();
        //工程的Product选项模块
        this.product = new Product();
        //所有的事件订阅都放在这里，统一管理
        this.subscriptions = new CompositeDisposable();
        //xib辅助模块
        this.xib = new XibHelper()

        //自定义订阅的事件
        this.subscriptEvents();

        //处理 TextEditor的事件监听
        atom.workspace.observeTextEditors((editor) => {
            // editor.onDidSave((event) => this.product.build());
        });
        this.provider = provider;

        console.log('activate');
    },

    //订阅事件
    subscriptEvents() {
        this.fileOptEventHandle();
        this.productOptEventHandle();
    },

    //File菜单的事件
    fileOptEventHandle() {
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

        // xib
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'yy-script:new xib': () => this.xib.newXib()
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'yy-script:open xib': () => this.xib.openXib()
        }));

        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'yy-script:quick import': () => this.file.quickImport()
        }));
    },

    //Product菜单的事件
    productOptEventHandle() {
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'yy-script:toggle': () => this.product.toggle()
        }));
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'yy-script:run': () => this.product.run()
        }));
    },

    deactivate() {
        this.product.stop();
        this.subscriptions.dispose();
    },

    run() {},
    serialize() {
        return {};
    },

    getProvider() {
      return this.provider
    }
};
