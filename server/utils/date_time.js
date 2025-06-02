export function formatDateToReadable(dateString) {
  const date = new Date(dateString);

  const options = {
    day: "2-digit",
    month: "long",
    year: "numeric",
    timeZone: "Asia/Kolkata", // Optional: ensures it's IST
  };

  return date.toLocaleDateString("en-GB", options);
}

export function convertTimeTo12HourFormat(timeString) {
  const [hour, minute] = timeString.split(":");

  let h = parseInt(hour, 10);
  const suffix = h >= 12 ? "PM" : "AM";

  h = h % 12 || 12; // Convert 0 to 12 for 12-hour format

  return `${h.toString().padStart(2, "0")}:${minute} ${suffix}`;
}
