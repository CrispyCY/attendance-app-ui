// import PropTypes from 'prop-types';
// import { createContext, useEffect, useReducer } from 'react';

// // third-party
// import { Chance } from 'chance';
// import jwtDecode from 'jwt-decode';

// // reducer - state management
// import { LOGIN, LOGOUT } from 'store/actions';
// import accountReducer from 'store/accountReducer';

// // project imports
// import Loader from 'ui-component/Loader';
// import axios from 'utils/axios';

// const chance = new Chance();

// // constant
// const initialState = {
//     isLoggedIn: false,
//     isInitialized: false,
//     user: null
// };

// const verifyToken = (serviceToken) => {
//     if (!serviceToken) {
//         return false;
//     }
//     const decoded = jwtDecode(serviceToken);
//     /**
//      * Property 'exp' does not exist on type '<T = unknown>(token, options?: JwtDecodeOptions | undefined) => T'.
//      */
//     return decoded.exp > Date.now() / 1000;
// };

// const setSession = (serviceToken) => {
//     if (serviceToken) {
//         localStorage.setItem('serviceToken', serviceToken);
//         axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
//     } else {
//         localStorage.removeItem('serviceToken');
//         delete axios.defaults.headers.common.Authorization;
//     }
// };

// // ==============================|| JWT CONTEXT & PROVIDER ||============================== //
// const JWTContext = createContext(null);

// export const JWTProvider = ({ children }) => {
//     const [state, dispatch] = useReducer(accountReducer, initialState);

//     useEffect(() => {
//         const init = async () => {
//             try {
//                 const serviceToken = window.localStorage.getItem('serviceToken');
//                 if (serviceToken && verifyToken(serviceToken)) {
//                     setSession(serviceToken);
//                     const response = await axios.get('/api/account/me');
//                     const { user } = response.data;
//                     dispatch({
//                         type: LOGIN,
//                         payload: {
//                             isLoggedIn: true,
//                             user
//                         }
//                     });
//                 } else {
//                     dispatch({
//                         type: LOGOUT
//                     });
//                 }
//             } catch (err) {
//                 console.error(err);
//                 dispatch({
//                     type: LOGOUT
//                 });
//             }
//         };

//         init();
//     }, []);

//     const login = async (email, password) => {
//         const response = await axios.post('/api/account/login', { email, password });
//         const { serviceToken, user } = response.data;
//         setSession(serviceToken);
//         dispatch({
//             type: LOGIN,
//             payload: {
//                 isLoggedIn: true,
//                 user
//             }
//         });
//     };

//     const register = async (email, password, firstName, lastName) => {
//         // todo: this flow need to be recode as it not verified
//         const id = chance.bb_pin();
//         const response = await axios.post('/api/account/register', {
//             id,
//             email,
//             password,
//             firstName,
//             lastName
//         });
//         let users = response.data;

//         if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
//             const localUsers = window.localStorage.getItem('users');
//             users = [
//                 ...JSON.parse(localUsers),
//                 {
//                     id,
//                     email,
//                     password,
//                     name: `${firstName} ${lastName}`
//                 }
//             ];
//         }

//         window.localStorage.setItem('users', JSON.stringify(users));
//     };

//     const logout = () => {
//         setSession(null);
//         dispatch({ type: LOGOUT });
//     };

//     const resetPassword = async (email) => {
//         console.log(email);
//     };

//     const updateProfile = () => { };

//     if (state.isInitialized !== undefined && !state.isInitialized) {
//         return <Loader />;
//     }

//     return (
//         <JWTContext.Provider value={{ ...state, login, logout, register, resetPassword, updateProfile }}>{children}</JWTContext.Provider>
//     );
// };

// JWTProvider.propTypes = {
//     children: PropTypes.node
// };

// export default JWTContext;

import PropTypes from 'prop-types';
import { createContext, useEffect, useReducer } from 'react';

// third-party
import { Chance } from 'chance';
import jwtDecode from 'jwt-decode';

// reducer - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// project imports
import Loader from 'ui-component/Loader';
import axios from 'utils/axios';
import { openSnackbar } from 'store/slices/snackbar';
import { useDispatch } from 'store';

const chance = new Chance();
// const CryptoJS = require("crypto-js");

// constant
const initialState = {
    isLoggedIn: false,
    isInitialized: false,
    user: null,
    organization: null,
    // modules: null
};

const verifyToken = (serviceToken) => {
    if (!serviceToken) {
        return false;
    }
    const decoded = jwtDecode(serviceToken);
    /**
     * Property 'exp' does not exist on type '<T = unknown>(token, options?: JwtDecodeOptions | undefined) => T'.
     */
    // console.log(decoded.exp > Date.now() / 1000 ? 'Token not expired' : 'Token expired')
    return decoded.exp > Date.now() / 1000;
};

const setSession = (serviceToken) => {
    if (serviceToken) {
        localStorage.setItem('serviceToken', serviceToken);
        axios.defaults.headers.common.Authorization = `Bearer ${serviceToken}`;
    } else {
        localStorage.removeItem('serviceToken');
        delete axios.defaults.headers.common.Authorization;
    }
};

// const setSessionUser = (user) => {
//     if (user) {
//         const encrypted = CryptoJS.AES.encrypt(user, process.env.REACT_APP_CRYPTOJS_PASS_KEY);
//         localStorage.setItem('user', encrypted);
//     } else {
//         localStorage.removeItem('user');
//     }
// };

// ==============================|| JWT CONTEXT & PROVIDER ||============================== //
const JWTContext = createContext(null);

export const JWTProvider = ({ children }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);
    const dispatchMsg = useDispatch();

    useEffect(() => {
        const init = async () => {
            try {
                const serviceToken = window.localStorage.getItem('serviceToken');
                if (serviceToken && verifyToken(serviceToken)) {
                    setSession(serviceToken);
                    console.log(axios.get('user/me', {
                        withCredentials: true
                    }));
                    const response = await axios.get('user/me', {
                        withCredentials: true
                    });
                    const { user } = response.data;
                    // const modules = response.data.modules
                    const organization = response.data.organization

                    dispatch({
                        type: LOGIN,
                        payload: {
                            isLoggedIn: true,
                            user,
                            organization,
                            // modules
                        }
                    });
                } else if (serviceToken && !verifyToken(serviceToken)) {
                    dispatchMsg(
                        openSnackbar({
                            open: true,
                            message: 'Login Expired! Please re-login!',
                            variant: 'alert',
                            alert: {
                                color: 'error'
                            },
                            close: true
                        })
                    );
                    dispatch({
                        type: LOGOUT
                    });
                } else {
                    dispatch({
                        type: LOGOUT
                    });
                }
            } catch (err) {
                console.error(err);
                dispatch({
                    type: LOGOUT
                });
            }
        };

        init();
    }, []);

    const login = async (email, password) => {
        const response = await axios.post('auth/login', { email, password });
        const { token,
            user
        } = response.data;
        // const modules = response.data.modules
        const organization = response.data.organization
        console.log(user, token)
        setSession(token);
        dispatch({
            type: LOGIN,
            payload: {
                isLoggedIn: true,
                user,
                organization,
                // modules
            }
        });
    };

    const register = async (email, password, firstName, lastName) => {
        // todo: this flow need to be recode as it not verified
        const id = chance.bb_pin();
        const response = await axios.post('/api/account/register', {
            id,
            email,
            password,
            firstName,
            lastName
        });
        let users = response.data;

        if (window.localStorage.getItem('users') !== undefined && window.localStorage.getItem('users') !== null) {
            const localUsers = window.localStorage.getItem('users');
            users = [
                ...JSON.parse(localUsers),
                {
                    id,
                    email,
                    password,
                    name: `${firstName} ${lastName}`
                }
            ];
        }

        window.localStorage.setItem('users', JSON.stringify(users));
    };

    const logout = () => {
        setSession(null);
        dispatch({ type: LOGOUT });
    };

    const resetPassword = async (email) => {
        await axios.post('member/forgetPassword', { email });
    };

    const updateProfile = () => { };

    if (state.isInitialized !== undefined && !state.isInitialized) {
        return <Loader />;
    }

    return (
        <JWTContext.Provider value={{ ...state, login, logout, register, resetPassword, updateProfile }}>{children}</JWTContext.Provider>
    );
};

JWTProvider.propTypes = {
    children: PropTypes.node
};

export default JWTContext;
