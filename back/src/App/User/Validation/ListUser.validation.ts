import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import { PaginateUserInterface} from "../User.interface";

export default class ListUserValidation extends Validation<PaginateUserInterface> {
    rules(): JSONSchemaType<PaginateUserInterface> {
        return {
            type: "object",
            properties: {
                name:{type:"string", maxLength: 300,nullable:true},
                email:{type:"string", maxLength: 340,nullable:true},
                suspended:{type:"boolean",nullable:true},

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
        return async (data: PaginateUserInterface) => {}
    }

}
