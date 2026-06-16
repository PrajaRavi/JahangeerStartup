export const generatePickupDays = (
  days
) => {
  return days.map((label, index) => {
    const date = new Date();
    
    // Add offset days
    date.setDate(date.getDate() + index);
    
    return {
      id: label
      .toLowerCase()
      .replace(/\s+/g, "-"),
      label,
      date: date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
    };
  });
};
      console.log(generatePickupDays([
  "Today",
  "Tomorrow",
  "Day After Tomorrow",
]))
