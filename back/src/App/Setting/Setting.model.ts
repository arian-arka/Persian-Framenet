import {Schema, model} from "mongoose";
import {SettingInterface} from "./Setting.interface";

export const SettingSchema = new Schema<SettingInterface>({
    name: String,
    body : Schema.Types.Mixed,
}, {
    timestamps: {
        createdAt: 'createdAt',
        updatedAt: 'updatedAt',
    }
})
SettingSchema.index({name: 1})
export const SettingModel = model('setting', SettingSchema);