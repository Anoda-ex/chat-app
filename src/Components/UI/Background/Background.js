import React from 'react'
import classes from "./Background.module.css"
export default function Background(props) {
    let style={}
    let level=props.level?props.level:1
    style.zIndex=level*100
    return (
        <div className={classes.Background} onClick={props.close} style={style}></div>
    )
}
