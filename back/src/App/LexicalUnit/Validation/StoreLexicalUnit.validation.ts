import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import {EditLexicalUnitInterface,} from "../LexicalUnit.interface";
import {LEXICAL_UNIT_TYPE} from "../LexicalUnit.contant";
import FrameInterface from "../../Frame/Frame.interface";
import LexicalUnitService from "../LexicalUnit.service";

export default class StoreLexicalUnitValidation extends Validation<EditLexicalUnitInterface,FrameInterface> {
    rules(): JSONSchemaType<EditLexicalUnitInterface> {
        return {
            type: "object",
            additionalProperties: false,
            required: ["name", "type"],
            properties: {
                name: {type: "string", minLength: 1, maxLength: 500},
                type: {type: "integer"},
                definition: {type: "string", maxLength: 5000,nullable:true},
            },

            errorMessage: {
                type: this.generate('validation.type'),
                required: {
                    name: this.generate('validation.required', 'lexicalUnitName'),
                    type: this.generate('validation.required', 'lexicalUnitType'),
                },

                properties: {
                    name: this.generate('validation.lexicalUnit.name'),
                    type: this.generate('validation.lexicalUnit.type'),
                    definition: this.generate('validation.lexicalUnit.definition'),
                }
            }

        }
    }


    custom(): Function {
        return async (data: EditLexicalUnitInterface) => {
            if(!Object.values(LEXICAL_UNIT_TYPE).includes(data.type))
                return this.pair('type','validation.lexicalUnit.type');
            if(await LexicalUnitService.exists({
                type:data.type,
                name:data.name,
                frame:this.additionalData._id
            }))
                return this.pair('frame','validation.lexicalUnit.frameExists');
        }
    }
}