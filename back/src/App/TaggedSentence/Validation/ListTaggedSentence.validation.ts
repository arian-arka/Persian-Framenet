import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import {PaginateTaggedSentenceInterface} from "../TaggedSentence.interface";
import UserService from "../../User/User.service";
// import FrameService from "../../Frame/Frame.service";
// import LexicalUnitService from "../../LexicalUnit/LexicalUnit.service";
// import {Types} from "mongoose";

export default class ListTaggedSentenceValidation extends Validation<PaginateTaggedSentenceInterface> {
    rules(): JSONSchemaType<PaginateTaggedSentenceInterface> {
        return {
            type: "object",
            properties: {
                words: {
                    type: "array",
                    items: {type: "string", minLength: 1, maxLength: 300},
                    minItems: 0,
                    maxItems: 200,
                    nullable: true
                },
                user: {type: "string", maxLength: 30, nullable: true},
                issuer: {type: "string", maxLength: 1, nullable: true},
                frame: {type: "string", minLength: 1, maxLength: 1000, nullable: true},
                frameHelper: {type: "string", minLength: 1, maxLength: 1000, nullable: true},
                lexicalUnit: {type: "string", minLength: 1, maxLength: 1000, nullable: true},
                lexicalUnitHelper: {type: "string", minLength: 1, maxLength: 1000, nullable: true},
                lexicalUnitHint: {type: "string", minLength: 1, maxLength: 1000, nullable: true},
                status: {type: "number", minimum: 1, nullable: true},
                lang: {type: "number", minimum: 1,maximum:2, nullable: true},

                page: {type: "number", minimum: 1},
                linkPerPage: {type: "number", minimum: 1},
                limit:{type:"integer",minimum:1,maximum:2500},
                sort: {type: "number", minimum: 1, nullable: true}
            },
            required: ["page", "linkPerPage", "limit"],
            additionalProperties: false
        }
    }

    custom(): Function {
        return async (data: PaginateTaggedSentenceInterface) => {
            if(!!data.user && !await UserService.exists({_id:data.user}))
                return {'user':'user not found'};
            // console.log('$#$#',data);
            //
            // if (data.frame) {
            //     const frame = await FrameService.find(data.frame);
            //     if (!frame)
            //         return {frame: 'frame not found'}
            //     const lexicalUnit = await LexicalUnitService.find(data.lexicalUnit);
            //     if (!lexicalUnit)
            //         return {frame: 'lexical unit not found'}
            //     if (!frame._id.equals(lexicalUnit.frame as Types.ObjectId))
            //         return {lexicalUnit: 'irrelevant lexical unit'};
            // } else if (data.lexicalUnit)
            //     return {lexicalUnit: 'must be empty'};
        }
    }

}
