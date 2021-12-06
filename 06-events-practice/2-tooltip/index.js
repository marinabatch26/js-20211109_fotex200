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
    const TOOLTIP_MARGIN = 10;

    this.element.style.left = `${e.clientX + TOOLTIP_MARGIN}px`;
    this.element.style.top = `${e.clientY + TOOLTIP_MARGIN}px`;
  }

  constructor() {
    if (!Tooltip._instance) {
      Tooltip._instance = this;
    }

    return Tooltip._instance;
  }

  render(message) {
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
    document.removeEventListener('pointerover', this.showTooltip);
    document.removeEventListener('pointerout', this.hideTooltip);
    document.removeEventListener('pointermove', this.calcTooltipPosition);
    this.element = null;
    return this.remove();
  }
}

export default Tooltip;
