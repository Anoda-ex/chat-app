import React from 'react'
export default function MessageContent(props) {
    let messageData={text:props.message.text,images:props.message.images}
    if(props.message.body){
        messageData={text:props.message.body.text,images:props.message.body.images}
    }
    if (messageData.text.length>15){
        messageData.text=messageData.text.substr(0,15)+"..."
    }
    let fontSize=18
    if(window.innerWidth<1000){
        fontSize=16
    }
    return (
        <div>
            <span style={{color:'gray',fontSize:fontSize}}>{messageData.images&&"Фотография"}</span>
            {(messageData.images&&messageData.text)&&", "}
            <span style={{fontSize:fontSize}}>{messageData.text&&messageData.text}</span>
        </div>
    )
}
