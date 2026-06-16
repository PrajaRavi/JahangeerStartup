import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api, { postRequest } from "../../utils/post.api";
import type { VerifyOtpFormData } from "../../components/EmailVerification";
import type { LoginFormData } from "../../components/Signin";
import { SetAllUsers, SetIsUserLogin, SetUser } from "../Slice/Auth.slice";

/*
  Expected API response structure

  Why:
  Gives TypeScript type safety for fulfilled action payload
*/
interface SignupResponse {
  success: boolean;
  message: string;
  data?: any;
}

/*
  Thunk input type

  Since component already creates FormData,
  we accept FormData directly.
*/
export const signupUser = createAsyncThunk<
 SignupResponse, // success payload type
  FormData, // input payload type
  { rejectValue: string } // error payload type
>(
  "auth/signupUser",

  /*
    payload = FormData from component
    thunkAPI = toolkit helper object
  */
  async (formData, thunkAPI) => {//thunkAPI is the object containing values like rejectwithvalues etc 
    try {
      /*
        Call utility function

        Why:
        only route changes here
        baseURL already configured
      */
      const result = await postRequest(
        "/user/signup",
        formData
      );

      /*
        Return successful response

        This triggers:
        signupUser.fulfilled
      */
      return result;
    } catch (error: any) {
      /*
        Handle axios-specific errors

        Why:
        backend errors usually come inside:
        error.response.data
      */
      if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.msg ||
          "Signup failed"
        );
      }

      /*
        Fallback error handling

        Why:
        catches unexpected JS/runtime errors
      */
      return thunkAPI.rejectWithValue(
        "Something went wrong"
      );
    }
  }
);
export const EmailVerification=createAsyncThunk("auth/emailverification",async (formData:VerifyOtpFormData,thunkAPI)=>{
  try {
    const result = await postRequest(
        "/user/verify-otp-after-signup",
        formData
      );

      return result;

  } catch (error) {
    if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
          "Emailverification failed"
        );
      }
  }

})

export const LoginUser=createAsyncThunk("auth/LoginUser",async (formData:LoginFormData,thunkAPI)=>{
  try {
    const result = await postRequest(
        "/user/signin",
        formData
      );

      return result;

  } catch (error) {
    if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
          "signin failed"
        );
      }
  }

})

export const RefreshToken=createAsyncThunk("auth/Refreshtoken",async (_,thunkAPI)=>{
  try {
    
    const {data}=await api.post("/user/refresh-token",{},{withCredentials:true})
    
      return data;

  } catch (error) {
    if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
          "refreshaccess Token failed"
        );
      }
  }

})


export const GetLogedInUser=createAsyncThunk("auth/GetLogedInUser",async (_,thunkAPI)=>{
  try {
    
    const {data}=await api.get("/user/loged-in-user",{withCredentials:true})
    console.log(data.data)
    thunkAPI.dispatch(SetUser(data.data))
    thunkAPI.dispatch(SetIsUserLogin(true))
    

    return data;
    

  } catch (error) {
    if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
          "get loged in failed"
        );
      }
  }

})
export const GetAllUser=createAsyncThunk("auth/GetLogedInUser",async (_,thunkAPI)=>{
  try {
    
    const {data}=await api.get("/user/all-users",{withCredentials:true})
    thunkAPI.dispatch(SetAllUsers(data.msg))
   
    return data;

    

  } catch (error) {
    if (axios.isAxiosError(error)) {
        return thunkAPI.rejectWithValue(
          error.response?.data?.message ||
          "get(/user/all-users) failed"
        );
      }
  }

})