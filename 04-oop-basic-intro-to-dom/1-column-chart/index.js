export default class ColumnChart {
  element;
  subElements = {};
  chartHeight = 50;

  constructor({
    data = [],
    label = '',
    link = '',
    value = 0,
    formatHeading = (value) => value
  } = {}) {
    this.data = data;
    this.label = label;
    this.link = link;
    this.value = value;
    this.formatHeading = formatHeading(value);
    this.render();
  }

  get template() {
    return `
      <div class="column-chart column-chart_loading">
        <div id="title" class="column-chart__title">
          Total ${this.label}
          ${this.renderLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.formatHeading}</div>
          <div data-element="body" class="column-chart__chart">
            ${this.renderBody(this.data)}
          </div>
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;

    if (this.data.length) {
      this.element.classList.remove('column-chart_loading');
    }

    this.subElements = this.getSubElements(this.element);
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-element]');

    for (const subElement of elements) {
      const name = subElement.dataset.element;
      result[name] = subElement;
    }

    return result;
  }

  renderBody(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;

    return data.map((item) => {
      const percent = (item / maxValue * 100).toFixed(0) + '%';

      return item = `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}"></div>`;
    }).join('');
  }

  renderLink() {
    return this.link ? `<a href="${this.link}" class="column-chart__link">View All</a>` : '';
  }

  update(data) {
    this.subElements.body.innerHTML = this.renderBody(data);
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
