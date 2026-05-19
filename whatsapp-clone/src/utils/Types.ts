export type GroupDataType = {
  _id: string;
  groupName: string;
  groupDescription: string;
  groupProfileImage: string;
  groupSettings: string[];
  members: MembersOfGroup[];
  admins: string[];
  LastMsgID:string|null;
  
  createdBy: string;
};
export type MembersOfGroup={
  userID:string;
  LastMsgID:string|null;
}

export type LastMsgAndSeenObjType = {
    lastmsg: string;
    lastseen: string;
  };
export  type memberObject = {
  userID: string;
  LastMsgID: string;
};

export const StatusOptions={
  statpriv:"Status Privacy",
  sett:"Settings"
}
export const GroupOptions={
  newgroup:"New Group",
  newcommu:"New Community",
  settings:"setting"
}
export const StatusTypes={
  text:"text",
  video:"video",
  image:'image',
  audio:"audio"
}