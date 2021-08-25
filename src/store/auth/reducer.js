import * as actions from "../actionsConsts"
const initState={
    UID:"isnP8gd3YmM0eQiRM0hIHr2hBhy1",
    // UID:false,
    isAuth:true,
    loading:false,
    error:null
}
export default (state=initState,action)=>{
    switch (action.type) {
        case actions.AUTH_START:
            return{
                ...state,
                loading:true,
                UID:null,
                error:null
            }
        case actions.AUTH_SUCCESS:
            return{
                ...state,
                loading:false,
                UID:action.UID
            
            }
        case actions.AUTH_FAIL:
            return{
                ...state,
                loading:false,
                error:action.error
            
            }
        case actions.AUTH_EXIT:
            return{
                ...state,
                loading:false,
                UID:null,
                error:null
            
            }
        default:
            return state
    }


}