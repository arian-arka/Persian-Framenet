import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import  {LoginUserInterface} from "../User.interface";

export default class LoginUserValidation extends Validation<LoginUserInterface> {
    rules(): JSONSchemaType<LoginUserInterface> {
        return {
            type: "object",
            additionalProperties: false,
            required: ["email", "password"],
            properties: {
                email: {type: "string", maxLength: 340, format: "email"},
                password: {type: "string", minLength: 8, maxLength: 64},
            },

            errorMessage: {
                type: this.generate('validation.type'),
                required: {
                    email: this.generate('validation.required', 'userEmail'),
                    password: this.generate('validation.required', 'userPassword'),
                },

                properties: {
                    email: this.generate('validation.user.invalidLogin'),
                    password: this.generate('validation.user.invalidLogin'),
                }
            }

        }
    }

    custom(): Function {
        return async (data: LoginUserInterface) => {

        }
    }
}