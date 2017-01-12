'use babel';

var esprima = require('esprima');
var unImportHelper = require('./unimport.js');

class LinterProvider {
  provideLinter() {
    var scopes = ['source.js', 'source.jsx','source.js.jsx','source.babel','source.js-semantic']

    var that = this;

    return {
    name: 'ESLint',
    grammarScopes: scopes,
    scope: 'file',
    lintOnFly: true,
    lint: function lint(textEditor) {

    var text = textEditor.getText();
    if (text.length === 0) {
      return Promise.resolve([]);
    }

    that.parseToken(text);

    var filePath = textEditor.getPath();

    var responses = [{
        fatal:true,
        line:12,
        message:'unimport class',
        severity:2
    },
    {
        fatal:true,
        line:15,
        message:'may be',
        severity:1
    }]

    return responses.map(function (_ref) {
          var message = _ref.message;
          var line = _ref.line;
          var severity = _ref.severity;
          var ruleId = _ref.ruleId;
          var column = _ref.column;
          var fix = _ref.fix;
          var endLine = _ref.endLine;
          var endColumn = _ref.endColumn;

          var textBuffer = textEditor.getBuffer();
          var linterFix = null;
          if (fix) {
            var fixRange = new _atom.Range(textBuffer.positionForCharacterIndex(fix.range[0]), textBuffer.positionForCharacterIndex(fix.range[1]));
            linterFix = {
              range: fixRange,
              newText: fix.text
            };
          }
          var range = void 0;
          var msgLine = line - 1;
          try {
            if (typeof endColumn !== 'undefined' && typeof endLine !== 'undefined') {
              // Here we always want the column to be a number
              var msgCol = Math.max(0, column - 1);
              range = [[msgLine, msgCol], [endLine - 1, endColumn - 1]];
            } else {
              // We want msgCol to remain undefined if it was initially so
              // `rangeFromLineNumber` will give us a range over the entire line
              var _msgCol = typeof column !== 'undefined' ? column - 1 : column;
              range = [[msgLine,0],[msgLine,3]];
            }
          } catch (err) {
            throw new Error('Cannot mark location in editor for (' + ruleId + ') - (' + message + ')' + (' at line (' + line + ') column (' + column + ')'));
          }
          var ret = {
            filePath: filePath,
            type: severity === 1 ? 'Warning' : 'Error',
            range: range
          };

          var showRule = true;
          if (showRule) {
            var elName = ruleId ? 'a' : 'span';
            var href = ruleId ? ' href=' + (0, 'http://www.baidu.com')(ruleId).url : '';
            ret.html = '<' + elName + href + ' class="badge badge-flexible eslint">' + (ruleId || 'Fatal') + '</' + elName + '> ' + message;
          } else {
            ret.text = message;
          }

          if (linterFix) {
            ret.fix = linterFix;
          }

          return ret;
        });
      }
    }
  }

  parseToken(text) {
    if (!text || typeof text === 'undefined' || text.length === 0) {
      return;
    }

    try {
      var token = esprima.parse(text,{loc:true});
      var body = token.body;
      var unimportList = [];

      for (var i = 0; i < body.length; i++) {
        var statement = body[i];
        if (statement.type === "ExpressionStatement") {
          if (statement.expression.type === "CallExpression") {
            if (statement.expression.callee.name === "YYClass" || statement.expression.callee.name === "defineClass") {
              var list = this.parseClass(statement.expression);
              console.log('list', list);

              if (list && list.length > 0) {
                unimportList.push(list);
              }
            }
          }
        }
      }

      console.log('total unimportList', unimportList);
    } catch (e) {
      console.log(e);
    }
  }

  parseClass(text) {
    if (!text || typeof text === 'undefined' || text.length === 0) {
      return;
    }

    var argument = text["arguments"];
    for (let i = 0; i < argument.length; i++) {
      let arg = argument[i];

      if (arg.type === "ObjectExpression") {
        let properties = arg.properties;
        for (let k = 0; k < properties.length; k++) {
          let prop = properties[k];
          if (prop.value.type === "FunctionExpression") {
            // 未导入类处理
            return unImportHelper.parseExpression(prop.value.body);
          }
        }
      }
    }
  }
}

module.exports = new LinterProvider();
