import Route from "../../Core/Class/Route";
import {AuthenticatedUser} from "../User/AuthenticatedUser.middleware";
import {SuspendedUser} from "../User/SuspendedUser.middleware";
import {ServiceAvailability} from "../ServiceAvailability.middleware";


export default Route.instance(function (route: Route) {
    route.prefix('/api/frame').group(function (route: Route) {
        route.middleware(ServiceAvailability.make());
        route.group(function (route: Route) {
            route.middleware(AuthenticatedUser.make());
            route.middleware(SuspendedUser.make());
            route.post('/list/withoutWaiting', 'Frame/Frame@withoutWaiting').make();
            route.post('/list', 'Frame/Frame@list').make();
            route.post('/store', 'Frame/Frame@store').make();
            route.put('/softDelete/:frame/:status', 'Frame/Frame@softDelete').make();
            route.put('/status/:frame', 'Frame/Frame@status').make();
            route.put('/publish/:frame', 'Frame/Frame@publish').make();
            route.post('/duplicate/:frame', 'Frame/Frame@duplicate').make();
            route.put('/:frame', 'Frame/Frame@edit').make();
            route.delete('/:frame', 'Frame/Frame@destroy').make();
            route.get('/:frame', 'Frame/Frame@show').make();
        })
    });
})