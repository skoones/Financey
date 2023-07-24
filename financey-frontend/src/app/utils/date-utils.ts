export function groupIntoStartEndDates(arr: Date[]): [Date, Date][] {
  if (arr.length < 2) {
    return [];
  }

  return arr.reduce<[Date, Date][]>((result, current, index, array) => {
    if (index < array.length - 1) {
      if (index == 0) {
        result.push([findDateAtMidnight(current),
          findEndOfDay(array[index + 1])]);
      } else {
        result.push([addOneDay(findDateAtMidnight(current)),  findEndOfDay(array[index + 1])])
      }
    }
    return result;
  }, []);
}

export function getFirstDayOfMonth(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}


function findDateAtMidnight(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(0);
  newDate.setMinutes(0);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
}

function findEndOfDay(date: Date): Date {
  const newDate = new Date(date);
  newDate.setHours(23);
  newDate.setMinutes(59);
  newDate.setSeconds(59);
  newDate.setMilliseconds(59);
  return newDate;
}

function addOneDay(date: Date): Date {
  const oneDayInMillis = 24 * 60 * 60 * 1000; // Number of milliseconds in one day
  const newDateInMillis = date.getTime() + oneDayInMillis;
  return new Date(newDateInMillis);
}
