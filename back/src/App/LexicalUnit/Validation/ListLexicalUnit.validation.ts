import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import {PaginateLexicalUnitInterface} from "../LexicalUnit.interface";
import {LEXICAL_UNIT_TYPE} from "../LexicalUnit.contant";

export default class ListLexicalUnitValidation extends Validation<PaginateLexicalUnitInterface> {
    rules(): JSONSchemaType<PaginateLexicalUnitInterface> {
        return {
            type: "object",
            properties: {
                name:{type:"string", maxLength: 300,nullable:true},
                type:{type:"integer",nullable:true},
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
        return async (data: PaginateLexicalUnitInterface) => {
            if(!!data.type && !Object.values(LEXICAL_UNIT_TYPE).includes(data.type))
                return this.pair('type','validation.lexicalUnit.type');
        }
    }

}
