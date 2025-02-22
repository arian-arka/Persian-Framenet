import Route from "../../Core/Class/Route";
import {AuthenticatedUser} from "../User/AuthenticatedUser.middleware";
import {SuspendedUser} from "../User/SuspendedUser.middleware";
import {ServiceAvailability} from "../ServiceAvailability.middleware";


export default Route.instance(function (route: Route) {
    route.prefix('/api/lexicalUnit').group(function (route: Route) {
        route.middleware(ServiceAvailability.make());
        route.group(function (route: Route) {
            route.middleware(AuthenticatedUser.make());
            route.middleware(SuspendedUser.make());
            route.post('/list/:frame', 'LexicalUnit/LexicalUnit@list').make();
            route.post('/ofFrame/:frame', 'LexicalUnit/LexicalUnit@ofFrame').make();
            route.post('/forTagging/:frame', 'LexicalUnit/LexicalUnit@forTagging').make();
            route.post('/store/:frame', 'LexicalUnit/LexicalUnit@store').make();
            route.post('/storeForTaggedSentence/:frame', 'LexicalUnit/LexicalUnit@storeForTaggedSentence').make();
            route.put('/reorder', 'LexicalUnit/LexicalUnit@reorder').make();
            route.post('/search', 'LexicalUnit/LexicalUnit@search').make();
            route.get('/annotation/:lexicalUnit', 'LexicalUnit/LexicalUnit@annotation').make();
            // route.get('/lexicalEntry/:lexicalUnit', 'LexicalUnit/LexicalUnit@lexicalEntry').make();
            route.put('/:lexicalUnit', 'LexicalUnit/LexicalUnit@edit').make();
            route.delete('/:lexicalUnit', 'LexicalUnit/LexicalUnit@destroy').make();
            route.get('/:lexicalUnit', 'LexicalUnit/LexicalUnit@show').make();
        })
    });
})