import { signal } from "@angular/core";

export type SortDirection = 'asc' | 'desc';
export type SortAccessor<T> = (item: T) => unknown;

export class Sorting<T> {
  readonly sortColumn = signal<keyof T>(null as unknown as keyof T);
  readonly sortDirection = signal<SortDirection>('asc');

  constructor(defaultColumn: keyof T, defaultDirection: SortDirection = 'asc') {
    this.sortColumn.set(defaultColumn);
    this.sortDirection.set(defaultDirection);
  }

  setSort(column: keyof T) {
    if (this.sortColumn() === column) {
      this.sortDirection.set(this.sortDirection() === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortColumn.set(column);
      this.sortDirection.set('asc');
    }
  }

  sortArray(array: T[], accessor: SortAccessor<T>): T[] {
    const dir = this.sortDirection();
    return [...array].sort((a, b) => {
      let aVal = accessor(a);
      let bVal = accessor(b);
      // Convert Date objects and date strings to timestamps
      if (aVal instanceof Date) aVal = aVal.getTime();
      if (bVal instanceof Date) bVal = bVal.getTime();
      if (typeof aVal === 'string' && !isNaN(Date.parse(aVal))) aVal = new Date(aVal).getTime();
      if (typeof bVal === 'string' && !isNaN(Date.parse(bVal))) bVal = new Date(bVal).getTime();
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return 1;
      if (bVal == null) return -1;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return dir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return dir === 'asc' ? aVal - bVal : bVal - aVal;
      }
      return 0;
    });
  }
}
