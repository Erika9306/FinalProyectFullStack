import React, {useContext} from "react";
import {useNavigate} from "react-router-dom";
import { Button } from "../Button/Button";
import { AuthContext } from "../../context/AuthContext.jsx";


export const Logout = () => {
    const {logout} = useContext(AuthContext);
    const navigate = useNavigate();
        
    const handleLogout = () => {
        logout();
        //redirigimos al login
        navigate("/login");
    }
    return (
        <Button 
            text={"Salir"} 
            onClick={handleLogout}
            className={"button-danger"}
        />
    );
}