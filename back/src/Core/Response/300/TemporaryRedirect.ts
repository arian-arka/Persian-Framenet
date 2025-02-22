import PermanentRedirect from "./PermanentRedirect";

export default class TemporaryRedirect extends PermanentRedirect {
    status(): number {
        return 302;
    }
}