import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LocalStorageLogedinuserId } from "../utils/Dotenv";
import { SetMessagesEmpty, UpdateMessageBySpread, type messageType } from "../Redux/Slice/Auth.slice";
import { BiDownArrow } from "react-icons/bi";
import { MessageStatus } from "./MessageStatus";

export function MessageList() {
  const messages = useSelector((state: any) => state.Auth.messages);
  let ActiveUser = useSelector((state: any) => state.Auth.ActiveUser);
  let [IsScrolling, setIsScrolling] = useState<boolean>(false);
  let ShowGroupOrChat = useSelector((state: any) => state.Auth.ShowGroupOrChat);

  let TopScrollRef = useRef(null);

  let ScrollRef = useRef(null);
  let [page, setpage] = useState<number>(1);
  const dispatch = useDispatch();
  let [TotalPage, setTotalPage] = useState<number>(2);
  // let [UserMessageFromDB,setUserMessageFromDB]=useState<messageType[]>([{senderID:"",reciverID:"",id:'no',text:"he",time:'',sender:"",roomid:""}])
  const LogedInUser = useSelector((state: any) => state.Auth.user);

  async function GetMessagesOfParticipents(limit: number, page: number = 1) {
    // console.log(LogedInUser._id,ActiveUser._id)
    try {
      let { data } = await axios.get(
        `http://localhost:7000/conversation/msg-of-participents?limit=${limit}&page=${page}&senderid=${LogedInUser._id}&reciverid=${ActiveUser._id}`,
        { withCredentials: true },
      );
      if (data.success) {
        console.log(data?.msg);
        // we have to convert all the message in the required format

        if (data?.msg.length > 0) {
          //  for proper ordering of these messages we have to reverse them
          // using two pointer method for reversing them
          // if(String(localStorage.getItem(LocalStorageLogedinuserId))!==ActiveUser._id){

            let i = 0;
            let j = data?.msg?.length - 1;
            while (i < j) {
              let temp = data?.msg[i];
              data.msg[i] = data?.msg[j];
              data.msg[j] = temp;
              
              i++;
              j--;
            }
          // }
            if (page == 1) {
            console.log(data?.totalpage + "totalpage");
            setTotalPage(data?.totalpage);
          }
          dispatch(UpdateMessageBySpread(data?.msg));
        } else {
          dispatch(SetMessagesEmpty());
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
    }
  }

  async function GetMessagesOfGroup(limit: number, page: number = 1) {
    try {
      let { data } = await axios.get(
        `http://localhost:7000/message/group-messages?GroupID=${ActiveUser._id}&page=${page}&limit=${limit}`,
        { withCredentials: true },
      );
      if (data.success) {
        console.log(data?.msg);
        // we have to convert all the message in the required format

        if (data?.msg.length > 0) {
          //  for proper ordering of these messages we have to reverse them
          // using two pointer method for reversing them
          let i = 0;
          let j = data?.msg?.length - 1;
          while (i < j) {
            let temp = data?.msg[i];
            data.msg[i] = data?.msg[j];
            data.msg[j] = temp;

            i++;
            j--;
          }
          if (page == 1) {
            console.log(data?.totalpage + "totalpage");
            setTotalPage(data?.totalpage);
          }
          dispatch(UpdateMessageBySpread(data?.msg));
        } else {
          dispatch(SetMessagesEmpty());
        }
      }
    } catch (error) {
      console.log(error);
      console.log("error in getmessage of groups");
    } finally {
    }
  }

  useEffect(() => {
    if (IsScrolling == false) {
      ScrollRef?.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    dispatch(SetMessagesEmpty());
    if (ShowGroupOrChat == "chat") {
      GetMessagesOfParticipents(20, page);
    } else {
      GetMessagesOfGroup(20, page);
    }
    setpage(0);
  }, [ActiveUser]);

  // This function will extract UserProfile using it's id to show with each group message

  useEffect(() => {
    if (page > 1 && page <= TotalPage) {
      if (ShowGroupOrChat == "chat") {
        GetMessagesOfParticipents(20, page);
      } else {
        GetMessagesOfGroup(9, page);
      }
    }
  }, [page]);
  useEffect(() => {
    if (!TopScrollRef.current) return;
    const Topobserver = new IntersectionObserver(
      ([data]) => {
        console.log(data?.isIntersecting);
        if (data?.isIntersecting) {
          if (Number(page) <= Number(TotalPage)) {
            setpage((page) => page + 1);
          }
        }
      },
      { threshold: 0.1 },
    );
    Topobserver.observe(TopScrollRef.current);
    return () => {
      if (TopScrollRef.current != undefined) {
        Topobserver.unobserve(TopScrollRef.current);
      }
    };
  }, []);
  if (ShowGroupOrChat == "chat") {
    return (
      <div
        onScroll={(e) => {
          setIsScrolling(true);
        }}
        onScrollEnd={() => {
          setIsScrolling(false);
        }}
        className="flex-1 overflow-y-auto relative p-4 space-y-4 bg-gray-50"
      >
        <div ref={TopScrollRef} className="topScroller w-full  h-1"></div>
        <div
          onClick={() => {
            // alert(TotalPage)
            ScrollRef?.current?.scrollIntoView({ behavior: "smooth" });
          }}
          className="ScrollToDown fixed right-5 bg-green-400 w-8 h-8 flex items-center justify-center rounded-full bottom-24"
        >
          <BiDownArrow />
        </div>
        {messages.map((msg: messageType) => (
          <div
            key={msg._id}
            className={`flex ${msg.senderID == LogedInUser._id ? "justify-end" : ActiveUser._id === msg.senderID && msg.reciverID === LogedInUser._id ? "justify-start" : "hidden"}`}
            // className={`flex ${ (msg.senderID==LogedInUser._id ) ? "justify-end":"justify-start"}`}
          >
            <div
              className={`max-w-[75%]  px-4 py-2 rounded-2xl text-sm shadow ${
                msg.senderID == LogedInUser._id
                  ? "bg-green-500 text-white"
                  : "bg-white text-black"
              }`}
            >
              <p className="mr-3">{msg.text}</p>
              <div className=" flex items-center justify-end gap-1 right-2 text-xs text-gray-300 font-bold bottom-0">
                <p>{msg.time}</p>
                <p>
                  {msg.senderID == LogedInUser._id ? (
                    <MessageStatus seen={msg?.seen} status={msg?.status} />
                  ) : (
                    ""
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div
          ref={ScrollRef}
          className="scrollIndicator w-full h-1 bg-transparent"
        ></div>
      </div>
    );
  } else {
    return (
      <div
        onScroll={(e) => {
          setIsScrolling(true);
        }}
        onScrollEnd={() => {
          setIsScrolling(false);
        }}
        className="flex-1 overflow-y-auto relative p-4 space-y-4 bg-gray-50"
      >
        <div ref={TopScrollRef} className="topScroller w-full  h-1"></div>
        <div
          onClick={() => {
            // alert(TotalPage)
            ScrollRef?.current?.scrollIntoView({ behavior: "smooth" });
          }}
          className="ScrollToDown fixed z-30 right-5 bg-green-400 w-8 h-8 flex items-center justify-center rounded-full bottom-24"
        >
          <BiDownArrow />
        </div>
        {messages.map((msg: messageType) => (
          <div
            key={msg._id}
            className={`flex relative z-20 ${msg.senderID == LogedInUser._id ? "justify-end  " : "justify-start my-2"}`}
            // className={`flex ${ (msg.senderID==LogedInUser._id ) ? "justify-end":"justify-start"}`}
          >
            {msg.senderID !== LogedInUser._id ? (
              <div className="photo bg-green-300 w-8 h-8 rounded-full absolute -top-5 -left-2">
                <img
                  src={`http://localhost:4500/Images/Profile/${msg.profilePicture}`}
                  className="w-full h-full content-center rounded-full"
                  alt=""
                />
              </div>
            ) : null}
            <div
              className={`max-w-[75%]  px-4 py-2 rounded-2xl text-sm shadow ${
                msg.senderID == LogedInUser._id
                  ? "bg-green-500 text-white"
                  : "bg-white text-black"
              }`}
            >
              <p className="mr-3">{msg.text}</p>
              <div className=" flex items-center justify-end gap-1 right-2 text-xs text-gray-300 font-bold bottom-0">
                <p>{msg.time}</p>
                <p>
                  {msg.senderID == LogedInUser._id ? (
                    <MessageStatus seen={msg?.seen} status={msg?.status} />
                  ) : (
                    ""
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
        <div
          ref={ScrollRef}
          className="scrollIndicator w-full h-1 bg-transparent"
        ></div>
      </div>
    );
  }
}
