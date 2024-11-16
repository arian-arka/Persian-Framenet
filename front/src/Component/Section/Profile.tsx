import {Component, createSignal, Show} from "solid-js";
import {A, useNavigate} from "@solidjs/router";
import {useLocalData} from "../../Core/LocalData";
import {Ok} from "../../Core/Api/Response/Ok";
import {BadRequest} from "../../Core/Api/Response/BadRequest";
import UserApi from "../../Api/User.api";

const Profile: Component = () => {
    const navigate = useNavigate();
    const localData = useLocalData();
    const fetchLogout = async () => {
        try{
            await (new UserApi()).logout().forever({
                ok(r: Ok<any>) {
                    navigate('/login');
                    localData.removeKeys(['email','name','privileges','isSuperAdmin']);
                },
                unAuthenticated(r: BadRequest) {
                    navigate('/login');
                }
            });

        }catch (e) {
        }
    }
    return (
        <>
            <Show when={localData.localData()?.email} fallback={
                <div class="text-center m-3">
                    <div role="status">
                        <svg aria-hidden="true"
                             class="inline w-6 h-6 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                             viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"/>
                            <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"/>
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>
                </div>
            }>
            <div class="py-3 px-4">
                <span class="block text-sm font-semibold text-gray-900 dark:text-white">{localData.localData()?.name ?? '-'}</span>
                <span class="block text-sm font-light text-gray-500 truncate dark:text-gray-400">{localData.localData()?.email ?? '-'}</span>
            </div>
            <ul class="py-1 font-light text-gray-500 dark:text-gray-400"
                aria-labelledby="dropdown">
                <li>
                    <A href="/user/profile"
                       class="block py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:text-gray-400 dark:hover:text-white">
                        پروفایل</A>
                </li>
            </ul>
            </Show>
            <ul class="py-1 font-light text-gray-500 dark:text-gray-400"
                aria-labelledby="dropdown">
                {/*<li>*/}
                {/*    <a href="solid/src/Component#"*/}
                {/*       class="flex items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">*/}
                {/*        <svg class="mr-2 w-5 h-5 text-gray-400" fill="currentColor"*/}
                {/*             viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">*/}
                {/*            <path fill-rule="evenodd"*/}
                {/*                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"*/}
                {/*                  clip-rule="evenodd"></path>*/}
                {/*        </svg>*/}
                {/*        My likes</a>*/}
                {/*</li>*/}
                {/*<li>*/}
                {/*    <a href="solid/src/Component#"*/}
                {/*       class="flex items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">*/}
                {/*        <svg class="mr-2 w-5 h-5 text-gray-400" fill="currentColor"*/}
                {/*             viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">*/}
                {/*            <path*/}
                {/*                d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z"></path>*/}
                {/*        </svg>*/}
                {/*        Collections</a>*/}
                {/*</li>*/}
                <li>
                    <button onClick={fetchLogout}
                       class="flex items-center py-2 px-4 text-sm hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white">
                        خروج
                        <svg class="mr-2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9 8.25H7.5a2.25 2.25 0 00-2.25 2.25v9a2.25 2.25 0 002.25 2.25h9a2.25 2.25 0 002.25-2.25v-9a2.25 2.25 0 00-2.25-2.25H15m0-3l-3-3m0 0l-3 3m3-3V15"></path>
                        </svg>
                        </button>
                </li>

            </ul>


        </>
    )
}
export default Profile;