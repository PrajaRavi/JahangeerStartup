import React, { createContext } from "react";
const InitialValue={
  DirtyChangeFiles:[{name:"ravipraj",id:"123"}],
  setDirtyFileChanges:()=>{},
  setcount:()=>{},
  count:0
}
export let CounterContext=createContext<counterContextType>(InitialValue)
 interface counterContextType {
  //! This is the standard React type for a setState function
  setcount:React.Dispatch<React.SetStateAction<number>>
  count:number

  

}
