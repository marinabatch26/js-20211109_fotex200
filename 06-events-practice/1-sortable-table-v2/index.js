export default class SortableTable {
  subElements = {};
  isSortLocally = true;
  onClickSort = (e) => {
    if (!e.target.closest('.sortable-table__cell')) return;

    const sortableCell = e.target.closest('.sortable-table__cell');

    if (!e.currentTarget.contains(sortableCell)) return;
    if (sortableCell.dataset.sortable === 'false') return;

    const id = sortableCell.dataset.id;
    const order = e.currentTarget.querySelectorAll('[data-order="asc"]').length ? 'desc' : 'asc';

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

  sort(field, order) {
    if (this.isSortLocally) {
      this.sortOnClient(field, order);
    } else {
      this.sortOnServer();
    }
  }

  sortOnClient(field, order) {
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

  sortOnServer() {
    //TODO: Future homework
  }

  setHeaderDirectionArrow(field, order) {
    const elements = this.subElements.header.querySelectorAll("[data-id]");

    for (const el of elements) {
      (el.dataset.id === field) ? el.dataset.order = order : el.dataset.order = '';
    }
  }

  addEventListners() {
    this.subElements.header.addEventListener('pointerdown', this.onClickSort)
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
    return data.map((productData) => {
      return `
        <a href="#" class="sortable-table__row">
          ${this.getTableBodyCell(productData)}
        </a>
      `
    }).join('');
  }

  getTableBodyCell(productData) {
    const productDataKeys = Object.keys(productData);
    const productCellArray = [];

    for (const { id, template = null } of this.headerConfig) {
      if (productDataKeys.includes(id)) {
        const productCell = template ? template(productData[id])
          : `<div class="sortable-table__cell">${productData[id]}</div>`;

        productCellArray.push(productCell);
      }
    }

    return productCellArray.join('');
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
    // не хочется вешать обработчик на документ или это не принципиально? Если можно, тогда не будет проблем снимать
    // не хотелось обращаться в DOM и записывать обработчик в переменную, но удаление ниже вызывает ошибку тестов
    // this.subElements.header.removeEventListener('pointerdown', this.onClickSort);
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

