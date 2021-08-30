
import React, { Component } from 'react'
import { connect } from 'react-redux'
import "./App.css"
import classes from "./App.module.css"
import {Switch, Route, Redirect} from "react-router-dom"
import {authRoutes, chatRoutes} from "./routes"
import Chats from './Components/Chats/Chats'
import * as actions from "./store/index"
import firebase from "firebase"
export class App extends Component {

    componentDidMount(){
        window.addEventListener("resize", ()=>{
            this.forceUpdate()
        });
        firebase.auth().onAuthStateChanged((user) => {
            
            if(user){
                this.props.initUserSignin(user)
            }else(
                this.props.initUserSignin(null)
            )
        });
    }
    pushInfo=()=>{
        this.props.database.ref("/test").push({date:Date.now()}).then(response=>{
            // console.log("push info",response);
        })
    }
    getInfo=()=>{
        this.props.database.ref("/test").on("value",dataSnapshot=>{
            // console.log("get info",dataSnapshot.val());
        })
    }
 

    


    render() {
    let height = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);;   
       
        if(this.props.UID=="INIT"){
            return<div className={classes.Loading}>Загрузка...</div>
        }else{
            if(!this.props.UID){
                return (
                    <React.Fragment>
                        <Switch>
                            {authRoutes.map(({path,Component})=>{
                                return <Route key={path} path={path} component={Component}></Route>
                            })}
                            <Redirect exact to="/auth-email"></Redirect>
                        </Switch>
                    </React.Fragment>
                )
            }
            if(this.props.UID){
                return( 
                    <div className={classes.MainWindow} style={{"height":height}}>
                        <Chats></Chats>
                        <Redirect  from="/" to="/chats"></Redirect>
                    </div>
                )
            }
        }
    }
}

const mapStateToProps = (state) => {
    return{
        UID:state.auth.UID,
        authLoading:state.auth.loading
    }
}

const mapDispatchToProps =dispatch=> {
    return {
        initUserSignin:(user)=>dispatch(actions.initUserSignin(user))
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(App)