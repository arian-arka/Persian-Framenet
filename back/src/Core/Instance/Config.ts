import SetterGetter from "../Class/SetterGetter";
import Path from "../Singleton/Path";
import Loader from "../Singleton/Loader";

class Config extends SetterGetter {
    constructor() {
        super();
        this._sets(Loader.default(Path.configPath(), (path: string) => {
            return (require(path).default)(process.env)
        }));
    }
}

export default Config;