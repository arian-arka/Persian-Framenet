import BadRequest from "./BadRequest";
import Framework from "../../Framework";

export default class NotFound extends BadRequest {
    constructor(message: string | null = null) {
        super(message ?? Framework.Language.generate('responses.404'));
    }

    status(): number {
        return 404;
    }

    static instance(message: string | null = null): NotFound {
        return new NotFound(message);
    }

    static forMessage(message: string | null = null): NotFound {
        return new NotFound(message);
    }
}
