export default class NotificationMessage {
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
    // ничего умнее не придумал, как обратиться к ДОМ, буду ждать разбора =\
    const notificationExist = document.querySelector('.notification');

    if (notificationExist) {
      notificationExist.remove();
    };

    el.append(this.element);
    setTimeout(() => this.destroy(), this.duration);
  }

  destroy() {
    return this.remove();
    this.element = null;
    this.subElements = {};
  }

  remove() {
    if (this.element) {
      return this.element.remove();
    }
  }
}
