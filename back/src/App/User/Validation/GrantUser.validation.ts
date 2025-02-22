import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import {GrantUserInterface} from "../User.interface";
import {USER_PRIVILEGES} from "../User.contant";

export default class GrantUserValidation extends Validation<GrantUserInterface> {
    rules(): JSONSchemaType<GrantUserInterface> {
        return {
            type: "object",
            additionalProperties: false,
            required: ["_id", "grant","privileges"],
            properties: {
                _id: {type: "string",minLength:24, maxLength: 24},
                grant: {type: "boolean"},
                privileges: {
                    type: "array",
                    minItems: 1,
                    uniqueItems: true,
                    items: {type: "integer"}
                }
            },
            // errorMessage: {
            //     type: this.generate('validation.type'),
            //     required: {
            //         _id: this.generate('validation.required', 'email'),
            //         grant: this.generate('validation.required', 'password'),
            //         privileges: this.generate('validation.required', 'privileges'),
            //     },
            //
            //     properties: {
            //         _id: this.generate('validation.email'),
            //         grant: this.generate('validation.password'),
            //         privileges : this.generate('validation.user.privileges'),
            //     }
            // }

        }
    }

    custom(): Function {
        return async (data: GrantUserInterface) => {
            const numbers = Object.values(USER_PRIVILEGES);
            for(let n of data.privileges){
                if(!numbers.includes(n))
                    return this.pair('privileges','validation.user.privileges');
            }
        }
    }
}