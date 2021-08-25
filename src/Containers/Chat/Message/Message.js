import React from 'react'
import MessageContent from '../../../Components/MessageContent/MessageContent'
import ImagesBlock from '../../../Components/UI/ImagesBlock/ImagesBlock'
import { getDateHM } from '../../../Date'
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
    let userName = props?.user?.public?.name?props.user.public.name:props.message.user
    let userForwardName = ""
    if(props.forwardUser){
        userForwardName=props.forwardUser?.public?.name ? props.forwardUser.public.name:props.message.body.user
    }
    return (
        
        <div className={classes.MessageWrapper} onMouseDown={props.toggleSelectMessageHandler} onMouseUp={props.toggleSelectMessageHandler} onDoubleClick={props.onDoubleClick}>
            <div className={wrapperClasses.join(" ")} >
                {props.message.isForward&&<div className={classes.ForwardMessage}>Переслано от {userForwardName}</div>}
                {!props.author&&!props.message.isForward&&<div className={classes.AuthorName}>{userName}</div>}
                {props.replyMessage&&<div className={classes.Reply}>
                    <div className={classes.ReplyUser}>{props.replyMessage.user}</div>  
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
