import Route from "../../Core/Class/Route";
import {AuthenticatedUser} from "../User/AuthenticatedUser.middleware";
import {SuspendedUser} from "../User/SuspendedUser.middleware";
import {ServiceAvailability} from "../ServiceAvailability.middleware";


export default Route.instance(function (route: Route) {
    route.prefix('/api/message').group(function (route: Route) {
        route.middleware(ServiceAvailability.make());
        route.group(function (route: Route) {
            route.middleware(AuthenticatedUser.make());
            route.middleware(SuspendedUser.make());
            // route.get('/unread', 'Message/Message@unread').make();
            route.get('/notifications', 'Message/Message@notifications').make();
            route.post('/list', 'Message/Message@list').make();
            route.post('/open/:message', 'Message/Message@open').make();
        })
    });
})