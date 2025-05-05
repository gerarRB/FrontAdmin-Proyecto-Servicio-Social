import { Children, createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";


export const AuthContext = createContext();

export const AuthPrivider = ({children, initialState}) => {
    const [token, setToken] = useState(null);
    const [isLogin, setIsLogin] = useState(false);
    const [user, setUser] = useState(null);

    const loginAuth = (newToken) => {
       try {
        setToken(newToken);
        localStorage.setItem('token', newToken);
        const decodedToken = jwtDecode(newToken);
        const userData = {
            id: decodedToken.user_id,
          
            email: decodedToken.email,
        
        }
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
       } catch (error) {
        console.log(error);
       }
    }

    const logout = () => {
        setToken(null);
        localStorage.removeItem('token');
        setIsLogin(false);
    }

    useEffect(()=>{
        const checkoutIsLogin =() => {
            const token = localStorage.getItem('token');
            if (token) {
                setToken(token);
                setIsLogin(true);
            } else {
                setIsLogin(false);
            }
        }
        checkoutIsLogin()
    },[])

    return (
        <AuthContext.Provider value={{isLogin,token,loginAuth,logout,setIsLogin}} >
            {children}
        </AuthContext.Provider>
    )
}