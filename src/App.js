// import React, { Component } from 'react'
// import { connect } from 'react-redux'

// export class App extends Component {
//     componentDidMount(){
//         console.log("APP AUTH");
//         this.props.firebase.referense("/test").push({a:1,b:2})
//     }
//     render() {
//         return (
//             <div>
                
//             </div>
//         )
//     }
// }

// const mapStateToProps = (state) => {
//     return{}
// }

// const mapDispatchToProps = (dispatch)=> {
//     return{}    
// }

// export default connect(mapStateToProps, mapDispatchToProps)(App)


import React, { Component } from 'react'
import { connect } from 'react-redux'
import "./App.css"
import Auth from "./Components/Auth/Auth"
import classes from "./App.module.css"
import SignIn from './Components/Auth/Auth';
import {Switch, Route, Redirect} from "react-router-dom"
import {authRoutes, chatRoutes} from "./routes"
import Chats from './Components/Chats/Chats'
import * as actions from "./store/index"
export class App extends Component {
    // componentDidMount(){
    //     if()
    //     this.props.subscribeInit()

    // }
    componentDidMount(){
        window.addEventListener("resize", ()=>{
            this.forceUpdate()
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
       
        return !this.props.UID? (
            <React.Fragment>
                <Switch>
                    {authRoutes.map(({path,Component})=>{
                        return <Route key={path} path={path} component={Component}></Route>
                    })}
                    <Redirect exact to="/auth-email"></Redirect>
                </Switch>
            </React.Fragment>
          
        ):( 
            <div className={classes.MainWindow} style={{"height":height}}>
     
                        <Chats></Chats>
                        <Redirect  from="/" to="/chats"></Redirect>

                    
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return{
        UID:state.auth.UID
    }
}

const mapDispatchToProps =dispatch=> {
    return {
        subscribeInit:()=>dispatch(actions.subscribeInit())
    }
}


export default connect(mapStateToProps,mapDispatchToProps)(App)