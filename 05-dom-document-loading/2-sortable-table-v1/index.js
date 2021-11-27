export default class SortableTable {
  subElements = {};

  constructor(headerConfig = [], data = []) {
    this.data = Array.isArray(data) ? data : data.data;
    this.headerConfig = headerConfig;

    this.render();
  }

  get template() {
    return `
      <div class="sortable-table">
        <div data-elem="header" class="sortable-table__header sortable-table__row">
          ${this.getTableHeader()}
        </div>
        <div data-elem="body" class="sortable-table__body">
          ${this.getTableBody(this.data)}
        </div>
      </div>
    `;
  }

  render() {
    const element = document.createElement('div');
    element.innerHTML = this.template;
    this.element = element.firstElementChild;

    this.subElements = this.getSubElements(this.element);
  }

  sort(field = '', order = 'asc') {
    const directions = {
      'asc': 1,
      'desc': -1
    };

    const sortTypeObj = {
      string: (string1, string2) => {
        return direction * string1[field].localeCompare(string2[field], ['ru', 'en'], {caseFirst: 'upper'});
      },
      number: (a, b) => direction * (a[field] - b[field]),
    };

    const fieldSortType = this.headerConfig.find(item => item.id === field);
    const direction = directions[order];
    const sortedData = [...this.data].sort(sortTypeObj[fieldSortType?.sortType]);

    this.subElements.body.innerHTML = this.getTableBody(sortedData);
    this.setHeaderDirectionArrow(field, order);
  }

  setHeaderDirectionArrow(field, order) {
    const elements = this.subElements.header.querySelectorAll("[data-id]");

    for (const el of elements) {
      el.dataset.order = '';
      if (el.dataset.id === field) el.dataset.order = order;
    }
  }

  getTableHeader() {
    return this.headerConfig.map(({
      id = '',
      title = '',
      sortable,
      order = ''
    } = headerData) => {
      const sortableArrow = sortable ? `
          <span data-element="arrow" class="sortable-table__sort-arrow">
            <span class="sort-arrow"></span>
          </span>
      ` : '';

      return `
        <div class="sortable-table__cell" data-id="${id}" data-sortable="${sortable}" data-order="${order}">
          <span>${title}</span>
          ${sortableArrow}
        </div>

      `
    }).join('');
  }

  getTableBody(data) {
    return data.map(({
      title = '',
      images = [],
      quantity = 0,
      price = 0,
      sales = 0
    } = productData) => {
      const productImageUrl = images[0]?.url || '';
      return `
        <a href="#" class="sortable-table__row">
          <div class="sortable-table__cell">
            <img class="sortable-table-image" alt="Image" src="${productImageUrl}">
          </div>
          <div class="sortable-table__cell">${title}</div>

          <div class="sortable-table__cell">${quantity}</div>
          <div class="sortable-table__cell">${price}</div>
          <div class="sortable-table__cell">${sales}</div>
        </a>
      `
    }).join('');
  }

  getSubElements(element) {
    const result = {};
    const elements = element.querySelectorAll('[data-elem]');

    for (const subElement of elements) {
      const name = subElement.dataset.elem;
      result[name] = subElement;
    }

    return result;
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

