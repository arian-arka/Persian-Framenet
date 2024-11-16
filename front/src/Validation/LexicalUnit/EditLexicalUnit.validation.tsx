import {number, object, string} from "yup";
import Language from "../../Core/Language";

export default {
    schema : object({
        name: string()
            .required(Language.get('errors.string.required', Language.get('keys.lexicalUnit.name')))
            .min(1, Language.get('errors.string.min', Language.get('keys.lexicalUnit.name'), 1))
            .max(500, Language.get('errors.string.max', Language.get('keys.lexicalUnit.name'), 500)),
        type: number()
            .required(Language.get('errors.string.required', Language.get('keys.lexicalUnit.type'))),
        definition: string()
            .notRequired()
            .max(5000, Language.get('errors.string.max', Language.get('keys.lexicalUnit.definition'), 5000)),

    })
}