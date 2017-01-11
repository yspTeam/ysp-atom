var path = require('path');
var fs = require('fs-plus');
var mkdirp = require('mkdirp').mkdirp;

class IOSBuild {
	build(inputPath, outputPath) {
		console.log("dirname", __dirname);

		console.log('arg1', process.argv[2]);
		console.log('arg2', process.argv[3]);

		if (!this.isPathValid(inputPath)) {
			inputPath = process.argv[2];
		}

		if (!this.isPathValid(outputPath)) {
			outputPath = process.argv[3];
		}

		if (!fs.isDirectorySync(inputPath)) {
			console.log('inputPath is not valid');
			return;
		}

		if (!this.isPathValid(outputPath)) {
			console.log('outputPath is not valid');
			return;
		}

		this.buildPath = outputPath;

		console.log("buildPath", outputPath);

		// copy file
		this.copyFile(inputPath, outputPath);

		// generate resConfig
		this.generateResConfig(outputPath);

		// process openId
		this.preprocessScript(outputPath);
	}

	copyFile(srcDir, desDir) {
		if (!this.isPathValid(srcDir) || !this.isPathValid(desDir)) {
			return;
		}

		if (!fs.existsSync(srcDir)) {
			return;
		}

		// remove
		fs.removeSync(desDir);

		fs.copySync(srcDir, desDir)
	}

	generateResConfig(buildPath) {
		if (!this.isPathValid(buildPath)) {
			return;
		}

		var resConfigPath = path.join(buildPath, 'res/resConfig.json');
		var resDir = path.join(buildPath, 'res');

		var resConfig = {};
		this.scanRes(resDir, resConfig);
		console.log(resConfig);

		var jsonString = JSON.stringify(resConfig);

		fs.writeFileSync(resConfigPath, jsonString);
	}

	scanRes(resDir, resConfig) {
		if (!this.isPathValid(resDir)) {
			return {};
		}

		if (!fs.isDirectorySync(resDir)) {
			return {};
		}

		var subFiles = fs.listSync(resDir);
		if (subFiles && subFiles.length > 0) {
			for (var i = 0; i < subFiles.length; i++) {
				var subFilePath = subFiles[i];
				// dir
				if (fs.isDirectorySync(subFilePath)) {
					this.scanRes(subFilePath, resConfig);
				} else if (fs.isFileSync(subFilePath)) {
					// file
					var basename = path.basename(subFilePath);
					if (basename === 'resConfig.json') {
						continue;
					}

					if (basename.startsWith('.')) {
						continue;
					}

					var extension = path.extname(subFilePath);
					var fileName = basename;

					if (fileName && fileName.length > 0) {
						fileName = basename.substr(0, basename.lastIndexOf('.'));

						// relativePath
						var relativePath = path.relative(this.buildPath, subFilePath);
						var relativeDir = path.dirname(relativePath);

						var dict = {};

						if (extension === '.png') {
							// remove @2x @3x
							if (fileName.endsWith('@2x')) {
								fileName = fileName.replace('@2x','');
								dict["scale"] = true;
							} else if (fileName.endsWith('@3x')) {
								fileName = fileName.replace('@3x','');
								dict["scale"] = true;
							} else {
								dict["scale"] = false;
							}

						} else {
							dict["scale"] = false;
						}

						relativePath = path.join(relativeDir, fileName+extension);

						// 加上extension
						dict["path"] = relativePath;

						resConfig[fileName] = dict;
					}
				}
			}
		}
	}

	preprocessScript(buildPath) {
		var openId = this.getOpenId(buildPath);

		if (openId === null || typeof openId === 'undefined' || openId.length === 0 ) {
			return;
		}

		console.log(openId);

		var scriptPath = path.join(buildPath, 'script');

		this.preproccessOpenID(scriptPath, openId);
	}

	preproccessOpenID(scriptPath, openId) {
		if (!this.isPathValid(scriptPath)) {
			return;
		}

		if (openId === null || typeof openId === 'undefined' || openId.length === 0 ) {
			return;
		}

		var subFiles = fs.listSync(scriptPath);
		if (subFiles && subFiles.length > 0) {
			for (var i = 0; i < subFiles.length; i++) {
				var subFilePath = subFiles[i];
				console.log("process openid", subFilePath);

				// dir
				if (fs.isDirectorySync(subFilePath)) {
					// recursive
					this.preproccessOpenID(subFilePath, openId);

				} else if (fs.isFileSync(subFilePath)) {
					var fileContent = fs.readFileSync(subFilePath);
					var fileString = fileContent.toString();

					if (fileString && fileString.length > 0) {
						var regex = new RegExp("YYAPI.res.(\\w+)\\(\\s*[\"|\'](\\w+)[\"|\']\\s*\\)","g")
						var newStr = fileString.replace(regex, 'YYAPI.res.$1_plugin(\"$2\",\"'+openId +'\")');
						fs.writeFileSync(subFilePath, newStr);
					}
				}
			}
		}
	}

	getOpenId(buildPath) {
		if (!this.isPathValid(buildPath)) {
			return null;
		}

		var configPath = path.join(buildPath, 'config.json');
		if (!fs.existsSync(configPath)) {
			return null;
		}

		// 读取config
		var configContent = fs.readFileSync(configPath);
		var configString = configContent.toString();
		var config = {};

		try {
			config = JSON.parse(configString);
			var openId = config["openId"];
			return openId;

		} catch (e) {
			console.log(e);
			return null;
		}
	}

	isPathValid(filePath) {
		if (filePath != null && typeof filePath === 'string' && filePath.length > 0) {
			return true;
		}

		return false;
	}
}

function buildWithAtom(inputPath, outputPath){
	new IOSBuild().build(inputPath, outputPath);
}
exports.buildWithAtom = buildWithAtom;
