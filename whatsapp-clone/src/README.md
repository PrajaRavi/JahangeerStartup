-> when user is connect in socket then i am not storing it's socket id in the db instead i am storing their id's in memory(ram) inside a Map
->for now i am storing all the online users map object in context api but later store it in rtk(it is throwing non serializable errror)
->How i will send the message
i)when i click on the send button then i will add the message object with a unqiueID in the chat array with status as {sending} now in the backend when the message is saved in the db then i will emit an event for this message with status {sent} and when i emit the reciver end event then i will again emit an event with a status delivered
->If A user is sending  message to B then their are three possibilities for message seen -
  ->first B is online and the activeuser._id ===reciverId so by default store the message with seen false and if this condition is true then make a db query and set it to true(done)

  ->B is online but activeuser._id!==reciverId so if it is then keep a count of all the messages(id) and when activeuser._id===reciverId  then make a db query and set seen to true
  ->B is offline it is similar to second condition

  ---------------------------------------Getting lastmsg and lastseen time-------------------------------------------
  ->i)first created an api that is returning lastmsg with reciverid
  ->ii)on frontend creating a map(since array traversal take o(n) time and map takes o(1) time)
  ->iii)creating this function GetLastMessageOfChatWrapper() which will call GetLastMsg api and store all users lsgmsg in the Map
  ->iv)since GetLastMessageOfChatWrapper() function returns a promise hence  i do not call this directly inside jsx hence i create a helper function(GetLastMsgOfChat) which takes reciverid and gives lastmsg of user 

->-----------------------Working on B is online but activeuser._id!==reciverId-------------------------------->
i)i will store all the senderId as key and their unseen message as value in a Map object
ii)Whenever Activeuser is changing i will  continuosly check if the activeuser is present in the Map if yes then i will do a query in db and do message seen=true;
iii)i also have to store these UnseenMessagesMap data insie dB because if the user goes offline or user closes browser then all data will erased
--->solved
i)let [AllUsersUnSeenMsg,setAllUsersUnseenMsg]=useState<Map<string,string[]|undefined>>(new Map());//This map is storing all the unseen messages of diffrent senders when user is online/offline but activeuser is !=that user which is sending the message Map<senderId,[messageids]>
ii)
iii)StoreUnseenMsginDB->this function store this map(AllUsersUnSeenMsg) data into db 
->---------------------------------B is offline it is similar to second condition------------------------------->(done) maybe bad me koi issue ho but again from now i am storing all the unseen msg in server also
---------------------------------------adding pagination ----------------------------------------
->using IntersectionObserver for this (done)

---------------------------------------adding typing event-------------------------------------------
i)whenever user will start typing means it will press first key then i will emit an event which will tell the reciver that sender is typing and it will now continuosly show typing instead of online and when sender will stop writing then i will immidiately emit an event whihc will tell reciver then sender is not typing hence show online instead of typing(done)

--------------------------------------sending message in a group-------------------------------------------
->.At time of message sending it can be that all the users will not be online
1.first extract all the online users and emit send-message event 
2. 
  chalenge1.how will i know that if user has opend the group chat or not because the message should be gone inside group chat not the user chat
->For group conversation i am creating another model which is similar to conversation model but here it's participants will be intially all the group members and during group creation i will create these group conversation collection for specifig group

-->Thinking i)how will i add messages in specific group conversation because if i am searching the specific sender in members array and if it matches then add their message in that group conversation but their could be possibility that that sender is part of multiple group so that message will be added in all that groups 
  -->solution=>i will store groupID with every message(means i can know that kaun sa message kis group ka hai)
  -->On reciver side=>Get all the messages where msg.senderid==logedinuser._id use this condition only(it is nothing but groupid)

-->When i will show chats in group then i also have to show the sender name/profile with message (means i have to store sender detail also with group messages) 
  ->solution->at the time of send-msg i am also sending the profileImage and storing it with msg

-->Now i have to store all unseen group messages
  ->Thinking=>In case of chat unseen messages between two users on reciver side i am storing all the messages arr[value] with the senderid(key) in a map
  so for group messages i have to create a Map which will store groupId(key) and Unseenmsg(value)  
  ->for this purpose i will use the same unseenmsgmodel senderID will be the sender who is sending message and reciverID will be the groupID and during rendering on sender side condition will be (if msg.senderID!==logedinuser._id and msg.reciverID==Activeuser._id(groupID)) then only i will render the message 
  
->problem->actualy when a is sending messages in group1 then in unseesmsgmodel senderID(a) and reciverID(group1)
actualy when b is sending messages in group1 then in unseesmsgmodel senderID(b) and reciverID(group1)
nowtheir is also user c which is member of that group then this unseenmessages should be visible to this c user also(this is the only problem so how should i store these unseesmsg and how should i render them )
->solution1->if i store senderID(as array of group members) then every time when a new unseenmsg comes then i will push that msg in specific unseenmsg model and it will be global for all the group members
->solution2->Recommended(implimented)->(kal implemt karunga bhai)
Here i have to do two task
        !1.emit the send-message event for all the online group members(and also Update their lastmsgID if message is seened means the members has opened the same group)
        !2.handle members who are offline
        !3.basically intially it is not neccesary that all user are online so for online users i will imidiately send message and also update theis lastmsgID in group document but members who are offline
          !1.initally their msgid will be null so inside useffect whenever they will come online so i have to check if their lastmsgID==null then first fetch all the message of that group and all the messages will be unseen for them now
          !->as well as they will open the group i will update their lastmsgid(which will be the lastmsg of the group)->so for that i have to store the lastmsgID of group
          !->now if they are offline again but this time their lastmsgid!=null(so i will fetch all the messages of that group)->and i will count all the messages which are after the lastmsgid of that member 
->Handling the unseenmsg count problem
->Problem->i want unseenmsg count of the logedinUser for every group
-->i will make an api which wil take groupId as array(All groupId where the logedinuser is member) and userId now it will give me a map as an arry with GroupId(key),count(value)           

<----------------------------------Current Problem->Handle UnseenMsgCount for group---------------------------------->
->also when reciving chat messages of a user then also it is coming in group chat also(conflict issue) chat->group and group->group
->Standardising the AlllUsersUnseenMsg for both group unseen msg and also for chat unseen msg


-->How i was handling the UnseenMsg of chats
i)I am stroing msg SenderId as key and all unseesmsgIDs array as value in AllUsersUnseenMsg  Map and when the reciver is opening the chat then i am using these unseenmsgIDs array to again update their seen status as true(For these things i seprately created a new model UnseenMsgModel)

-->How i am handling the UnseenMsg of chats
->now i am changing this architecture to the UnseenMsg of Groups
  for this implementation i have to store LastMsgID in the conversation model and also here i have to keep track of LastMsgId of sender and reciver


->How i am handling the UnseenMsg of Groups
i)Here i am storing groupId as key and in backend as i am tracking every member lastmsgID and using this i am  gettting all the messages after the lastMsgId and using this arr.length to show as unseen Msg  as value and whenever user is opening the group then i am immidiately changing the lastmsgId of that user



<---------------------------------Adding status feature------------------------------------>
i)defining Model(schema)
->User(kisne status lagaya hai),Time(Today or tomarrow)[not need i will use createdAt feild and in frontend using a function i will show today,tommarow,just],Viewed(array of user have seen this status),WhoCanSee(privace an array containing users who can see the users status (future me dekhunga)),Type(means it is Text/Video/Audio)[if it is Text then data to be stored{text,bgcolor,font}]
-->How i will manage Time

->challange----------------------> how to show status
->requirment->i want an array having status data and also whoCanSee array (also if multiple status contains same userId means they are created by same user so i do not have to show multiple status)
->what i have 1.status data with userId and 2.alluserdata having _id
solution->if i create a Map having key(userid) and value([{statusdata,username,userProfile}])

<----------------------------------------------Handling Attachments--------------------->
->created a  variable Attachments for keeping the attachments
->steps->as soon as user will select an image first i will store it in server and show progress bar (in future store it in cloud) then immidiatly i will create a Blob url and show the preview of the image and when the image is uploaded 100% then i will emit send-message event

<-------------------------------------adding delete functionality----------------------------->
->delete for everyOne->delete from database
->delete for me->i will add a feild(IsDeletedForMe) in db and if it is true then i will not show that message to sender(but here is a glitch their is possibility that the reciver also doing delete for me for the same message)->solution->i will create two feild IsDeletedForSender and second IsDeletedForReciver
==>solid solution->create only one feild hiddenBy(array of ids)->it will store id's of users who are doing delete for me