import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import {PaginateFrameInterface} from "../Frame.interface";
import {FRAME_STATUS} from "../Frame.contant";

export default class ListFrameValidation extends Validation<PaginateFrameInterface> {
    rules(): JSONSchemaType<PaginateFrameInterface> {
        return {
            type: "object",
            properties: {
                issuer:{type:"string", maxLength: 1,nullable:true},
                name:{type:"string", maxLength: 300,nullable:true},
                lang:{type:"integer",minimum:1,nullable:true},
                status:{type:"integer",nullable:true},
                page:{type:"integer",minimum:1},
                linkPerPage:{type:"integer",minimum:1},
                limit:{type:"integer",minimum:1,maximum:2500},
                sort:{type:"integer",minimum:1,maximum:9,nullable:true}
            },
            required: ["page","linkPerPage","limit"],
            additionalProperties: false
        }
    }

    custom(): Function {
        return async (data: PaginateFrameInterface) => {
            if (data.status && Object.values(FRAME_STATUS).indexOf(data.status) === -1)
                return this.pair('status', 'validation.frame.status')
        }
    }

}
