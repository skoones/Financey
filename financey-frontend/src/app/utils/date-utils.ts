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
