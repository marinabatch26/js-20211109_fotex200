class Tooltip {
  showTooltip = (e) => {
    if (e.target.dataset.tooltip === undefined) return;

    this.render(e.target.dataset.tooltip);
  }

  hideTooltip = (e) => {
    if (e.target.dataset.tooltip === undefined) return;

    this.remove();
  }

  calcTooltipPosition = (e) => {
    if (e.target.dataset.tooltip === undefined) return;

    this.element.style.left = `${e.clientX + 10}px`;
    this.element.style.top = `${e.clientY + 10}px`;
  }

  constructor() {
    if (!Tooltip.instance) {
      Tooltip.instance = this;
    }

    return Tooltip.instance;
  }

  render(message) {
    // мы получается удаляем и пересоздаем элемент каждый раз по pointerover, решение не оптимально или это незначительно ?
    const element = document.createElement('div');
    element.innerHTML = `<div class="tooltip">${message}</div>`;
    this.element = element.firstElementChild;
    document.body.append(this.element);
  }

  initialize() {
    this.addEventListeners();
  }

  addEventListeners() {
    document.addEventListener('pointerover', this.showTooltip);
    document.addEventListener('pointerout', this.hideTooltip);
    document.addEventListener('pointermove', this.calcTooltipPosition);
  }

  remove() {
    if (this.element) {
      return this.element.remove();
    }
  }

  destroy() {
    return this.remove();
    document.removeEventListener('pointerover', this.showTooltip);
    document.removeEventListener('pointerout', this.hideTooltip);
    document.removeEventListener('pointerout', this.calcTooltipPosition);
    this.element = null;
  }
}

export default Tooltip;
