import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import {PaginateAllLogInterface} from "../Log.interface";
import {LOG_TYPE} from "../Log.constants";

export default class ListLogValidation extends Validation<PaginateAllLogInterface> {
    rules(): JSONSchemaType<PaginateAllLogInterface> {
        return {
            type: "object",
            properties: {
                type:{type:"number",nullable:true},
                period:{type:"number",nullable:true},

                page:{type:"number",minimum:1},
                linkPerPage:{type:"number",minimum:1},
                limit:{type:"number",minimum:1,maximum:2500},
                sort:{type:"number",minimum:1,nullable:true}
            },
            required: ["page","linkPerPage","limit"],
            additionalProperties: false
        }
    }

    custom(): Function {
        return async (data: PaginateAllLogInterface) => {
            if((data.type || data.type === 0) && !Object.values(LOG_TYPE).includes(data.type))
                return {'2':'2'};
        }
    }

}
