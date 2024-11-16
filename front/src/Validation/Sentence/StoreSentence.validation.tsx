import {array, number, object, string} from "yup";
import Language from "../../Core/Language";

export default {
    schema : object({
        words: array()
            .required(Language.get('errors.array.required', Language.get('keys.sentence.words')))
            .of(string().required(Language.get('errors.array.required', Language.get('keys.sentence.words'))))
            .min(1, Language.get('errors.array.required', Language.get('keys.sentence.words')))
    })
}