
function Modal({top,right,options,groupclick,settingclick}:{top:string,right:string,options:string[],groupclick:(e:any)=>void,settingclick:(e:any)=>void}) {
  return (
    <>
    <div style={{top,right}} className={`fixed  z-30 bg-green-300 rounded-md p-4`}>
      {
        options.map((item:string)=>{
return <button key={item} title={item} onClick={item=="New Group"?(e)=>groupclick(e):item=="settings"?(e)=>settingclick(e):null} className='font-semibold text-sm my-2 w-full'>
  {item}
{/* <hr className='hr'/> */}
</button>
        })
      }
      
    </div>
      </>
  )
}

export default Modal
