import { createElement } from "../../shared/utils/create-element";


/** Функция форматирования заголовка диаграммы. */
type HeaderFormater = (v: number) => string;


/** Функция форматирования заголовка диаграммы по умолчанию. */
const DefaultHeaderFormater: HeaderFormater = (v: number) => String(v);


/** Стилевой класс для отображения состояния загрузки элемента. */
const LoadingStyleClass: string = 'column-chart_loading';


/** Параметры для создания новой диаграммы. */
interface Options {
  data?: number[]
  link?: string
  label?: string
  value?: number
  formatHeading?: HeaderFormater
}

export default class ColumnChart {
  /** Элемент диаграммы в дереве DOM. */
  public element: HTMLElement | null;

  /** Высота диаграммы. */
  public chartHeight: number

  constructor({
    data = [],
    link = '',
    label = '',
    value = 0,
    formatHeading = DefaultHeaderFormater,
  }: Options = {}) {
    this.chartHeight = 50;
    this.element = createElement(this.createChartHTML());

    this.update(data)
        .updateLink(link)
        .updateLabel(label)
        .updateHeader(value, formatHeading);
  }

  /** Обновить тело графика. */
  public update(data: number[]) {
    if (this.element === null) throw new Error('Element is not exist');

    if (!data.length) this.element.classList.add(LoadingStyleClass);
    else this.element.classList.remove(LoadingStyleClass);

    this.updateData(data);

    return this;
  }

  /** Удалить элемент компонента из DOM. */
  public remove() {
    this.element?.remove();

    return this;
  }

  /** Удалить компонент полностью и очистить память. */
  public destroy() {
    this.remove();
    this.element = null;

    return this;
  }

  // PRIVATE PART =================================================================================

  private createChartHTML(): string {
    return /* html */ `
      <div class="column-chart" style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          <span data-element="label">Label</span>
          <a href="123" class="column-chart__link">View all</a>
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header"></div>
          <div data-element="body" class="column-chart__chart"></div>
        </div>
      </div>
    `;
  }

  private createBar(value: string, tooltip: string): HTMLDivElement {
    const bar = document.createElement('div');

    bar.style.setProperty('--value', value);
    bar.dataset.tooltip = tooltip;

    return bar;
  }

  private updateLabel(label: string) {
    const lbl = this.element?.querySelector('[data-element="label"]');;

    if (!lbl) throw new Error('Wrong type of label node');

    lbl.textContent = label;

    return this;
  }

  private updateLink(path: string) {
    const lnk = this.element?.querySelector<HTMLAnchorElement>('.column-chart__link');

    if (!lnk) throw new Error('Wrong type of link node');

    lnk.href = path || '';
    lnk.hidden = !path;

    return this;
  }

  private updateHeader(value: number, format: HeaderFormater) {
    const hdr = this.element?.querySelector<HTMLDivElement>('.column-chart__header');

    if (!hdr) throw new Error('Wrong type of header node');

    hdr.textContent = format(value);

    return this;
  }

  private updateData(data: number[]): this {
    const body = this.element?.querySelector<HTMLDivElement>('.column-chart__chart');

    if (!body) throw new Error('Wrong type of chart node');

    body.innerHTML = '';

    if (!data.length) return this;

    const max = Math.max(...data);

    if (max <= 0) return this;

    const scale = this.chartHeight / max;

    data.forEach((itm) => {
      const val = Math.floor(itm * scale) + '';
      const ttp = (itm / max * 100).toFixed(0) + '%';
      return body.append(this.createBar(val, ttp));
    });

    return this;
  }
}
