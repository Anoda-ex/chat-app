import React, { Component } from 'react'
import {connect} from "react-redux"
import classes from "./ListModal.module.css"
import Modal from "../../Components/UI/Modal/Modal"
class ListModal extends Component {
    render() {
        let chats=this.props.chats
        return (
            <Modal close={this.props.close} show={true}>
                <div className={classes.wrapper}>

                    {Object.keys(chats).map(chatId=>{
                        let chat=chats[chatId]
                        return <div key={chatId} className={classes.chat} onClick={()=>{this.props.startForward(chatId)}}>
                            <div className={classes.imageWrapper}></div>
                            <h2 className={classes.name}>{chat.name}</h2>
                        </div>
                    })}
                </div>
            </Modal>
        )
    }
}
const mapStateToProps = (state) => {
    return {
        chats: state.chats.chats
    }    
}

export default connect(mapStateToProps)(ListModal)