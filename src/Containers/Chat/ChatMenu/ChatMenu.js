import React, { Component } from 'react'
import Modal from '../../../Components/UI/Modal/Modal'

export class ChatMenu extends Component {
    render() {
        return (
            <Modal show={true} close={this.props.close}>
                <div onClick={this.props.chatExit}>Выйти с чата</div>
                {this.props.isAdmin&&<div onClick={this.props.deleteChat}>Удалить чат</div>}
            </Modal>
        )
    }
}

export default ChatMenu
