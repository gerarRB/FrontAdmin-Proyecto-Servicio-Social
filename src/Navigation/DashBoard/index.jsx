import { Routes,Route } from "react-router";

import React from 'react'
import { DashBoardView } from "../../views/DashBoardView";
import LogoutComponent from "../../components/auth/LogoutComponent/LogoutComponent";
import { HomeView } from "../../views/HomeView";
import { StudentView } from "../../views/StudentView";
import {CoordinatorView} from "../../views/CoordinatorView";
import { CoordinationView } from "../../views/CoordinationView";
import { UserView } from "../../views/UserView";
import { UniversityDegreeView } from "../../views/UniversityDegreeView";
import { ProjectView } from "../../views/ProjectView";
import { InstitutionView } from "../../views/InstitutionView";
import { DirectionView } from "../../views/DirectionView";


export default function index() {
  return (
    <Routes>
        <Route path="/" element={<DashBoardView />}>
          <Route index element={<HomeView />} />
          <Route path="home" element={<HomeView/>}/>
          <Route path="users" element={< UserView/>} />
          <Route path="coordinations" element={<CoordinationView />} />
          <Route path="coordinators" element={<CoordinatorView />} />
          <Route path="directions" element={<DirectionView />} />
          <Route path="institutions" element={<InstitutionView />} />
          <Route path="university_degrees" element={<UniversityDegreeView />} />
          <Route path="projects" element={< ProjectView/>} />
          <Route path ="students" element={<StudentView />} />
        </Route>
        <Route path="/logout" element={<LogoutComponent />}></Route>
        
    </Routes>
  )
}
