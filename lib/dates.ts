export function kyivDate(now: Date): string {
 const parts = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Kyiv", year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
 const part = (name: string) => parts.find(p => p.type === name)!.value;
 return `${part("year")}-${part("month")}-${part("day")}`;
}
export function adjacentDate(date: string, offset: number): string {
 const d = new Date(`${date}T12:00:00Z`); d.setUTCDate(d.getUTCDate() + offset); return d.toISOString().slice(0,10);
}
