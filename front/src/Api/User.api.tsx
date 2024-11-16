import Api from "../Core/Api/Api";
import UserInterface, {
    GrantUserInterface,
    LoginUserInterface, PaginateUserInterface,
    PaginateUserLogInterface,
    RegisterUserInterface,
    UpdateProfileInterface, UpdateUserInterface, UserLogPaginatedInterface
} from "../Type/User.interface";
import UserLoginValidation from "../Validation/User/UserLogin.validation";
import UserRegisterValidation from "../Validation/User/UserRegister.validation";
import UserProfileValidation from "../Validation/User/UserProfile.validation";
import EditUserValidation from "../Validation/User/EditUser.validation";
import CsrfApi from "./Csrf.api";

export default class UserApi extends CsrfApi {
    login(data: LoginUserInterface) {
        return this._fetch<UserInterface>({
            method: `POST`,
            url: '/api/user/login',
            headers: {"Content-Type": "application/json",},
            body: data,
            validation: UserLoginValidation
        })
    }

    register(data: RegisterUserInterface) {
        return this._fetch<UserInterface>({
            method: `POST`,
            url: '/api/user/register',
            body: data,
            headers: {"Content-Type": "application/json",},
            validation: UserRegisterValidation
        })
    }

    updateProfile(data: UpdateProfileInterface) {
        return this._fetch<any>({
            method: `PUT`,
            url: '/api/user/updateProfile',
            body: data,
            headers: {"Content-Type": "application/json",},
            validation: UserProfileValidation
        })
    }

    updateUser(data: UpdateUserInterface) {
        return this._fetch<any>({
            method: `PUT`,
            url: '/api/user/updateUser',
            body: data,
            headers: {"Content-Type": "application/json",},
            validation: EditUserValidation
        })
    }
    suspend(user:string,grant:boolean) {
        return this._fetch({
            method: `PUT`,
            url: `/api/user/suspend/${user}/${grant ? 'true':'false'}`,
            headers: {"Content-Type": "application/json",},
            body: {},
        })
    }
    grantAll(user:string,grant:boolean) {
        return this._fetch({
            method: `PUT`,
            url: `/api/user/grant/${user}/${grant ? 'true':'false'}`,
            headers: {"Content-Type": "application/json",},
            body: {},
        })
    }
    grant(data: GrantUserInterface) {
        return this._fetch({
            method: `PUT`,
            url: `/api/user/grant`,
            headers: {"Content-Type": "application/json",},
            body: data,
        })
    }
    log(data: PaginateUserLogInterface) {
        return this._fetch<UserLogPaginatedInterface>({
            method: `POST`,
            url: `/api/user/log`,
            headers: {"Content-Type": "application/json",},
            body: data,
        })
    }
    list(data: PaginateUserInterface) {
        return this._fetch({
            method: `POST`,
            url: `/api/user/list`,
            headers: {"Content-Type": "application/json",},
            body: data,
        })
    }

    logout() {
        return this._fetch<any>({
            method: `GET`,
            url: `/api/user/logout`
        })
    }

    delete(user: string) {
        return this._fetch<any>({
            'method': 'DELETE',
            'url': `/api/user/delete/${user}`
        });
    }

    current() {
        return this._fetch<UserInterface>({
            'method': 'GET',
            'url': `/api/user`
        });
    }

    user(user: string) {
        return this._fetch<UserInterface>({
            'method': 'GET',
            'url': `/api/user/${user}`
        });
    }
}