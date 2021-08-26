export default (users,userId)=>{
    if (users[userId]?.public?.name ){
        return users[userId].public.name  
    }else{
        return userId.substr(0,10)
    }
}