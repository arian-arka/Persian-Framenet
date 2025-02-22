import BadRequest from "./BadRequest";
import Framework from "../../Framework";

export default class Unauthorized extends BadRequest {
    constructor(message : string|null = null) {
        super(message ?? Framework.Language.generate('responses.401'));
    }

    status(): number {
        return 401;
    }

    static instance(message: string | null = null): Unauthorized {
        return new Unauthorized(message);
    }

    static forMessage(message: string | null = null): Unauthorized {
        return new Unauthorized(message);
    }
}
