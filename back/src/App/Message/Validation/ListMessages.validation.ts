import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import {PaginateMessageInterface} from "../Message.interface";
import {MESSAGE_FOR} from "../Message.constants";

export default class ListMessagesValidation extends Validation<PaginateMessageInterface> {
    rules(): JSONSchemaType<PaginateMessageInterface> {
        return {
            type: "object",
            properties: {
                isFor:{type:"number",nullable:true},
                page:{type:"number",minimum:1},
                linkPerPage:{type:"number",minimum:1},
                limit:{type:"number",minimum:1},
                opened:{type:"boolean",nullable:true},
                sort:{type:"number",minimum:1,nullable:true}
            },
            required: ["page","linkPerPage","limit"],
            additionalProperties: false
        }
    }

    custom(): Function {
        return async (data: PaginateMessageInterface) => {
            if(data.isFor && !Object.values(MESSAGE_FOR).includes(data.isFor))
                return {'isFor' : 'Invalid'};
        }
    }

}
