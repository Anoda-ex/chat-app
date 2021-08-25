import React, { Component } from 'react'
import Background from '../Background/Background'
import classes from "./Modal.module.css"
export default (props)=> {
        let style={}
        if(!props.show){
            return null
        }
        if(props.noPadding){
            style.padding=0
            
        }
        let level=props.level?props.level:1
        style.zIndex=level*101
        return (
            <React.Fragment>
                <Background close={props.close} level={props.level}></Background>
                <div className={classes.Modal} style={style}>
                    {props.children}
                </div>
            </React.Fragment>
        )
    
}
