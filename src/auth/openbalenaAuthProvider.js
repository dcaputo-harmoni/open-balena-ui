const authProvider = {
    login: ({ username, password }) =>  {
        console.log(JSON.stringify({ "username": username, "password": password }));
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
                console.log(response);
                return response;
            })
            .then(auth => {
                localStorage.setItem('auth', auth);
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
};

export default authProvider;