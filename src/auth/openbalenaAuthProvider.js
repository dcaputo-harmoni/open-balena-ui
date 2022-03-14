import jwt_decode from 'jwt-decode';

const authProvider = {
    login: ({ username, password }) =>  {
        const request = new Request(`${process.env.REACT_APP_OPEN_BALENA_API_URL}/login_`, {
            method: 'POST',
            body: JSON.stringify({ "username": username, "password": password }),
            headers: new Headers({ 'Content-Type': 'application/json' }),
            strictSSL: false
        });
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                response.body.getReader().read().then((streamData) => {
                    let token = (new TextDecoder()).decode(streamData.value);
                    console.log(jwt_decode(token));
                    localStorage.setItem('auth', token)
                })
            })
            .catch(() => {
                throw new Error('Network error')
            });
    },
    checkAuth: () => {
        return localStorage.getItem('auth')
        ? Promise.resolve()
        : Promise.reject();
    },
    getPermissions: () => {
        return Promise.resolve();
    },
    checkError: (error) => {
        return Promise.resolve();
    },
    logout: () => {
        localStorage.removeItem('auth');
        return Promise.resolve();
    },
    getCurrentUser: () => {
        console.dir(localStorage.getItem('auth'))
        const request = new Request(`${process.env.REACT_APP_OPEN_BALENA_API_URL}/user/v1/whoami`, {
            method: 'GET',
            headers: new Headers({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('auth')}`,
            }),
            strictSSL: false
        });
        return fetch(request)
            .then(response => {
                if (response.status < 200 || response.status >= 300) {
                    throw new Error(response.statusText);
                }
                return response.body.getReader().read().then((streamData) => {
                    let data = (new TextDecoder()).decode(streamData.value);
                    return data;
                })
            })
            .catch(() => {
                throw new Error('Network error')
            });
    }
};

export default authProvider;