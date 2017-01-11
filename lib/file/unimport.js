'use babel';
import path from 'path';

class UnImportHelper {
    parseClass(expression) {
     if (!expression || typeof expression !== 'object') {
       return
     }

     let type = expression.type;
     if (type !== "BlockStatement") {
       return;
     }

     let body = expression.body;
     if (body && typeof body !== 'undefined') {
       for (let i = 0; i < body.length; i++) {
         let value = body[i];
         if (typeof value !== 'object') {
           continue;
         }

         type = value.type;
         if (type === 'ExpressionStatement') {
           let exp = value.expression;
           if (exp && typeof exp === 'object') {
             let name = this.parseObject(exp);
             console.log('extract name', name);
           }
         } else if (type === 'VariableDeclaration') {
           // array
           let declarations = value.declarations;
           for (j = 0; j < declarations.length; j++) {
             let declaration = declarations[j];
             if (declaration.type === 'VariableDeclarator') {
               let initInfo = declaration.init;
               let name = this.parseObject(initInfo);
               console.log('extract name', name);
             }
           }
         }
       }
     }
   }

   parseObject(expression) {
     if (!expression || typeof expression === 'undefined') {
       return null;
     }

     if (expression.type === 'Identifier') {
       return expression.name;
     } else if (expression.type === "CallExpression") {
       if (expression.callee.type === "MemberExpression") {
         let object = expression.callee.object;
         if (object && typeof object !== 'undefined') {
           return this.parseObject(object)
         }
        }
     }
   }

   // 检查是否未导入
   handleName(name) {
     if (!name || typeof name !== 'string' || name.length === 0) {
       return;
     }



   }
}

module.exports = new UnImportHelper();
