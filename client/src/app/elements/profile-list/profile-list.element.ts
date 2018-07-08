import './profile-list-item/profile-list-item.element';

import { ProfileService } from '../../services/profile.service';
import { CzProfileListItemElement } from './profile-list-item/profile-list-item.element';
import { Profile } from '../../models/profile.model';

const css = require('./profile-list.scss');

const template = document.createElement('template');
template.innerHTML = `
    <style>${css.toString()}</style>
    <div class="toolbar">
        <span>Profielen</span>
        <div id="add-button" class="icon">add</div>
    </div>
    <div id="list" class="list">
    </div>
`;

export class CzProfileListElement extends HTMLElement {
    private profileService = ProfileService.getInstance();
    private addButton: HTMLElement;
    private list: HTMLElement;
    private profiles: Profile[];

    constructor() {
        super();

        this.onDelete = this.onDelete.bind(this);
        this.refresh = this.refresh.bind(this);
        this.onAddClick = this.onAddClick.bind(this);
        this.onItemClick = this.onItemClick.bind(this);
        this.onPopState = this.onPopState.bind(this);
        
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    public async connectedCallback() {
        this.list = this.shadowRoot.getElementById('list');
        this.addButton = this.shadowRoot.getElementById('add-button');
        this.addButton.addEventListener('click', this.onAddClick);

        this.profileService.addEventListener('created', this.refresh);
        this.profileService.addEventListener('deleted', this.onDelete);

        await this.refresh();

        window.addEventListener('popstate', this.onPopState);
        this.onPopState();
    }

    private onPopState() {
        if(location.pathname === '/new') {
            this.dispatchEvent(new Event('addclick'));
        } else if(location.pathname !== '/') {
            const id = location.pathname.substr(1);
            const profile = this.profiles.find(p => p._id === id);
            if(profile) {
                this.dispatchEvent(new CustomEvent('itemclick', {
                    detail: profile
                }));
            }
        }
    }

    private onDelete(event) {
        const index = this.profiles.findIndex(p => p._id === event.detail);
        this.profiles.splice(index, 1);
        
        this.list.removeChild(this.list.children.item(index));
    }

    private async refresh() {
        this.profiles = await this.profileService.list();
        this.renderProfiles();
    }

    private renderProfiles() {
        let child;
        while((child = this.list.firstChild)) {
            this.list.removeChild(child);
        }

        const fragment = document.createDocumentFragment();
        for(const profile of this.profiles) {
            const node = new CzProfileListItemElement(profile);
            node.addEventListener('click', this.onItemClick);
            fragment.appendChild(node);
        }
        this.list.appendChild(fragment);
    }

    private onItemClick(event) {
        event.preventDefault();
        this.dispatchEvent(new CustomEvent('itemclick', {
            detail: event.target.profile
        }));
        history.pushState(undefined, '', `/${event.target.profile._id}`);
    }

    private onAddClick(event) {
        event.preventDefault();
        this.dispatchEvent(new Event('addclick'));
        history.pushState(undefined, '', '/new');
    }
}

customElements.define('cz-profile-list', CzProfileListElement);