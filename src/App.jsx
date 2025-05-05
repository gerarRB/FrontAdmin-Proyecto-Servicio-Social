import { useState,useEffect, useContext } from 'react'
import './App.css'
import AuhtNavigation from './Navigation/Auth'
import DashBoardNavigation from './Navigation/DashBoard'
import { AuthContext, AuthPrivider } from './context/AuthContext'

const AppNavigation = () => {
  const {isLogin} = useContext(AuthContext)
  return isLogin?<DashBoardNavigation />:<AuhtNavigation />
}


function App() {

  return (
     <AuthPrivider >
      <AppNavigation />
     </AuthPrivider>
  )
}

export default App
