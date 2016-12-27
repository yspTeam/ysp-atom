'use babel';

import path from 'path';
import fs from 'fs-plus';
import FileUtils from './file-utils';
import {Directory} from 'atom';
import ProjectConfig from './../project-config';

var chokidar = require('chokidar');


export default class QuickImport {

  constructor(serializedState) {
    this.keyStrings = ['NS','UI','CA','AV','YYAPI'];
    this.class2script = {};
    this.chokidarListen(this.scriptPath());
  }

  chokidarListen(scriptDir){
    if (scriptDir == null) {
      return;
    }
    var self = this;

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

    console.log('word ',word);

    word = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')

    var requireString = '';

    for (var i = 0; i < this.keyStrings.length; i++) {
      let keyword = this.keyStrings[i];
      if (word.includes(keyword)) {
        requireString = `require('${word}')`;
        isKeyClass = true;
        break;
      }
    }

    if (requireString == '') {
      if(this.class2script[word]){
        let scriptFile = this.class2script[word];
        let scriptPath = path.relative(editor.getPath(), scriptFile);
        scriptPath = scriptPath.slice(1, scriptPath.length);
        requireString = `include('${scriptPath}')`;
      }
    }

    if (requireString != '') {
      //去重判断
      var repeat = this.checkRepeatRequire(requireString);
      if (!repeat) {
        //移动到首行
        editor.moveToTop();
        editor.moveDown();
        editor.insertNewlineAbove();
        editor.insertText(requireString);
      }
    }
  }

  //去重
  checkRepeatRequire(requireString){
    let repeat = false;
    var editor = atom.workspace.getActiveTextEditor();
    //TextEditor的scan函数，callback是一个同步的调用，非异步。跟nodejs不一样
    editor.scan(/require\('([\w\W]+?)'\)/g, function(result) {
      if (requireString == result.matchText) {
        // console.log('equ',requireString,result.matchText);
        repeat = true
        result.stop();
      }
    });
    editor.scan(/include\('([\w\W]+?)'\)/g, function(result) {
      if (requireString == result.matchText) {
        // console.log('equ',requireString,result.matchText);
        repeat = true
        result.stop();
      }
    });

    return repeat;
  }


  scanScriptFile(filePath){

    if (path.extname(filePath)==='.js') {

      console.log('filePatch',filePath);
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
