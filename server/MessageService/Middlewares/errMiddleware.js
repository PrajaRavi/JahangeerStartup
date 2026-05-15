export const errMiddleware=(err,req,resp,next)=>{
  let msg=err.message||"Internal server error";
  let code=err.statusCode||500;

  resp.status(code).send({
    success:false,
    msg,
    code
  })
}