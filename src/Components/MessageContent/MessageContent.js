import React from 'react'

export default function MessageContent(props) {
    let messageData={text:props.message.text,images:props.message.images}
    if(props.message.body){
        messageData={text:props.message.body.text,images:props.message.body.images}
    }
    if (messageData.text.length>15){
        messageData.text=messageData.text.substr(0,15)+"..."
    }
    return (
        <div>
            <span style={{color:'gray'}}>{messageData.images&&"Фотография"}</span>
            {(messageData.images&&messageData.text)&&", "}
            {messageData.text&&messageData.text}
        </div>
    )
}
