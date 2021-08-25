import React from 'react'
import Background from '../Background/Background'
import Modal from '../Modal/Modal'
import classes from "./ImagesBlock.module.css"
export default class ImagesBlock extends React.Component {
    state={
        focusImage:-1
    }
    getImageWidth=(imagesCount,number)=>{
        let imageWidthTable={
            0:[0],
            1:[100],
            2:[100,100],
            3:[100,50,50],
            4:[100,100/3,100/3,100/3],
            5:[100,50,50,50,50],
            6:[100,50,50,100/3,100/3,100/3],
            7:[100,100/3,100/3,100/3,100/3,100/3,100/3],
            8:[50,50,50,50,50,50,50,50],
            9:[50,50,50,50,50,50,100/3,100/3,100/3],
            10:[50,50,50,50,100/3,100/3,100/3,100/3,100/3,100/3]
        }   
        return imageWidthTable[imagesCount][number]
    }
    changeFocusImage=(event,imageIndex)=>{
        let focusImageIndex=this.state.focusImage
        let countOfImages=this.props.images.length
        // // let 
        // console.log(event.nativeEvent.wheelDelta,focusImageIndex,);
        if(event.nativeEvent.wheelDelta<    0){
            // 10 фоток
            // 9 индекс
            if(focusImageIndex>=countOfImages-1){
                focusImageIndex=0
            }else{
                focusImageIndex=focusImageIndex+1
            }
        }else{
            if(focusImageIndex<=0){
                focusImageIndex=countOfImages-1
            }else{
                focusImageIndex=focusImageIndex-1
            }
        }
        this.setState({focusImage:focusImageIndex})
    }
    render(){

        return (
            <div className={classes.ImagesWrapper}>
                        {this.props.images.map((image,num)=>{
                            return <div key={num}  style={{
                                width:this.getImageWidth(this.props.images.length,num)+"%"
                            }}>
                                <img src={image} className={classes.Image} onClick={()=>{this.setState({focusImage:num})}}></img>
                            </div>
                        })}

                        {this.state.focusImage>-1 && <React.Fragment>
                            <img className={classes.FocusImage} src={this.props.images[this.state.focusImage]} onClick={()=>{this.setState({focusImage:-1})}} onWheel={this.changeFocusImage}></img>
                            <Background close={()=>{this.setState({focusImage:-1})}}></Background>   
                        </React.Fragment>}
            </div>
        )
    }
}
