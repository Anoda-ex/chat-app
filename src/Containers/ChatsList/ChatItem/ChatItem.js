import React, { Component } from 'react'
import { NavLink } from 'react-router-dom'
import MessageContent from '../../../Components/MessageContent/MessageContent'
import { getDate } from '../../../Date'
import classes from "./ChatItem.module.css"

export default (props)=> {
  
    return (
        <NavLink to={"/chats/"+props.id} className={classes.Link} activeClassName={classes.active}>
            <div className={classes.ChatItem} >
                <div className={classes.Avatar} onClick={()=>{props.delete(props.id)}}>
                    <img className={classes.Avatar} src={props.avatar?props.avatar:"/Images/noPhoto.jpg"}></img>
                </div>
                <div className={classes.Wrapper}>
                    <div className={classes.TopWrapper}>
                        <div className={classes.Name}>{props.name}</div>

                        <div className={classes.LastMessageTime}>
                            {getDate( props.lastMessage?props.lastMessage.date:props.chatCreateDate)}
                        </div>
                    </div>
                    <div className={classes.BottomWrapper}>
                        {props.lastMessage?
                            <MessageContent message={props.lastMessage}></MessageContent>:
                            <div>Вы создали чат!!!</div>
                        }
                    </div>
                </div>
            </div>
        </NavLink>
        
    )
    
}
