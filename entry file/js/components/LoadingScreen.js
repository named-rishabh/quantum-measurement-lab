export default class LoadingScreen {
    constructor(container) {
        this.container = container;
        this.element = document.createElement('div');
        this.element.className = 'loading-screen';
        this.element.innerHTML = `
            <div class="loading-spinner"></div>
            <div class="loading-text">Loading...</div>
        `;
        this.container.appendChild(this.element);
    }

    hide() {
        this.element.style.display = 'none';
    }
}
