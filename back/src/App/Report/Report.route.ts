import Route from "../../Core/Class/Route";
import {AuthenticatedUser} from "../User/AuthenticatedUser.middleware";
import {SuspendedUser} from "../User/SuspendedUser.middleware";
import {ServiceAvailability} from "../ServiceAvailability.middleware";


export default Route.instance(function (route: Route) {
    route.prefix('/api/report').group(function (route: Route) {
        route.middleware(ServiceAvailability.make());
        route.group(function (route: Route) {
            route.middleware(AuthenticatedUser.make());
            route.middleware(SuspendedUser.make());
            route.post('/waitingTaggedSentencesOfLogs', 'Report/Report@waitingTaggedSentencesOfLogs').make();
            route.post('/waitingTaggedSentences', 'Report/Report@waitingTaggedSentences').make();
            route.get('/sample1','Report/Report@sample1').make();
            route.get('/sample2','Report/Report@sample2').make();

        })
    });
})