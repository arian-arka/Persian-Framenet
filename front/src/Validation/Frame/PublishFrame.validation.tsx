import {number, object, string} from "yup";
import Language from "../../Core/Language";

export default {
    schema : object({

        message: string()
            .max(5000, Language.get('errors.string.max', Language.get('keys.frame.message'), 5000)),


    })
}