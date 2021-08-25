import React from 'react'
import classes from "./Button.module.css"
export default function Button(props) {
    let buttonClasses=[classes.Button]
    if(props.className){
        buttonClasses.push(props.className)
    }
    return (
        <button className={buttonClasses.join(" ")} onClick={props.onClick}>
            {props.children}
        </button>
    )
}
