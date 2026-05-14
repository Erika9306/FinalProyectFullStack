import React from "react";
import "./AdminNavbar.css";
import { Link } from "react-router-dom";
import {Logout} from "../../Logout/Logout.jsx";




export default function AdminNavbar() {
  

  return (
    <div className="navbar">
    <nav >      
     <ul>
        <li><Link to="/admin/home">🏠</Link></li>
        <li><Link to="/admin/users" >👤</Link></li>
        <li><Link to="/admin/movies" >🎬</Link></li>
       
      </ul>
      <Logout/>
    </nav>
    </div>
  );
}
