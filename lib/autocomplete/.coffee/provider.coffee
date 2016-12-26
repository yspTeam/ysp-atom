
module.exports =

  selector: '.source.js, .source.coffee'
  disableForSelector: '.source.js .comment'
  filterSuggestions: true
  suggestionPriority: 2

  getSuggestions: ({editor, bufferPosition}) ->
    prefix = @getPrefix(editor, bufferPosition).trim()
    suggestions = []

    if prefix.toLowerCase().includes('yyapi')
      for suggestion in @getYYApiPackage().concat(@getApiEnt()).concat(@getApiRes()).concat(@getApiUtils())
        suggestion.replacementPrefix = prefix
        suggestion.descriptionMoreURL = 'http://dev.yypm.com/yylive/? \
        post=posts/yyscriptpluginsdk/api.md'
        suggestions.push(suggestion)
    if prefix.toLowerCase().includes('self.ysp')
      for suggestion in @getYSPNotify()
        suggestion.replacementPrefix = prefix
        suggestion.descriptionMoreURL = 'http://dev.yypm.com/yylive/? \
        post=posts/yyscriptpluginsdk/api.md'
        suggestions.push(suggestion)
    return suggestions

  getYYApiPackage: ->
    ent =
      text: 'YYAPI.ent'
      snippet: 'YYAPI.ent'
      type: 'class'
      description: 'Ent 相关接口'
    res =
      text: 'YYAPI.res'
      snippet: 'YYAPI.res'
      displayText: 'YYAPI.res'
      type: 'class'
      description: 'Res 相关接口'
    log =
      text: 'YYAPI.log'
      snippet: 'YYAPI.log()'
      type: 'function'
      description: 'log 接口'
    utils =
      text: 'YYAPI.utils'
      snippet: 'YYAPI.utils'
      type: 'class'
      description: 'Utils 相关接口'
    return [ent,res,log,utils]

  getApiEnt: ->
    sendEntProtocol =
      text: 'YYAPI.ent.sendEntProtocolByMaxType_minType_info();'
      # snippet: 'YYApi.ent.sendEntProtocolByMaxType_minType_info(${1:maxType},${2:minType},${3:info})'
      type: 'function'
      description: '通过大小端号发送协议'
    registerEntProtocol =
      text: 'YYAPI.ent.registerEntProtocolByMaxType_minType_block();'
      type: 'function'
      description: '通过大小端号注册协议回调'
    registerEntStruct =
      text: 'YYAPI.ent.registerEntStructByMaxType_minType_info();'
      type: 'function'
      description: '通过大小端号注册协议结构'
    addCoreClient =
      text: 'YYAPI.ent.addCoreClient_protocl();'
      type: 'function'
      description: '监听Protocol'
    removeCoreClient =
      text: 'YYAPI.ent.removeCoreClient_protocl();'
      type: 'function'
      description: '移除监听'
    removeAllCoreClient =
      text: 'YYAPI.ent.removeAllCoreClient();'
      type: 'function'
      description: '移除所有的监听'
    notifyCoreClient =
      text: 'YYApi.ent.notifyCoreClientWithProtocl_selector_argsType_args();'
      type: 'function'
      description: '协议通知'

    return [sendEntProtocol,registerEntProtocol,registerEntStruct, \
    addCoreClient,removeCoreClient,removeAllCoreClient,notifyCoreClient]

  getApiRes: ->
    suggestions = [
      {text: 'YYAPI.res.image();'
      type: 'function'
      description: '获取组件下图片资源'},
      {text: 'YYAPI.res.path();'
      type: 'function'
      description: '获取组件下图片资源地址'},
      {text: 'YYAPI.res.createView();'
      type: 'function'
      description: '根据xib资源id生成View'}
    ]
    return suggestions

  getYSPNotify: ->
    yspAddNotify =
      text: 'self.yspAddNotify_block("name",blockNotify(function(object,userinfo){ });'
      type: 'function'
      description: '添加notify监听'
    yspPostNotify =
      text: 'self.yspPostNotify_objcet_userinfo("name",null,null);'
      type: 'function'
      description: '发送notify'
    yspRemoveNotify =
      text: 'self.yspRemoveNotify("name");'
      type: 'function'
      description: '移除指定notifyname'
    yspRemoveAllNotify =
      text: 'self.yspRemoveAllNotify();'
      type: 'function'
      description: '移除所有notify'
    return [yspAddNotify, yspPostNotify, yspRemoveNotify, yspRemoveAllNotify]

  getApiUtils: ->
    suggestions = [
      {text: 'YYAPI.utils.deleteFileWithFullPath();'
      description: '删除文件'},
      {text: 'YYAPI.utils.isFileExists();'
      description: '判断文件是否存在'},
      {text: 'YYAPI.utils.createDirForPath();'
      description: '创建文件夹'},
      {text: 'YYAPI.utils.readFile();'
      description: '读文件'},
      {text: 'YYAPI.utils.getAppSource();'
      description: '获取appSource'},
      {text: 'YYAPI.utils.getappVersion();'
      description: '获取appVersion'},
      {text: 'YYAPI.utils.isFromAppStore();'
      description: '获取是否是App Store渠道'},
      {text: 'YYAPI.utils.modelName();'
      description: '获取modelName'},
      {text: 'YYAPI.utils.systemVersion();'
      description: '获取systemVersion'},
      {text: 'YYAPI.utils.identifierForVendor();'
      description: '获取当前设备的 IDFV，IDFV 在某些情况下会变，不建议将其作为设备标识'},
      {text: 'YYAPI.utils.deviceID();'
      description: '获取deviceID'},
      {text: 'YYAPI.utils.networkStatus();'
      description: '获取网络状态'},
      {text: 'YYAPI.utils.reachableStatus();'
      description: '获取网络状态，精确到2，3，4G'},
      {text: 'YYAPI.utils.ipAddress();'
      description: '获取ipAddress'},
      {text: 'YYAPI.utils.ipAddress(true);'
      description: '获取ipAddress 优先取IPv4的地址'},
      {text: 'YYAPI.utils.macAddresss();'
      description: '获取macAddresss'},
      {text: 'YYAPI.utils.idfa();'
      description: '获取idfa'},
      {text: 'YYAPI.utils.carrier();'
      description: '获取运营商'},
      {text: 'YYAPI.utils.carrierIdentifier();'
      description: '获取运营商类型'},
      {text: 'YYAPI.utils.carrierName();'
      description: '获取运营商名称'},
    ]

    for suggestion in suggestions
      suggestion.type = 'function'

    return suggestions


  getPrefix: (editor, bufferPosition) ->
    regex = /\ \S*$/g
    line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition])

    if line.includes(' ')
      line = line.match(regex)[0]
    return line

  onDidInsertSuggestion: ({editor, suggestion}) ->
    setTimeout(@triggerAutocomplete.bind(this, editor), 1) if suggestion.type is 'attribute'
  triggerAutocomplete: (editor) ->
    atom.commands.dispatch(atom.views.getView(editor), 'autocomplete-plus:activate', activatedManually: false)
