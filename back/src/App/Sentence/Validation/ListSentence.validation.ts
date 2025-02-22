import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import {PaginateSentenceInterface} from "../Sentence.interface";

export default class ListSentenceValidation extends Validation<PaginateSentenceInterface> {
    rules(): JSONSchemaType<PaginateSentenceInterface> {
        return {
            type: "object",
            properties: {
                words: {
                    type: "array",
                    items: {type: "string", minLength: 1, maxLength: 300},
                    minItems:0,
                    maxItems:200,
                    nullable:true
                },
                lang:{type:"number",minimum:1,maximum:2,nullable:true},
                page:{type:"number",minimum:1},
                linkPerPage:{type:"number",minimum:1},
                limit:{type:"integer",minimum:1,maximum:2500},
                sort:{type:"number",minimum:1,nullable:true}
            },
            required: ["page","linkPerPage","limit"],
            additionalProperties: false
        }
    }

    custom(): Function {
        return async (data: PaginateSentenceInterface) => {}
    }

}
