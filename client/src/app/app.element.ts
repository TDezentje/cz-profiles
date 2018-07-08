import './elements/profile-details/profile-details.element';
import './elements/profile-list/profile-list.element';
import { CzProfileDetailsElement } from './elements/profile-details/profile-details.element';
import { CzProfileListElement } from './elements/profile-list/profile-list.element';

const css = require('./app.scss');

const template = document.createElement('template');
template.innerHTML = `
    <style>${css.toString()}</style>
    <cz-profile-list></cz-profile-list>
    <cz-profile-details></cz-profile-details>
`;

customElements.define('cz-app', class extends HTMLElement {
    private profileDetailsElement: CzProfileDetailsElement;
    private profileListElement: CzProfileListElement;

    constructor() {
        super();

        this.onAddClick = this.onAddClick.bind(this);
        this.onItemClick = this.onItemClick.bind(this);

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    public connectedCallback() {
        this.profileListElement = this.shadowRoot.querySelector('cz-profile-list');
        this.profileDetailsElement = this.shadowRoot.querySelector('cz-profile-details');

        this.profileListElement.addEventListener('addclick', this.onAddClick);
        this.profileListElement.addEventListener('itemclick', this.onItemClick);
    }

    private onItemClick(event) {
        this.profileDetailsElement.showProfile(event.detail);
    }

    private onAddClick() {
        this.profileDetailsElement.createNewProfile();
    }
});