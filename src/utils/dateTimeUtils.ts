export function getLocalDate(
  timezone: string,
  date: Date = new Date(),
): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date);

    const year = parts.find((part) => part.type === "year")?.value;
    const month = parts.find((part) => part.type === "month")?.value;
    const day = parts.find((part) => part.type === "day")?.value;

    return `${year}-${month}-${day}`;
}

export function getLocalTime(
  timezone: string,
  date: Date = new Date(),
): string {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);

    const hour = parts.find((part) => part.type === "hour")?.value;
    const minute = parts.find((part) => part.type === "minute")?.value;

    return `${hour}:${minute}`;
}

export function getLocalWeekday(
  timezone: string,
  date: Date = new Date(),
): string {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "long",
  }).format(date).toLowerCase();
}

export function addMinutesToTime(time: string, minutesToAdd: number): string {
  const [hour = 0, minute = 0] = time.split(":").map(Number);
  const adjustedTime = new Date(Date.UTC(2000, 0, 1, hour, minute));

  adjustedTime.setUTCMinutes(adjustedTime.getUTCMinutes() + minutesToAdd);

  return adjustedTime.toISOString().slice(11, 16);
}
