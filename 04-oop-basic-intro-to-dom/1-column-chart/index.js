export default class ColumnChart {
  constructor(options = {}) {
    this.options = options;
    this.chartHeight = 50;
    this.render();
  }

  render() {
    const { data = [], label, value, link, formatHeading = (value) => value} = this.options;
    const loading = (data.length === 0) ? true : false;

    const element = document.createElement('div');
    element.className = `${loading ? 'column-chart column-chart_loading' : 'column-chart'}`
    element.innerHTML = `
        <div id="title" class="column-chart__title">
          Total ${label ? label : ''}
          ${link ? this.renderLink(link) : ''}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${formatHeading(value)}</div>
          <div data-element="body" class="column-chart__chart"></div>
        </div>
    `;

    this.element = element;
    this.renderBody(data);
  }

  renderBody(data) {
    const columnProps = this.getColumnProps(data);
    const chartBodyHtml = data.reduce((acc, current, index) => {
      return (
        acc + `<div style="--value: ${columnProps[index].value}" data-tooltip="${columnProps[index].percent}"></div>`
      )
    }, '');

    this.element.querySelector('.column-chart__chart').insertAdjacentHTML('afterbegin', chartBodyHtml);
  }

  renderLink(link) {
    return `<a href="${link}" class="column-chart__link">View All</a>`
  }

  getColumnProps(data) {
    const maxValue = Math.max(...data);
    const scale = 50 / maxValue;

    return data.map(item => {
      return {
        percent: (item / maxValue * 100).toFixed(0) + '%',
        value: String(Math.floor(item * scale))
      };
    });
  }

  update(newData) {
    this.element.querySelector('.column-chart__chart').innerHTML = '';
    this.renderBody(newData);
  }

  destroy() {
    return this.element.remove();
    // ? тесты требовали, возможно что то не дописал, но вроде как работает
  }

  remove() {
    return this.element.remove();
  }
}
