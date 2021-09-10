import React, { Component } from 'react'
import Background from '../Background/Background'
import classes from "./Modal.module.css"
export default (props)=> {
        let style={}
        if(props.noPadding){
            style.padding=0
            
        }
        let level=props.level?props.level:1
        style.zIndex=level*101
        let classList=[classes.Modal]
        if(props.show){
            classList.push(classes.Show)
        }
        return (
            <React.Fragment>
                {props.show&&<Background close={props.close} level={props.level}></Background>}
                <div className={classList.join(" ")} style={style}>
                    {props.show&&props.children}
                </div>
            </React.Fragment>
        )
    
}
