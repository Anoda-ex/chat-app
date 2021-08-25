import React, { Component } from 'react'
import {withRouter} from "react-router-dom"
import classes from "./NoSelectChat.module.css"
const NoSelectChat=(props)=> {
    return (
            <div className={classes.NoSelectChat}  >
                <h1 className={classes.Title}>Выберите чат...</h1>
            </div>
    )
}


export default NoSelectChat
