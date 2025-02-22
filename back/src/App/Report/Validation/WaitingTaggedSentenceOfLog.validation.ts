import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import { WaitingTaggedSentenceOfLogInterface} from "../Report.interface";
import Str from "../../../Core/Singleton/Str";

export default class WaitingTaggedSentenceOfLogValidation extends Validation<WaitingTaggedSentenceOfLogInterface> {
    rules(): JSONSchemaType<WaitingTaggedSentenceOfLogInterface> {
        return {
            type: "object",
            additionalProperties: false,
            // required: ["name", "type", "color","definition"],
            properties: {
                users: {
                    type: "array",
                    items: {type: "string"},
                    minItems: 0,
                    maxItems: 20,
                    nullable:true
                },
            },

            // errorMessage: {
            //     type: this.generate('validation.type'),
            //     required: {
            //         name: this.generate('validation.required', 'elementName'),
            //         type: this.generate('validation.required', 'elementType'),
            //         definition: this.generate('validation.required', 'elementDefinition'),
            //         color: this.generate('validation.required', 'elementColor'),
            //     },
            //
            //     properties: {
            //         name: this.generate('validation.element.name'),
            //         type: this.generate('validation.element.type'),
            //         definition: this.generate('validation.element.definition'),
            //         color: this.generate('validation.element.color'),
            //         semanticType: this.generate('validation.element.semanticType'),
            //         abbreviation: this.generate('validation.element.abbreviation'),
            //         excludes: this.generate('validation.element.excludes'),
            //     }
            // }

        }
    }


    custom(): Function {
        return async (data: WaitingTaggedSentenceOfLogInterface) => {
            for(let  _id of data.users ?? [])
                if(!Str.isValidObjectId(_id))
                    return {'users' : 'invalid id'};
        }
    }
}