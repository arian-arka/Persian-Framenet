import Route from "../../Core/Class/Route";
import {AuthenticatedUser} from "../User/AuthenticatedUser.middleware";
import {SuspendedUser} from "../User/SuspendedUser.middleware";
import {ServiceAvailability} from "../ServiceAvailability.middleware";


export default Route.instance(function (route: Route) {
    route.prefix('/api/frame-relation').group(function (route: Route) {
        route.middleware(ServiceAvailability.make());
        route.group(function (route: Route) {
            route.middleware(AuthenticatedUser.make());
            route.middleware(SuspendedUser.make());
            route.post('/list/:frame', 'FrameRelation/FrameRelation@list').make();
            route.post('/store', 'FrameRelation/FrameRelation@store').make();
            route.put('/:relation', 'FrameRelation/FrameRelation@edit').make();
            route.delete('/:relation', 'FrameRelation/FrameRelation@destroy').make();
            route.get('/:relation', 'FrameRelation/FrameRelation@show').make();

        })
    });
})