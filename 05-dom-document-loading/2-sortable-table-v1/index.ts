type SortOrder = 'asc' | 'desc';

type SortType = 'string' | 'number';

type RowData = Record<string, string | number>;

type TableData = RowData[];

type HeaderConfig = HeaderCellConfig[];



interface HeaderCellConfig {
  id: string
  title: string
  order?: SortOrder
  sortable?: boolean
  sortType?: SortType
  template?: (value: string | number) => string;
}



export default class SortableTable {

  public element: HTMLDivElement | null = null

  private header: HTMLDivElement | null = null

  private body: HTMLDivElement | null = null

  private sortArrow: HTMLSpanElement | null = null

  private columns: HeaderConfig

  private rows: TableData

  private name: string = 'products'



  constructor(header: HeaderConfig = [], data: TableData = []) {
    this.rows = structuredClone(data);
    this.columns = header.map(c => ({...c}));
    this.createTable();
  }



  public remove() {
    this.element?.remove();
  }

  public destroy() {
    this.remove();
    this.element = null;
    this.header = null;
    this.body = null;
    this.sortArrow = null;
  }



  public sort(field: string, order: SortOrder) {
    if (!this.element) throw new Error('No table');
    if (!this.body) throw new Error('No table body');

    const column = this.columns.find(c => c.sortable && c.id === field);

    if (!column) return;

    const type = column.sortType || 'string';
    const comp = this.compareRows.bind(this, order, type, field);

    this.rows.sort(comp);
    this.body.replaceChildren(this.createRows());
    this.updateHeaderSortArrow(field, order);
  }

  private compareRows(
    order: SortOrder,
    type: SortType,
    key: keyof RowData,
    a: RowData,
    b: RowData,
  ): number {
    const ord = order === 'asc' ? 1 : -1;
    const v1 = a[key];
    const v2 = b[key];

    switch (type) {
      case 'string':
        const s1 = String(v1);
        const s2 = String(v2);

        return s1.localeCompare(s2, ['ru', 'en'], {caseFirst: 'upper'}) * ord;

      case 'number':
        const n1 = Number(v1);
        const n2 = Number(v2);

        if (!isNaN(n1) && !isNaN(n2)) {
          if (n1 > n2) return ord;
          if (n1 < n2) return -ord;
        }

        return 0;
    }
  }

  private updateHeaderSortArrow(field: string, order: SortOrder) {
    if (!this.header) throw Error('No table header');

    this.sortArrow ??= this.createSortArrow();
    const cell1 = this.sortArrow.parentElement;

    if (cell1) {
      delete cell1.dataset.order;
      this.sortArrow.remove();
    }

    const cell2 = this.header.querySelector(`[data-id="${field}"]`);

    if (cell2 instanceof HTMLElement) {
      cell2.append(this.sortArrow);
      cell2.dataset.order = order;
    } else {
      throw Error('Invalid header cell');
    }
  }



  private createTable(): HTMLDivElement {
    const table = this.element = document.createElement('div');

    table.classList.add('sortable-table');
    table.append(this.createHeader());
    table.append(this.createBody());
    table.append(this.createLoading());
    table.append(this.createPlaceholder());

    return table;
  }

  private createHeader(): HTMLDivElement {
    const header = this.header = document.createElement('div');

    header.dataset.element = 'header';
    header.classList.add('sortable-table__row');
    header.classList.add('sortable-table__header');

    this.columns.forEach((c) => {
      header.append(this.createHeaderCell(c));
    });

    return header;
  }

  private createBody(): HTMLDivElement {
    const body = this.body = document.createElement('div');

    body.dataset.element = 'body';
    body.classList.add('sortable-table__body');
    body.append(this.createRows());

    return body;
  }

  private createRows(): DocumentFragment {
    const fragment = document.createDocumentFragment();

    this.rows.forEach(row => {
      fragment.append(this.createRow(row));
    });

    return fragment;
  }

  private createRow(data: RowData): HTMLAnchorElement {
    const row = document.createElement('a');

    row.href = `/${this.name}/${data.id}`
    row.dataset.element = 'row';
    row.classList.add('sortable-table__row');

    this.columns.forEach(column => {
      const key = column.id;
      const prp = data[key];
      const val = column?.template?.(prp) ?? String(prp);

      row.append(this.createCell(val));
    });

    return row;
  }

  private createLoading(): HTMLDivElement {
    const loading = document.createElement('div');

    loading.dataset.element = 'loading';
    loading.classList.add('sortable-table__loading-line');
    loading.classList.add('loading-line');

    return loading;
  }

  private createPlaceholder(): HTMLDivElement {
    const element = document.createElement('div');

    element.dataset.element = 'emptyPlaceholder';
    element.classList.add('sortable-table__empty-placeholder');

    element.innerHTML = /* html */ `
      <div>
        <p>No products satisfies your filter criteria</p>
        <button type="button" class="button-primary-outline">
          Reset all filters
        </button>
      </div>
    `;

    return element;
  }

  private createCell(html: string = ''): HTMLDivElement {
    const cell = document.createElement('div');

    cell.classList.add('sortable-table__cell');
    cell.innerHTML = html;

    return cell;
  }

  private createHeaderCell(config: HeaderCellConfig): HTMLDivElement {
    const {id, title, order, sortable, sortType} = config;
    const cell = this.createCell(`<span>${title}</span>`);

    cell.dataset.id = id;
    cell.dataset.sortable = String(!!sortable);
    cell.dataset.sortType = sortType || 'string';

    return cell;
  }

  private createSortArrow(): HTMLSpanElement {
    const arrow = this.sortArrow = document.createElement('span');

    arrow.dataset.element = 'arrow'
    arrow.classList.add('sortable-table__sort-arrow');
    arrow.innerHTML = '<span class="sort-arrow"></span>';

    return arrow;
  }
}
