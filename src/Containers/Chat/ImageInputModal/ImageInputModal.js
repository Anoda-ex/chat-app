import React, { Component } from 'react'
import ImagesBlock from '../../../Components/UI/ImagesBlock/ImagesBlock'
import Modal from '../../../Components/UI/Modal/Modal'
import classes from "./ImageInputModal.module.css"
export default class ImageInputModal extends Component {
    state={
        images:[]
    }
    selectFiles=(event)=>{
        console.log(typeof(event.target.files));
        Array.from(event.target.files).forEach((file,id)=>{
            console.log(file);
            let reader  = new FileReader();
            reader.onloadend = (image)=> {
                this.setState(state=>({images:[...state.images,image.target.result]}))
            }
            reader.readAsDataURL(file)
        })
    }
    componentDidMount(){
        if(this.props.initImage){
            this.setState((state)=>({images:[...state.images,this.props.initImage]}))
        }else{
            this.inputFileRef.current.click()

        }
        console.log("imageInputModal",this.props.initImage);

    }

    inputTextRef=React.createRef()
    inputFileRef=React.createRef()
    render() {
        
        return (
            <Modal close={this.props.close} show={this.props.show}>
                <div className={classes.Component}>
                    {this.state.images.length>0?
                    <div className={classes.Images}><ImagesBlock images={this.state.images}></ImagesBlock></div>
                    :<div className={classes.TitleNoImages}>Нет фотографий, выберите их</div>}

                    
                    <div className={classes.ControlButtons}>
                        <input className={classes.InputText} type="text" ref={this.inputTextRef} placeholder="Подпись"></input>
                        <div className={classes.InputWrapper}>
                            <input multiple  id="inputFile" type="file" onChange={this.selectFiles} style={{display:"none"}}></input>
                            <label className={classes.Button} ref={this.inputFileRef} htmlFor="inputFile">Выберите файл</label>
                        </div>
                        <button className={classes.Button} onClick={()=>{this.props.send(false,this.inputTextRef.current.value,this.state.images);this.props.close()}}>Сохранить</button>
                    </div>
                </div>
            </Modal>
        )
    }
}
