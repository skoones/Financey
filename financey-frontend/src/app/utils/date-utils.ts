export function groupIntoStartEndDates(arr: Date[]): [Date, Date][] {
  if (arr.length < 2) {
    return [];
  }

  return arr.reduce<[Date, Date][]>((result, current, index, array) => {
    if (index < array.length - 1) {
      if (index == array.length - 2) {
        result.push([findDateAtMidnight(current),
          getPreviousDayEnd(getFirstDayOfMonth(array[index + 1]))]);
        result.push([getFirstDayOfMonth(array[index + 1]), array[index + 1]])
      } else {
        result.push([findDateAtMidnight(current),  getPreviousDayEnd(array[index + 1])])
      }
    }
    return result;
  }, []);
}

export function getFirstDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

export function getStartOfYear(date: Date): Date {
  return new Date(date.getFullYear(), 0, 1);
}

export function addMonths(date: Date, monthsToAdd: number): Date {
  const newDate = new Date(date);
  const originalDay = date.getDate();
  newDate.setMonth(newDate.getMonth() + monthsToAdd);

  if (newDate.getDate() !== originalDay) {
    newDate.setDate(0);
  }

  return newDate;
}

export function findEndOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(23);
  newDate.setMinutes(59);
  newDate.setSeconds(59);
  newDate.setMilliseconds(59);
  return newDate;
}

export function dateToString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export function generateDatesForEveryMonth(start: Date, end: Date): Date[] {
  const numberOfMonths = (end.getFullYear() - start.getFullYear()) * 12 + (end.getMonth() - start.getMonth()) - 1;
  const monthsInBetween = generateMonthBeginningsFromDate(numberOfMonths, getFirstDayOfMonth(addMonths(start, 1)));

  return [start, ...monthsInBetween, end];
}

export function generateMonthBeginningsFromDate(numberOfMonths: number, start: Date): Date[] {
  return Array.from({length: numberOfMonths},
    (_, index) => getFirstDayOfMonth(addMonths(start, index)));
}

export function findMonthAndYearFromDate(dateString: string) {
  const date = new Date(dateString);
  const monthIndex = date.getMonth();
  const year = date.getFullYear();

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sept", "Oct", "Nov", "Dec"
  ];

  return `${monthNames[monthIndex]} ${year}`
}

export function findInitialDatesForAnalysis(): Date[] {
  const datesSuffix = generateMonthBeginningsFromDate(new Date().getMonth(), getStartOfYear(new Date()));
  const currentDate = new Date()

  return [...datesSuffix, currentDate];
}


function findDateAtMidnight(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(0);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
}

function getPreviousDayEnd(date: Date): Date {
  const previousDay = new Date(date);
  previousDay.setDate(previousDay.getDate() - 1);

  return findEndOfDay(previousDay);
}
