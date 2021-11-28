export default class SortableTable {
  subElements = {};
  onClickSort = (e) => {
    if (!e.target.closest('.sortable-table__cell')) return;

    const sortableCell = e.target.closest('.sortable-table__cell');

    if (!e.currentTarget.contains(sortableCell)) return;
    if (sortableCell.dataset.sortable === 'false') return;

    const id = sortableCell.dataset.id;
    const order = (sortableCell.dataset.order === undefined || sortableCell.dataset.order !== 'asc') ? 'asc' : 'desc';

    this.sort(id, order);
  }

  constructor(headerConfig = [], {
    data = [],
    sorted = {}
  } = {}) {
    this.data = Array.isArray(data) ? data : data.data;
    this.headerConfig = headerConfig;
    const { id, order = '' } = sorted;

    this.render();
    this.sort(id, order);
    this.addEventListners();
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

  sort(field = '', order) {
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
      (el.dataset.id === field) ? el.dataset.order = order : el.dataset.order = '';
    }
  }

  addEventListners() {
    this.subElements.header.addEventListener('click', this.onClickSort)
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
    // уверен тут, что то страшное делаю)) буду смотреть ответ на лекции после ревью
    return data.map((productData) => {
      const productDataKeys = Object.keys(productData);
      const productCellArray = [];

      for (const { id, template = null } of this.headerConfig) {
        if (productDataKeys.includes(id)) {
          const productCell = template ? template(productData[id])
            : `<div class="sortable-table__cell">${productData[id]}</div>`;

          productCellArray.push(productCell);
        }
      }

      return `
        <a href="#" class="sortable-table__row">
          ${productCellArray.join('')}
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
    this.removeEventListener('click', this.onClickSort);
    this.element = null;
    this.subElements = {};
  }

  remove() {
    if (this.element) {
      return this.element.remove();
    }
  }
}

