import {number, object, string} from "yup";
import Language from "../../Core/Language";

export default {
    schema : object({
        name: string()
            .required(Language.get('errors.string.required', Language.get('keys.frame.name')))
            .min(1, Language.get('errors.string.min', Language.get('keys.frame.name'), 1))
            .max(500, Language.get('errors.string.max', Language.get('keys.frame.name'), 500)),
        semanticType: string()
            .notRequired()
            .max(500, Language.get('errors.string.max', Language.get('keys.frame.semanticType'), 500)),

        lang: number()
            .required(Language.get('errors.string.required', Language.get('keys.frame.type'))),

        definition: string()
            .required(Language.get('errors.string.required', Language.get('keys.frame.definition')))
            .min(1, Language.get('errors.string.min', Language.get('keys.frame.definition'), 1))
            .max(5000, Language.get('errors.string.max', Language.get('keys.frame.definition'), 5000)),

    })
}