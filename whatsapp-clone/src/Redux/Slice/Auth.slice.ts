// src/features/counter/counterSlice.ts
// let [CurrFileOpendId,setCurrFileOpenedId]=useState<string>("456")


import { createSlice } from '@reduxjs/toolkit';
import { signupUser } from '../Thunk/Auth.thunk';
import type { MessageStatus } from '../../components/MessageStatus';
export type messageType={
  _id:string,
  text:string,
  status?:MessageStatus,
  time:string,
  senderID:string,
  seen:boolean,
  reciverID:string,
 }
 export type GroupOrChat=
  |"group"
  |"chat"


interface FileStates {
  ActiveUser: SignupFormData,//this is nothing but the right side active tab
  IsUserLogin:boolean,
  user: SignupFormData;
  loading: boolean;
  error: string | null;
  AllUsers:SignupFormData[];
  messages:messageType[],
  UnseenMessages:string[],
  ShowGroupOrChat:GroupOrChat //This will keep track that right side page shows normal chats or a group chat
}
export interface SignupFormData {
  username: string;
  email: string;
  _id:string,
  phoneNumber: string;
  bio: string;
  profilePicture: File | null;
  whoCanSee?:string[]

}
const initialState: FileStates = {
  ActiveUser:{username:"",email:"",_id:"",phoneNumber:"",bio:"",profilePicture:null},
  IsUserLogin:false,
  user:{username:"",email:"",_id:"",phoneNumber:"",bio:"",profilePicture:null},
  loading:false,
  error:null,
  AllUsers:[],
  UnseenMessages:[],
  ShowGroupOrChat:"chat",
  
  messages:[
    
      
  
]
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
    SetMessages: (state, action) => {
      state.messages.push(action.payload)
     },
    UpdateMsg: (state, action) => {
      let {msgid,status,msgMongoId}=action.payload;//msgid->local msg id,msgMongoId->message mongodb id
      const msg=state.messages.find((item)=>item._id==msgid)
      if(msg){
        msg.status=status
        if(msgMongoId) msg._id=msgMongoId

      }
    },
    SetShowChatOrGroup:(state, action) => {
      state.ShowGroupOrChat=action.payload;
      
     },
    UpdateMsgSeen: (state, action) => {
      let {msgid,seen}=action.payload;
      const msg=state.messages.find((item)=>item._id==msgid)
      if(msg){
        msg.seen=seen
      }
    },
    SetUnseenMsg:(state, action) => {
      state.UnseenMessages.push(action.payload)
    },
    SetMessagesEmpty:(state) => {
      state.messages=[]
     },
    UpdateMessageBySpread:(state, action) => {
      state.messages=[...action.payload,...state.messages]
     },




 
    
      
  
  },
   extraReducers: (builder) => {
  builder

    /*
      Runs when signup API starts

      Why:
      - show loader
      - clear old errors
    */
    .addCase(signupUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    })

    /*
      Runs when signup succeeds

      Why:
      - stop loading
      - save user data
      - mark authenticated
    */
    .addCase(signupUser.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload.data;
      state.IsUserLogin = true;
      state.error = null;
    })

    /*
      Runs when signup fails

      Why:
      - stop loading
      - save backend error message
    */
    .addCase(signupUser.rejected, (state, action) => {
      state.loading = false;
      state.error =
        action.payload || "Signup failed";
    });
} 
    
    

   
});

export const { setActiveUser,SetIsUserLogin,SetUser,SetAllUsers,SetMessages,UpdateMsg,UpdateMessageBySpread,SetMessagesEmpty,UpdateMsgSeen,SetUnseenMsg,SetShowChatOrGroup} = counterSlice.actions;
export const FileReducer = counterSlice.reducer;