'use babel';
import path from 'path';
import QuickImport from './quick-import';

class UnImportHelper {
    constructor() {
      this.quickImport = new QuickImport();
    }

    parseExpression(expression) {
      var classList = new Set();

      this.parseClass(expression, classList);

      var filterList = this.handleClassList(classList);

      return filterList;
    }

    parseClass(expression, classList) {
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
               this.parseObject(initInfo, classList);
             }
           }
         } else if (type === 'IfStatement') {
           this.parseClass(value.consequent, classList);
         } else if (type === 'WhileStatement' || type === 'ForStatement'
         || type === 'ForInStatement' || type === 'DoWhileStatement') {
           this.parseClass(value.body, classList);
         } else if (type === 'SwitchStatement') {
           this.parseObject(value.cases.consequent, classList);
         } else if (type === 'TryStatement') {
           this.parseClass(value.block, classList);
         }
       }
     }
   }

   parseObject(expression, classList) {
     if (!expression || typeof expression === 'undefined') {
       return;
     }

     if (expression.type === 'Identifier') {
       const name = expression.name;

       if (name && name.length > 0) {
         var result = {};
         result.name = name;

         // 解析loc
         if (!this.containClass(classList, name)) {
           classList.add(result);

           var loc = expression.loc;

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
   || name.startsWith('CA') || name.startsWith('YYAPI')) {
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
