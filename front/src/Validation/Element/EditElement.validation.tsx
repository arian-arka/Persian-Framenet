import {number, object, string} from "yup";
import Language from "../../Core/Language";

export default {
    schema : object({

        name: string()
            .required(Language.get('errors.string.required', Language.get('keys.element.name')))
            .min(1, Language.get('errors.string.min', Language.get('keys.element.name'), 1))
            .max(500, Language.get('errors.string.max', Language.get('keys.element.name'), 500)),
        type: number()
            .required(Language.get('errors.string.required', Language.get('keys.element.type'))),
        abbreviation: string()
            .notRequired()
            .nullable().transform((value) => !!value ? value : null)
            .min(1, Language.get('errors.string.min', Language.get('keys.element.abbreviation'), 1))
            .max(500, Language.get('errors.string.max', Language.get('keys.element.abbreviation'), 500)),
        color: string()
            .required(Language.get('errors.string.required', Language.get('keys.element.color'))),
        definition: string()
            .required(Language.get('errors.string.required', Language.get('keys.element.definition')))
            .min(1, Language.get('errors.string.min', Language.get('keys.element.definition'), 1))
            .max(5000, Language.get('errors.string.max', Language.get('keys.element.definition'), 5000)),
        semanticType: string()
            .notRequired()
            .nullable().transform((value) => !!value ? value : null)
            .min(1, Language.get('errors.string.min', Language.get('keys.element.semanticType'), 1))
            .max(500, Language.get('errors.string.max', Language.get('keys.element.semanticType'), 500)),
        excludes: string()
            .notRequired()
            .nullable().transform((value) => !!value ? value : null)
            .min(1, Language.get('errors.string.min', Language.get('keys.element.excludes'), 1))
            .max(500, Language.get('errors.string.max', Language.get('keys.element.excludes'), 500)),

    })
}