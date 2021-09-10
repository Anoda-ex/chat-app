import React from 'react'
import MessageContent from '../../../Components/MessageContent/MessageContent'
import ImagesBlock from '../../../Components/UI/ImagesBlock/ImagesBlock'
import { getDateHM } from '../../../scripts/Date'
import getName from '../../../scripts/getName'
import classes from "./Message.module.css"
function Message(props) {
    let style=null
    if(props.author){
        style={
            marginLeft:"auto" 
        }
    }
  
    let messageData={text:props.message.text,images:props.message.images}
    if(props.message.isForward){
        messageData={text:props.message.body.text,images:props.message.body.images}
    }

    let wrapperClasses=[classes.Message]
    if(props.author){
        wrapperClasses.push(classes.MessageAuthor)
    }
    if(!!props.images && !props.replyMessage && !props.isForward){
        wrapperClasses.push(classes.MessageWithImages)
    }
    let userForwardName = ""
    return (
        
        <div className={classes.MessageWrapper} onMouseDown={props.toggleSelectMessageHandler} onMouseUp={props.toggleSelectMessageHandler} onDoubleClick={props.onDoubleClick}>
            <div className={wrapperClasses.join(" ")} >
                {props.message.isForward&&<div className={classes.ForwardMessage}>Переслано от {getName(props.users,props.message.body.user)}</div>}
                {!props.author&&!props.message.isForward&&<div className={classes.AuthorName}>{getName(props.users,props.message.user)}</div>}
                {props.replyMessage&&<div className={classes.Reply}>
                    <div className={classes.ReplyUser}>{getName(props.users,props.replyMessage.user)}</div>  
                    <MessageContent message={props.replyMessage}></MessageContent>
                </div>}
                {messageData.images&&<ImagesBlock images={messageData.images}></ImagesBlock>}
                {messageData.text&&<p  className={classes.MessageText}>{messageData.text}</p>}
                {props.select&&<div className={classes.Select}></div>}
                <div className={classes.Date}>{getDateHM(props.message.date)}</div>
            </div>
        </div>
    )
}

export default Message
