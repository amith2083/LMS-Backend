export function formatMyDate(dateInput: string | Date | number) {
  const date = new Date(dateInput);

  if (isNaN(date.getTime())) {
    console.error("Invalid date passed to formatMyDate:", dateInput);
    return "Invalid Date";
  }

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  return new Intl.DateTimeFormat("en-US", options).format(date);
}