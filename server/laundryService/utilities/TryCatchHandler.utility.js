export const TryCatchHandler=(passedfunction)=>{
  return ((req,resp,next)=>{
    Promise.resolve(passedfunction(req,resp,next)).catch(next)   
  })


}