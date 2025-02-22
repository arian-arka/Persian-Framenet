import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import {ChangeTaggedSentenceStatusInterface} from "../TaggedSentence.interface";
import {TAGGED_SENTENCE_STATUS} from "../TaggedSentence.constant";



export default class ChangeTaggedSentenceStatusValidation extends Validation<ChangeTaggedSentenceStatusInterface> {
    rules(): JSONSchemaType<ChangeTaggedSentenceStatusInterface> {
        return {
            type: "object",
            additionalProperties: false,
            required: ["status"],
            properties: {
                status: {type: "number"},
            },
        }
    }


    custom(): Function {
        return async (data: ChangeTaggedSentenceStatusInterface) => {
            if (Object.values(TAGGED_SENTENCE_STATUS).indexOf(data.status) === -1)
                return this.pair('status', 'validation.taggedSentence.status')
        }
    }
}