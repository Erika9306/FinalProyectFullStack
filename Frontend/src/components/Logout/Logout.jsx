import React from "react";
import {useNavigate} from "react-router-dom";
import { Button } from "../Button/Button";

export const Logout = ({setToken, setRole}) => {
    const navigate = useNavigate();
        
    const handleLogout = () => {
        localStorage.clear();
        console.clear();
        setToken(null);
        setRole (null);

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