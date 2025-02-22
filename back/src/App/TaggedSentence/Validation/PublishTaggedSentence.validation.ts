import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import {PublishTaggedSentenceInterface} from "../TaggedSentence.interface";
import {TAGGED_SENTENCE_STATUS} from "../TaggedSentence.constant";


export default class PublishTaggedSentenceValidation extends Validation<PublishTaggedSentenceInterface> {
    rules(): JSONSchemaType<PublishTaggedSentenceInterface> {
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
        return async (data: PublishTaggedSentenceInterface) => {
            if (Object.values(TAGGED_SENTENCE_STATUS).indexOf(data.status) === -1)
                return this.pair('status', 'validation.taggedSentence.status')
        }
    }
}