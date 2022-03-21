import jwt_decode from 'jwt-decode';

const authProvider = {
    login: ({ username, password }) => {
        return fetch(`${process.env.REACT_APP_OPEN_BALENA_API_URL}/login_`, {
            method: 'POST',
            body: JSON.stringify({ "username": username, "password": password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
            insecureHTTPParser: true
        }).then(response => {
            if (response.status < 200 || response.status >= 300) {
                throw new Error(response.statusText);
            }
            return response.body.getReader().read().then((streamData) => {
                let token = (new TextDecoder()).decode(streamData.value);
                localStorage.setItem('auth', token)
            })
        })
        .catch(() => {
            throw new Error(`Error: Could not log in as user ${username}`)
        });
    },
    checkAuth: (params) => {
        return localStorage.getItem('auth')
        ? Promise.resolve()
        : Promise.reject();
    },
    getPermissions: (params) => {
        const jwt = localStorage.getItem('auth');
        return jwt
            ? Promise.resolve(jwt_decode(jwt).permissions)
            : Promise.reject();
    },
    checkError: (error) => {
        return Promise.resolve();
    },
    logout: () => {
        localStorage.removeItem('auth');
        return Promise.resolve();
    },
    getSession: () => {
        const jwt = localStorage.getItem('auth');
        return ({jwt: jwt, object: jwt_decode(jwt)});
    },
};

export default authProvider;