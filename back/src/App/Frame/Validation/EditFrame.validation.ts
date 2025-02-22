import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import FrameService from "../Frame.service";
import FrameInterface, { EditFrameInterface } from "../Frame.interface";



export default class EditFrameValidation extends Validation<EditFrameInterface,FrameInterface> {
    rules(): JSONSchemaType<EditFrameInterface> {
        return {
            type: "object",
            additionalProperties: false,
            required: ["name", "lang", "definition"],
            properties: {
                name: {type: "string", minLength: 1, maxLength: 500},
                lang: {type: "integer"},
                definition: {type: "string", minLength: 1, maxLength: 5000},
                mirror: {type: "string", minLength: 1, maxLength: 200,nullable:true},
                semanticType: {type: "string", minLength: 1, maxLength: 500,nullable:true},
            },

            errorMessage: {
                type: this.generate('validation.type'),
                required: {
                    name: this.generate('validation.required', 'frameName'),
                    lang: this.generate('validation.required', 'frameLang'),
                    definition: this.generate('validation.required', 'frameDefinition'),
                },

                properties: {
                    name: this.generate('validation.frame.name'),
                    lang: this.generate('validation.frame.lang'),
                    definition: this.generate('validation.frame.definition'),
                    semanticType: this.generate('validation.frame.semanticType'),
                }
            }

        }
    }


    custom(): Function {
        return async (data: EditFrameInterface) => {
            if(await FrameService.exists({
                name:data.name,
                _id:{'$ne' : this.additionalData._id}
            }))
                return this.pair('name','validation.frame.nameExists')
            if(data.mirror && !await FrameService.exists({_id:data.mirror}))
                return this.pair('mirror','validation.frame.mirror')
        }
    }
}