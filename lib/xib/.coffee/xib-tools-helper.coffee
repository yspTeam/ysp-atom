{File} = require('atom')

module.exports =

  class XibToolsHelper
    propertyLabels : [],
    classFlie: null,
    xibFile:null

    constructor: (args) ->

    openXib: (filePath) ->
      if !filePath?
        editor = atom.workspace.getActivePaneItem()
        file = editor?.buffer.file
        filePath = file?.path

      process = require('child_process')
      exec = process.exec;
      exec ('open "' + filePath  + '"');
      fs = new File(filePath,false);

      self = @
      fs.onDidChange(() ->
        fs.read().then((xmlString) ->
            xmlreader = require('xmlreader')
            xmlreader.read(xmlString, (errors, response) ->

              self.propertyLabels = []
              self.className = filePath.split('/').pop().split('.')[0]

              str = filePath.split('.')
              str.pop()
              str.push(".js")
              str = str.join('')

              self.getPropertyLabelWithView(response.document.objects.view)
              self.saveToJSClass(str,self.className,self.propertyLabels)
            )
          )
      )

    newXib: () ->
      AddDialog = require './add-dialog'
      editor = atom.workspace.getActivePaneItem()
      file = editor?.buffer.file
      filePath = file?.path
      filePath = "" if !filePath

      dialog = new AddDialog(filePath, true)
      self = @
      dialog.on 'file-created', (event, createdPath) ->

        false
      dialog.attach()

    getPropertyLabelWithView: (view) ->
      if view.array?
        @getPropertyLabelWithView(subview) for subview in view.array
        return

      if view.attributes().userLabel? and view.attributes().userLabel.startsWith("@")
        @propertyLabels.push(view.attributes().userLabel.replace("@",""))

      subviews = view.subviews

      if subviews?
        @getPropertyLabelWithView(subviews.button) if subviews.button?
        @getPropertyLabelWithView(subviews.label) if subviews.label?
        @getPropertyLabelWithView(subviews.view) if subviews.view?
        @getPropertyLabelWithView(subviews.tableView) if subviews.tableView?
        @getPropertyLabelWithView(subviews.imageView) if subviews.imageView?
        @getPropertyLabelWithView(subviews.textField) if subviews.textField?
        @getPropertyLabelWithView(subviews.webView) if subviews.webView?

    saveToJSClass:(filePath,className,propertyLabels) ->
      jsfs = new File(filePath,false);
      jsfs.exists().then((isExists) -> (
        if isExists
          jsfs.read().then((text) ->
            reg = new RegExp('\(YYClass\\(.*\)\\[.*\\]','gi')
            str = text.replace(reg,"$1[#{propertyLabels}]")
            jsfs.writeSync(str)
          )
        else
          jsContent = """
            YYClass('#{className}:YYXibUIView', [#{propertyLabels}],{},{})
          """
          jsfs.create().then((isCreated) ->
            jsfs.writeSync(jsContent)
            jsfs.read().then((text) ->
            )
          )
      ))
