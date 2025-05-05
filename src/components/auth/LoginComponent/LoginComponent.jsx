import React, { useContext, useState } from 'react'
import { style } from './LoginComponentStyle'
import { login } from '../../../services';
import { useNavigate } from 'react-router';
import { AuthContext } from '../../../context/AuthContext';

export function LoginComponent() {
    const {loginAuth,setIsLogin} = useContext(AuthContext)
    const navigate = useNavigate()
    const [email,setEmail] = useState(null);
    const [password,setPassword] = useState(null);

    const getData = (e) => {
        
        const {name,value} = e.target
        
        if(name=='email'){
            setEmail(value)
        }
        if (name=='password') {
            setPassword(value)
        }
        
       
    }

    const handleSubmit = async(e)=>{
        e.preventDefault()
        if(email == '' || email == null){
            alert('email es obligatorio')
            return
        }
        const params = {
            email,
            password
        }

        const response = await login(params)
      
        localStorage.setItem('token',response.data.token)
        if (response.data.token) {
            loginAuth(response.data.token)
            setIsLogin(true)
        }
        
        navigate('/')
        
    }
  

  return (
   <>
    <article style={style.boxStyle}>
        <div style={style.title}>
            <h1>Login</h1>
        </div>
        <div style={style.form}>
            <form action="" onSubmit={handleSubmit}>
            <div style={style.divContainer}>
                <label htmlFor="" style={style.labelStyle}>Email</label>
                <input type="text" name='email' value={email} onChange={getData}  style={style.inputStyle} />
            </div>
            <div style={style.divContainer}>
                <label htmlFor="" style={style.labelStyle}>Password</label>
                <input type="password" name='password' onChange={getData} value={password} style={style.inputStyle} />
            </div>
            <input type="submit" value='Iniciar sesión' style={style.submit} />
            </form>
        </div>
    </article>
   </>
  )
}
