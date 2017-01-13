'use babel';
import path from 'path';
import QuickImport from './quick-import';
import esprima from 'esprima';

class UnImportHelper {
    constructor() {
      this.quickImport = new QuickImport();
    }

    // 解析整个文件
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

                if (list && list.length > 0) {
                  unimportList = unimportList.concat(list);
                }
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
      console.log('parseClass');

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
      console.log('parseExpression');

      var classList = new Set();

      this.parseFunction(expression, classList);

      var filterList = this.handleClassList(classList);
      return filterList;
    }

    // 解析function里面的所有函数调用
    parseFunction(expression, classList) {
      console.log('parseFunction');
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

     if (expression.type === 'Identifier') {
       const name = expression.name;

       if (name && name.length > 0) {
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
           this.parseObject(object, classList)
         }
        }
     } else if (expression.type === 'MemberExpression') {
       object = expression.object;
       if (object && typeof object !== 'undefined') {
         this.parseObject(object, classList)
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
   || name.startsWith('CA') || name.startsWith('YY')) {
     var result = this.quickImport.checkRepeatRequire(name);
     if (!result) {
       console.error('class ' + name + ' unimported!');
       return false;
     }
   } else {
     // 判断是否在自定义类中
     let script = this.quickImport.class2script[name];
     if (script && typeof script !== 'undefined') {
       result = this.quickImport.checkRepeatRequire(name);
       if (!result) {
         console.error('class ' + name + ' unimported!');
         return false;
       }
     }
   }

   return true;
 }
}

module.exports = new UnImportHelper();
