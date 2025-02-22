import Route from "../../Core/Class/Route";
import {AuthenticatedUser} from "../User/AuthenticatedUser.middleware";
import {SuspendedUser} from "../User/SuspendedUser.middleware";
import {ServiceAvailability} from "../ServiceAvailability.middleware";


export default Route.instance(function (route: Route) {
    route.prefix('/api/element').group(function (route: Route) {
        route.middleware(ServiceAvailability.make());
        route.group(function (route: Route) {
            route.middleware(AuthenticatedUser.make());
            route.middleware(SuspendedUser.make());
            route.post('/store/:frame', 'Element/Element@store').make();
            route.post('/list/:frame', 'Element/Element@list').make();
            route.put('/reorder', 'Element/Element@reorder').make();
            route.put('/:element', 'Element/Element@edit').make();
            route.delete('/:element', 'Element/Element@destroy').make();
            route.get('/:element', 'Element/Element@show').make();
        })
    });
})