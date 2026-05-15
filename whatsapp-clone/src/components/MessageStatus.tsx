import {
  BsClock,
  BsCheck,
  BsCheckAll,
} from "react-icons/bs";

export type MessageStatus =
  | "sending"
  | "sent"
  | "delivered";

interface Message {
  id: string;
  text: string;
  senderId: string;
  status: MessageStatus;
  createdAt: string;
}
export const MessageStatus = ({
  status,
  seen,
}: {
  status: MessageStatus,seen:boolean;
}) => {
  if (status === "sending") {
    return <BsClock size={14} />;
  }

  if (status === "sent") {
    return <BsCheck size={16} />;
  }

  if (status === "delivered") {
    return <BsCheckAll color={seen?"Blue":""} size={16} />;
  }

  return null;
};