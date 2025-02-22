import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import {StoreTaggedSentenceInterface} from "../TaggedSentence.interface";
import {SentenceInterface} from "../../Sentence/Sentence.interface";
import {FRAME_NET_TAGE_TYPE, PROP_BANK_TAGE_TYPE} from "../TaggedSentence.constant";
import FrameService from "../../Frame/Frame.service";
import LexicalUnitService from "../../LexicalUnit/LexicalUnit.service";
import {Types} from "mongoose";
import ElementService from "../../Element/Element.service";

export default class StoreTaggedSentenceValidation extends Validation<StoreTaggedSentenceInterface, SentenceInterface> {
    rules(): JSONSchemaType<StoreTaggedSentenceInterface> {
        return {
            type: "object",
            properties: {
                propBankTags: {
                    type: "array",
                    items: {type: "number", nullable: true},
                    minItems: 1,
                },
                frameNetTags: {
                    type: "array",
                    items: {
                        type: "object",
                        properties: {
                            tagType: {type: "number"},
                            element: {type: "string", minLength: 1, maxLength: 255, nullable: true},
                        },
                        required: ["tagType"],
                        additionalProperties: false
                    },
                    minItems: 1,
                },
                frame: {type: "string", minLength: 1, maxLength: 255, nullable: true},
                lexicalUnit: {type: "string", minLength: 1, maxLength: 255, nullable: true},
                description: {type: "string", maxLength: 1000, nullable: true},
                lexicalUnitHint: {type: "string", maxLength: 1000, nullable: true},
            },
            required: ["propBankTags", "frameNetTags"],
            additionalProperties: false,
            errorMessage: {
                type: this.generate('validation.type'),
                required: {
                    propBankTags: this.generate('validation.required', 'taggedSentencePropBankTags'),
                    frameNetTags: this.generate('validation.required', 'taggedSentenceFrameNetTags'),
                },
                properties: {
                    propBankTags: this.generate('validation.taggedSentence.propBankTags'),
                    frameNetTags: this.generate('validation.taggedSentence.frameNetTags'),
                    frame: this.generate('validation.taggedSentence.frame'),
                    lexicalUnit: this.generate('validation.taggedSentence.lexicalUnit'),
                }
            }
        }
    }


    custom(): Function {
        return async (data: StoreTaggedSentenceInterface) => {
            const sentence = this.additionalData;
            const wordsLen = sentence.words.split(' ').length;
            if (data.propBankTags.length !== wordsLen)
                return this.pair('propBankTags', 'validation.taggedSentence.propBankTags');


            if (data.frameNetTags.length !== wordsLen)
                return this.pair('propBankTags', 'validation.taggedSentence.frameNetTags');

            const propBankValues = Object.values(PROP_BANK_TAGE_TYPE);
            for (let propBankTag of data.propBankTags)
                if (propBankTag && !propBankValues.includes(propBankTag))
                    return this.pair('propBankTags', 'validation.taggedSentence.propBankTags');

            if (data.frame) {
                const frame = await FrameService.find(data.frame);

                if (!frame)
                    return this.pair('frame', 'validation.taggedSentence.frame');

                if (data.lexicalUnit) {
                    const lexicalUnit = await LexicalUnitService.find(data.lexicalUnit);
                    if (!lexicalUnit || !frame._id.equals(lexicalUnit.frame as Types.ObjectId))
                        return this.pair('lexicalUnit', 'validation.taggedSentence.lexicalUnit');
                }

                for (let frameNetTag of data.frameNetTags) {
                    if (frameNetTag.tagType === FRAME_NET_TAGE_TYPE['element'] || (frameNetTag.tagType === FRAME_NET_TAGE_TYPE['lexicalUnit'] && frameNetTag.element)) {
                        const element = await ElementService.find(frameNetTag.element);
                        if (!element || !frame._id.equals(element.frame as Types.ObjectId))
                            return this.pair('frameNetTags', 'validation.taggedSentence.frameNetTags');
                    }
                    else if (frameNetTag.element)
                        return this.pair('frameNetTags', 'validation.taggedSentence.frameNetTags');
                }
            }

            else {
                for (let frameNetTag of data.frameNetTags)
                    if (frameNetTag?.element || FRAME_NET_TAGE_TYPE['empty'] !== frameNetTag.tagType)
                        return this.pair('frameNetTags', 'validation.taggedSentence.frameNetTags');
            }

        }
    }
}