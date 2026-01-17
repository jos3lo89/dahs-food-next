import dayjs from "dayjs";

type DateFormat = "full" | "date" | "time" | "short";

export const formatDateTime = (
  dateString: string | Date | null | undefined,
  format: DateFormat = "full",
): string => {
  if (!dateString) return "-";

  const date = dayjs(dateString);

  if (!date.isValid()) return "Fecha inválida";

  const FORMATS = {
    date: "DD/MM/YYYY",
    time: "hh:mm A",
    full: "DD/MM/YYYY hh:mm A",
    short: "DD/MM",
  };

  switch (format) {
    case "date":
      return date.format(FORMATS.date);
    case "time":
      return date.format(FORMATS.time);
    case "short":
      return date.format(FORMATS.short);
    case "full":
    default:
      return date.format(FORMATS.full);
  }
};
