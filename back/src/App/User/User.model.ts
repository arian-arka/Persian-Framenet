import { Schema,model } from "mongoose";
import UserInterface from "./User.interface";

export const UserSchema = new Schema<UserInterface>({
    name: String,
    email: {type: String},
    password: String,
    privileges: {type: [Number]},
    isSuperAdmin : {type : Boolean,default:false},
    lastLogout : { type : Date, default: null },
    lastLogin : { type : Date, default: null },
    suspendedAt : { type : Date, default: null },
},{
    timestamps:{
        createdAt : 'createdAt',
        updatedAt : 'updatedAt',
    }
})
UserSchema.index({email: 'text'})
export const UserModel = model('user',UserSchema);