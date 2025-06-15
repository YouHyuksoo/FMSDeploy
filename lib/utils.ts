import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { addDays, addWeeks, addMonths, addYears, formatISO, isValid, parseISO } from "date-fns"
import type { InspectionPeriodType } from "@/types/inspection-master"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTodayIsoDate(): string {
  return formatISO(new Date(), { representation: "date" })
}

export function calculateNextScheduleDate(
  baseDateStr: string | Date,
  periodType: InspectionPeriodType,
  periodValue: number,
): string {
  let baseDate = typeof baseDateStr === "string" ? parseISO(baseDateStr) : baseDateStr

  if (!isValid(baseDate)) {
    console.warn(`Invalid baseDate provided to calculateNextScheduleDate: ${baseDateStr}. Defaulting to today.`)
    baseDate = new Date()
  }

  if (periodValue <= 0) {
    console.warn(`Period value (${periodValue}) must be positive. Returning base date.`)
    return formatISO(baseDate, { representation: "date" })
  }

  let nextDate: Date

  switch (periodType) {
    case "DAILY":
      nextDate = addDays(baseDate, periodValue)
      break
    case "WEEKLY":
      nextDate = addWeeks(baseDate, periodValue)
      break
    case "MONTHLY":
      nextDate = addMonths(baseDate, periodValue)
      break
    case "QUARTERLY":
      nextDate = addMonths(baseDate, periodValue * 3)
      break
    case "BI_ANNUALLY": // 반기별 (6개월)
      nextDate = addMonths(baseDate, periodValue * 6)
      break
    case "YEARLY":
      nextDate = addYears(baseDate, periodValue)
      break
    case "CUSTOM_DAYS":
      nextDate = addDays(baseDate, periodValue)
      break
    default:
      // For unhandled period types, or if logic dictates, return the base date or throw an error
      console.warn(`Unhandled period type: ${periodType}. Returning base date.`)
      nextDate = baseDate
      break
  }
  return formatISO(nextDate, { representation: "date" })
}
