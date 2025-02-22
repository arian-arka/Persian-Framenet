import {MongooseService} from "../../Core/Class/MongooseService";
import {SettingInterface} from "./Setting.interface";
import {SettingModel} from "./Setting.model";


export default new class SettingService extends MongooseService<SettingInterface> {
    constructor() {
        super(SettingModel);
    }

    async isSiteDown(){
        const obj = await this._model.findOne({'name':'status'}).exec();
        return !obj || obj.body !== true;
    }

    async setSiteStatus(status : boolean){
        const obj = await this._model.findOne({'name':'status'}).exec();
        if(obj)
            await this.update(obj._id,{'body' : status});
        else
            await this.create({'name':'status','body':status});
    }

}