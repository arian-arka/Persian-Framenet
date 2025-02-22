import Route from "../../Core/Class/Route";
import {AuthenticatedUser, UnAuthenticatedUser} from "./AuthenticatedUser.middleware";
import {SuspendedUser} from "./SuspendedUser.middleware";
import {ServiceAvailability} from "../ServiceAvailability.middleware";


export default Route.instance(function (route: Route) {
    route.prefix('/api/user').group(function (route: Route) {
        route.middleware(ServiceAvailability.make());

        route.post('/register/test/:token', 'User/User@registerTest').make();

        route.group(function (route: Route) {
            route.middleware(UnAuthenticatedUser.make());
            route.post('/login', 'User/User@login').make();
        })

        route.group(function (route: Route) {
            route.middleware([AuthenticatedUser.make(),SuspendedUser.make()]);
            route.get('/logout', 'User/User@logout').make();
            route.post('/log', 'User/User@log').make();
            route.post('/register', 'User/User@register').make();
            route.put('/updateProfile', 'User/User@updateProfile').make();
            route.put('/updateUser', 'User/User@updateUser').make();
            route.put('/grant/:user/:grant', 'User/User@grantAll').make();
            route.put('/suspend/:user/:grant', 'User/User@suspend').make();
            route.put('/grant', 'User/User@grant').make();
            route.post('/list', 'User/User@list').make();
            route.post('/logout', 'User/User@logout').make();
            route.delete('/delete/:user', 'User/User@delete').make();
            route.get('/:user', 'User/User@user').make();
            route.get('/', 'User/User@currentUser').make();
        })

        route.group(function (route: Route) {
        })

    });
})