import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import {ReorderElementInterface} from "../Element.interface";

export default class ReorderElementValidation extends Validation<ReorderElementInterface> {
    rules(): JSONSchemaType<ReorderElementInterface> {
        return {
            type: "object",
            additionalProperties: false,
            required: ["element"],
            properties: {
                element: {type: "string", minLength: 24, maxLength: 24},
                after: {type: "string", minLength: 24, maxLength: 24,nullable:true},
            },
        }
    }


    custom(): Function {
        return async (data: ReorderElementInterface) => {

        }
    }
}