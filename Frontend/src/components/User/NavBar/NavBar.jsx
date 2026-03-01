import React from "react";
import "./NavBar.css";
import { NavLink } from "react-router-dom";
import {Logout} from "../../Logout/Logout";

export const NavBar = ({setToken, setRole}) => {
  return (
    <nav className="navbar-user">
      <ul>
        <li><NavLink to="/">🏠</NavLink></li>
        <li><NavLink to="/user/profile">👤</NavLink></li>
        <li><NavLink to="/user/favourite">❤️</NavLink></li>
        
      </ul>
        <Logout setToken={setToken} setRole={setRole}/>
    </nav>
  );
};
export default NavBar;