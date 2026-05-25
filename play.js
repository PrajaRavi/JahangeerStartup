let arr=[{name:"ravi",id:1},{id:2,name:"sanam"}]
let newarr=arr.filter((item)=>{
  return item.id==1
})
console.log(newarr)