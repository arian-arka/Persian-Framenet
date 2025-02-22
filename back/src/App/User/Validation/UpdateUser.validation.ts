import Validation from "../../../Core/Class/Validation";
import {JSONSchemaType} from "ajv";
import UserService from "../User.service";
import  { UpdateUserInterface} from "../User.interface";

export default class UpdateUserValidation extends Validation<UpdateUserInterface> {
    rules(): JSONSchemaType<UpdateUserInterface> {
        return {
            type: "object",
            additionalProperties: false,
            required: ["_id","email", "name"],
            properties: {
                _id: {type: "string", minLength: 1, maxLength: 300},
                name: {type: "string", minLength: 1, maxLength: 300},
                email: {type: "string", maxLength: 340, format: "email"},
                password: {type: "string", minLength: 8, maxLength: 64,nullable:true},
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
                    password: this.generate('validation.user.password'),
                }
            }

        }
    }


    custom(): Function {
        return async (data: UpdateUserInterface) => {
            const user = await UserService.find(data._id);
            if(!user)
                return {'_id':'not found'};
            if (await UserService.emailExists(data.email,user._id))
                return this.pair('email', 'validation.user.emailExists', data.email);
        }
    }
}