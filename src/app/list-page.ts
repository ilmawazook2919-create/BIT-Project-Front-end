export class ListPage {
  page = 1;
  pageSize = 8;
  searchText = '';

  private found(list: any[] | null | undefined): any[] {
    const rows = list || [];
    const query = (this.searchText || '').toLowerCase();
    const matched = query
      ? rows.filter(row => JSON.stringify(row ?? '').toLowerCase().includes(query))
      : rows;
    const pages = Math.max(1, Math.ceil(matched.length / this.pageSize));
    if (this.page > pages) {
      this.page = pages;
    }
    return matched;
  }

  rows(list: any[] | null | undefined): any[] {
    const matched = this.found(list);
    const start = (this.page - 1) * this.pageSize;
    return matched.slice(start, start + this.pageSize);
  }

  pageCount(list: any[] | null | undefined): number {
    return Math.max(1, Math.ceil(this.found(list).length / this.pageSize));
  }

  showing(list: any[] | null | undefined): string {
    const total = this.found(list).length;
    if (!total) {
      return 'No records';
    }
    const start = (this.page - 1) * this.pageSize + 1;
    const end = Math.min(this.page * this.pageSize, total);
    return start + '–' + end + ' of ' + total;
  }

  previous(): void {
    this.page = Math.max(1, this.page - 1);
  }

  next(list: any[] | null | undefined): void {
    this.page = Math.min(this.pageCount(list), this.page + 1);
  }
}
