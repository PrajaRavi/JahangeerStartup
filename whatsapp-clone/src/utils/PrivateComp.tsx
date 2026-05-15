import { useSelector } from 'react-redux'
import { Outlet ,Navigate} from "react-router"

export function PrivateComp() {
  const IsUserLogin =useSelector((state:any)=>state.Auth.IsUserLogin)
  return IsUserLogin ? <Outlet/>:<Navigate  to={'/signin/abc@gmail.com'} />
}


