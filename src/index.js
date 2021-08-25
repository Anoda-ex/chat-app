import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import firebase from "firebase";
import {combineReducers,applyMiddleware,createStore,compose} from "redux"
import thunk from "redux-thunk"
import {BrowserRouter} from "react-router-dom"
import {Provider} from "react-redux"
import authReducer from "./store/auth/reducer"
import chatsReducer from "./store/chatsReducer"
firebase.initializeApp({
    apiKey: "AIzaSyC2Gf1VqDDnCCth5xGCVbLL6coHBWJoq6Y",
    authDomain: "chat-cc558.firebaseapp.com",
    projectId: "chat-cc558",
    storageBucket: "chat-cc558.appspot.com",
    messagingSenderId: "802123311223",
    appId: "1:802123311223:web:13cd6546011edba6f9fe72"
  }
);
firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE)


const rootReducer = combineReducers({
    auth:authReducer,
    chats:chatsReducer
})
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
const store=createStore(rootReducer,composeEnhancers(applyMiddleware(thunk)))

ReactDOM.render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>,
   
    document.getElementById('root')
);

