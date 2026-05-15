export type GroupDataType = {
  _id: string;
  groupName: string;
  groupDescription: string;
  groupProfileImage: string;
  groupSettings: string[];
  members: string[];
  admins: string[];
  createdBy: string;
};

export type LastMsgAndSeenObjType = {
    lastmsg: string;
    lastseen: string;
  };
export  type memberObject = {
  userID: string;
  LastMsgID: string;
};

