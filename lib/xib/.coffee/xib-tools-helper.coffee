{File} = require('atom')
{Path} = require('path')
{rootPath} = require('./helpers')

module.exports =

  class XibToolsHelper
    propertyLabels : [],
    orginalPropertyLabels :[],
    classFlie: null,
    xibFile:null

    constructor: (args) ->

    openXib: (filePath) ->
      filePath = @openTreeView()

      if !filePath.endsWith("xib")
        return

      process = require('child_process')
      exec = process.exec
      exec ('open "' + filePath  + '"')
      fs = new File(filePath,false)

      self = @

      fs.read().then((xmlString) ->
        xmlreader = require('xmlreader')
        xmlreader.read(xmlString, (errors, response) ->
          self.propertyLabels = []
          self.getPropertyLabelWithView(response.document.objects.view)
          self.orginalPropertyLabels = self.propertyLabels
        )
      )

      fs.onDidChange(() ->
        fs.read().then((xmlString) ->
          xmlreader = require('xmlreader')
          xmlreader.read(xmlString, (errors, response) ->
            self.propertyLabels = []
            self.className = filePath.split('/').pop().split('.')[0]

            str = filePath.replace(/xib$/,"js")
            jsFilePath = rootPath()
            str = jsFilePath.concat("/ios/script/xib/",str.split('/').pop())

            self.getPropertyLabelWithView(response.document.objects.view)
            self.saveToJSClass(str,self.className,self.propertyLabels,self.orginalPropertyLabels)

            self.orginalPropertyLabels = self.propertyLabels
          )
        )
      )

    newXib: () ->
      AddDialog = require './add-dialog'
      filePath = @openTreeView()
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

    saveToJSClass:(filePath,className,propertyLabels,orginalPropertyLabels) ->
      jsfs = new File(filePath,false)
      jsfs.exists().then((isExists) -> (
        if isExists
          jsfs.read().then((text) ->
            for label in orginalPropertyLabels
              text = text.replace(label,"")

            reg1 = new RegExp('\(YYClass\\(.*\)\\[\\s*,*\(.*?\),*\\s*\\]','gi')
            text = text.replace(reg1,"$1[$2]")
            text = text.replace(/,{2,}/,"")

            if propertyLabels.length > 0
              reg = new RegExp('\(YYClass\\(.*\)\\[\(.*\)\\]','gi')
              text = text.replace(reg,"$1[$2,#{propertyLabels}]")

            text = text.replace(reg1,"$1[$2]")

            jsfs.writeSync(text)
          )
        else
          jsContent = """
            YYClass('#{className}:YYXibUIView', [#{propertyLabels}],{\n
            },\n
            {\n
            })
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
          return packageObj.selectedPath
