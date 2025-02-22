import Route from "../../Core/Class/Route";
import {AuthenticatedUser} from "../User/AuthenticatedUser.middleware";
import {SuspendedUser} from "../User/SuspendedUser.middleware";
import {ServiceAvailability} from "../ServiceAvailability.middleware";

export default Route.instance(function (route: Route) {
    route.prefix('/api/taggedSentence').group(function (route: Route) {
        route.middleware(ServiceAvailability.make());
        route.group(function (route: Route) {
            route.middleware(AuthenticatedUser.make());
            route.middleware(SuspendedUser.make());
            route.post('/list', 'TaggedSentence/TaggedSentence@list').make();
            route.post('/store/:sentence', 'TaggedSentence/TaggedSentence@store').make();
            route.put('/status/:taggedSentence', 'TaggedSentence/TaggedSentence@status').make();
            route.put('/publish/:taggedSentence', 'TaggedSentence/TaggedSentence@publish').make();
            route.put('/:taggedSentence', 'TaggedSentence/TaggedSentence@edit').make();
            route.delete('/:taggedSentence', 'TaggedSentence/TaggedSentence@destroy').make();
            route.get('/:taggedSentence', 'TaggedSentence/TaggedSentence@show').make();
        })
    });
})