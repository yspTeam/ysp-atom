'use babel';

export let config = {
    iosBundleID:{
      title: 'iOS BundleId',
      type: 'string',
      default: "com.",
    },
    androidPackageName:{
      title: 'android包名',
      type: 'string',
      default: "com.",
    },
    schema:{
      title: '宿主 url scheme',
      type: 'string',
      default: "",
    }
};


// module.exports =  {
//   YYMobileApp:{
//     type:"object",
//     prototype:{
//       updateURL:{
//         title:"YYMobile App - Updated URL",
//         description:"设置更新YYMobileApp的URL",
//         type:"string",
//         "default":"http://192.168.1.1/Atom/Package/YYMobile.zip"
//       }
//     }
//   }
// };
