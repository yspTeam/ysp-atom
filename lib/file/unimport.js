'use babel';
import path from 'path';
import QuickImport from './quick-import';
import esprima from 'esprima';

class UnImportHelper {
    constructor() {
      this.quickImport = new QuickImport();
      this.includeClassList = [];
    }

    // 解析整个文件
    parseToken(text) {
      if (!text || typeof text === 'undefined' || text.length === 0) {
        return;
      }

      this.includeClassList = [];

      try {
        var token = esprima.parse(text,{loc:true});
        var body = token.body;
        var unimportList = [];

        for (var i = 0; i < body.length; i++) {
          var statement = body[i];
          if (statement.type === "ExpressionStatement") {
            if (statement.expression.type === "CallExpression") {
              var calleeName = statement.expression.callee.name;

              if (calleeName === "YYClass" || calleeName === "defineClass") {
                var list = this.parseClass(statement.expression);

                if (list && list.length > 0) {
                  unimportList = unimportList.concat(list);
                }
              } else if (calleeName === 'require') {
                var args = statement.expression.arguments;
                this.parseRequire(args);
              }
            }
          }
        }

        return unimportList;
      } catch (e) {
        console.log('parseToken error',e);
      }
    }

    // 解析class里面的function
    parseClass(text) {
      if (!text || typeof text === 'undefined' || text.length === 0) {
        return null;
      }

      var argument = text["arguments"];
      var list = [];
      for (var i = 0; i < argument.length; i++) {
        let arg = argument[i];

        if (arg.type === "ObjectExpression") {
          let properties = arg.properties;
          for (var k = 0, l = properties.length; k < l; k++) {
            let prop = properties[k];

            if (prop.value.type === "FunctionExpression") {
              // 未导入类处理
              var result = this.parseExpression(prop.value.body);
              if (result && result.length > 0) {
                list = list.concat(result);
              }
            }
          }
        }
      }

      return list;
    }

    parseExpression(expression) {
      var classList = new Set();

      this.parseFunction(expression, classList);

      var filterList = this.handleClassList(classList);
      return filterList;
    }

    // 解析function里面的所有函数调用
    parseFunction(expression, classList) {
     if (!expression || typeof expression !== 'object') {
       return
     }

     let type = expression.type;
     if (type !== "BlockStatement") {
       return;
     }

     let body = expression.body;

     if (body && typeof body !== 'undefined') {
       for (var i = 0; i < body.length; i++) {
         let value = body[i];
         if (typeof value !== 'object') {
           continue;
         }

         type = value.type;

         if (type === 'ExpressionStatement') {
           let exp = value.expression;
           if (exp && typeof exp === 'object') {
             // 右值
             if (exp.right && exp.right.type === 'CallExpression') {
               exp = exp.right;
             }
             this.parseObject(exp, classList);
           }
         } else if (type === 'VariableDeclaration') {
           // array
           let declarations = value.declarations;
           for (var j = 0; j < declarations.length; j++) {
             let declaration = declarations[j];
             if (declaration.type === 'VariableDeclarator') {
               let initInfo = declaration.init;
               if (initInfo.type === 'CallExpression') {
                 this.parseObject(initInfo, classList);
               }
             }
           }
         } else if (type === 'IfStatement') {
           this.parseFunction(value.consequent, classList);
         } else if (type === 'WhileStatement' || type === 'ForStatement'
         || type === 'ForInStatement' || type === 'DoWhileStatement') {
           this.parseFunction(value.body, classList);
         } else if (type === 'SwitchStatement') {
           this.parseObject(value.cases.consequent, classList);
         } else if (type === 'TryStatement') {
           this.parseFunction(value.block, classList);
         }
       }
     }
   }

   // 解析某个function
   parseObject(expression, classList) {
     if (!expression || typeof expression === 'undefined') {
       return;
     }

     // 解析require参数
     if (expression.callee && expression.callee.name === 'require') {
       this.parseRequire(expression.arguments);
     }

     if (expression.type === 'Identifier') {
       const name = expression.name;

       if (name && name.length > 0 && name !== 'self' && name !== 'require') {
         var result = {};
         result.name = name;

         if (!this.containClass(classList, name)) {
           classList.add(result);

           var loc = expression.loc;
           // 解析loc
           if (loc) {
             result.line = loc.start.line;
             result.column = loc.start.column;
             result.endLine = loc.end.line;
             result.endColumn = loc.end.column;
           }
         }
       }
     } else if (expression.type === "CallExpression") {
       if (expression.callee.type === "MemberExpression") {
         //参数里面有函数调用
          let args = expression.arguments;
          if (args && args.length > 0) {
            for (var i = 0; i < args.length; i++) {
              if (args[i].type === 'CallExpression') {
                this.parseObject(args[i], classList)
              }
            }
          }

         var object = expression.callee.object;

         if (object && typeof object !== 'undefined') {
           this.parseObject(object, classList);
         }
        }
     } else if (expression.type === 'MemberExpression') {
       object = expression.object;
       if (object && typeof object !== 'undefined') {
         this.parseObject(object, classList)
       }
     }
   }

   // 解析require参数
   parseRequire(args) {
     if (!args || typeof args === 'undefined') {
       return;
     }

     for (var j = 0; j < args.length; j++) {
       var arg = args[j];
       if (arg.arguments) {
         this.parseRequire(arg.arguments);
       }

       if (arg && arg.type && arg.type === 'Literal') {
         var value = arg.value;
         if (value && value.length > 0) {
           var paramslist = value.split(',');
           if (paramslist && paramslist.length > 0) {
             this.includeClassList = this.includeClassList.concat(paramslist);
           }
         }
       }
     }
   }

   containClass(classList,className) {
     for (let item of classList) {
       if (item.name === className) {
         return true;
       }
     }
     return false;
   }

   handleClassList(classList) {
     var filterList = [];
     for (let item of classList) {
       if (!this.handleName(item)) {
         filterList.push(item);
       }
     }

     return filterList;
   }

   // 检查是否未导入
   handleName(item) {
     var name = item.name;
     if (!name || typeof name !== 'string' || name.length === 0) {
       return true;
     }

     if (name.startsWith('UI') || name.startsWith('NS') || name.startsWith('AV')
     || name.startsWith('CA') || name.startsWith('YY') || this.isCustomClass(name)) {
     var result = this.checkIsRequired(name);//this.quickImport.checkRepeatRequire(name);
     if (!result) {
       console.error('class ' + name + ' unimported!');
       return false;
     }
   }

   return true;
 }

// 自定义类
 isCustomClass(name) {
   if (!name || typeof name === 'undefined' || name.length === 0) {
     return false;
   }

   let script = this.quickImport.class2script[name];
   if (script) {
     return true;
   }

   return false;
 }

// 是否已导入
 checkIsRequired(name) {

   if (!name || typeof name === 'undefined' || name.length === 0) {
     return true;
   }

   // 先查自定义类
   var editor = atom.workspace.getActiveTextEditor();
   var currentScriptPath = editor.getPath();

   let scriptFile = this.quickImport.class2script[name];
   if (scriptFile) {
     let scriptPath = path.relative(currentScriptPath, scriptFile);
     scriptPath = scriptPath.slice(1, scriptPath.length);
     name = scriptPath;
   }

   if (this.includeClassList && this.includeClassList.includes(name)) {
     return true;
   }

   return false;
 }
}

module.exports = new UnImportHelper();
