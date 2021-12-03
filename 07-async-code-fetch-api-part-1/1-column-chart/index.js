import fetchJson from './utils/fetch-json.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChart {
  element;
  subElements = {};
  chartHeight = 50;

  constructor({
    url = '',
    range = {},
    data = [],
    label = '',
    link = '',
    value = 0,
    formatHeading = (value) => value
  } = {}) {
    this.url = url;
    this.data = data;
    this.label = label;
    this.link = link;


    this.data = this.loadData(range.from, range.to);
    // this.formatHeading = formatHeading(value);
    this.render();

  }

  async loadData(from, to) {
    const response = await fetchJson(`${BACKEND_URL}/${this.url}?from=${from}&to=${to}`);
    const dataValuesArr = Object.values(response);
    const total = dataValuesArr.reduce((acc, item) => acc + item, 0);
    return {
      response,
      dataValuesArr,
      total,
      arr: Object.entries(response)
    }
  }

  get template() {
    return `
      <div class="column-chart column-chart_loading">
        <div id="title" class="column-chart__title">
          Total ${this.label}
          ${this.renderLink()}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">
            ${this.data.then(({ total } = data) => {
              console.log(total);
              this.formatHeading(total);
            })}
          </div>
          <div data-element="body" class="column-chart__chart">
            ${this.data.then(({ dataValuesArr } = data) => {
              this.renderBody(dataValuesArr);
            })}
          </div>
        </div>
      </div>
    `;
  }

  formatHeading(value) {
    this.subElements.header.innerHTML = value;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;

    this.data.then(({ dataValuesArr } = data) => {
      if (dataValuesArr.length) {
        this.element.classList.remove('column-chart_loading');
      }
    })

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

  renderBody(data = []) {
      const maxValue = Math.max(...data);
      const scale = 50 / maxValue;

      this.subElements.body.innerHTML = data.map((item) => {
        const percent = (item / maxValue * 100).toFixed(0) + '%';

        return item = `<div style="--value: ${Math.floor(item * scale)}" data-tooltip="${percent}"></div>`;
      }).join('');
  }

  renderLink() {
    return this.link ? `<a href="${this.link}" class="column-chart__link">View All</a>` : '';
  }

  update(from, to) {
    this.loadData(from, to).then(data => {

      this.subElements.body.innerHTML = this.renderBody(data);
    });
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
