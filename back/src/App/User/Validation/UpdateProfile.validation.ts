import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import UserService from "../User.service";
import UserInterface, {UpdateProfileInterface} from "../User.interface";

export default class UpdateProfileValidation extends Validation<UpdateProfileInterface,UserInterface> {
    rules(): JSONSchemaType<UpdateProfileInterface> {
        return {
            type: "object",
            additionalProperties: false,
            required: ["email","oldPassword", "name"],
            properties: {
                name: {type: "string", minLength: 1, maxLength: 300},
                email: {type: "string", maxLength: 340, format: "email"},
                oldPassword: {type: "string", minLength: 8, maxLength: 64},
                newPassword: {type: "string", minLength: 8, maxLength: 64,nullable:true},
            },

            errorMessage: {
                type: this.generate('validation.type'),
                required: {
                    name: this.generate('validation.required', 'userName'),
                    email: this.generate('validation.required', 'userEmail'),
                },

                properties: {
                    name: this.generate('validation.user.name'),
                    email: this.generate('validation.user.email'),
                    newPassword: this.generate('validation.user.newPassword'),
                    oldPassword: this.generate('validation.user.oldPassword'),
                }
            }

        }
    }


    custom(): Function {
        return async (data: UpdateProfileInterface) => {
            if (await UserService.emailExists(data.email,this.additionalData._id))
                return this.pair('email', 'validation.user.emailExists', data.email);
        }
    }
}