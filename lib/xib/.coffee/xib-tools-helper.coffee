{File} = require('atom')
{FileUtils} = require('./../file/file-utils.js')
{Path} = require('path')

module.exports =

  class XibToolsHelper
    propertyLabels : [],
    classFlie: null,
    xibFile:null

    constructor: (args) ->

    openXib: (filePath) ->
      console.log('FILEPATH', filePath)

      process = require('child_process')
      exec = process.exec;
      exec ('open "' + filePath  + '"');
      fs = new File(filePath,false);

      self = @
      fs.onDidChange(() ->
        fs.read().then((xmlString) ->
            xmlreader = require('xmlreader')
            xmlreader.read(xmlString, (errors, response) ->

              console.log('FILEPATH', filePath)
              self.propertyLabels = []
              self.className = filePath.split('/').pop().split('.')[0]

              str = filePath.replace(".xib",".js")
              str = str.replace("ios/res/xib","ios/script/xib")
              console.log('STR', str)

              self.getPropertyLabelWithView(response.document.objects.view)
              self.saveToJSClass(str,self.className,self.propertyLabels)
            )
          )
      )

    newXib: () ->
      AddDialog = require './add-dialog'

      dialog = new AddDialog("ios/res/xib/", true)
      self = @
      dialog.on 'file-created', (event, createdPath) ->

        false
      dialog.attach()

    getPropertyLabelWithView: (view) ->
      if view.array?
        @getPropertyLabelWithView(subview) for subview in view.array
        return

      if view.attributes().userLabel? and view.attributes().userLabel.startsWith("@")
        label = view.attributes().userLabel.replace("@","")
        @propertyLabels.push("'#{label}'")

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
      console.log('FILEPATH', filePath)
      jsfs = new File(filePath,false);
      console.log('JSFS', jsfs)
      jsfs.exists().then((isExists) -> (
        console.log('ISEXISTS', isExists)
        if isExists
          console.log('CONDITION PASSED')
          jsfs.read().then((text) ->
            console.log('TEXT', text)
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
          )
      ))

    openTreeView: ->
      packageObj = null
      if atom.packages.isPackageLoaded('nuclide-file-tree') == true
        nuclideFileTree = atom.packages.getLoadedPackage('nuclide-file-tree')
        path = nuclideFileTree.contextMenuManager.activeElement?.getAttribute('data-path')
        packageObj = selectedPath:path
      if atom.packages.isPackageLoaded('tree-view') == true
        treeView = atom.packages.getLoadedPackage('tree-view')
        treeView = require(treeView.mainModulePath)
        packageObj = treeView.serialize()
      if typeof packageObj != 'undefined' && packageObj != null
        if packageObj.selectedPath
          @openXib packageObj.selectedPath
