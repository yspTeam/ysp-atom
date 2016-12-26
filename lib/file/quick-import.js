'use babel';

export default class QuickImport {

  constructor(serializedState) {
    this.keyStrings = ['NS','UI','CA','AV'];

  }

  import(){

    var editor = atom.workspace.getActiveTextEditor();
    var word = editor.getSelectedText();
    if (word == '') {
        word = editor.getWordUnderCursor()
    }
    word = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')

    var requireString = '';

    for (var i = 0; i < self.keyStrings.length; i++) {
      let keyword = self.keyStrings[i];
      if (word.includes(keyword)) {
        requireString = `require('${word}')`
        break;
      }
    }

    // UIView
    //移动到首行
    editor.moveToTop();
    editor.moveDown();
    editor.insertNewlineAbove();
    editor.insertText(requireString);
  }

}
