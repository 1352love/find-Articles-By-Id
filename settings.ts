import { App, PluginSettingTab, Setting } from "obsidian";
import SMEditorPlugin from "./main";

export class SettingsTab extends PluginSettingTab {
    plugin: SMEditorPlugin;
    constructor(app: App, plugin: SMEditorPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        let { containerEl } = this;
        containerEl.empty();
        containerEl.createEl("h2", { text: this.plugin.manifest.name });
        new Setting(containerEl)
        .setName("SMEditorPro action config path")
        .addText(cb => cb.onChange(value => {
            this.plugin.settings.qkIniPath = value;
            this.plugin.saveSettings();
        }).setValue(this.plugin.settings.qkIniPath));

        new Setting(containerEl)
            .setName("UID field in frontmatter")
            .addText(cb => cb.onChange(value => {
                this.plugin.settings.idField = value;
                this.plugin.saveSettings();
            }).setValue(this.plugin.settings.idField));
        new Setting(containerEl)
            .setName("SMEditorProPlugin_OB2SM action id")
            .addText(cb => cb.onChange(value => {
                this.plugin.settings.SMEditorProPlugin_OB2SM_Id = value;
                this.plugin.saveSettings();
            }).setValue(this.plugin.settings.SMEditorProPlugin_OB2SM_Id));


    }
}
