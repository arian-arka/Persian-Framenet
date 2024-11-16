import {Component, createSignal} from "solid-js";
import Form from "../../Component/Form";
import {isBadRequest, isUnauthenticated, isUnauthorized} from "../../Core/Api/Api";
import {useLocalData} from "../../Core/LocalData";
import {BadRequest} from "../../Core/Api/Response/BadRequest";
import {useToast} from "../../Component/Toast";
import UserApi from "../../Api/User.api";

const StoreUser: Component = () => {
    const localData = useLocalData();
    const toast=useToast();
    const [errors,setErrors] = createSignal<any>({},{equals:false});
    const [mirrors, setMirrors] = createSignal<any>(undefined, {equals: false});
    document.title = 'ساخت کاربر';
    const storeUser = async (values:any, setLoading:Function) => {
        console.log(values);
        setLoading(true);
        try{
            const ok = await (new UserApi()).register(values).fetch()
            localData.navigate(`/user/edit/${ok.data._id}`);
            toast.success('با موفقیت ذخیره شد');
        }catch (e) {
            console.log(e);
            if(isBadRequest(e)){
                setErrors((e as BadRequest).data.errors);
            }else if(isUnauthenticated(e))
                localData.navigate('/login');
            else if(isUnauthorized(e))
                toast.warning('دسترسی ندارید.')
            else
                toast.warning('خطا در شبکه.');
        }finally {
            setLoading(false);
        }
    }

    return (
        <>
            <Form
                errors={errors()}
                header={
                    <div class="mx-auto max-w-screen-xl mb-2">
                        <h2 class="mb-4 text-3xl leading-none tracking-tight text-gray-900 md:text-4xl dark:text-white">ساخت
                            کاربر</h2>
                    </div>
                }
                onInput={(key, val) =>{}}
                onSubmit={storeUser}
                inputs={[
                    [
                        {
                            'type': 'text',
                            'name': 'name',
                            'label': 'نام',
                            'placeholder': 'نام ...',
                            'value': '',
                        },
                        {
                            'type': 'text',
                            'name': 'email',
                            'label': 'ایمیل',
                            'placeholder': 'ایمیل ...',
                            'value': '',
                        },
                    ],
                    [
                        {
                            'type': 'password',
                            'name': 'password',
                            'label': 'رمز',
                            'placeholder': 'رمز ...',
                            'value': '',
                        },

                    ],
                ]}
            />
        </>
    );
}
export default StoreUser;