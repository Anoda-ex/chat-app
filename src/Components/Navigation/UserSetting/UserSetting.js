import React, { Component } from 'react'

import { connect } from 'react-redux'
import Button from '../../UI/Button/Button'
import Modal from '../../UI/Modal/Modal'
import classes from "./UserSetting.module.css"
export class UserSetting extends Component {
    state={
        imagesModal:false
    }
    NameInputRef=React.createRef()
    componentDidUpdate(){
        // console.log("test",this.props.public);]
      
        if(!!this.props.public&&!!this.NameInputRef.current){

            this.NameInputRef.current.value=this.props.public.name
        }
    }
    selectFile=(event)=>{
        let file=event.target.files[0]
        if(file){
            let reader  = new FileReader();
            reader.onloadend = (image)=> {
                if(image.target.result.match(image)){
                    this.setState({imagesModal:image.target.result})

                }
            }
            reader.readAsDataURL(file)
        }
    }
    imageInputRef=React.createRef()
    render() {
        return (
            <React.Fragment>
                <Modal show={this.props.show} close={this.props.hideModal} level={2}>
                    <div className={classes.UserSetting}>

                   
                        <h2 className={classes.Title}>Настройки аккаунта</h2>
                        <div className={classes.TopWrapper}>
                            
                            <div className={classes.ImageWrapper} onClick={()=>{this.imageInputRef.current.click()}}>
                                <input ref={this.imageInputRef} style={{display:"none"}} type="file" onChange={this.selectFile} accept="image/*"></input>
                                    
                                <img  src={this.state.imagesModal?this.state.imagesModal:"/Images/noPhoto.jpg"}></img>
                            </div>
                            <div className={classes.NameWrapper}>
                                <h3 className={classes.NameTitle}>Имя пользователя</h3>
                                <input ref={this.NameInputRef} className={classes.NameInput}></input>
                                {/* <div className={classes.IdWrapper}>
                                    {this.props.UID}
                                </div> */}
                            </div>
                        </div>
                        <Button className={classes.SaveButton} onClick={()=>{this.props.save("images",this.NameInputRef.current.value);this.props.hideModal()}}>Сохранить изминения</Button>
                    </div>
                </Modal>

            </React.Fragment>
        )
    }
}


export default UserSetting
