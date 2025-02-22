export default (env : NodeJS.ProcessEnv) : object => {
    return {
        'mongodb' : env.MONGODB_STRING ?? 'mongodb://127.0.0.1:27017',
    };
};
