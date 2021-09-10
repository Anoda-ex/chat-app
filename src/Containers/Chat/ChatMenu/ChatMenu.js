import React, { Component } from 'react'
import Button from '../../../Components/UI/Button/Button';
import Modal from '../../../Components/UI/Modal/Modal'
import classes from "./ChatMenu.module.css"


export class ChatMenu extends Component {
    state={
        chatImage:null
    }

    selectFile = (event) => {
        let file = event.target.files[0]
        if (file) {
            let reader = new FileReader();
            reader.onloadend = (image) => {
                if (image.target.result.match(image)) {
                    this.setState({ chatImage: image.target.result })
                }
            }
            reader.readAsDataURL(file)
        }
    }

    componentDidUpdate() {
        if (!!this.props.chatName && !!this.chatName.current) {
            this.chatName.current.value = this.props.chatName
        }
        if (!!this.props.chatDescription && !!this.chatDescription.current) {
            this.chatDescription.current.value = this.props.chatDescription
        }

    }

    chatName = React.createRef()
    chatDescription = React.createRef()
    chatImage=React.createRef()
    render() {
        let chatImage=null
        if(this.props.chatImage){
            chatImage=this.props.chatImage
        }
        if(this.state.chatImage){
            chatImage=this.state.chatImage
        }
        return (
            <Modal show={this.props.show} close={this.props.close}>
                <h2>Настройки чата</h2>
                <div className={classes.MenuWrapper + " " + classes.MenuWrapperNoCursor} >
                    <p className={this.ChatNameTitle}>
                        Имя чата{!this.props.isAdmin && ": " + this.props.chatName}
                    </p>
                    {this.props.isAdmin && <input className={classes.NameInput} ref={this.chatName}></input>}
                </div>
                <div className={classes.MenuWrapper + " " + classes.MenuWrapperNoCursor} >
                    <p className={this.ChatNameTitle}>
                        Описание чата {!this.props.isAdmin && (this.props.chatDescription ?
                            ": " + this.props.chatDescription
                            :
                            ": нет описания"
                        )}
                    </p>
                    {this.props.isAdmin && <textarea className={classes.DescriptionInput} ref={this.chatDescription}></textarea>}
                </div>
                <div className={classes.ImageWrapper} >
                    <img className={classes.Image} onClick={() => { this.chatImage.current.click() }}
                        src={chatImage ?
                            chatImage
                            :
                            "/Images/noPhoto.jpg"}
                    >

                    </img>
                    <input ref={this.chatImage} style={{ display: "none" }} type="file" id="inputFile" onChange={this.selectFile} accept="image/*"></input>

                </div>


                <div className={classes.MenuWrapper}>
                    <span onClick={this.props.chatExit}>Выйти с чата</span>
                </div>
                <div className={classes.MenuWrapper}>
                    {this.props.isAdmin && <span className={classes.DeleteChat} onClick={this.props.deleteChat}>Удалить чат</span>}
                </div>
                <Button centr onClick={() => { this.props.changeChatInfo(this.props.chatId, this.chatName.current.value, this.chatDescription.current.value,this.state.chatImage) }}>Сохранить</Button>
            </Modal>
        )
    }
}

export default ChatMenu
