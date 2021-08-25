import React, { Component } from 'react'
import Background from '../UI/Background/Background'
import classes from "./Navigation.module.css"
import CreateChat from "./CreateChat/CreateChat"
import * as actions from "../../store/index"
import {connect} from "react-redux"
import UserSetting from './UserSetting/UserSetting'
class Navigation extends Component {
    state={
        showCreateChat:false,
        showSetting:false,
    }

    createChat=(name,description,image)=>{
        this.props.createChat(name,description,image)
        this.setState({showCreateChat:false})
        this.props.close()
    }
    enterToChat=(chatId)=>{
        this.props.enterToChat(chatId)
        this.props.close()
    }
    setUserSetting
    render() {
        if(!this.props.show){
            return null
        }
        return (
            <React.Fragment>
                <Background close={this.props.close}></Background>
                <div className={classes.Navigation}>
                    <ul>
                        <li className={classes.ListItem} onClick={()=>{this.setState({showCreateChat:true})}}>
                            Создать чат
                        </li>
                        <li className={classes.ListItem} onClick={()=>{this.setState({showSetting:true})}}>
                            Настройки аккаунта
                        </li>

                        <li className={classes.ListItem} onClick={()=>{this.props.userExit()}}>
                            Выйти с аккаунта
                        </li>
                    </ul>
                     <CreateChat show={this.state.showCreateChat} hideModal={()=>{this.setState({showCreateChat:false})}} createChat={this.createChat}></CreateChat>
                     <UserSetting show={this.state.showSetting} hideModal={()=>{this.setState({showSetting:false})}} UID={this.props.UID} public={this.props.userInfo?.public} save={this.props.changeUserSetting}></UserSetting>
                </div> 
            </React.Fragment>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        UID:state.auth.UID,
        userInfo:state.chats.users[state.auth.UID],
    }
}

const mapDispatchToProps = dispatch=>{
    return{
        createChat:(name,description,image)=>dispatch(actions.createChat(name,description,image)),
        enterToChat:(chatId)=>dispatch(actions.enterToChat(chatId)),
        changeUserSetting:(images,name)=>dispatch(actions.changeUserSetting(images,name)),
        userExit:()=>dispatch(actions.userExit())
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(Navigation)
