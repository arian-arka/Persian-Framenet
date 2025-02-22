import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import {StoreFrameRelationInterface} from "../FrameRelation.interface";
import FrameRelationService from "../FrameRelation.service";

export default class StoreFrameRelationValidation extends Validation<StoreFrameRelationInterface> {
    rules(): JSONSchemaType<StoreFrameRelationInterface> {
        return {
            type: "object",
            additionalProperties: false,
            required: ["name", "fromFrame","toFrame"],
            properties: {
                name: {type: "string", minLength: 1, maxLength: 500},
                fromFrame: {type: "string"},
                toFrame: {type: "string"},
            },

            errorMessage: {
                type: this.generate('validation.type'),
                required: {
                    name: this.generate('validation.required', 'frameRelationName'),
                    fromFrame: this.generate('validation.required', 'frameRelationFromFrame'),
                    toFrame: this.generate('validation.required', 'frameRelationToFrame'),
                },

                properties: {
                    name: this.generate('validation.frameRelation.name'),
                    fromFrame: this.generate('validation.frameRelation.fromFrame'),
                    toFrame: this.generate('validation.frameRelation.toFrame'),
                }
            }

        }
    }


    custom(): Function {
        return async (data: StoreFrameRelationInterface) => {
            if(! await FrameRelationService.exists({frame:data.fromFrame}) || ! await FrameRelationService.exists({frame:data.toFrame}))
                return this.pair('','');
        }
    }
}