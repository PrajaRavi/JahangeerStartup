export const ApiResponseType={
  0:"pending",
  1:"fullfiled",
  2:'rejected'
}
export const AuthServicePort=4500;
export const MessageServicePort=7000;
export const formatTime12Hour = (timestamp: number): string => {
  const date = new Date(timestamp);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatMongoTime = (
  mongoTimestamp: string
): string => {
  const date = new Date(mongoTimestamp);

  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};
export const LocalStorageLogedinuserId="LogedInUser"
export const localStorageLastMsg="LastMsg"
export const myobject = {
  0: "chats",
  1: "status",
};
