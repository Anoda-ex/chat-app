import * as types from "../actionsConsts"
import firebase from "firebase"



// export const subscribeToChat=(dispatch,chatId)=>{
//     firebase.database().ref("chats/"+chatId).on("value",dataSnapshot=>{
//         const data=dataSnapshot.val()
//         dispatch({
//             type:types.ADD_CHAT,
//             chat:data
//         })
//     })
// }





export const auth =(email,password,isLogin)=>{
    return (dispatch)=>{
        dispatch({
            type:types.AUTH_START
        })
        if(isLogin){
            firebase.auth().signInWithEmailAndPassword(email, password)
            .then((userCredential) => {
                dispatch({
                    type:types.AUTH_SUCCESS,
                    UID:userCredential.user.uid
                })
                
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorMessage);
                dispatch({
                    type:types.AUTH_FAIL,
                    error:errorMessage
                })
            });
        }
        else{
            firebase.auth().createUserWithEmailAndPassword(email, password)
            .then((userCredential) => {
                dispatch({
                    type:types.AUTH_SUCCESS,
                    UID:userCredential.user.uid
                })
            })
            .catch((error) => {
                var errorCode = error.code;
                var errorMessage = error.message;
                dispatch({
                    type:types.AUTH_FAIL,
                    error:errorMessage
                })
            });
        }
    }
} 
export const initUserSignin=(user)=>{
    return (dispatch)=>{
        if(user){
            dispatch({
                type:types.AUTH_SUCCESS,
                UID:user.uid
            })
        }else{
            dispatch({
                type:types.AUTH_SUCCESS,
                UID:null
            })
        }
    }   
}
export const changeUserSetting=(images=null,name=null)=>{
    return (dispatch,state)=>{
        if(images){
            firebase.database().ref("users/"+state().auth.UID+"/public/images").set(images)
        }
        if(name){
            firebase.database().ref("users/"+state().auth.UID+"/public/name").set(name)
        }
    }
}
export const userExit=()=>{
    return(dispatch,state)=>{
        firebase.auth().signOut()
        dispatch({
            type:types.AUTH_EXIT
        })
        dispatch({
            type:types.CLEAN_CHATS_DATA
        })
        state().auth.userListeners.forEach(path => {
            firebase.database().ref(path).off()
        });
    }
}

