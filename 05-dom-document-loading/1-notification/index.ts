import { createElement } from "../../shared/utils/create-element";



/** Тип, допустимый для уведомления. */
type NotificationType = 'success' | 'error';



/** Настройки уведомления по умолчанию. */
const defaultOptions = {
  duration: 2000, // ms
  type: 'success' as NotificationType,
};



/** Настройки для всплывающего уведомления. */
interface Options {
  /** Длительность показа в миллисекундах. */
  duration?: number

  /** Тип уведомления. */
  type?: NotificationType
}



/**
 * Всплывающее уведомление, которое появляется на странице
 * и автоматически исчезает через заданное время.
 * @param message - Строка с текстом сообщения.
 * @param options - Объект с настройками.
 */
export default class NotificationMessage {

  /** Активное уведомление. */
  static active: NotificationMessage

  /** DOM-элемент компонента. */
  public element: HTMLElement | null

  /** Длительность показа в милисекундах. */
  private duration: number = defaultOptions.duration

  /** Запущенный таймер до исчезновения. */
  private timerID: number = 0



  /**
   * На странице может отображаться только одно уведомление. Если попытаться
   * создать еще одно, тогда существующее будет автоматически удалено.
   */
  constructor(message: string, {
    duration = defaultOptions.duration,
    type = defaultOptions.type
  }: Options = defaultOptions) {
    if (NotificationMessage.active) NotificationMessage.active.remove();

    const html = createStaticHTML(
      duration / 1000 + 's',
      type,
      type,
      message
    );

    this.duration = duration;
    this.element = createElement(html);

    NotificationMessage.active = this;
  }



  /**
   * Отображает уведомление на странице.
   * @param target - Место, куда нужно добавить уведомление.
   */
  public show(target: HTMLElement = document.body): void {
    if (!this.element) throw Error('No element');

    target.append(this.element);

    this.timerID = setTimeout(() => this.remove(), this.duration);
  }



  /**
   * Удалить элемент уведомления из DOM.
   */
  public remove(): void {
    clearTimeout(this.timerID);

    this.timerID = 0;
    this.element?.remove();
  }



  /**
   * Удалить компонент полностью и очистить память.
   */
  public destroy(): void {
    this.remove();
    this.element = null;
  }
}



function createStaticHTML(
  duration: string,
  header: string,
  type: string,
  text: string,
): string {
  return /* html */ `
  <div class="notification ${type}" style="--value: ${duration}">
    <div class="timer"></div>
    <div class="inner-wrapper">
      <div class="notification-header">${header}</div>
      <div class="notification-body">${text}</div>
    </div>
  </div>
  `;
}
