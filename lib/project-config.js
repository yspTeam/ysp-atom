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

    static masterAndroidAppUpdateURL() {
        try {
            var json = ProjectConfig.getProjectConfigJson();
            return json.masterAppUrl;

        } catch (e) {
            console.log('masterAppUpdateURL err:' + e);
        } finally {}
    }
    static setMasterAndroidAppUpdateURL(val) {
        try {
            var json = ProjectConfig.getProjectConfigJson();
            json.masterAppUrl = val;
            ProjectConfig.saveProjectConfigJson(json);

        } catch (e) {
            console.log('setMasterAppUpdateURL err:' + e);
        } finally {}
    }
        static masteriOSAppUpdateURL() {
            try {
                var json = ProjectConfig.getProjectConfigJson();
                return json.masterAppUrl;

            } catch (e) {
                console.log('masterAppUpdateURL err:' + e);
            } finally {}
        }
        static setMasteriOSAppUpdateURL(val) {
            try {
                var json = ProjectConfig.getProjectConfigJson();
                json.masterAppUrl = val;
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

    static androidPackageName() {
        try {
            var json = ProjectConfig.getProjectConfigJson();

            return json.androidPackageName;

        } catch (e) {
            console.log('androidPackageName err:' + e);
        } finally {}
    }
    static setAndroidPackageName(val) {
        try {
            var json = ProjectConfig.getProjectConfigJson();
            json.androidPackageName = val;
            ProjectConfig.saveProjectConfigJson(json);

        } catch (e) {
            console.log('setAndroidPackageName err:' + e);
        } finally {}
    }

    static scheme() {
        try {
            var json = ProjectConfig.getProjectConfigJson();

            return json.scheme;

        } catch (e) {
            console.log('scheme err:' + e);
        } finally {}
    }
    static setScheme(val) {
        try {
            var json = ProjectConfig.getProjectConfigJson();
            json.scheme = val;
            ProjectConfig.saveProjectConfigJson(json);

        } catch (e) {
            console.log('setScheme err:' + e);
        } finally {}
    }
}
