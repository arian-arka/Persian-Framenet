import BadRequest from "./BadRequest";
import Framework from "../../Framework";

export default class Forbidden extends BadRequest {
    constructor(message : string|null = null) {
        super(message ?? Framework.Language.generate('responses.403'));
    }

    status(): number {
        return 403;
    }

    static instance(message: string |null = null) : Forbidden {
        return new Forbidden(message);
    }

    static forErrors(errors: { [key: string]: string }): Forbidden {
        return (new this).setErrors(errors);
    }

    static forMessage(message: string|null = null): Forbidden {
        return new this(message);
    }
}