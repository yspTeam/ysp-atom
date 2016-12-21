
module.exports =

  selector: '.source.js, .source.coffee'
  disableForSelector: '.source.js .comment'
  filterSuggestions: true
  suggestionPriority: 2

  getSuggestions: ({editor, bufferPosition}) ->
    prefix = @getPrefix(editor, bufferPosition).trim()
    if prefix.toLowerCase().includes('yyapi')
      suggestions = []
      for suggestion in @getYYApiPackage().concat(@getApiEnt())
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
      snippet: 'YYAPI.log'
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

  getPrefix: (editor, bufferPosition) ->
    # Whatever your prefix regex might be
    # regex = /YY*$/
    # Get the text for the line up to the triggered buffer position
    line = editor.getTextInRange([[bufferPosition.row, 0], bufferPosition])
    # Match the regex to the line, and return the match
    # line.match(regex)?[0] or ''
    return line

  onDidInsertSuggestion: ({editor, suggestion}) ->
    setTimeout(@triggerAutocomplete.bind(this, editor), 1) if suggestion.type is 'attribute'
  triggerAutocomplete: (editor) ->
    atom.commands.dispatch(atom.views.getView(editor), 'autocomplete-plus:activate', activatedManually: false)
