import {Component, createEffect, createSignal, For, Show} from "solid-js";
import Form from "../../Component/Form";
import Log from "../../Core/Log";
import {isBadRequest, isUnauthenticated, isUnauthorized} from "../../Core/Api/Api";
import {useLocalData} from "../../Core/LocalData";
import {BadRequest} from "../../Core/Api/Response/BadRequest";
import {useToast} from "../../Component/Toast";
import {A, useParams} from "@solidjs/router";
import {Ok} from "../../Core/Api/Response/Ok";
import UserApi from "../../Api/User.api";
import UserInterface from "../../Type/User.interface";
import {USER_PRIVILEGES} from "../../Constant/User";
import Language from "../../Core/Language";

const EditProfile: Component = () => {
    const localData = useLocalData();
    const toast = useToast();
    const [errors, setErrors] = createSignal<any>({}, {equals: false});
    const [user, setUser] = createSignal<UserInterface | undefined>(undefined, {equals: false});
    const editUser = async (values: any, setLoading: Function) => {
        console.log(values);
        setLoading(true);
        try {
            const ok = await (new UserApi()).updateProfile({
                name: values?.name,
                email: values?.email,
                newPassword: !!values?.newPassword ? values.newPassword : null,
                oldPassword: !!values?.oldPassword ? values.oldPassword : null,
            }).fetch()
            setErrors({});
            toast.success('با موفقیت ذخیره شد');
        } catch (e) {
            console.log(e);
            if (isBadRequest(e)) {
                setErrors((e as BadRequest).data.errors);
            } else if (isUnauthenticated(e))
                localData.navigate('/login');
            else if (isUnauthorized(e))
                toast.warning('دسترسی ندارید.')
            else
                toast.warning('خطا در شبکه.');
        } finally {
            setLoading(false);
        }
    }

    (new UserApi()).current().forever({
        ok(r: Ok<UserInterface>) {
            Log.success('r', r);
            setUser(r.data);
        },
        unAuthenticated(r: BadRequest) {
            localData.navigate('/login');
        },
    });

        document.title = 'پروفایل';

    return (
        <Show when={user()} fallback={
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
            <Form
                errors={errors()}
                header={
                    <div class="mx-auto max-w-screen-xl mb-2">
                        <h2 class="mb-4 text-3xl leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">ویرایش
                            پروفایل</h2>
                        <p class="mb-8 font-light text-gray-500 lg:mb-16 sm:text-xl dark:text-gray-400">
                            <A href={`/user/list`}
                               class="inline-flex items-center font-medium text-blue-600 dark:text-blue-500 hover:underline">
                                بازگشت
                                <svg aria-hidden="true" class="w-5 h-5 ml-1" fill="currentColor"
                                     viewBox="0 0 20 20"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path fill-rule="evenodd"
                                          d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                                          clip-rule="evenodd"></path>
                                </svg>
                            </A>
                        </p>
                    </div>
                }
                onInput={(key, val) => {
                }}
                onSubmit={editUser}
                inputs={[
                    [
                        {
                            'type': 'text',
                            'name': 'name',
                            'label': 'نام',
                            'placeholder': 'نام ...',
                            'value': user()?.name ?? '',
                        },
                        {
                            'type': 'text',
                            'name': 'email',
                            'label': 'ایمیل',
                            'placeholder': 'ایمیل ...',
                            'value': user()?.email ?? '',
                        },
                    ],
                    [
                        {
                            'type': 'password',
                            'name': 'oldPassword',
                            'label': 'رمز',
                            'placeholder': 'رمز ...',
                            'value': '',
                        },
                        {
                            'type': 'password',
                            'name': 'newPassword',
                            'label': <>
                                رمز جدید
                                <span class="text-xs">
                                (تنها در صورتی این فیلد را پر کنید که می خواهید رمزتان را تغییر کنید)
                                </span>
                            </>,

                            'placeholder': 'رمز جدید ...',
                            'value': '',
                        },
                    ],
                ]}
            />

        </Show>
    );
}
export default EditProfile;