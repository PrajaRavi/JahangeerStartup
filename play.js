let map=new Map()
map.set("helllo",[1,2,3,4])
map.set("helllo1",[10])
map.set("helllo12",[1220,23,45])
map.forEach((value,key)=>{
console.log(key)
value.map((item)=>{
  console.log(item)
})
})