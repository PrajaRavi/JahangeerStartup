import { nanoid } from "@reduxjs/toolkit";
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

/**
 * Formats a MongoDB date string or Date object into relative chat/status headers.
 * @param mongoTime - The timestamp from MongoDB (e.g., createdAt string or Date object)
 * @returns A string like "Just now", "Today at HH:MM PM", "Tomorrow at HH:MM AM", or a fallback date string
 */
export const formatStatusTime = (mongoTime: string | Date): string => {
  const statusDate = new Date(mongoTime);
  const now = new Date();

  // 1. Check for "Just now" (if the status was posted less than 1 minute ago)
  const timeDifferenceInSeconds = Math.floor((now.getTime() - statusDate.getTime()) / 1000);
  
  if (timeDifferenceInSeconds >= 0 && timeDifferenceInSeconds < 60) {
    return "Just now";
  }

  // 2. Format the clock time (e.g., "04:15 PM")
  // Using Intl.DateTimeFormatOptions ensures strict typing for options parameters
  const timeOptions: Intl.DateTimeFormatOptions = { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: true 
  };
  const formattedTime = statusDate.toLocaleTimeString('en-US', timeOptions);

  // 3. Create clean day-only timestamps (setting hours to midnight)
  const todayMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const statusMidnight = new Date(statusDate.getFullYear(), statusDate.getMonth(), statusDate.getDate());

  // Calculate the difference in calendar days
  const oneDayInMs = 24 * 60 * 60 * 1000;
  const dayDifference = Math.round((statusMidnight.getTime() - todayMidnight.getTime()) / oneDayInMs);

  // 4. Return relative string based on day differences
  if (dayDifference === 0) {
    return `Today at ${formattedTime}`;
  } else if (dayDifference === 1) {
    return `Tomorrow at ${formattedTime}`;
  } else if (dayDifference === -1) {
    return `Yesterday at ${formattedTime}`;
  } else {
    // Fallback for older dates (e.g., "May 20, 2026")
    const dateOptions: Intl.DateTimeFormatOptions = {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    };
    
    return `${statusDate.toLocaleDateString('en-US', dateOptions)} at ${formattedTime}`;
  }
};

export const ProjectName="MYDHOBI"
type PickupDay = {
  id: string;
  label: string;
  date: string;
};

export const generatePickupDays = (
  days: string[]
): PickupDay[] => {
  return days.map((label, index) => {
    const date = new Date();

    // Add offset days
    date.setDate(date.getDate() + index);

    return {
      id: nanoid(),
      label,
      date: date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
    };
  });
};

type TimeSlot = {
  from: string;
  to: string;
};

export const generateTimeSlots = (
  slots: TimeSlot[]
) => {
  return slots.map((slot) => ({
    id:slot._id,

    label: `${slot.from} - ${slot.to}`,

    disabled: false,
  }));
};