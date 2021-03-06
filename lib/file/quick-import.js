'use babel';
import path from 'path';
import fs from 'fs-plus';
import FileUtils from './file-utils';
import ProjectConfig from './../project-config'

var chokidar = require('chokidar');


export default class QuickImport {

  constructor(serializedState) {
    this.keyStrings = ['NS','UI','CA','AV','YYAPI'];
    this.keyFunctions = ['createView'];
    // this.didImportList = [];
    this.class2script = {};
    this.chokidarListen(this.scriptPath());

  }

  chokidarListen(scriptDir){
    if (!scriptDir || typeof scriptDir === 'undefined') {
      return true;
    }

    var self = this;
    //如果脚本目录为空，需要起一个计时器，2秒轮询
    if (scriptDir == null) {
      setTimeout(function () {
        let scriptPath = self.scriptPath();
        console.log('setInterval,scriptPath',scriptPath);
        self.chokidarListen(scriptPath);
      }, 2000);
      return;
    }

    var watcher = chokidar.watch(scriptDir, {
      ignored: /(^|[\/\\])\../,
      persistent: true
    });

    watcher.add(path.join(scriptDir,'**/*.js'));

    watcher
    .on('add', path => {
      self.scanScriptFile(path);
      // console.log(`File ${path} has been added`)
    })
    .on('changed',path =>{
      self.scanScriptFile(path);
    });
  }

  import(){

    var editor = atom.workspace.getActiveTextEditor();
    var word = editor.getSelectedText();
    if (word == '') {
        word = editor.getWordUnderCursor()
    }
    word = word.replace(/[-\/\\^$*+?.()'"|[\]{}]/g, '')
    // console.log('word ',word);

    var requireSymbol = '';
    var currentScriptPath = this.scriptPath();//editor.getPath();

    //处理特殊函数需要导入类的情况，如xib的createView,需要支持导入xib对应的类
    if (requireSymbol === '') {
      for (let i = 0; i < this.keyFunctions.length; i++) {
        let keyword = this.keyFunctions[i];
        if (word === keyword) {
          //将光标移到函数单词前方，然后选择到行尾，框选出这部分字符串，再进行正则提取
          editor.moveToBeginningOfWord();
          editor.selectToEndOfLine();
          let text = editor.getSelectedText();
          let reg = new RegExp(`${keyword}\\(\\s*[\"|\'](.+)[\"|\']\\s*\\)`, 'i');
          let match = text.match(reg);
          //提取到关键的参数，进行匹配
          if (match && match.hasOwnProperty(1)) {
            let matchText = match[1];
            if (this.class2script[matchText]) {
              let scriptFile = this.class2script[matchText];
              if (scriptFile) {
                let scriptPath = path.relative(currentScriptPath, scriptFile);

                requireSymbol = scriptPath;//`require('${scriptPath}')`;
              }
            }
          }
        }
      }
    }

    //处理自定义类
    if (requireSymbol === '') {
      if(this.class2script[word]){
        let scriptFile = this.class2script[word];
        if (scriptFile) {
          let scriptPath = path.relative(currentScriptPath, scriptFile);
          requireSymbol = scriptPath;//`require('${scriptPath}')`;
        }
      }
    }

    //
    if (requireSymbol === '') {
      // for (let i = 0; i < this.keyStrings.length; i++) {
      //   let keyword = this.keyStrings[i];
      //   if (word.includes(keyword)) {
      //     requireString = `require('${word}')`;
      //     isKeyClass = true;
      //     break;
      //   }
      // }
      requireSymbol = word;//`require('${word}')`;
    }

    if (requireSymbol != '') {
      //去重判断
      var repeat = this.checkRepeatRequire(requireSymbol);
      if (!repeat) {

        let requireString = `require('${requireSymbol}')`
        //移动到首行
        editor.moveToTop();
        editor.insertNewlineAbove();
        editor.insertText(requireString);
      }
    }
  }

  //去重
  checkRepeatRequire(requireSymbol){
    if (!requireSymbol || typeof requireSymbol === 'undefined' || requireSymbol.length === 0) {
      return true;
    }

    // 先查自定义类
    var editor = atom.workspace.getActiveTextEditor();
    var currentScriptPath = this.scriptPath();//editor.getPath();

    let scriptFile = this.class2script[requireSymbol];
    if (scriptFile) {
      let scriptPath = path.relative(currentScriptPath, scriptFile);
      // scriptPath = scriptPath.slice(1, scriptPath.length);
      requireSymbol = scriptPath;
    }

    var requireString = `require('${requireSymbol}')`

    let repeat = false;
    //拿到当前的上下文，进行全文正则查找
    //TextEditor的scan函数，callback是一个同步的调用，非异步。跟nodejs不一样
    editor.scan(/require\('([\w\W]+?)'\)/g, function(result) {
      console.log('scan result', result);
      if (result.match && result.match.length >= 2) {
        var match = result.match[1];
        console.log('scan match', match);
        if (match.includes(requireSymbol)) {
          repeat = true;
          result.stop();
        }
      } else {
        if (requireString == result.matchText) {
          repeat = true;
          result.stop();
        }
      }
    });

    return repeat;
  }


  scanScriptFile(filePath){
    if (!filePath || typeof filePath === 'undefined') {
      return true;
    }

    if (path.extname(filePath)==='.js') {
      var scriptContent = fs.readFileSync(filePath);
      var scriptString = scriptContent.toString();

      var found = scriptString.match(/YYClass\('([\w\W]+?)\'/g);
      console.log('YYClass：',found);
      if (found) {
        var i = found.length;
        while (i--) {
          let item = found[i]
          console.log('item',item);
          let className = item.match(/YYClass\('([\w\W]+?)\'/);
          console.log('className:',className);
          if (className && className.hasOwnProperty(1)) {
              var yyclass = className[1];
              var classList = yyclass.split(':')
              if (classList.length>1) {
                yyclass = classList[0]
              }
              console.log('扫描',yyclass);
              this.class2script[yyclass] = filePath;
          }
        }
      }
    }
  }

  scriptPath() {
    var iosProjectPath = FileUtils.iosProjectPath();
    if (FileUtils.isPathValid(iosProjectPath)) {
      return path.join(iosProjectPath, 'script');
    }

    return null
  }

}
