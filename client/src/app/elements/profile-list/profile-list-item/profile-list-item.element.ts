import { Profile } from '../../../models/profile.model';
import { ProfileService } from '../../../services/profile.service';

const css = require('./profile-list-item.scss');

const template = document.createElement('template');
template.innerHTML = `
    <style>${css.toString()}</style>
    <div id="photo"></div>
    <span id="name"></span>
`;

export class CzProfileListItemElement extends HTMLElement {
    private profileService = ProfileService.getInstance();
    private name: HTMLElement;
    private photo: HTMLElement;

    constructor(public profile: Profile) {
        super();

        this.onUpdate = this.onUpdate.bind(this);

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    public connectedCallback() {
        this.name = this.shadowRoot.getElementById('name');
        this.photo = this.shadowRoot.getElementById('photo');
                
        this.profileService.addEventListener('updated', this.onUpdate);
        this.updateView();
    }

    public disconnectedCallback() {
        this.profileService.removeEventListener('updated', this.onUpdate);
    }

    private onUpdate(event) {
        if(event.detail._id === this.profile._id) {
            this.profile = event.detail;
            this.updateView();
        }
    }

    private updateView() {
        this.name.textContent = this.profile.name;
        this.photo.classList.add('icon', 'empty');
        this.photo.textContent = 'face';
    }
}

customElements.define('cz-profile-list-item', CzProfileListItemElement);