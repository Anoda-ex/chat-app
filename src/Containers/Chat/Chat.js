import React, { Component } from 'react'
import classes from "./Chat.module.css"
import Message from "./Message/Message"
import * as actions from "../../store/index"
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import ListModal from '../ListModal/ListModal';
import ImageInputModal from './ImageInputModal/ImageInputModal';
import MessageContent from '../../Components/MessageContent/MessageContent';
import ChatMenu from './ChatMenu/ChatMenu';
class Chat extends Component {
    state={
        selectMessages:[],
        canDeleteMessages:false,
        forwardMessages:null,
        showImageModal:false,
        imageModalInitImage:null,
        replyMessage:null,
    }

    componentDidUpdate(prevProps,state){
        if(this.props.match.params.id!=prevProps.match.params.id){
            this.setState({ 
                selectMessages:[],
                canDeleteMessages:false,
                forwardMessages:false,
                replyMessage:false
            })
            let chat=this.props.chats[this.props.match.params.id]
            if(!chat){
                this.props.getChat(this.props.match.params.id)
            }

            return 
        }
        if(this.props.chats[this.props.match.params.id]?.messages!=prevProps.chats[this.props.match.params.id]?.messages){
            let selectMessages=[...state.selectMessages]
            let chatMessages=this.props.chats[this.props.match.params.id].messages
            let replyMessage=this.state.replyMessage
            if(chatMessages){
                selectMessages=selectMessages.filter(selectMessage=>{
                    return chatMessages[selectMessage]
                })
                if (replyMessage&&!chatMessages[replyMessage.chatMessageId]){
                    replyMessage=false
                }
            }else{
                selectMessages=[]
                replyMessage=false
            }
            this.setState({selectMessages:selectMessages,canDeleteMessages:this.canDeleteMessages(selectMessages),replyMessage:replyMessage})
        }
    }
    sendMessage=(event,text,images)=>{
        if(event){
            this.props.sendMessage(this.props.match.params.id,this.inputRef.current.value,[],this.state.replyMessage)
            
        }else{
            this.props.sendMessage(this.props.match.params.id,text,images,this.state.replyMessage)
        }
        this.inputRef.current.value=""
    }
    getMessageFromChatEntry=(chatMessageId)=>{
        let chat=this.props.chats[this.props.match.params.id]
        if(chat.messages[chatMessageId]){
            return this.props.messages[chat.messages[chatMessageId].message]

        }else{
            return null
        }
    }
    deleteMessages=()=>{
        let chat=this.props.chats[this.props.match.params.id]
        this.state.selectMessages.map(selectMessage=>{
            if(this.state.canDeleteMessages){
                this.props.deleteMessage(this.props.match.params.id,selectMessage)
            }
        })
        this.setState({selectMessages:[]})
    }
    SelectConfig={}
    toggleSelectMessageHandler=(chatMessageId,event)=>{
        if(event.type=="mousedown"){
            this.SelectConfig[chatMessageId]=Date.now()
            if(this.state.selectMessages.indexOf(chatMessageId)!=-1){
                this.toggleSelectMessage(chatMessageId)
            }
        }        
        if(event.type=="mouseup"){
            if((Date.now()-this.SelectConfig[chatMessageId])/1000>0.2){
                this.toggleSelectMessage(chatMessageId)
                this.SelectConfig[chatMessageId]=0
            }

        }        
    }
    toggleSelectMessage=(chatMessageId)=>{
        let selectMessages=[...this.state.selectMessages]
        if(this.state.selectMessages.indexOf(chatMessageId)==-1){
            selectMessages.push(chatMessageId)
        }else{
            selectMessages.splice(selectMessages.indexOf(chatMessageId),1)
        }
        let canDeleteMessages=this.canDeleteMessages(selectMessages)
        this.setState({selectMessages:selectMessages,canDeleteMessages:canDeleteMessages})
    }
    canDeleteMessages=(selectMessages)=>{
        let UID=this.props.UID
        let chatCreator=this.props.chats[this.props.match.params.id].creator
        let canDeleteMessages=true
        if(selectMessages.length<1){
            canDeleteMessages=false
        }else{
            selectMessages.forEach(selectMessage=>{
                canDeleteMessages*= ((UID==chatCreator||UID==this.getMessageFromChatEntry(selectMessage)?.user)&&!!this.props.chats[this.props.match.params.id].messages[selectMessage])
            })
        }
        return !!canDeleteMessages
    }
    showImageModal=()=>{
        this.setState({showImageModal:true})
    }
    hideImageModal=()=>{
        this.setState({showImageModal:false,imageModalInitImage:null})
    }
    chekClipboard=(event)=>{
        if(event.clipboardData.files.length>0){
            let file=event.clipboardData.files[0]
            let reader  = new FileReader();
            reader.onloadend = (image)=> {
                if(image.target.result.match(image)){
                    this.setState({showImageModal:true,imageModalInitImage:image.target.result})
                }
            }
            reader.readAsDataURL(file)
        }
    }
    forwardMessages=(newChatId)=>{
        this.setState({forwardMessages:true})
        this.state.selectMessages.forEach(chatMessageId=>{
            this.props.forwardMessage(newChatId,this.getMessageFromChatEntry(chatMessageId))
        })
        this.setState({forwardMessages:false,selectMessages:[]})
        this.props.history.push("/chats/"+newChatId)
    }
  
    inputRef=React.createRef()
    render() {
        //формирование массива сообщений с чата
        let chat=this.props.chats[this.props.match.params.id]
        let chatMessages=[]
        if(chat && chat.messages){
            Object.keys(chat.messages).map((messageId,num)=>{
                if(this.props.messages[chat.messages[messageId].message]){
                    let newMessage={...this.getMessageFromChatEntry(messageId),chatMessageId:messageId}
                    chatMessages.push(newMessage)
                
                }
            })
        }
        chatMessages.sort((m1,m2)=>{
            return m1.date-m2.date
        })
        
        //Загрузка
        if(!chat || chat=="LOADING"){
            return  <div className={classes.Chat}>
                        <div className={classes.Status}>Загрузка...</div>
                    </div>
        }
        //Чата не существует

        if(chat=="NOT_EXIST"){
            let breakElement=null
            if(window.innerWidth<=650){
                breakElement=<br></br>
            }
            return  <div className={classes.Chat} onClick={()=>{this.props.history.push("/chats")}}>
                        <div className={classes.Status} >Чата не существует {breakElement} или {breakElement} он бы удален</div>
                    </div>
        }

        //обрабока хедера чата
        let headerContent=null
        if(this.state.selectMessages.length<1){
            //Обычный режим
            headerContent=<div className={classes.HeaderInfo}>
                <img className={classes.HeaderBackArrow} onClick={()=>{this.props.history.push("/chats")}} src="/Images/backArrow.svg"></img>
                <div className={classes.HeaderName}>{chat.name}</div>
                <img className={classes.HeaderThreeDots} onClick={()=>{this.setState({showChatMenu:true})}} src="/Images/threeDots.svg"></img>
            </div>
        }else{
            //Режим выделенных сообщений
            headerContent=<div className={classes.HeaderSelect}>
                <div className={classes.HeaderButtonsWrapper}>
                    {this.state.canDeleteMessages&&<button className={classes.HeaderButton} onClick={this.deleteMessages}>
                        Удалить
                    </button>}
                    <button className={classes.HeaderButton} onClick={()=>{this.setState({forwardMessages:true})}}>
                        Переслать
                    </button>
                </div>
                <button className={classes.HeaderButtonCancel} onClick={()=>{this.setState({selectMessages:[]})}}>Отмена</button>
            </div>
        }
    
        let height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0); 
        return (
            <div className={classes.Chat}>
                {headerContent}
                <div className={classes.ChatWindow} style={{"height":height-120-(this.state.replyMessage?50:0)  }}>
                    {chatMessages.map(message=>{
                        return  <Message 
                            key={message.id}
                            toggleSelectMessageHandler  ={(event)=>{this.toggleSelectMessageHandler(message.chatMessageId,event)}} 
                            select={this.state.selectMessages.indexOf(message.chatMessageId)!=-1}
                            author={message.user==this.props.UID}
                            message={message} 
                            onDoubleClick={()=>{this.setState({replyMessage:message})}}
                            users={this.props.users}
                            replyMessage={this.getMessageFromChatEntry(message.replyChatMessageId)}
                            // user={this.props.users[message.user]}
                            // replyMessageUser={this.getMessa}
                            // forwardUser={message.isForward && this.props.users[message.body.user]}
                            >
                        </Message>
                    })}
                </div>
                
                {this.state.replyMessage&&<div className={classes.ReplyWrapper}>
                    <div className={classes.ReplyUser}>{this.state.replyMessage.user}</div>
                    <div className={classes.ReplyMessage}>
                        <MessageContent message={this.state.replyMessage}></MessageContent>
                    </div>
                    <span className={classes.ReplyCancel} onClick={()=>{this.setState({replyMessage:null})}}>✖</span>
                </div>}

                {Object.values(chat.members).indexOf(this.props.UID)>-1
                ?
                <div  className={classes.InputWrapper}>
                    <textarea ref={this.inputRef} className={classes.Input} onPaste={this.chekClipboard}></textarea>
                    <div className={classes.SendIconWrapper} onClick={this.showImageModal}>
                        <img className={classes.SendIcon} src="/Images/camera.svg"></img>
                    </div>

                    <div className={classes.SendIconWrapper} onClick={this.sendMessage} >
                        <svg xmlns="http://www.w3.org/2000/svg" className={"icon icon-tabler icon-tabler-send "+classes.sendIcon} viewBox="0 0 24 24"  stroke="#2c3e50" fill="none" strokeLinecap="round" strokeLinejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
                            <line x1="10" y1="14" x2="21" y2="3" />
                            <path d="M21 3l-6.5 18a0.55 .55 0 0 1 -1 0l-3.5 -7l-7 -3.5a0.55 .55 0 0 1 0 -1l18 -6.5" />
                        </svg>
                    </div>    
                </div>
                :
                <div className={classes.EnterToChat} onClick={()=>{this.props.enterToChat(this.props.match.params.id)}}>
                    Вступить в чат
                </div>
                }

                
                {this.state.showChatMenu&&<ChatMenu 
                    close={()=>{this.setState({showChatMenu:false})}} 
                    chatExit={()=>{this.props.chatExit(this.props.match.params.id);
                                   this.props.history.push("/chats") }}
                    isAdmin={this.props.UID==chat.creator}
                    deleteChat={()=>{this.props.deleteChat(this.props.match.params.id)}}
                    >
                </ChatMenu>}
                
                {this.state.forwardMessages&&<ListModal startForward={this.forwardMessages} close={()=>{this.setState({forwardMessages:false})}}>

                </ListModal>}
                {this.state.showImageModal&&
                    <ImageInputModal 
                        close={this.hideImageModal} 
                        show={this.state.showImageModal} 
                        text={this.inputRef.current.value} 
                        initImage={this.state.imageModalInitImage}
                        send={this.sendMessage}>
                    </ImageInputModal>}
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return{
        chats:state.chats.chats,
        messages:state.chats.messages,
        UID:state.auth.UID,
        users:state.chats.users
    }
}

const mapDispatchToProps = dispatch=>{
    return{
        sendMessage:(chatId,message,images,replyMessage)=>dispatch(actions.sendMessage(chatId,message,images,replyMessage)),
        deleteMessage:(chatId,messageId)=>dispatch(actions.deleteMessage(chatId,messageId)),
        forwardMessage:(chatId,message)=>dispatch(actions.forwardMessage(chatId,message)),
        getChat:(chatId)=>dispatch(actions.getChat(chatId)),
        enterToChat:(chatId)=>dispatch(actions.enterToChat(chatId)),
        chatExit:(chatId)=>dispatch(actions.chatExit(chatId)),
        deleteChat:(chatId)=>dispatch(actions.deleteChat(chatId))
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Chat))
