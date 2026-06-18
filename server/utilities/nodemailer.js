import nodemailer from "nodemailer"
export  const transporter=nodemailer.createTransport({
  secure:true,
host:'smtp.gmail.com',
port:465,
auth:{
  user:'kingraviprajapati@gmail.com',
  pass:'zfdfyukrdpttyzfw',
}
})

