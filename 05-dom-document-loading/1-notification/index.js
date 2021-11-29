export default class NotificationMessage {
  static activeNotification;

  constructor(message = '', {
    duration = 1000,
    type = ''
  } = {}) {
    this.duration = duration;
    this.type = type;
    this.message = message;

    this.render();
  }

  get template() {
    return `
      <div class="notification ${this.type}" style="--value:${this.duration / 1000}s">
        <div class="timer"></div>
        <div class="inner-wrapper">
          <div class="notification-header">${this.type}</div>
          <div class="notification-body">
            ${this.message}
          </div>
        </div>
      </div>
    `;
  }


  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;
  }

  show(el = document.body) {
    if (NotificationMessage.activeNotification) {
      NotificationMessage.activeNotification.remove();
    }

    el.append(this.element);
    setTimeout(() => this.destroy(), this.duration);

    NotificationMessage.activeNotification = this;
  }

  destroy() {
    this.element = null;
    this.subElements = {};
    return this.remove();
  }

  remove() {
    if (this.element) {
      return this.element.remove();
    }
  }
}
