import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import {ChangeFrameStatusInterface,} from "../Frame.interface";
import {FRAME_STATUS} from "../Frame.contant";


export default class ChangeFrameStatusValidation extends Validation<ChangeFrameStatusInterface> {
    rules(): JSONSchemaType<ChangeFrameStatusInterface> {
        return {
            type: "object",
            additionalProperties: false,
            required: ["status"],
            properties: {
                status: {type: "integer"},
            },
        }
    }


    custom(): Function {
        return async (data: ChangeFrameStatusInterface) => {
            if (Object.values(FRAME_STATUS).indexOf(data.status) === -1)
                return this.pair('status', 'validation.frame.status')
        }
    }
}