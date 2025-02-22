import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import UserService from "../User.service";
import {RegisterUserInterface} from "../User.interface";

export default class RegisterUserValidation extends Validation<RegisterUserInterface> {
    rules(): JSONSchemaType<RegisterUserInterface> {
        return {
            type: "object",
            additionalProperties: false,
            required: ["email", "password", "name"],
            properties: {
                name: {type: "string", minLength: 1, maxLength: 300},
                email: {type: "string", maxLength: 340, format: "email"},
                password: {type: "string", minLength: 8, maxLength: 64},
            },

            errorMessage: {
                type: this.generate('validation.type'),
                required: {
                    name: this.generate('validation.required', 'userName'),
                    email: this.generate('validation.required', 'userEmail'),
                    password: this.generate('validation.required', 'userPassword'),
                },

                properties: {
                    name: this.generate('validation.user.name'),
                    email: this.generate('validation.user.email'),
                    password: this.generate('validation.user.password'),
                }
            }

        }
    }


    custom(): Function {
        return async (data: RegisterUserInterface) => {

            if (await UserService.emailExists(data.email))
                return this.pair('email', 'validation.user.emailExists', data.email);
        }
    }
}