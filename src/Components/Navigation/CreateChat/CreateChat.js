import React, { Component,createRef } from 'react'
import Modal from "../../../Components/UI/Modal/Modal"
import classes from "./CreateChat.module.css"
import Button from "../../UI/Button/Button"
export default class CreateChat extends Component {
    state={
        showImageInputModal:false,
        image:false,
       
    }
    nameRef=createRef()
    descRef=createRef()
    imageInputRef=createRef()
    createChat=()=>{
        this.props.createChat(this.nameRef.current.value,this.descRef.current.value,this.state.image)
    }
    save=(images)=>{
        this.setState({images:images})
    }
    selectFile=(event)=>{
            let file=event.target.files[0]
            if(file){
                let reader  = new FileReader();
                reader.onloadend = (image)=> {
                    if(image.target.result.match(image)){
                        this.setState({image:image.target.result})

                    }
                }
                reader.readAsDataURL(file)
            }
    }
    render() {
        return (
            <Modal show={this.props.show} close={this.props.hideModal}>
                <div className={classes.AddChat}>
                    <h1 className={classes.Title}>Создать чат</h1>
                    <div className={classes.Wrapper}>
                        <p className={classes.InputName}>Введите имя чата</p>
                        <input  ref={this.nameRef} className={classes.Input}></input>

                    </div>
                    <div className={classes.Wrapper}>
                        <div className={classes.descImageWrapper}>
                            <p className={classes.InputName}>Введите описание чата</p>
                            <div className={classes.ImageWrapper} onClick={()=>{this.setState({showImageInputModal:true})}}>
                                <img className={classes.Image} onClick={()=>{this.imageInputRef.current.click()}} 
                                    src={this.state.image?
                                        this.state.image
                                        :
                                        "/Images/noPhoto.jpg"}
                                       >
                                    
                                </img>
                                <input ref={this.imageInputRef} style={{display:"none"}} type="file" id="inputFile" onChange={this.selectFile} accept="image/*"></input>
                                
                            </div>
                        </div>

                        <textarea ref={this.descRef} className={classes.descArea}></textarea>

                    </div>
                  
                    <Button onClick={this.createChat} >Создать чат</Button>

                </div>
                   
            </Modal>
        )
    }
}
