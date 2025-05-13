import React,{useContext} from "react";
import { Link, NavLink, Outlet } from "react-router";
import { AuthContext } from "../../context/AuthContext";

export function DashBoardView() {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <div>
      <nav className="navbar navbar-expand-lg bg-dark" data-bs-theme="dark">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Servicio Social ULS
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarTogglerDemo02"
            aria-controls="navbarTogglerDemo02"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarTogglerDemo02">
            <ul className="navbar-nav mb-2 mb-lg-0">
              <li className="nav-item">
              <NavLink
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  to="/home"
                >
                  Inicio
                </NavLink>
              </li>
              <li className="nav-item">
              <NavLink
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  to="/coordinations"
                >
                  Coordinaciones
                </NavLink>
              </li>
              <li className="nav-item">
              <NavLink
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  to="/coordinators"
                >
                  Coordinadores
                </NavLink>
              </li>
              <li className="nav-item">
              <NavLink
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  to="/institutions"
                >
                  Instituciones
                </NavLink>
              </li>
              
              <li className="nav-item">
              <NavLink
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  to="/university_degrees"
                >
                  Carreras
                </NavLink>
              </li>
              <li className="nav-item">
              <NavLink
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  to="/projects"
                >
                  Proyectos
                </NavLink>
              </li>
              <li className="nav-item">
              <NavLink
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  to="/students"
                >
                  Estudiantes
                </NavLink>
              </li>
              <li className="nav-item">
              <NavLink
                  className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
                  to="/users"
                >
                  Usuarios
                </NavLink>
              </li>
             
            </ul>

            <ul className="navbar-nav mb-2 mb-lg-0 ms-auto">
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="#"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                 {user?.email}
                </a>
                <ul className="dropdown-menu dropdown-menu-end">
                  <li>
                    <Link className="dropdown-item" to="/logout">
                      Cerrar sesion
                    </Link>
                  </li>
                 
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className="container mt-5">
        <Outlet />
      </div>
    </div>
  );
}
