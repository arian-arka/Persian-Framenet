import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import {PublishFrameInterface,} from "../Frame.interface";
import {FRAME_STATUS} from "../Frame.contant";


export default class PublishFrameValidation extends Validation<PublishFrameInterface> {
    rules(): JSONSchemaType<PublishFrameInterface> {
        return {
            type: "object",
            additionalProperties: false,
            required: ["status"],
            properties: {
                status: {type: "integer"},
                message: {type: "string",maxLength:5000,nullable:true},
            },
        }
    }


    custom(): Function {
        return async (data: PublishFrameInterface) => {
            if (Object.values(FRAME_STATUS).indexOf(data.status) === -1)
                return this.pair('status', 'validation.frame.status')
        }
    }
}