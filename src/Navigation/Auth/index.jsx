import { Routes, Route } from "react-router";

import React from 'react'
import { LoginView } from "../../views/auth";

export default function index() {
  return (
   <Routes>
    <Route path="/" element={<LoginView />} ></Route>
   </Routes>
  )
}
