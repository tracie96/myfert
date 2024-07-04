export function calculateMaxDate() {
  const today = new Date();
  return new Date(today.getFullYear() - 13, today.getMonth(), today.getDate());
}

export function disabledPreviousDates() {
  const today = new Date();
  const formattedDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  )
    .toISOString()
    .slice(0, 16);
  return formattedDate;
}

export function disabledPreviousOnlyDates() {
  const today = new Date();
  const formattedDate = new Date(
    today.getTime() - today.getTimezoneOffset() * 60000
  );

  return formattedDate;
}

export function getDateFromString(dateTimeString) {
  const dateOnly = dateTimeString.substring(0, 10);
  return dateOnly;
}

export function calculateDaysDifference(targetDate) {
  const targetDateTime = new Date(targetDate);
  const today = new Date();
  const differenceMilliseconds = targetDateTime - today;
  const differenceDays = Math.floor(
    differenceMilliseconds / (1000 * 60 * 60 * 24)
  );

  return differenceDays;
}

export const truncateText = (text, limit) => {
  const words = text.split(" ");
  if (words.length > limit) {
    return words.slice(0, limit).join(" ") + "...";
  }
  return text;
};
