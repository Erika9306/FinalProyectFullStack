import React from 'react'
import './Button.css'

export const Button = ({type= "button", text, onClick, className}) => {
  return (
    <button className={className}
     onClick={onClick}
     type={type}
     >
      {text}
    </button>
  )
}
