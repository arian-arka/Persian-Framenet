import {Component, createEffect, createSignal, For, Match, Show, Switch} from "solid-js";
import {AsideExpander} from "../MenuItem";
import Notifications from "./Notifications";
import Profile from "./Profile";
import logo from "../../assets/logo.jpg";
import {useLocalData} from "../../Core/LocalData";
import {MessageInterface} from "../../Type/Message.interface";
import MessageApi from "../../Api/Message.api";
import {Ok} from "../../Core/Api/Response/Ok";
import {BadRequest} from "../../Core/Api/Response/BadRequest";
import Language from "../../Core/Language";
import {A} from "@solidjs/router";
import {MESSAGE_FOR} from "../../Constant/Message";

const toggleDarkmode = (isDark: boolean) => {
    const h = document.getElementsByTagName('html')[0];
    if (isDark)
        h.classList.add('dark');
    else
        h.classList.remove('dark');
};

const NavSection: Component = () => {
    const localData = useLocalData();
    const [expansion,setExpansion] = createSignal({
        'profile' : false,
        'notification' : false,
    },{equals:false});
    const toggleExpand = (name:string) => {
        const _ : any = expansion();
        const tmp = !_[name];
        for(let k in _)
            _[k] = false;
        _[name] = tmp;
        setExpansion(_);
    }
    const [sideBarExpanded, sideBarExpand] = createSignal(true);
    const [darkmode, setDarkmode] = createSignal(localStorage.getItem('darkMode') === 'dark');
    const expandAside = (expand: boolean) => {
        const sideBar = document.getElementById('sidebar');
        const container = document.getElementById('container');
        if (sideBar && container) {
            if (expand) {
                AsideExpander.expand();
                sideBar.classList.remove('lg:w-14');
                sideBar.classList.remove('sm:w-14');
                sideBar.classList.remove('md:w-14');
                container.classList.remove('sm:mr-16');
                container.classList.remove('md:mr-16');
                container.classList.remove('lg:mr-16');
                container.classList.add('sm:mr-64');
                container.classList.add('md:mr-64');
                container.classList.add('lg:mr-64');
            } else {
                AsideExpander.collapse();
                sideBar.classList.add('lg:w-14');
                sideBar.classList.add('sm:w-14');
                sideBar.classList.add('md:w-14');
                container.classList.add('sm:mr-16');
                container.classList.add('md:mr-16');
                container.classList.add('lg:mr-16');
                container.classList.remove('sm:mr-64');
                container.classList.remove('md:mr-64');
                container.classList.remove('lg:mr-64');

            }
        }
    };

    createEffect(() => expandAside(sideBarExpanded()));
    expandAside(sideBarExpanded())
    createEffect(() => {
        if (darkmode())
            localStorage.setItem('darkMode', 'dark');
        else
            localStorage.setItem('darkMode', 'white');
        toggleDarkmode(darkmode());
    });
    const [notifications,setNotifications] = createSignal<MessageInterface[]|undefined>(undefined,{equals:false});
    const [unread,setUnread] = createSignal<number|undefined>(undefined,{equals:false});
    (new MessageApi()).notifications().forever({
        ok(r: Ok<{
            messages : MessageInterface[],
            count : number,
        }>) {
            setNotifications(r.data.messages);
            setUnread(r.data.count);
        },
        unAuthenticated(r: BadRequest) {
            localData.navigate('/login');
        },
    })

    return (

        <>
            <nav class="border border-gray-200 rounded-lg shadow fixed top-0 z-30 w-full bg-white  h-19 lg:h-17 md:h-17 sm:h-17   pb-2.5 dark:bg-gray-800">
                <div class="flex items-center justify-between w-full px-3 py-3 mx-auto max-w-8xl lg:px-4"
                     style="z-index:30;">
                    <div class="flex justify-start items-center">

                        <button onClick={() => sideBarExpand(c => !c)} id='asideOpenButton'
                                class="lg:inline md:inline sm:inline hidden p-2 mr-3 text-gray-600 rounded cursor-pointer  hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700">
                            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                      clip-rule="evenodd"></path>
                            </svg>
                        </button>
                        <button data-drawer-target="sidebar" data-drawer-toggle="sidebar" aria-controls="sidebar"
                                type="button"
                                class="p-2 mr-2 text-gray-600 rounded-lg cursor-pointer lg:hidden md:hidden sm:hidden hover:text-gray-900 hover:bg-gray-100 focus:bg-gray-100 dark:focus:bg-gray-700 focus:ring-2 focus:ring-gray-100 dark:focus:ring-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                            <svg aria-hidden="true" class="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                      d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h6a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                                      clip-rule="evenodd"></path>
                            </svg>
                            <svg aria-hidden="true" class="hidden w-6 h-6" fill="currentColor"
                                 viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd"
                                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                                      clip-rule="evenodd"></path>
                            </svg>
                            <span class="sr-only">Toggle sidebar</span>
                        </button>


                        <a href="/" class="flex mr-4">
                            <img src={logo} class="mx-5 h-12"
                                 alt="FlowBite Logo"/>
                            <span
                                class="self-center text-xl whitespace-nowrap dark:text-white">FrameNet</span>
                        </a>

                    </div>
                    <div class="flex items-center lg:order-2 pr-5">
                        <h3 class="p-2.5  text-gray-900">{localData.localData()?.name ?? '-'}</h3>
                        <button onClick={() => toggleExpand('notification')}
                                class="closeOnOutsideClick p-2.5  text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">

                            <span class="sr-only">View notifications</span>
                            <svg fill="none" stroke="currentColor" class="w-6 h-6" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0"></path>
                            </svg>
                            <Show when={unread()}>
                            <div style="left:5.5rem;" class="absolute inline-flex items-center justify-center w-6 h-6 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full top-2 dark:border-gray-900">{unread()}</div>
                            </Show>
                        </button>
                        <div
                            class={
                                expansion()['notification']
                                    ? 'closeOnOutsideClick overflow-hidden z-50 my-4 max-w-sm text-base list-none bg-white rounded divide-y divide-gray-100 shadow-lg dark:divide-gray-600 dark:bg-gray-700 block'
                                    : 'closeOnOutsideClickhidden overflow-hidden z-50 my-4 max-w-sm text-base list-none bg-white rounded divide-y divide-gray-100 shadow-lg dark:divide-gray-600 dark:bg-gray-700'
                            }
                            style={
                                expansion()['notification']
                                    ? 'position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate3d(10px, 70px, 0px);'
                                    : 'position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate3d(5000px, 70px, 0px);'
                            }
                            >

                                <div
                                    class="block py-2 px-4 text-base font-medium text-center text-gray-700 bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                                    {Language.get('notification.notification')}

                                </div>
                                <div>
                                    <Show when={notifications()} fallback={
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
                                        <For each={notifications()}>{(notification)=>
                                            <A href={notification.isFor === MESSAGE_FOR['frame'] ? `/frame/${notification.ref}` : (notification.isFor === MESSAGE_FOR['taggedSentence'] ? `/taggedSentence/edit/${notification.ref}` : (notification.isFor === MESSAGE_FOR['lexicalUnit'] ? `/lexicalUnit/edit/${notification.ref}` : `/element/edit/${notification.ref}`))} class="flex py-3 px-4 border-b hover:bg-gray-100 dark:hover:bg-gray-600 dark:border-gray-600">
                                                <div class="flex-shrink-0">
                                                    <div class="flex absolute justify-center items-center ml-6 -mt-5 w-5 h-5 rounded-full border border-white bg-primary-700 dark:border-gray-700">
                                                        <Switch>
                                                            <Match when={notification.isFor === MESSAGE_FOR['frame']} >
                                                                <svg aria-hidden="true"
                                                                     class="w-3 h-3 text-white"
                                                                     fill="none" stroke="currentColor" stroke-width="1.5"
                                                                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                                          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path>
                                                                </svg>
                                                            </Match>
                                                            <Match when={notification.isFor === MESSAGE_FOR['lexicalUnit']} >
                                                                <svg aria-hidden="true"
                                                                     class="w-3 h-3 text-white"
                                                                     fill="none" stroke="currentColor" stroke-width="1.5"
                                                                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                                          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path>
                                                                </svg>
                                                            </Match>
                                                            <Match when={notification.isFor === MESSAGE_FOR['element']} >
                                                                <svg aria-hidden="true"
                                                                     class="w-3 h-3 text-white"
                                                                     fill="none" stroke="currentColor" stroke-width="1.5"
                                                                     viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                                                    <path fill-rule="evenodd" clip-rule="evenodd"
                                                                          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"></path>
                                                                </svg>
                                                            </Match>
                                                            <Match when={notification.isFor === MESSAGE_FOR['taggedSentence']} >
                                                                <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor"
                                                                     stroke-width="1.5" viewBox="0 0 20 20"
                                                                     xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                                          d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"></path>
                                                                    <path stroke-linecap="round" stroke-linejoin="round"
                                                                          d="M6 6h.008v.008H6V6z"></path>
                                                                </svg>
                                                            </Match>
                                                        </Switch>
                                                    </div>
                                                </div>
                                                <div class="pl-3 w-full">
                                                    <div class="text-gray-500 font-normal text-sm mb-1.5 dark:text-gray-400">
                                    <span class="font-semibold text-gray-900 dark:text-white">
                                        {notification.refText}
                                    </span>
                                                    </div>
                                                    <div class="text-xs font-medium text-primary-700 dark:text-primary-400">
                                                        {notification.updatedAt.toString()}
                                                    </div>
                                                </div>
                                            </A>

                                        }</For>
                                    </Show>
                                </div>


                                <A href='/message/list' class="block py-2 text-base font-normal text-center text-gray-900 bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:underline">
                                    <div class="inline-flex items-center m-1.5">
                                        <svg aria-hidden="true" class="ml-2 w-5 h-5" fill="currentColor"
                                             viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"></path>
                                            <path fill-rule="evenodd"
                                                  d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z"
                                                  clip-rule="evenodd"></path>
                                        </svg>

                                        {Language.get('notification.all')}
                                    </div>
                                </A>


                        </div>

                        <button onClick={() => toggleExpand('profile')}
                                class="closeOnOutsideClick items-center inline-flex p-2.5 text-gray-500 rounded-lg hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-4 focus:ring-gray-300 dark:focus:ring-gray-600">


                            <svg fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true" class="w-6 h-6"   viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                        </button>
                        <div
                            class={
                                expansion()['profile']
                                    ? 'closeOnOutsideClick z-50 my-4 w-56 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 block'
                                    : 'closeOnOutsideClick z-50 my-4 w-56 text-base list-none bg-white rounded divide-y divide-gray-100 shadow dark:bg-gray-700 dark:divide-gray-600 hidden'
                            }
                            style={
                                expansion()['profile']
                                    ? 'position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate3d(5px, 70px, 0px);'
                                    : 'position: absolute; inset: 0px auto auto 0px; margin: 0px; transform: translate3d(5000px, 70px, 0px);'
                            }
                            >
                            <Profile/>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}

export default NavSection;