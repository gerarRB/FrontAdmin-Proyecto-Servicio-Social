import React, { useEffect } from 'react'
import { useContext } from 'react'
import { AuthContext } from '../../../context/AuthContext'
import { useNavigate } from 'react-router'
import { logoutApi } from '../../../services'

export default function LogoutComponent() {
    const {logout} = useContext(AuthContext)
    const navigate = useNavigate()
    const handleLogout = async() => {
        try {

            const response = await logoutApi()
            if (response.status == 200) {
                logout()
                navigate('/')
            }else{
                navigate('/')
            }
           
    
        } catch (error) {
            
        }
      
    }
   
    useEffect(() => {
        handleLogout()
    }, [])
  return (
    <div>
      a
    </div>
  )
}
