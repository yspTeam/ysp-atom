fs = require 'fs'
path = require 'path'
esprima = require 'esprima'
chokidar = require 'chokidar'
FileUtils = require '../file/file-utils'
path = require 'path'

module.exports =

  selector: '.source.js, .source.coffee'
  disableForSelector: '.source.js .comment'
  filterSuggestions: true
  suggestionPriority: 1

  getSuggestions: ({editor, bufferPosition}) ->
    prefix = @getPrefix(editor, bufferPosition).trim()
    suggestions = []

    if prefix.toLowerCase().includes('yyapi')
      for suggestion in @getYYApiPackage().concat(@getApiEnt()).concat(@getApiRes()).concat(@getApiUtils())
        suggestion.replacementPrefix = prefix
        suggestion.descriptionMoreURL = 'http://dev.yypm.com/yylive/? \
        post=posts/yyscriptpluginsdk/api.md'
        suggestions.push(suggestion)
    else if prefix.toLowerCase().includes('self.ysp')
      for suggestion in @getYSPNotify()
        suggestion.replacementPrefix = prefix
        suggestion.descriptionMoreURL = 'http://dev.yypm.com/yylive/? \
        post=posts/yyscriptpluginsdk/api.md'
        suggestions.push(suggestion)
    else if prefix.toLowerCase().includes('disp')
      for suggestion in @getOcDispatch()
        suggestion.replacementPrefix = prefix
        suggestions.push(suggestion)
    else if prefix.toLowerCase().includes('self.')
      for suggestion in @getYSPApi()
        suggestion.replacementPrefix = prefix
        suggestions.push(suggestion)
    else if prefix.toLowerCase().includes('block')
      for suggestion in @getBlock()
        suggestion.replacementPrefix = prefix
        suggestions.push(suggestion)

    if prefix.toLowerCase().includes('.')
      for suggestion in @all_completions
        strArray = prefix.split('.')
        suggestion.replacementPrefix = strArray[strArray.length - 1]
        suggestions.push(suggestion)

    @classes.forEach((name) ->
      suggestion = {}
      suggestion.text = name
      suggestion.leftLabel = "UIKit"
      suggestion.type = 'class'
      strArray = prefix.split(' ')
      suggestion.replacementPrefix = strArray[strArray.length - 1]
      suggestions.push(suggestion)
    )

    for key,value of @LocalYYClassCompletes
      suggestion = {}
      suggestion.text = value.className
      suggestion.leftLabel = "YYClass"
      suggestion.type = 'class'
      strArray = prefix.split(' ')
      suggestion.replacementPrefix = strArray[strArray.length - 1]
      suggestions.push(suggestion)

      if prefix.toLowerCase().includes('.')
        for func in value.functions
          funcSuggestion = {}
          funcSuggestion.text = func.methodName + '(' + func.params + ')'
          funcSuggestion.leftLabel = value.className
          funcSuggestion.type = 'method'
          strArray = prefix.split('.')
          funcSuggestion.replacementPrefix = strArray[strArray.length - 1]
          suggestions.push(funcSuggestion)
        for prop in value.propertys
          suggestion = {}
          suggestion.text = prop
          suggestion.leftLabel = value.className
          suggestion.type = 'method'
          suggestions.push(suggestion)

          suggestionSet = {}
          suggestionSet.text = 'set' + prop.charAt(0).toUpperCase() + prop.slice(1)
          suggestionSet.leftLabel = value.className
          suggestionSet.type = 'method'
          suggestions.push(suggestionSet)

    return suggestions

  getBlock:->
    suggestions = [
      {text: 'BlockD( function(data) {\n # body...\n})'
      type: 'function'
      description: '只有一个NSDictionary参数的Block'},
      {text: 'block(function() {\n # body...\n})'
      snippet: 'block(function(${1:args}) {\n # body...\n})'
      type: 'function'
      description: 'JS中传递Block作为参数的形式'},
      {text: 'blockNotify( function(object,userinfo) {\n # body...\n})'
      type: 'function'
      description: '用于yspNotify的Block定义'},
    ]

    return suggestions

  getYSPApi: ->
    suggestions = [
      {text: 'self.observeModuleWithIdentifier()'
      type: 'function'
      description: '监听对应的VC'},
    ]

    return suggestions

  getYYApiPackage: ->
    suggestions = [
      {text: 'YYAPI.ent'
      snippet: 'YYAPI.ent'
      type: 'class'
      description: 'Ent 相关接口'},
      {text: 'YYAPI.res'
      snippet: 'YYAPI.res'
      displayText: 'YYAPI.res'
      type: 'class'
      description: 'Res 相关接口'},
      {text: 'YYAPI.log()'
      type: 'function'
      description: '普通日志接口'},
      {text: 'YYAPI.error()'
      type: 'function'
      description: '错误日志接口'},
      {text: 'YYAPI.warning()'
      type: 'function'
      description: '警告日志接口'},
      {text: 'YYAPI.info()'
      type: 'function'
      description: 'info日志接口'},
      {text: 'YYAPI.debug()'
      type: 'function'
      description: '调试日志接口'},
      {text: 'YYAPI.utils'
      snippet: 'YYAPI.utils'
      type: 'class'
      description: 'Utils 相关接口'}
    ]
    return suggestions

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

  getOcDispatch: ->
    suggestions = [
      {text: 'dispatch_after(second,function() {\n
        // do something\n
        })',
      snippet: 'dispatch_after(${1:#second},function() {\n
        // do something\n
        })',
      description: 'GCD 支持'},
      {text: 'dispatch_async_main(function() {\n
        // do something\n
        })',
      description: 'GCD 支持'},
      {text: 'dispatch_sync_main(function() {\n
        // do something\n
        })',
      description: 'GCD 支持'},
      {text: '''
      dispatch_async_global_queue(function() {
        // do something
      })''',
      description: 'GCD 支持'},
    ]

    for suggestion in suggestions
      suggestion.type = 'function'

    return suggestions

  loadUIKitCompletions: ->
    completions = []
    @all_completions = []

    @classes = new Set()

    suggestion = {}
    suggestion.text = "alloc"
    suggestion.leftLabel = "NSObject"
    suggestion.type = 'method'
    @all_completions.push(suggestion)

    fs.readFile path.resolve(__dirname, '.', 'UIKit.json'), (error, content) =>
      completions = JSON.parse(content) unless error?
      for object in completions
        suggestion = {}
        suggestion.text = object.method
        suggestion.leftLabel = object.className
        suggestion.type = 'method'
        @all_completions.push(suggestion)
        @classes.add(object.className)

    fs.readFile path.resolve(__dirname, '.', 'UIKitProperty.json'), (error, content) =>
      completions = JSON.parse(content) unless error?
      for object in completions
        suggestion = {}
        suggestion.text = object.method
        suggestion.description = object.desc
        suggestion.leftLabel = object.className
        suggestion.type = 'method'
        @all_completions.push(suggestion)

        suggestionSet = {}
        suggestionSet.text = 'set'+object.method.charAt(0).toUpperCase()+object.method.slice(1)
        suggestionSet.description = object.desc
        suggestionSet.leftLabel = object.className
        suggestionSet.type = 'method'
        @all_completions.push(suggestionSet)

        @classes.add(object.className)

  loadLocalComplete: () ->
    self = @

    projectPath = FileUtils.iosProjectPath()

    if FileUtils.isPathValid(projectPath)
      projectPath = path.join(projectPath, 'script')
      projectPath = projectPath.concat("/**/*.js")
    else
      return

    watcher = chokidar.watch projectPath, {
      ignored: /(^|[\/\\])\../
      persistent: true
      }

    @LocalYYClassCompletes = {}

    watcher
    .on('add', (path) ->
      self.parseSyntax(path)
    )
    .on('change', (path) ->
      self.parseSyntax(path)
    )

  parseSyntax: (filepath) ->
    text = fs.readFileSync(filepath,'utf-8')
    token = esprima.parse(text)

    for statement in token.body
      if statement.type is "ExpressionStatement"
        if statement.expression.type is "CallExpression"
          if statement.expression.callee.name is "YYClass"
            @parseYYClass(statement.expression)

  parseYYClass: (expression) ->
    className = ''
    propertys = []
    functions = []

    for arg in expression.arguments
      if arg.type is "Literal"
        if arg.value.includes(":")
          strArray = arg.value.split(':')
          className = strArray[0]
        else
          className = arg.value

      if arg.type is "ArrayExpression"
        for prop in arg.elements
          propertys.push prop.value
      if arg.type is "ObjectExpression"
        for prop in arg.properties
          if prop.value.type is "FunctionExpression"
            func = {}
            params = []
            func.methodName = prop.key.name
            for param in prop.value.params
              params.push param.name
            func.params = params
            functions.push func

    @LocalYYClassCompletes[className] = {
      "className" : className
      "propertys" : propertys
      "functions" : functions
    }

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
