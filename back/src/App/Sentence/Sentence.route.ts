import Route from "../../Core/Class/Route";
import {AuthenticatedUser} from "../User/AuthenticatedUser.middleware";
import {SuspendedUser} from "../User/SuspendedUser.middleware";
import {ServiceAvailability} from "../ServiceAvailability.middleware";


export default Route.instance(function (route: Route) {
    route.prefix('/api/sentence').group(function (route: Route) {
        route.middleware(ServiceAvailability.make());
        route.group(function (route: Route) {
            route.middleware(AuthenticatedUser.make());
            route.middleware(SuspendedUser.make());
            route.post('/list', 'Sentence/Sentence@list').make();
            route.post('/store', 'Sentence/Sentence@store').make();
            route.get('/tagged/:sentence', 'Sentence/Sentence@tagged').make();
            route.put('/:sentence', 'Sentence/Sentence@edit').make();
            route.delete('/:sentence', 'Sentence/Sentence@destroy').make();
            route.get('/:sentence', 'Sentence/Sentence@show').make();
        })
    });
})