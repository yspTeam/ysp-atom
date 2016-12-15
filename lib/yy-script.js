'use babel';

// import File from './file';
import File from './file/file';
import Product from './product/product';
import {
    CompositeDisposable
} from 'atom';

export default {

    subscriptions: null,
    file: null,
    product: null,

    activate(state) {
        //工程的File选项模块
        this.file = new File();
        //工程的Product选项模块
        this.product = new Product();
        //所有的事件订阅都放在这里，统一管理
        this.subscriptions = new CompositeDisposable();

        //自定义订阅的事件
        this.subscriptEvents();

        //处理 TextEditor的事件监听
        atom.workspace.observeTextEditors((editor) => {
            editor.onDidSave((event) => this.product.build());
            // editor.onDidSave((event) => this.file.save(event));
        });

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
            'yy-script:new project': () => this.file.newProject()
        }));

        // reload config
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'yy-script:reload config': () => this.file.refreshConfig()
        }));
    },

    //Product菜单的事件
    productOptEventHandle() {
        this.subscriptions.add(atom.commands.add('atom-workspace', {
            'yy-script:run': () => this.product.run(),
            'yy-script:build': () => this.product.build()
        }));
    },

    deactivate() {
        this.product.stop();
        this.subscriptions.dispose();
    },

    run() {},
    serialize() {
        return {};
    }
};
