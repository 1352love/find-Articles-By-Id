import {parseFrontMatterEntry, Plugin, TFile,FileSystemAdapter } from 'obsidian';
import { SettingsTab } from "./settings";
import {SMEditorPluginSettings} from "./types";
import * as fs from 'fs';
const DEFAULT_SETTINGS: SMEditorPluginSettings = {
    idField: "id",
	qkIniPath: "",
    SMEditorProPlugin_OB2SM_Id:"",
};
export default class SMEditorPlugin extends Plugin {
	settings: SMEditorPluginSettings;

	onInit() {

	}

	async onload() {
        await this.loadSettings();
        this.addSettingTab(new SettingsTab(this.app, this));
        let syncitem = this.addStatusBarItem();
        //syncitem.createEl("span",{text:"⏳Sync..",cls:"syncitemcls"})
        syncitem.createEl("span",{text:"⏳Sync.."});
        syncitem.style.display = "none";
        

        this.addCommand({
            id: "quicker tempMd to md",
            name: "quicker tempMd to md",
            callback: () => {
                // const fileModal = new FileModal(this, "Used file for search and replace");
                // fileModal.open();
                // fileModal.onChooseItem = (filePath: FileModalData) => {
                //     const searchModal = new SearchModal(this);
                //     searchModal.open();
                //     searchModal.onChooseSuggestion = (item: SearchModalData) => {
                //         new ReplaceModal(this, item, filePath?.source).open();
                //     };
                // };
				
				let configTxt  = fs.readFileSync(this.settings.qkIniPath, {encoding: 'utf8'});
				console.log(configTxt);
				console.log(this.pad(configTxt.match(/editedEleId ?= ?(.+)/)[1],8));
				const res = this.getFileFromUID(this.pad(configTxt.match(/editedEleId ?= ?(.+)/)[1],8))?.path;
				if (res != undefined) {
                    let outputPath = this.app.vault.adapter.basePath+"\\"+res.replaceAll("/","\\");
                    syncitem.style.display = "block";
					window.open("quicker:runaction:"+this.settings.SMEditorProPlugin_OB2SM_Id+"?"+outputPath);
                    this.registerInterval(
                        window.setInterval(() => this.updateSyncStatusBar(syncitem), 5000)
                    );
                    
                    
                }else{
					window.open("quicker:runaction:"+this.settings.SMEditorProPlugin_OB2SM_Id+"?NoPath");
               

                }
            },
        });







    }
    updateSyncStatusBar(syncitem:HTMLElement) {
        syncitem.style.display="none";
      }
	getFileFromUID(uid: string): TFile | undefined {
        const files = this.app.vault.getFiles();
        const idKey = this.settings.idField;
        var temp =files.find(file => parseFrontMatterEntry(this.app.metadataCache.getFileCache(file)?.frontmatter, idKey) == uid);
    
        //return files.find(file => parseFrontMatterEntry(this.app.metadataCache.getFileCache(file)?.frontmatter, idKey) == uid);
        return temp;
    }
	pad(num:string, size:number) {
		var s = "000000000" + num;
		return s.substr(s.length-size);
	}
    async loadSettings() {
        this.settings = Object.assign(DEFAULT_SETTINGS, await this.loadData());
    }
	async saveSettings() {
        await this.saveData(this.settings);
    }

	onunload() {
		console.log('unloading plugin');
	}
}

