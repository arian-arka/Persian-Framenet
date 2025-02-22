import mongoose from "mongoose";
import Config from "../Core/Instance/Config";

const connections = (config : Config) => {
    return {
        mongoose : {
            open : async () => await mongoose.connect(config.Connection.mongodb),
            close : async (con : any) => await mongoose.connection.close(),
        }
    }
}

export default connections;