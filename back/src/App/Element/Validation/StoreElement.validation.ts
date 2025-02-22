import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import {StoreElementInterface} from "../Element.interface";
import {ELEMENT_TYPE} from "../Element.contant";

export default class StoreElementValidation extends Validation<StoreElementInterface> {
    rules(): JSONSchemaType<StoreElementInterface> {
        return {
            type: "object",
            additionalProperties: false,
            required: ["name", "type", "color","definition"],
            properties: {
                name: {type: "string", minLength: 1, maxLength: 500},
                type: {type: "integer"},
                color: {type: "string", minLength: 7, maxLength: 7},
                definition: {type: "string",minLength: 1, maxLength: 5000},
                semanticType: {type: "string", minLength: 1, maxLength: 500,nullable:true},
                abbreviation: {type: "string", minLength: 1, maxLength: 500,nullable:true},
                excludes: {type: "string", minLength: 1, maxLength: 500,nullable:true},
            },

            errorMessage: {
                type: this.generate('validation.type'),
                required: {
                    name: this.generate('validation.required', 'elementName'),
                    type: this.generate('validation.required', 'elementType'),
                    definition: this.generate('validation.required', 'elementDefinition'),
                    color: this.generate('validation.required', 'elementColor'),
                },

                properties: {
                    name: this.generate('validation.element.name'),
                    type: this.generate('validation.element.type'),
                    definition: this.generate('validation.element.definition'),
                    color: this.generate('validation.element.color'),
                    semanticType: this.generate('validation.element.semanticType'),
                    abbreviation: this.generate('validation.element.abbreviation'),
                    excludes: this.generate('validation.element.excludes'),
                }
            }

        }
    }


    custom(): Function {
        return async (data: StoreElementInterface) => {
            if(!(/^#[0-9A-F]{6}$/i.test(data.color)))
                return this.pair('color','validation.element.color');
            if(!Object.values(ELEMENT_TYPE).includes(data.type))
                return this.pair('type','validation.element.type');
        }
    }
}