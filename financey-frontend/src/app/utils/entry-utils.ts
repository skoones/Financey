import {EntryType} from "../../generated";

export function mapIsBuyToEntryType(isBuy: boolean): EntryType {
  if (isBuy) {
    return EntryType.EXPENSE;
  } else {
    return EntryType.INCOME;
  }
}

export function mapEntryTypeToIsBuy(entryType: EntryType = EntryType.EXPENSE): boolean {
  return entryType == EntryType.EXPENSE;
}

