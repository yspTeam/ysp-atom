'use babel';

import fs from 'fs-plus';
import FileUtils from './file/file-utils';
import path from 'path';

export default class ProjectConfig {

    static masterAppUpdated() {
        var updated = atom.config.get('ysp.masterAppUpdated');
        if (updated == 1) {
            return true;
        } else {
            return false;
        }
    }

    static setMasterAppUpdated(updated) {
        var value;
        if (updated == true) {
            value = 1;
        } else {
            value = 0;
        }
        atom.config.set('ysp.masterAppUpdated', value);
    }

    static quickDebug() {
        var b = atom.config.get('ysp.quickDebug');
        if (b == 1) {
            return true;
        } else {
            return false;
        }
    }

    static setQuickDebug(b) {
        var value;
        if (b == true) {
            value = 1;
        } else {
            value = 0;
        }
        atom.config.set('ysp.quickDebug', value);
    }

    static getProjectConfigJson() {
        var projectConfigPath = path.join(FileUtils.rootPath(), 'project.json')
        var configContent = fs.readFileSync(projectConfigPath);
        var json = JSON.parse(configContent);
        return json;
    }

    static saveProjectConfigJson(json) {
        var projectConfigPath = path.join(FileUtils.rootPath(), 'project.json')
        fs.writeFileSync(projectConfigPath, JSON.stringify(json));
    }

    static androidBuildToolsURL() {
        try {
            var json = ProjectConfig.getProjectConfigJson();
            return json.androidBuildToolsURL;

        } catch (e) {
            console.log('androidBuildToolsURL err:' + e);
            return "";
        } finally {}
    }
    static setAndroidBuildToolsURL(val) {
        try {
            var json = ProjectConfig.getProjectConfigJson();
            json.androidBuildToolsURL = val;
            ProjectConfig.saveProjectConfigJson(json);

        } catch (e) {
            console.log('setAndroidBuildToolsURL err:' + e);
        } finally {}
    }
    static masterAndroidAppUpdateURL() {
        try {
            var json = ProjectConfig.getProjectConfigJson();
            return json.androidAppUrl;

        } catch (e) {
            console.log('masterAppUpdateURL err:' + e);
            return "";
        } finally {}
    }
    static setMasterAndroidAppUpdateURL(val) {
        try {
            var json = ProjectConfig.getProjectConfigJson();
            json.androidAppUrl = val;
            ProjectConfig.saveProjectConfigJson(json);

        } catch (e) {
            console.log('setMasterAppUpdateURL err:' + e);
        } finally {}
    }
    static masteriOSAppUpdateURL() {
        try {
            var json = ProjectConfig.getProjectConfigJson();
            return json.iosAppUrl;

        } catch (e) {
            console.log('masterAppUpdateURL err:' + e);
            return "";
        } finally {}
    }
    static setMasteriOSAppUpdateURL(val) {
        try {
            var json = ProjectConfig.getProjectConfigJson();
            json.iosAppUrl = val;
            ProjectConfig.saveProjectConfigJson(json);

        } catch (e) {
            console.log('setMasterAppUpdateURL err:' + e);
        } finally {}
    }

    static iosBundleId() {
        try {
            var json = ProjectConfig.getProjectConfigJson();

            return json.iosBundleId;

        } catch (e) {
            console.log('iosBundleId err:' + e);
            return "";
        } finally {}
    }
    static setIosBundleId(val) {
        try {
            var json = ProjectConfig.getProjectConfigJson();
            json.iosBundleId = val;
            ProjectConfig.saveProjectConfigJson(json);

        } catch (e) {
            console.log('setIosBundleId err:' + e);
        } finally {}
    }

    static androidPackage() {
        try {
            var json = ProjectConfig.getProjectConfigJson();

            return json.androidPackageName;

        } catch (e) {
            console.log('androidPackage err:' + e);
            return "";
        } finally {}
    }
    static setAndroidPackage(val) {
        try {
            var json = ProjectConfig.getProjectConfigJson();
            json.androidPackageName = val;
            ProjectConfig.saveProjectConfigJson(json);

        } catch (e) {
            console.log('setAndroidPackage err:' + e);
        } finally {}
    }

    static androidScheme() {
        try {
            var json = ProjectConfig.getProjectConfigJson();

            return json.androidScheme;

        } catch (e) {
            console.log('androidScheme err:' + e);
            return "";
        } finally {}
    }
    static setAndroidScheme(val) {
        try {
            var json = ProjectConfig.getProjectConfigJson();
            json.androidScheme = val;
            ProjectConfig.saveProjectConfigJson(json);

        } catch (e) {
            console.log('setAndroidScheme err:' + e);
        } finally {}
    }

    static iosScheme() {
        try {
            var json = ProjectConfig.getProjectConfigJson();

            return json.iosScheme;

        } catch (e) {
            console.log('iosScheme err:' + e);
            return "";
        } finally {}
    }
    static setIosScheme(val) {
        try {
            var json = ProjectConfig.getProjectConfigJson();
            json.iosScheme = val;
            ProjectConfig.saveProjectConfigJson(json);

        } catch (e) {
            console.log('setIosScheme err:' + e);
        } finally {}
    }

    static androidAppFileName() {
        try {
            var json = ProjectConfig.getProjectConfigJson();

            return json.androidAppFileName;

        } catch (e) {
            console.log('androidAppFileName err:' + e);
            return "";
        } finally {}
    }
    static setAndroidAppFileName(val) {
        try {
            var json = ProjectConfig.getProjectConfigJson();
            json.androidAppFileName = val;
            ProjectConfig.saveProjectConfigJson(json);

        } catch (e) {
            console.log('setAndroidAppFileName err:' + e);
        } finally {}
    }

    static iosAppFileName() {
        try {
            var json = ProjectConfig.getProjectConfigJson();

            return json.iosAppFileName;

        } catch (e) {
            console.log('iosAppFileName err:' + e);
            return "";
        } finally {}
    }
    static setIosAppFileName(val) {
        try {
            var json = ProjectConfig.getProjectConfigJson();
            json.iosAppFileName = val;
            ProjectConfig.saveProjectConfigJson(json);

        } catch (e) {
            console.log('setIosAppFileName err:' + e);
        } finally {}
    }
}
