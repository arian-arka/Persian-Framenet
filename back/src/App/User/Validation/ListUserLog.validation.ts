import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import {PaginateLogInterface} from "../../Log/Log.interface";
import {LOG_TYPE} from "../../Log/Log.constants";
import UserService from "../User.service";

export default class ListUserLogValidation extends Validation<PaginateLogInterface> {
    rules(): JSONSchemaType<PaginateLogInterface> {
        return {
            type: "object",
            properties: {
                type:{type:"number",nullable:true},
                period:{type:"number",nullable:true},
                issuer:{type:"string",nullable:true},

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
        return async (data: PaginateLogInterface) => {
            if(! await UserService.find(data?.issuer))
                return {'1':'1'};
            if((data.type || data.type === 0) && !Object.values(LOG_TYPE).includes(data.type))
                return {'2':'2'};
        }
    }

}
