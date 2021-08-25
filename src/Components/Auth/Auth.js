  
import React,{Component} from 'react';

import classes from "./Auth.module.css"
import {connect} from "react-redux"
import * as actions from "../../store/index"
import {withRouter} from "react-router-dom"
class Auth extends Component {
  state={
    isLogin:true
  }
  emailRef=React.createRef()
  passwordRef=React.createRef()
  auth=()=>{
      this.props.auth(this.emailRef.current.value,this.passwordRef.current.value,this.state.isLogin)
  }
  // componentDidUpdate=()=>{
  //   console.log(" COMPONENT MOUNT");
  // }
  componentWillUnmount=()=>{
    // console.log("AUTH UNMOUNT");
    // this.props.subscribeInit()
    this.props.history.push("/chats")
  }
  render() {
    return (
      <div className={classes.Auth}>
        <h1 className={classes.Title}>{this.state.isLogin?"Войдите в аккаунт":"Регистрация"}</h1>
        <input className={classes.Input} placeholder="Почта" ref={this.emailRef}></input>
        <input className={classes.Input} placeholder="Пароль" ref={this.passwordRef}></input>
        {this.props.error && <div className={classes.Error}>{this.props.error}</div>}
        <div className={classes.IsLogin} onClick={()=>{this.setState(state=>({isLogin:!state.isLogin}))}}>{this.state.isLogin?"Нет аккаунта?":"Войдите в аккаунт"}</div>
        <button className={classes.Button} onClick={this.auth}>{this.state.isLogin?"Войти":"Зарегестрироваться"}</button>
      </div>
    )
  }
}
const mapStateToProps = (state) => {
    return{
      loading:state.auth.loading,
      error:state.auth.error
    }
}

const mapDispatchToProps = (dispatch)=>{
    return {
      auth:(email,password,isLogin)=>dispatch(actions.auth(email,password,isLogin)),
      subscribeInit:()=>dispatch(actions.subscribeInit())
      
    }
}



export default connect(mapStateToProps,mapDispatchToProps)(withRouter(Auth))