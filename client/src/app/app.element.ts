const css = require('./app.scss');

const template = document.createElement('template');
template.innerHTML = `
    <style>${css.toString()}</style>
    <span class="name"></span>
`;

customElements.define('cz-app', class extends HTMLElement {
    constructor() {
        super();

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    public async connectedCallback() {
        const request = await fetch('/api/profiles');
        const result = await request.json();

        this.shadowRoot.querySelector('.name').textContent = result[0].name;
    }
});