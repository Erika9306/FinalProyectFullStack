import React from 'react'
import './Button.css'

export const Button = ({text, onClick, className}) => {
  return (
    <button className={className}
     onClick={onClick}
     >
      {text}
    </button>
  )
}
