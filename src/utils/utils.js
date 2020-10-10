// 根据国标时间获取时区时间
export let getChinaTime = (time)=>{
    let data = new Date(time)
   
    return data.getFullYear() + '-' + (data.getMonth()+1) + '-' + data.getDate() + ' ' + data.getHours()+ ':' + data.getMinutes() + ':' + data.getSeconds() 
}