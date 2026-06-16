

import { createSlice } from '@reduxjs/toolkit';
import type { CurrServiceType } from '../../components/ServiceDetails';
 
 
 
export type OrderProductType={
  Address:String;
  Items:[];
  paymentStatus:String;
  Time:{from:String,to:String};
  Day:String;
  orderStatus:String;
  _id:String;

  
}
type ProductPickUpType={
  from:String;
  to:String;
}
interface FileStates {
  ActiveUser: SignupFormData,//this is nothing but the right side active tab
  IsUserLogin:boolean,
  user: SignupFormData;
  loading: boolean;
  AllUsers:SignupFormData[];
  CartItems:CurrServiceType[];
  OrderdProducts:OrderProductType[];
  ProductPickUpDays:string[];
  ProductPirckUpTime:ProductPickUpType[]
 }
 
export interface SignupFormData {
  username: string;
  email: string;
  _id:string,
  phoneNumber: string;
  profilePicture: string | null;
  

}
const initialState: FileStates = {
  ActiveUser:{username:"",email:"",_id:"",phoneNumber:"",profilePicture:null},
  IsUserLogin:false,
  user:{username:"",email:"",_id:"",phoneNumber:"",profilePicture:null},
  loading:false,
  
  AllUsers:[],
  CartItems:[],
  OrderdProducts:[],
  ProductPickUpDays:[],
  ProductPirckUpTime:[],
  
  };

export const counterSlice = createSlice({
  name: 'AuthSlice',
  initialState,
  reducers: {
    setActiveUser: (state, action) => {
      state.ActiveUser = action.payload
    },
    SetUser: (state, action) => {
      state.user = action.payload
    },
    SetIsUserLogin: (state, action) => {
      state.IsUserLogin = action.payload
    },
    SetAllUsers: (state, action) => {
      state.AllUsers = action.payload
    },
    setCartItems:(state, action) => {
      state.CartItems=[...state.CartItems,...action.payload]
    },
    ReStoreCartItems:(state, action) => {
      state.CartItems=action.payload
    },
    SetOrderdProd:(state, action) => {
      state.OrderdProducts=action.payload;
    },
    SetProductPickUpDay:(state, action) => {
      state.ProductPickUpDays=action.payload;
    },
    SetProductPickUpTime:(state, action) => {
      state.ProductPirckUpTime=action.payload;
    },
    



 
    
      
  
  },
    
    

   
});

export const { setActiveUser,SetIsUserLogin,SetUser,SetAllUsers,setCartItems,ReStoreCartItems,SetOrderdProd,SetProductPickUpDay,SetProductPickUpTime} = counterSlice.actions;
export const FileReducer = counterSlice.reducer;