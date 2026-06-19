

import { createSlice } from '@reduxjs/toolkit';
import type { CurrServiceType } from '../../components/ServiceDetails';
 
 
 
export type OrderProductType={
  Address:String;
  phoneNumber?:Number;
  AltphoneNumber?:Number;
  lat?:Number|string|undefined;
  lang?:Number|string|undefined;
  Items:[];
  User:SignupFormData
  Amount?:Number
  Count?:Number
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
  ProductPickUpDays:string[];
  ProductPirckUpTime:ProductPickUpType[];
  UsersData:SignupFormData[];
  OrderdProducts:OrderProductType[];//This contains Orders data of the logedin user
  OrderData:OrderProductType[]; //This contains all the orders data
  GetAllOrdersFlag:boolean;
  OrderdProductsFlag:boolean;
  GetAllUserFlag:boolean;

  
 }
 
export interface SignupFormData {
  username: string;
  email: string;
  _id:string,
  role?:string,
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
  UsersData:[],
  OrderData:[],
  GetAllOrdersFlag:true,
  OrderdProductsFlag:true,
  GetAllUserFlag:true,
  
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
    UpdateUsersData:(state, action) => {
      state.UsersData=action.payload;
    },
    UpdateOrderData:(state, action) => {
      state.OrderData=action.payload;
    },
    UpdateAllOrderDataFlag:(state, action) => {
      state.GetAllOrdersFlag=action.payload;
    },
    UpdateOrderdProductFlag:(state, action) => {
      state.OrderdProductsFlag=action.payload;
    },
    UpdateGetAllUsersFlag:(state, action) => {
      state.GetAllUserFlag=action.payload;
    },
    



 
    
      
  
  },
    
    

   
});

export const { setActiveUser,SetIsUserLogin,SetUser,SetAllUsers,setCartItems,ReStoreCartItems,SetOrderdProd,SetProductPickUpDay,SetProductPickUpTime,UpdateUsersData,UpdateOrderData,UpdateAllOrderDataFlag,UpdateOrderdProductFlag,UpdateGetAllUsersFlag} = counterSlice.actions;
export const FileReducer = counterSlice.reducer;