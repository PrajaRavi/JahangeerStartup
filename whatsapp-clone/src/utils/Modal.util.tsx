export type position =
  | "fixed"
  | "relative"
  | "absolute";
export type Options={
  label:string,
  onClick:()=>void;

}
function Modal({top,right,options,position,left}:{top:string,right:string,options:Options[],position:position,left:string}) {
  
  return (
    <>
    <div style={{top,right,left}} className={`${position}  z-30 bg-green-300 rounded-md p-4`}>
      {
        options.map((item:Options)=>{
return <button key={item.label} title={item.label} onClick={item.onClick} className='font-semibold text-sm my-2 w-full'>
  {item.label}
{/* <hr className='hr'/> */}
</button>
        })
      }
      
    </div>
      </>
  )
}

export default Modal
