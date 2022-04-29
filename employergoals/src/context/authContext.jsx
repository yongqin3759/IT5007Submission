import { createContext, useContext, useState } from "react";
import loginService from "../services/login";

const defultFunc = () => { }

const AuthContext = createContext({ logoutHandler: defultFunc, user: { email: '', fullName: '', token: '', _id: '' }, loginHandler: defultFunc, signupHandler: defultFunc });


export const AuthContextProvider = props => {
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('goal-auth')));
    const loginHandler = credentials => {
        return loginService.login(credentials)
            .then(res => {
                setUser(res.data);
                localStorage.setItem('goal-auth', JSON.stringify(res.data))
            })
    }
    const logoutHandler = () => {
        setUser(null);
        localStorage.clear('goal-auth');
    }
    const signupHandler = credentials => {
        return loginService.signup(credentials)
            .then(res => {
                setUser(res.data);
                localStorage.setItem('goal-auth', JSON.stringify(res.data))
            })
    }
    return (
        <AuthContext.Provider value={{ user, loginHandler, logoutHandler, signupHandler }}>{props.children}</AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)

export default AuthContext