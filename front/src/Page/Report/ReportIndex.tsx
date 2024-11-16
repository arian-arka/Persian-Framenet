import {Component, Show} from "solid-js";
import {USER_PRIVILEGES} from "../../Constant/User";
import Language from "../../Core/Language";
import {useNavigate} from "@solidjs/router";

const ReportIndex :Component = () => {
    const navigate = useNavigate();
    return (
        <>
            <div
                class="w-full mt-4 p-4 text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <h3 class="mb-5 text-lg font-medium text-gray-900 dark:text-white">گزارش ها</h3>
                    <ul class="grid w-full gap-6 md:grid-cols-3">
                        <li onClick={() => {
                            navigate(`/report/reportWaitingTaggedSentences`);
                        }}>
                            <input type="checkbox" class="hidden peer"/>
                            <label
                                class={` text-center inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border-2 border-primary-600 rounded-lg cursor-pointer dark:hover:text-gray-300 peer-checked:border-blue-600 hover:text-gray-600 dark:peer-checked:text-gray-300 peer-checked:text-gray-600 hover:bg-gray-50 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700`}>
                                <div class="block text-center">
                                    {/*<div class="w-full text-lg font-semibold">گزارش کاربران خاص</div>*/}
                                    <div class="w-full text-center text-sm">گزارش جمله های برپسب خورده در انتظار تایید کاربر های خاص</div>
                                </div>
                            </label>
                        </li>
                    </ul>
            </div>

        </>
    );
}
export default ReportIndex;