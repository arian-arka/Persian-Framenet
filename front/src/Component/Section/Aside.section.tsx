import {Component, Show} from "solid-js";
import MenuItem from "../MenuItem";
import {useLocalData} from "../../Core/LocalData";
import {USER_PRIVILEGES} from "../../Constant/User";

const AsideSection: Component = () => {
    const localData = useLocalData();
    if (!localData.localData()?.privileges && localData?.localData()?.isSuperAdmin !=='true')
        return (<>
            <aside id="sidebar"
                   class="border-l border-l-gray-200 rounded-l-lg shadow fixed top-0 right-0 z-40 h-full sm:translate-x-0 translate-x-full overflow-y-hidden w-64 lg:mt-5.2rem md:mt-5.2rem sm:mt-5.2rem mt-0">
                <div
                    class="h-full px-3 py-4 overflow-y-auto bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                </div>
            </aside>

        </>)
    return (
        <>
            <aside id="sidebar"
                   class="border-l border-l-gray-200 rounded-l-lg shadow fixed top-0 right-0 z-40 h-full sm:translate-x-0 translate-x-full overflow-y-hidden w-64 lg:mt-5.2rem md:mt-5.2rem sm:mt-5.2rem mt-0">
                <div
                    class="h-full px-3 py-4 overflow-y-auto bg-white border-r border-gray-200 dark:bg-gray-800 dark:border-gray-700">
                    <ul class="overflow-y-unset space-y-2">
                        <MenuItem url={"/helper/translate-with-frame"} condition="is" text={'شباهت یابی'}
                                  hidden={localData.localData()?.isSuperAdmin !== 'true' && !localData.localData()?.privileges?.includes(USER_PRIVILEGES['store frame'])}
                                  icon={
                                      <svg class="flex-shrink-0 w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 20">
                                          <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5v10M3 5a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm0 10a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm6-3.976-2-.01A4.015 4.015 0 0 1 3 7m10 4a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z"/>
                                      </svg>
                                  }/>

                        <MenuItem url={"/frame/store"} condition="is" text={'ساخت قالب معنایی'}
                                  hidden={localData.localData()?.isSuperAdmin !== 'true' && !localData.localData()?.privileges?.includes(USER_PRIVILEGES['store frame'])}
                                  icon={
                                      <svg
                                          class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                                          fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                          <path stroke-linecap="round" stroke-linejoin="round" d="M21.75 6.75a4.5 4.5 0 01-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 11-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 016.336-4.486l-3.276 3.276a3.004 3.004 0 002.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852z"></path>
                                          <path stroke-linecap="round" stroke-linejoin="round" d="M4.867 19.125h.008v.008h-.008v-.008z"></path>
                                      </svg>

                                  }/>
                        <MenuItem url={"/frame/inheritance"} condition="is" text={'روابط بیناقالبی'}
                                  hidden={localData.localData()?.isSuperAdmin !=='true' && !localData.localData()?.privileges?.includes(USER_PRIVILEGES['show frame'])}
                                  icon={
                                      <svg
                                          class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                                          aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 22 21">
                                          <path stroke="currentColor" stroke-linecap="round" stroke-width="2" d="M7.24 7.194a24.16 24.16 0 0 1 3.72-3.062m0 0c3.443-2.277 6.732-2.969 8.24-1.46 2.054 2.053.03 7.407-4.522 11.959-4.552 4.551-9.906 6.576-11.96 4.522C1.223 17.658 1.89 14.412 4.121 11m6.838-6.868c-3.443-2.277-6.732-2.969-8.24-1.46-2.054 2.053-.03 7.407 4.522 11.959m3.718-10.499a24.16 24.16 0 0 1 3.719 3.062M17.798 11c2.23 3.412 2.898 6.658 1.402 8.153-1.502 1.503-4.771.822-8.2-1.433m1-6.808a1 1 0 1 1-2 0 1 1 0 0 1 2 0Z"/>
                                      </svg>
                                  }/>
                        <MenuItem url={"/frame/list"} condition="is" text={'قالب‌های معنایی'}
                                  hidden={localData.localData()?.isSuperAdmin !=='true' && !localData.localData()?.privileges?.includes(USER_PRIVILEGES['show frame'])}
                                  icon={
                                      <svg
                                          class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                                          fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                          <path stroke-linecap="round" stroke-linejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5h7.5c.621 0 1.125-.504 1.125-1.125m-9.75 0V5.625m0 12.75v-1.5c0-.621.504-1.125 1.125-1.125m18.375 2.625V5.625m0 12.75c0 .621-.504 1.125-1.125 1.125m1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125m0 3.75h-7.5A1.125 1.125 0 0112 18.375m9.75-12.75c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125m19.5 0v1.5c0 .621-.504 1.125-1.125 1.125M2.25 5.625v1.5c0 .621.504 1.125 1.125 1.125m0 0h17.25m-17.25 0h7.5c.621 0 1.125.504 1.125 1.125M3.375 8.25c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125m17.25-3.75h-7.5c-.621 0-1.125.504-1.125 1.125m8.625-1.125c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125M12 10.875v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 10.875c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125M13.125 12h7.5m-7.5 0c-.621 0-1.125.504-1.125 1.125M20.625 12c.621 0 1.125.504 1.125 1.125v1.5c0 .621-.504 1.125-1.125 1.125m-17.25 0h7.5M12 14.625v-1.5m0 1.5c0 .621-.504 1.125-1.125 1.125M12 14.625c0 .621.504 1.125 1.125 1.125m-2.25 0c.621 0 1.125.504 1.125 1.125m0 1.5v-1.5m0 0c0-.621.504-1.125 1.125-1.125m0 0h7.5"></path>
                                      </svg>
                                  }/>

                        <MenuItem url={"/lexicalUnit/search"} condition="is" text={'واحدهای واژگانی'}
                                  hidden={localData.localData()?.isSuperAdmin !== 'true' && !localData.localData()?.privileges?.includes(USER_PRIVILEGES['show frame'])}
                                  icon={
                                      <svg
                                          class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                                          fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                          <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"></path>
                                      </svg>
                                  }/>

                        {/*<MenuItem url={"/sentence/store"} condition="is" text={'ساخت جمله'}*/}
                        {/*          hidden={localData.localData()?.isSuperAdmin !== 'true' && !localData.localData()?.privileges?.includes(USER_PRIVILEGES['store sentence'])}*/}
                        {/*          icon={*/}
                        {/*              <svg aria-hidden="true"*/}
                        {/*                   class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"*/}
                        {/*                   fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"*/}
                        {/*                   xmlns="http://www.w3.org/2000/svg">*/}
                        {/*                  <path*/}
                        {/*                      fill-rule="evenodd"*/}
                        {/*                      clip-rule="evenodd"*/}
                        {/*                      d="M12 4.5v15m7.5-7.5h-15"></path>*/}

                        {/*              </svg>*/}
                        {/*          }/>*/}

                        <MenuItem url={"/sentence/list"} condition="is" text={'جمله‌ها'}
                                  hidden={localData.localData()?.isSuperAdmin!=='true' && !localData.localData()?.privileges?.includes(USER_PRIVILEGES['show sentence'])}
                                  icon={
                                      <svg
                                          class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                                          fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                          <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>
                                      </svg>

                                  }/>
                        {/*<MenuItem url={"/sentence/list/english"} condition="is" text={'جمله‌های انگلیسی'}*/}
                        {/*          hidden={localData.localData()?.isSuperAdmin!=='true' && !localData.localData()?.privileges?.includes(USER_PRIVILEGES['show sentence'])}*/}
                        {/*          icon={*/}
                        {/*              <svg*/}
                        {/*                  class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"*/}
                        {/*                  fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">*/}
                        {/*                  <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>*/}
                        {/*              </svg>*/}

                        {/*          }/>*/}

                            <MenuItem url={"/taggedSentence/list"} condition="is" text={'برچسب‌نگاری'}
                                      hidden={localData.localData()?.isSuperAdmin !== 'true' && !localData.localData()?.privileges?.includes(USER_PRIVILEGES['show tagged sentence'])}
                                      icon={
                                          <svg
                                              class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                                              fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                              <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"></path>
                                              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z"></path>
                                          </svg>
                                      }/>
                        <MenuItem url={"/taggedSentence/list/english"} condition="is" text={'جمله‌های انگلیسی'}
                                  hidden={localData.localData()?.isSuperAdmin !== 'true' && !localData.localData()?.privileges?.includes(USER_PRIVILEGES['show tagged sentence'])}
                                  icon={
                                      <svg
                                          class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                                          fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                          <path stroke-linecap="round" stroke-linejoin="round" d="M9.568 3H5.25A2.25 2.25 0 003 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 005.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 009.568 3z"></path>
                                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 6h.008v.008H6V6z"></path>
                                      </svg>
                                  }/>

                            <MenuItem url={"/user/list"} condition="is" text={'کاربرها'}
                                      hidden={localData.localData()?.isSuperAdmin !== 'true' && !localData.localData()?.privileges?.includes(USER_PRIVILEGES['show user'])}
                                      icon={
                                          <svg
                                              class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                                              fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"
                                              xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                              <path stroke-linecap="round" stroke-linejoin="round"
                                                    d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"></path>
                                          </svg>
                                      }/>

                        <MenuItem url={"/log/list"} condition="is" text={'گزارش فعالیت'}
                                  hidden={localData.localData()?.isSuperAdmin !== 'true' && !localData.localData()?.privileges?.includes(USER_PRIVILEGES['show user'])}
                                  icon={
                                      <svg
                                          class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                                          fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path>
                                      </svg>

                                  }/>
                        <MenuItem url={"/report"} condition="is" text={'گزارش '}
                                  hidden={false}
                                  icon={
                                      <svg
                                          class="flex-shrink-0 w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white"
                                          fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path>
                                      </svg>

                                  }/>

                    </ul>
                </div>
            </aside>
        </>
    );
}
export default AsideSection;