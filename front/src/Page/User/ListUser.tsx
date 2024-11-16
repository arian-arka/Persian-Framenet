import {Component, createSignal} from "solid-js";
import {useToast} from "../../Component/Toast";
import {useLocalData} from "../../Core/LocalData";
import Table from "../../Component/Table";
import {A} from "@solidjs/router";
import {Ok} from "../../Core/Api/Response/Ok";
import Log from "../../Core/Log";
import {BadRequest} from "../../Core/Api/Response/BadRequest";
import UserApi from "../../Api/User.api";
import { UserPaginatedInterface} from "../../Type/User.interface";
import {USER_PRIVILEGES} from "../../Constant/User";

const ListUser: Component = () => {
    const toast = useToast();
    const [rows, setRows] = createSignal<any>(undefined, {equals: false});
    const [data, setData] = createSignal<any>(undefined, {equals: false});
    const [pagination, setPagination] = createSignal<any>(undefined, {equals: false});
    const localData = useLocalData();


    const fetchList = async (filters: any) => {
        setRows(undefined);
        Log.secondary('filters', filters);
        let _filters = {...filters};

        _filters.name = _filters?.name ?? null;
        _filters.email = _filters?.email ?? null;

        _filters = {
            ..._filters, ...{
                limit:!!_filters?.limit ? _filters.limit : 50,
                linkPerPage: 5
            }
        };
        Log.secondary('_filters', _filters);
        await (new UserApi()).list(_filters).forever({
            ok(r: Ok<UserPaginatedInterface>) {
                Log.success('users', r.data);
                setRows(r.data.data);
                setPagination(r.data.pagination);
            },
            unAuthenticated(r: BadRequest) {
                localData.navigate('/login');
            },
            bad(r: BadRequest) {
                Log.danger('users', r);
            }
        });
    }

    fetchList({
        page: 1,
        lang: '',
        status: '',
        limit: 50,
    });
    const addButton = useLocalData()?.localData()?.isSuperAdmin === 'true' || useLocalData()?.localData()?.privileges?.includes(USER_PRIVILEGES['store user']) ?
        {
            'text' : 'ساخت کاربر',
            'callback':()=>{localData.navigate(`/user/store`)}
        } : null;
    const actions = [];
    if(useLocalData()?.localData()?.isSuperAdmin  === true || useLocalData()?.localData()?.privileges?.includes(USER_PRIVILEGES['edit user']))
        actions.push({
            text: <>
                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5"
                     viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"></path>
                </svg>
            </>,
            link(row) {
                return `/user/edit/${row._id}`
            }
        })
    document.title = 'فهرست کاربرها';
    return (
        <>
            <Table
                limits={[50,100,250,500,1000,1500,2000,2500]}
                filters={[
                    {
                        name: 'email',
                        value: '',
                        type: 'text',
                        label: 'ایمیل',
                        placeholder: 'جستجو ایمیل...'
                    },
                ]}
                addButton={addButton}
                searchInput={{
                    name: 'name',
                    value: '',
                    placeholder: 'جستجو نام...'
                }}
                onFilter={(v: any) => {
                    setData(v);
                    fetchList({...data(), page: 1})
                }}
                pagination={pagination()}
                onPage={async (page: any) => await fetchList({...data(), 'page': page as unknown as number})}
                header={'فهرست کاربرها'}
                // actions={actions}
                columns={[
                    {
                        key: 'name',
                        text: 'نام',
                        customValue(val,row) {
                            if(useLocalData()?.localData()?.isSuperAdmin === 'true' || useLocalData()?.localData()?.privileges?.includes(USER_PRIVILEGES['edit user']))
                                return (<A target="_blank" class="font-medium text-gray-800 dark:text-blue-500 hover:underline"
                                                    href={`/user/edit/${row._id}`}>{val}</A>)
                            return val;
                        }
                    },
                    {
                        key: 'email',
                        text: 'ایمیل',
                    },
                    {
                        key: 'report',
                        text: 'فعالیت',
                        customValue(val,row) {
                            return (<A target="_blank" class="text-center flex justify-center font-medium text-blue-600 hover:underline"
                                           href={`/user/report/${row._id}`}>
                                <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25M9 16.5v.75m3-3v3M15 12v5.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"></path>
                                </svg>
                            </A>)
                        }
                    },
                ]}
                rows={rows()}
            />
        </>
    );
}
export default ListUser;