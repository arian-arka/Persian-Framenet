import {Component, createEffect, createSignal} from "solid-js";
import {useToast} from "../../Component/Toast";
import {useLocalData} from "../../Core/LocalData";
import Log from "../../Core/Log";
import UserApi from "../../Api/User.api";
import {Ok} from "../../Core/Api/Response/Ok";
import {UserLogPaginatedInterface, UserPaginatedInterface} from "../../Type/User.interface";
import {BadRequest} from "../../Core/Api/Response/BadRequest";
import {LOG_TYPE} from "../../Constant/User";
import Table from "../../Component/Table";
import {A, useParams} from "@solidjs/router";
import Language from "../../Core/Language";

const UserReport : Component = () =>{
    const params=useParams<{user:string}>();
    const toast = useToast();
    const [rows, setRows] = createSignal<any>(undefined, {equals: false});
    const [data, setData] = createSignal<any>(undefined, {equals: false});
    const [pagination, setPagination] = createSignal<any>(undefined, {equals: false});
    const localData = useLocalData();


    const fetchList = async (filters: any) => {
        setRows(undefined);
        Log.secondary('filters', filters);
        let _filters = {...filters};

        _filters.type = !!_filters?.type ? parseInt(_filters?.type) : null;
        _filters.period = !!_filters?.period ? parseInt(_filters?.period) : null;

        _filters = {
            ..._filters, ...{
                issuer:params.user,
                limit:!!_filters?.limit ? _filters.limit : 50,
                linkPerPage: 5
            }
        };
        Log.secondary('_filters', _filters);
        await (new UserApi()).log(_filters).forever({
            ok(r: Ok<UserLogPaginatedInterface>) {
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
        type:null,
        period:null,
        issuer:params.user,
    });
        document.title = 'گزارش'

    const getLogText = (key:number) => Language.get(`user.logs.${Object.keys(LOG_TYPE)[Object.values(LOG_TYPE).indexOf(key)]}`);
    const getRefLink = (action:number,ref?:string) => {
        if(!(!!ref))
            return '#';
        if(action < 10)
            return `/frame/${ref}`;
        if(action < 20)
            return `/element/edit/${ref}`;
        if(action < 30)
            return `/lexicalUnit/edit/${ref}`;
        if(action < 40)
            return `/sentence/edit/${ref}`;
        if(action < 50)
            return `/taggedSentence/edit/${ref}`;
        if(action < 60)
            return `/user/edit/${ref}`;
        if(action < 70)
            return `/frameRelation/edit/${ref}`;
        return '#';
    }
    return (
        <>
            <Table
                limits={[50,100,250,500,1000,1500,2000,2500]}
                filters={[
                    {
                        name: 'type',
                        value: '',
                        type: 'select',
                        label: 'نوع',
                        options:[
                            {
                                text:'پیش فرض',
                                value:'',
                            },
                        ...Object.keys(LOG_TYPE).filter((k) => !['store user','edit user','delete user'].includes(k)).map((k) => {
                            return {
                                text : Language.get(`user.logs.${k}`),
                                value : `${Object.values(LOG_TYPE)[Object.keys(LOG_TYPE).indexOf(k)]}`
                            }
                        })]
                    },
                    {
                        name: 'period',
                        value: '',
                        type: 'select',
                        label: 'بازه',
                        options:[
                            {
                                text:'پیش فرض',
                                value:'',
                            },
                            {
                                text:'امروز',
                                value:'1',
                            },
                            {
                                text:'هفته',
                                value:'2',
                            },
                            {
                                text:'ماه',
                                value:'3',
                            }, {
                                text:'سال',
                                value:'4',
                            },

                        ],
                    },
                ]}
                onFilter={(v: any) => {
                    setData(v);
                    fetchList({...data(), page: 1})
                }}
                buttons={[
                    <A href={`/user/edit/${params.user}`}
                       class="lg:ml-6 md:ml-6  w-full lg:w-1/5 md:w-1/5 sm:w-full flex items-center justify-center  px-1 py-2 text-sm text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg">
                         کاربر
                    </A>,

                ]}
                pagination={pagination()}
                onPage={async (page: any) => await fetchList({...data(), 'page': page as unknown as number})}
                header={'لیست گزارش فعالیت'}
                columns={[
                    {
                        key: 'description',
                        text: 'فعالیت',
                        customValue(val,row) {
                            return (<A target="_blank" class="font-medium text-blue-600 hover:underline" href={getRefLink(row.action,row?.ref)}>{val}</A>)
                        }
                    },
                    {
                        key: 'action',
                        text: 'نوع',
                        customValue : (val,row) => getLogText(val),
                    },
                    {
                        key: 'createdAt',
                        text: 'تاریخ',
                        customValue : (val,row) => (new Date(val)).toLocaleDateString('fa-IR',{ year: 'numeric', month: 'long', day: 'numeric' ,hour:"2-digit",minute:"2-digit",second:"2-digit"}),
                    },
                ]}
                rows={rows()}
            />
        </>
    );
}
export default UserReport;