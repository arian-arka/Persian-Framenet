import Route from "../../Core/Class/Route";
import {AuthenticatedUser} from "../User/AuthenticatedUser.middleware";
import {SuspendedUser} from "../User/SuspendedUser.middleware";
import {ServiceAvailability} from "../ServiceAvailability.middleware";


export default Route.instance(function (route: Route) {
    route.prefix('/api/helper').group(function (route: Route) {
        route.middleware(ServiceAvailability.make());
        route.group(function (route: Route) {
            route.middleware(AuthenticatedUser.make());
            route.middleware(SuspendedUser.make());
            route.post('/match/sentence', 'Helper/Helper@matchSentence').make();
            route.post('/match/frame', 'Helper/Helper@matchFrame').make();
        })
    });
})