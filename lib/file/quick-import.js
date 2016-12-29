'use babel';
import path from 'path';
import fs from 'fs-plus';
import FileUtils from './file-utils';
import {Directory} from 'atom';

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
    console.log('word ',word);

    var requireString = '';
    var currentScriptPath = editor.getPath();

    //处理特殊函数需要导入类的情况，如xib的createView,需要支持导入xib对应的类
    if (requireString === '') {
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
                scriptPath = scriptPath.slice(1, scriptPath.length);
                requireString = `require('${scriptPath}')`;
              }
            }
          }
        }
      }
    }

    //处理自定义类
    if (requireString === '') {
      if(this.class2script[word]){
        let scriptFile = this.class2script[word];
        if (scriptFile) {
          let scriptPath = path.relative(currentScriptPath, scriptFile);
          scriptPath = scriptPath.slice(1, scriptPath.length);
          requireString = `require('${scriptPath}')`;
        }
      }
    }

    //
    if (requireString === '') {
      // for (let i = 0; i < this.keyStrings.length; i++) {
      //   let keyword = this.keyStrings[i];
      //   if (word.includes(keyword)) {
      //     requireString = `require('${word}')`;
      //     isKeyClass = true;
      //     break;
      //   }
      // }
      requireString = `require('${word}')`;
    }

    if (requireString != '') {
      //去重判断
      var repeat = this.checkRepeatRequire(requireString);
      if (!repeat) {
        //移动到首行
        editor.moveToTop();
        editor.insertNewlineAbove();
        editor.insertText(requireString);
      }
    }
  }

  //去重
  checkRepeatRequire(requireString){
    let repeat = false;

    //拿到当前的上下文，进行全文正则查找
    var editor = atom.workspace.getActiveTextEditor();
    //TextEditor的scan函数，callback是一个同步的调用，非异步。跟nodejs不一样
    editor.scan(/require\('([\w\W]+?)'\)/g, function(result) {
      if (requireString == result.matchText) {
        repeat = true;
        result.stop();
      }
    });

    //include和require合并了，不处理include
    // if (!repeat) {
    //   editor.scan(/include\('([\w\W]+?)'\)/g, function(result) {
    //     if (requireString == result.matchText) {
    //       // console.log('equ',requireString,result.matchText);
    //       repeat = true;
    //       result.stop();
    //     }
    //   });
    // }

    //保存导入类
    // this.didImportList.push(requireString);

    return repeat;
  }


  scanScriptFile(filePath){

    if (path.extname(filePath)==='.js') {

      // console.log('filePatch',filePath);
      var scriptContent = fs.readFileSync(filePath);
      var scriptString = scriptContent.toString();

      var found = scriptString.match(/YYClass\('([\w\W]+?)\'/);
      if (found && found.hasOwnProperty(1)) {
          var yyclass = found[1];

          var classList = yyclass.split(':')
          if (classList.length>1) {
            yyclass = classList[0]
          }
          console.log('扫描',yyclass);
          this.class2script[yyclass] = filePath;
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
