import { SettingModel } from "../resolved-models";

export default class Settings {
  public static _settings: Map<string, any> = new Map<string, any>();

  public static async init() {
    const settings = await SettingModel.find({}).lean();
    settings.forEach((setting) => {
      this._settings.set(setting.name, setting.value);
    });
  }

  public static get(name: string) {
    return this._settings.get(name);
  }

  public static getJson(name : string) {
    return JSON.parse(this.get(name));
  }

}
