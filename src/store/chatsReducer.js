import * as types from "./actionsConsts"
const initState={
   chats:{},
   messages:{},
   userChatsList:[],
   searchChatsList:[],
   users:{}
}
export default (state=initState,action)=>{
    switch (action.type) {

        case types.SET_USER_CHATS_LIST:{
            return{
                ...state,
                userChatsList:action.chatsList
            }
        }
        case types.SET_SEARCH_CHATS_LIST:{
            return{
                ...state,
                searchChatsList:action.chatsList
            }
        }


        case types.CHAT_LOADING:{
            return{
                ...state,
                chats:{...state.chats,[action.chatId]:"LOADING"}
            }
        }
        case types.CHAT_SUCCESS:
            let prevChats={...state.chats}
            let chatMessagesSuccess={}
            if(prevChats[action.chatId].messages){
                chatMessagesSuccess={...prevChats[action.chatId].messages}
            }
            prevChats[action.chatId]={...action.chatData,messages:chatMessagesSuccess}
            return{
                ...state,
                chats: prevChats
            }
        case types.CHAT_FAIL:
            let prevChats1={...state.chats}
            prevChats1[action.chatId]="NOT_EXIST"
            return{
                ...state,
                chats:prevChats1
            }
        case types.APPEND_CHAT_MESSAGE:
            let chatMessagesAppend={}
            if(state.chats[action.chatId].messages){
                chatMessagesAppend={...state.chats[action.chatId].messages,[action.chatMessageId]:action.chatMessage}
            }
            let lastChangeMessagesDate=action.lastChangeMessagesDate
            if(state.chats[action.chatId]&&state.chats[action.chatId].lastChangeMessagesDate>lastChangeMessagesDate){
                lastChangeMessagesDate=state.chats[action.chatId].lastChangeMessagesDate
            }
            
            return{
                ...state,
                chats:{
                    ...state.chats,
                    [action.chatId]:{
                        ...state.chats[action.chatId],
                        messages:chatMessagesAppend,
                        lastChangeMessagesDate:lastChangeMessagesDate
                    }
                }
            }
            
        case types.REMOVE_CHAT_MESSAGE:
            if(state.chats[action.chatId]=="NOT_EXIST"){
                return state
            }
            let chatMessagesRemove={}
            if(state.chats[action.chatId].messages){
                chatMessagesRemove={...state.chats[action.chatId].messages}
            }
            delete chatMessagesRemove[action.chatMessageId]
            return{
                ...state,
                chats:{
                    ...state.chats,
                    [action.chatId]:{
                        ...state.chats[action.chatId],
                        messages:chatMessagesRemove,
                    }
                }
        }
        case types.SET_MESSAGE:
            let messages={...state.messages}
            messages[action.messageId]={...action.messageData}
            return{
                ...state,
                messages:messages
            }
        case types.SET_USER_INFO:
            let userData={}
            if(action.isMainUser){
                userData.public=action.userData
            }else{
                userData={...action.userData}
            }
            return{
                ...state,
                users:{
                    ...state.users,
                    [action.user]:userData
                }
        }
        case types.CLEAN_CHATS_DATA:
            return initState
        
        default:
            return state
    }


}