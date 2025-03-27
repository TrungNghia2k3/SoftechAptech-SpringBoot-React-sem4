import { format } from "date-fns";

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

export const formatVoteAverage = (vote) => {
  return `${Math.round(vote * 10)}`;
};

export const getYearFromDate = (dateString) => {
  const date = new Date(dateString);
  return date.getFullYear();
};

export const formatRuntime = (runtime) => {
  const hours = Math.floor(runtime / 60);
  const minutes = runtime % 60;
  return `${hours}h ${minutes}m`;
};

export const checkGender = (gender) => (gender === 1 ? "Female" : "Male");

export const formatMoney = (amount) => {
  // Chuyển số tiền sang dạng chuỗi
  const amountString = amount.toString();
  // Tách phần nguyên và phần lẻ
  const [integerPart, decimalPart] = amountString.split(".");
  // Định dạng phần nguyên với dấu phân cách
  const formattedIntegerPart = integerPart.replace(
    /\B(?=(\d{3})+(?!\d))/g,
    ","
  );
  // Định dạng phần lẻ
  const formattedDecimalPart = decimalPart
    ? "." + decimalPart.padEnd(2, "0")
    : ".00";
  // Ghép lại thành chuỗi định dạng
  return `$${formattedIntegerPart}${formattedDecimalPart}`;
};

export const formatLeadTime = (epochTime) => {
  const date = new Date(epochTime * 1000); // Chuyển từ giây sang mili giây

  const options = {
    weekday: "long", // Thứ trong tuần
    year: "numeric", // Năm đầy đủ
    month: "long", // Tháng đầy đủ
    day: "numeric", // Ngày
  };

  return date.toLocaleDateString("en-US", options);
};

export const formatCurrencyVND = (amount) => {
  if (isNaN(amount)) {
    return "₫ 0";
  }

  // Convert number to a string and reverse it
  const reverseAmount = amount.toString().split("").reverse().join("");

  // Add a dot every 3 digits
  const formattedAmount = reverseAmount.replace(/\d{3}(?=\d)/g, "$&.");

  // Reverse it back to the original order and add the currency symbol
  return `₫ ${formattedAmount.split("").reverse().join("")}`;
};

export const formatDescription = (text) => {
  return text ? text.replace(/\\n/g, "<br>") : "";
};

export const capitalizeFirstLetter = (text) => {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
};

export const formatDateWithAmPm = (dateString) => {
  const date = new Date(dateString);

  // Format date part (MM/DD/YYYY)
  const formattedDate = date.toLocaleDateString("en-US");

  const hours = date.getHours();
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  const amPm = hours >= 12 ? "PM" : "AM";

  // Handle 24-hour time
  const formattedHours = hours.toString().padStart(2, "0");

  return `${formattedDate}, ${formattedHours}:${minutes}:${seconds} ${amPm}`;
};

// Hàm để định dạng ngày giờ
export const formatNotificationDate = (timestamp) => {
  return format(new Date(timestamp), "M/dd/yyyy, h:mm:ss a");
};
