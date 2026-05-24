
function Ravi(time){
  let statusdate=new Date(time);
  let now=new Date();
let TSD=Math.floor((now-statusdate)/1000)
  if(TSD>=0 && TSD<60){
    return "Just Now"
  }
  const timeOptions={hour:'2-digit',minute:'2-digit',hour12:true}
  const formatedTime=statusdate.toLocaleTimeString('en-US',timeOptions)
  console.log(formatedTime)
}
Ravi("2026-05-19T05:19:47.070+00:00")