'use babel';

module.exports =  {
  YYMobileApp:{
    type:"object",
    prototype:{
      updateURL:{
        title:"YYMobile App - Updated URL",
        description:"设置更新YYMobileApp的URL",
        type:"string",
        "default":"http://192.168.1.1/Atom/Package/YYMobile.zip"
      }
    }
  }
};
