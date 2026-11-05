export const credits = (value: number) => value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const dateTime = (value: string) => new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Colombo" }).format(new Date(value));
export const calendarDate = (value: string) => new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "Asia/Colombo" }).format(new Date(value));
export const runtime = (minutes: number) => `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
export const shortId = (id: string) => id.startsWith("UC-DEMO") ? id : id.slice(0, 11);
