const DAYS=[
    'Воскресенье' ,'Понедельник' , 'Вторник' , 'Среда' , 'Четверг' , 'Пятница' , 'Суббота' 
]
const DAYS_S=[
    'вс', 'пн' , 'вт' , 'ср' , 'чт' , 'пт' , 'сб' 
]
const MONTHS=[
	'январь', 'февраль', 'марть',
	'апрель', 'маь', 'июнь',
	'июль', 'августь', 'сентябрь',
	'октябрь', 'ноябрь', 'декабрь'
]
const transformNumber=(nubmer)=>{
    let string=nubmer+""
    if(string.length<2){
        return "0"+string
    }else{
        return string
    }

}
export const getDate=(time)=>{
  
    let date = new Date(time)
    let res = Date.now()-date
    let dayRes=res/ (24*60*60*1000)
    if(dayRes<1){
        return transformNumber(date.getHours())+":"+transformNumber(date.getMinutes())
    }
    if(dayRes<7){
        return DAYS_S[date.getDay()]
    }
    if(dayRes<12){
        let day=date.getDay()+1
        let month=date.getMonth()+1
        let year=date.getFullYear()+""
        year=year.substring(2,4)
        return transformNumber(day)+"."+transformNumber(month)+"."+year
    }
}

export const getDateHM=(time)=>{
  
    let date = new Date(time)
    let hours=date.getHours()+""
    let minutes=date.getMinutes()+""
    if(hours.length==1){
        hours="0"+hours
    }
    if(minutes.length==1){
        minutes="0"+minutes
    }
    return hours+":"+minutes
}

