import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import { StoreSentenceInterface} from "../Sentence.interface";
import SentenceService from "../Sentence.service";

export default class StoreSentenceValidation extends Validation<StoreSentenceInterface> {
    rules(): JSONSchemaType<StoreSentenceInterface> {
        return {
            type: "object",
            properties: {
                words: {
                    type: "array",
                    items: {type: "string", minLength: 1, maxLength: 300},
                    minItems:1,
                    maxItems:200,
                },
            },
            required: ["words"],
            additionalProperties: false,
            errorMessage: {
                type: this.generate('validation.type'),
                required: {
                    words: this.generate('validation.required', 'sentenceWords'),
                },

                properties: {
                    words: this.generate('validation.sentence.words'),
                }
            }
        }
    }


    custom(): Function {
        return async (data: StoreSentenceInterface) => {
            if(await SentenceService.wordsExists(data.words))
                return this.pair('words','validation.sentence.wordsExists');
        }
    }
}