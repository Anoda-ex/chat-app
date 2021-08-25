import { logDOM } from "@testing-library/react"
import firebase from "firebase"
import * as types from "./actionsConsts"


export const createChat=(name,description,image)=>{
    return (dispatch,state)=>{
        //добавить к чатам
        let UID = state().auth.UID

        // console.log(name,description);
        firebase.database().ref("/chats").push(
            {
               
                chatData:{
                    creator:state().auth.UID,
                    name:name,
                    description:description,
                    create:firebase.database.ServerValue.TIMESTAMP,
                },
                messagesData:{
                    lastChangeDate:firebase.database.ServerValue.TIMESTAMP
                },
                searchName:name

            }
        ).then(response=>{
            //добавить в список чатов пользователя чат
            // images.forEach(image)
            if (image){
                firebase.database().ref("/chats/"+response.path.pieces_[1]+"/chatData/images").push(image)
            }
            firebase.database().ref("/users/"+UID+"/private/chats").push({
                chat:response.path.pieces_[1]
            })
            firebase.database().ref("/chats/"+response.path.pieces_[1]+"/chatData/members").push(UID)
        })
    }
}
export const enterToChat=(chatId)=>{
    return (dispatch,state)=>{
        //добавить к чатам
        firebase.database().ref("/chats/"+chatId+"/chatData/members").push(
            
               state().auth.UID
            
        )
        firebase.database().ref("/users/"+state().auth.UID+"/private/chats").push(
            {
                chat:chatId
            }
        )
    }
}



export const deleteMessage=(chatId,messageId)=>{
    return (dispatch,state)=>{
        firebase.database().ref("/chats/"+chatId+"/messagesData/messages/"+messageId).remove(
            
        )
    }
}


//подписка на получение иформации о своем аккаунте, вызывается при первом рендере листа чатов
export const subscribeInit=()=>{
    return (dispatch,state)=>{
        console.log("subscribeInit");
        let UID = state().auth.UID

        //подписка на получение информации о чатаъ пользователя
        firebase.database().ref("users/"+UID+"/private/chats/").on("value",(userChatSnapshot)=>{
            //обработка полученного списка чатов
            dispatch(handleChats("init",userChatSnapshot.val()))
        
            
        })
        //получение информации о пользователе, имя аватарка
        firebase.database().ref("users/"+UID).on("value",(userDataSnapshot)=>{
            dispatch({
                type:types.SET_USER_INFO,
                user:UID,
                userData:userDataSnapshot.val()
            })
        })
    }
}


//получение чата
export const getChat=(chatId,entryId=false)=>{
    return (dispatch,state)=>{
        // если чат уже был подписан то не продолжать действия
        if(state().chats.chats[chatId]){
            return
        }
        let UID = state().auth.UID
        // поставить чат в режим загрузки
        dispatch({
            type:types.CHAT_LOADING,
            chatId:chatId
        })
        // получить информацию о чате(кроме сообщений)
        firebase.database().ref("chats/"+chatId+"/chatData").on("value",chatDataSnapshot=>{
            const chatData = chatDataSnapshot.val()
            //если чата не существует то удалить чат со списка чатов пользователя
            //и поставить режим чата в не существует
            if(!chatData){
                dispatch({
                    type:types.CHAT_FAIL,
                    chatId:chatId
                })
                if(entryId){
                    firebase.database().ref("users/"+UID+"/private/chats/"+entryId).remove()
                }
            }
            //если чат существует то получить дату последнего действия
            else{
                firebase.database().ref("chats/"+chatId+"/messagesData/lastChangeDate").once("value",lastChangeMessagesDateSnapshot=>{

                    const chatDataTransform={...chatData,id:chatId,}
                    if(lastChangeMessagesDateSnapshot.val()){
                        chatDataTransform.lastChangeMessagesDate=lastChangeMessagesDateSnapshot.val()
                    }
                    else{
                        chatDataTransform.lastChangeMessagesDate=chatData.create
                    }
                    dispatch({
                        type:types.CHAT_SUCCESS,
                        chatId:chatId,
                        chatData:chatDataTransform
                    })
                })
            }

        })
        //получить все сообщения чата сортированные по дате и подписаться на добавление новых сообщений
        firebase.database().ref("chats/"+chatId+"/messagesData/messages").orderByChild("date").on("child_added",chatMessageDataSnapshot=>{
            //id сообщения
            let messageId=chatMessageDataSnapshot.val().message
            //id реплая на сообщение(в таблице чаты)
            let replyChatMessageId=chatMessageDataSnapshot.val().replyChatMessageId
            //получение самого сообщения 
            firebase.database().ref("/messages/"+messageId).on("value",messageDataSnapshot=>{
                const messageData=messageDataSnapshot.val()
                //если сообщение есть то трансформировать его(записать туда id сообщения id сообщения реплая)
                //и сохранить его 
                if(messageData){
                    const messageDataTransform={...messageData,id:messageId}
                    if(replyChatMessageId){
                        messageDataTransform.replyChatMessageId=replyChatMessageId
                    }
                    //добавление в таблицу общих сообщений
                    dispatch({
                        type:types.SET_MESSAGE,
                        messageId:messageId,
                        messageData:messageDataTransform
                    })
                    //добавление в таблицу сообщений конкретного чата
                    dispatch({
                        type:types.APPEND_CHAT_MESSAGE,
                        chatId:chatId,
                        chatMessageId:chatMessageDataSnapshot.key,
                        chatMessage:chatMessageDataSnapshot.val(),
                        lastChangeMessagesDate:messageData.date
                    })
                    //получить информацию о отправителе сообщения
                    if(!state()?.chats?.users[messageData.user]){
                            firebase.database().ref("users/"+messageData.user+"/public").on("value",(userDataSnapshot)=>{
                                dispatch({
                                    type:types.SET_USER_INFO,
                                    user:messageData.user,
                                    userData:{public:userDataSnapshot.val()},
                                    isMainUser:false
                                })
                            })
                    }
                    
                }   
            })
        })
        //если сообщение удалено то удалить его с сообщений конкретного чата
        //сообщение все еще сохранено в приложении но не отображается 
        firebase.database().ref("chats/"+chatId+"/messagesData/messages").on("child_removed",chatMessageRemovedSnapshot=>{
            dispatch({
                type:types.REMOVE_CHAT_MESSAGE,
                chatId:chatId,
                chatMessageId:chatMessageRemovedSnapshot.key
            })
        })

    }
}

// получение чатов со списка, переданного в функцию, имеет 2 режима 
export const handleChats=(type,chats)=>{
    return (dispatch,state)=>{
        console.log("handleChats", type,chats);
        
        //режим инициализации, срабатывает при обновления чатов пользователя
        if(type=="init" && chats){
            let userChatsList=[]
            Object.keys(chats).forEach(entryId=>{
                let chatId=chats[entryId].chat
                //подписка на чат
                dispatch(getChat(chatId,entryId))
                
                userChatsList.push(chats[entryId].chat)                
            })
            dispatch({
                type:types.SET_USER_CHATS_LIST,
                chatsList:userChatsList
            })
        }
        //режим поиска, срабатывает для обработки поискового запроса на чаты
        if(type=="search"){
            if(!chats){
                dispatch({
                    type:types.SET_SEARCH_CHATS_LIST,
                    chatsList:[]
                })
                return
            }
            let searchChatsList=[]
            Object.keys(chats).forEach(entryId=>{
                let chatId=entryId
                //подписка на чат
                dispatch(getChat(chatId))
                searchChatsList.push(entryId)                
            })
            dispatch({
                type:types.SET_SEARCH_CHATS_LIST,
                chatsList:searchChatsList
            })
        }
    }
}





export const sendMessage=(chatId,message,images,replyMessage)=>{
    return (dispatch,state)=>{
        console.log("img",images);
        let UID = state().auth.UID
        let date=firebase.database.ServerValue.TIMESTAMP
        firebase.database().ref("messages/").push({
            user:UID,
            text:message,
            images:images,
            date:date,
        }).then(response=>{
            let replyChatMessageId=null
            if(replyMessage){
                replyChatMessageId=replyMessage.chatMessageId
            }
            firebase.database().ref("chats/"+chatId+"/messagesData/messages").push({
                message:response.path.pieces_[1],
                replyChatMessageId:replyChatMessageId,

            }).then(()=>{
                firebase.database().ref("chats/"+chatId+"/messagesData/lastChangeDate").set(date)
            })

        })
    }
}
export const forwardMessage=(chatId,message)=>{
    return (dispatch,state)=>{
        let UID = state().auth.UID
        // firebase.database().ref("users/"+UID+"/chats").off()
        let date=firebase.database.ServerValue.TIMESTAMP
        let newBody=null
        if (message.isForward){
            newBody={
                ...message.body
            }
        }else{
            newBody={
                ...message
            }
        }
        console.log("AAA",newBody);
        firebase.database().ref("messages/").push({
            user:UID,
            body:newBody,
            isForward:true,
            date:date
        }).then(response=>{

            // console.log(response.path.pieces_[1]);
            firebase.database().ref("chats/"+chatId+"/messagesData/messages/").push({
                message:response.path.pieces_[1],
            }).then(()=>{
                firebase.database().ref("chats/"+chatId+"/messagesData/lastChangeDate").set(date)
            })
        })
    }
}




//удалить чат с базы, подписки на чат удалятся сами через метод getChat()
export const deleteChat=(chatId)=>{
    return (dispatch,state)=>{
        let UID = state().auth.UID

        firebase.database().ref("chats/"+chatId).remove()
    }
}
//поиск чатов
export const test=(search)=>{
    return (dispatch,state)=>{
        firebase.database().ref("chats/").orderByChild('searchName').startAt(search).endAt(search+"\uf8ff").once("value",snaphot=>{
            console.log(snaphot.val());
            // dispatch({
            //     type: types.SET_CHATS_LIST,
            //     chatsList:Object.keys(snaphot.val())
            // })
            dispatch(handleChats("search",snaphot.val()))
        })
    }
}