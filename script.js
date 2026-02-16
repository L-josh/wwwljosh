const dateElement = document.getElementById("current-date");
const now = new Date();
const days = [
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
];
const months = [
  "JANUARY",
  "FEBRUARY",
  "MARCH",
  "ARPIL",
  "MAY",
  "JUNE",
  "JULY",
  "AUGUST",
  "SEPTEMBER",
  "OCTOBER",
  "NOVEMBER",
  "DECEMBER",
];
const day = days[now.getDay()];
const month = months[now.getMonth()];
const date = now.getDate();
const year = now.getFullYear();
dateElement.textContent = `${day}, ${month} ${date} ${year}`;
