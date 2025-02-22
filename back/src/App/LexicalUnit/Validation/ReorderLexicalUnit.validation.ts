import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import {ReorderLexicalUnitInterface} from "../LexicalUnit.interface";

export default class ReorderLexicalUnitValidation extends Validation<ReorderLexicalUnitInterface> {
    rules(): JSONSchemaType<ReorderLexicalUnitInterface> {
        return {
            type: "object",
            additionalProperties: false,
            required: ["lexicalUnit"],
            properties: {
                lexicalUnit: {type: "string", minLength: 24, maxLength: 24},
                after: {type: "string", minLength: 24, maxLength: 24,nullable:true},
            },
        }
    }


    custom(): Function {
        return async (data: ReorderLexicalUnitInterface) => {

        }
    }
}