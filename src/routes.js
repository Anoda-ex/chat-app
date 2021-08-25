import * as paths from "./utils/consts"
import Auth from "./Components/Auth/Auth"
import ChatList from "./Containers/ChatsList/ChatsList"
import Chat from "./Containers/Chat/Chat"
import NoSelectChat from "./Components/NoSelectChat/NoSelectChat"

export const chatRoutes = [
    // {
    //     path:paths.CHAT_LIST,
    //     Component:ChatList
        
    // },
    // {
    //     path:paths.NO_SELECT_CHAT,
    //     Component:NoSelectChat,
    //     isExact:true
    // },
    // {
    //     path:paths.SELECT_CHAT,
    //     Component:Chat
    // },
]

export const authRoutes=[
    {
        path:paths.EMAIL_AUTH,
        Component: Auth
    }
]