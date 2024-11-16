import env from "./env";

const Config: { [key: string]: any } = {
    'baseUrl': env.base,
    'loginUrl': '/login',
    'notFoundUrl': '/404',
    'dashboardUrl': '/dashboard',
    'defaultLanguage': 'fa',
    'languages': {
        'en': (await import('./Lang/en')).default,
        'fa': (await import('./Lang/fa')).default,
    },
}

export default Config;