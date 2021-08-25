import React, { Component } from 'react'
import Chat from '../../Containers/Chat/Chat'
import ChatsList from '../../Containers/ChatsList/ChatsList'
import * as paths from "../../utils/consts"
import NoSelectChat from "../NoSelectChat/NoSelectChat"
import {Route,Switch} from "react-router-dom"
export default class Chats extends Component {
    render() {
        let isMobile=window.innerWidth<651
        // console.log("WIDTH",width);
        
        return (
            <React.Fragment>
                <Switch>
                    {isMobile&&<Route path={paths.SELECT_CHAT}></Route>}
                    <Route path={paths.CHAT_LIST} component={ChatsList}></Route>
                </Switch>
                
                {!isMobile&&<Route exact path={paths.NO_SELECT_CHAT} component={NoSelectChat}></Route>}
                <Route exact path={paths.SELECT_CHAT} render={()=>{
                    return <Chat></Chat>
                }}></Route>
            </React.Fragment>
        )
    }
}
