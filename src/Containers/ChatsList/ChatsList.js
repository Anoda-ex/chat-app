import React, { Component } from 'react'
import classes from "./ChatsList.module.css"
import ChatItem from "./ChatItem/ChatItem"
import * as actions from "../../store/index"
import {connect} from "react-redux"
import {withRouter} from "react-router-dom"
import Navigation from "../../Components/Navigation/Navigation"
export class ChatsList extends Component {
    state={
        showNavigation:false
    }
    componentDidMount(){
        if(this.props.UID && !this.props.users[this.props.UID]){
            this.props.subscribeInit()

        }
    }
    selectChat=(chatId)=>{
        if(chatId){

            this.props.history.push("/chats/"+chatId)
        }
    }
    showModal=()=>{
        this.setState({showNavigation:true})
    }
    hideModal=()=>{
        this.setState({showNavigation:false})
    }
    searchRef=React.createRef()
    render() {
        let height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0); 
        let chats=this.props.chats
        let chatsList=this.props.userChatsList
        if(this.searchRef.current?.value){
            if(this.props.searchChatsList.length>0){
                chatsList=this.props.searchChatsList
            }else{
                chatsList="NOT_EXIST"
            }

        }
        console.log(this.props.searchChatsList,chatsList);
        return (
            <div className={classes.ChatsList}>
                <div className={classes.Navigation}>
                    <div className={classes.Burger} onClick={this.showModal}>
                        <img src="/Images/menuBurger.svg"></img>
                    </div>
                    <div className={classes.Input}><input ref={this.searchRef} onChange={()=>{this.props.test(this.searchRef.current.value)}}></input></div>
                </div>
                <div className={classes.ChatsItems} style={{height:height-50}}>
                    {chatsList!="NOT_EXIST" ? chatsList.sort((key1,key2)=>{
                        let chat1=chats[key1]
                        let chat2=chats[key2]
                        let date1=chat1.lastChangeMessagesDate?chat1.lastChangeMessagesDate:chat1.create
                        let date2=chat2.lastChangeMessagesDate?chat2.lastChangeMessagesDate:chat2.create
                        return date2-date1
                    }).map(chatId=>{
                        let chat=chats[chatId]
                        if(chat=="NOT_EXIST"){
                            // this.props.history.replace("/chats")    
                            return null
                        }
                        if(chat=="LOADING"){
                            return null
                        }
                        let chatMessages=chat.messages
                        let lastMessage=null
                        if(Object.keys(chatMessages).length>0){
                            let maxTime=-1;
                            Object.values(chatMessages).forEach(chatMessage => {
                                let message=this.props.messages[chatMessage.message]
                                if (message.date>maxTime){
                                    maxTime=message.date
                                    lastMessage=message
                                }
                            });
                        }

                        return <ChatItem 
                                    key={chatId} 
                                    id={chat.id}
                                    name={chat.name} 
                                    avatar={chat.images&&chat.images[Object.keys(chat.images)[Object.keys(chat.images).length-1]]}
                                    chatCreateDate={chat.create}
                                    delete={this.props.deleteChat}
                                    lastMessage={lastMessage}
                                    ></ChatItem>
                    }):<div className={classes.NoSearchChat}>Чатов не найдено</div>}
                  
                </div>
                {/* <div className={classes.AddWrapper}>
                    <div onClick={this.showModal} className={classes.Add}></div>
                </div> */}
                <Navigation show={this.state.showNavigation} close={this.hideModal}></Navigation>
            </div>
        )
    }
}
const mapStateToProps = (state) => {
    return{
        chats:state.chats.chats,
        messages:state.chats.messages,
        userChatsList:state.chats.userChatsList,
        searchChatsList:state.chats.searchChatsList,
        UID:state.auth.UID,
        users:state.chats.users
        // isUserLoad:state.chats.users[state.auth.UID]

    }
}

const mapDispatchToProps = dispatch=>{
    return{
        // createChat:(name,description,image)=>dispatch(actions.createChat(name,description,image)),
        enterToChat:(chatId)=>dispatch(actions.enterToChat(chatId)),
        subscribeInit:()=>dispatch(actions.subscribeInit()),
        deleteChat:(chatId)=>dispatch(actions.deleteChat(chatId)),
        test:(search)=>dispatch(actions.test(search))
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(withRouter(ChatsList))
