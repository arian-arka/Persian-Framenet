import {object, string} from "yup";
import Language from "../../Core/Language";

export default {
    schema : object({
        name: string()
            .required(Language.get('errors.string.required', Language.get('keys.user.name')))
            .min(1, Language.get('errors.string.min', Language.get('keys.user.password'), 1))
            .max(300, Language.get('errors.string.max', Language.get('keys.user.password'), 300)),
        email: string()
            .required(Language.get('errors.string.required', Language.get('keys.user.email')))
            .email(Language.get('errors.string.email')),
        password: string()
            .required(Language.get('errors.string.required', Language.get('keys.user.password')))
            .min(8, Language.get('errors.string.min', Language.get('keys.user.password'), 8))
            .max(64, Language.get('errors.string.max', Language.get('keys.user.password'), 64))
    }),
    custom :  undefined,
}