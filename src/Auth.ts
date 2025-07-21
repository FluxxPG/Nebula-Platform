

const Auth = {

    isAuthenticated: false,

    getAuth() {
        if (typeof window !== 'undefined') {
            const status = sessionStorage.getItem('status');
            return status === 'true';
        }
        return false;
    },

    signOut() {
        if (typeof window !== 'undefined') {
            this.isAuthenticated = false;
            sessionStorage.removeItem('sessionKey');
            sessionStorage.removeItem('status')
            window.location.href = '/';
        }
    }

}

export default Auth;