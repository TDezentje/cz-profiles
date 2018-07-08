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

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    public connectedCallback() {
        this.name = this.shadowRoot.getElementById('name');
        this.photo = this.shadowRoot.getElementById('photo');
                
        this.updateView();
    }

    private updateView() {
        this.name.textContent = this.profile.name;


        if(this.profile.photo) {
            this.photo.style.backgroundImage = `url('${this.profile.photo}')`;
            this.photo.classList.remove('icon', 'empty');
            this.photo.textContent = '';
        } else {
            this.photo.style.backgroundImage = '';
            this.photo.classList.add('icon', 'empty');
            this.photo.textContent = 'face';
        }
    }
}

customElements.define('cz-profile-list-item', CzProfileListItemElement);