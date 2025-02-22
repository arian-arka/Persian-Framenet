import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import {EditSentenceInterface, SentenceInterface} from "../Sentence.interface";
import SentenceService from "../Sentence.service";

export default class EditSentenceValidation extends Validation<EditSentenceInterface,SentenceInterface> {
    rules(): JSONSchemaType<EditSentenceInterface> {
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
        return async (data: EditSentenceInterface) => {
            if(await SentenceService.wordsExists(data.words,this.additionalData._id))
                return this.pair('words','validation.sentence.wordsExists');
        }
    }
}