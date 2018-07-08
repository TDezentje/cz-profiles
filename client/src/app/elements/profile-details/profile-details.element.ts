import '../input/input.element';
import { CzInputElement } from '../input/input.element';
import { Profile } from '../../models/profile.model';
import { ProfileService } from '../../services/profile.service';

const css = require('./profile-details.scss');

const template = document.createElement('template');
template.innerHTML = `
    <style>${css.toString()}</style>
    <div id="no-content" class="no-content">
        <span>Selecteer of maak een nieuw profiel</span>
    </div>
    <form id="form" class="content hidden">
        <div class="photo-container">
            <div class="photo">
                <div class="icon">cloud_upload</div>
            </div>
        </div>
        <cz-input type="text" name="name" label="Naam" required></cz-input>
        <cz-input type="text" name="functionTitle" label="Functie" required></cz-input>
        <cz-input type="date" name="birthdate" label="Geboortedatum" required></cz-input>
        <cz-input type="text" name="address" label="Adres" required></cz-input>
        <cz-input type="textarea" name="biography" label="Biografie"></cz-input>
        <div class="button-container"><button id="remove-button">Verwijderen</button><button id="save-button">Opslaan</button></div>
    </form>
`;

export class CzProfileDetailsElement extends HTMLElement {
    private profileService = ProfileService.getInstance();
    private form: HTMLFormElement;
    private noContent: HTMLElement;
    private model: Profile;
    
    constructor() {
        super();

        this.onSubmit = this.onSubmit.bind(this);
        this.onRemove = this.onRemove.bind(this);

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    public async connectedCallback() {
        this.noContent = this.shadowRoot.getElementById('no-content');
        this.form = <HTMLFormElement>this.shadowRoot.getElementById('form');

        this.shadowRoot.getElementById('save-button').addEventListener('click', this.onSubmit);
        this.shadowRoot.getElementById('remove-button').addEventListener('click', this.onRemove);
    }

    public async createNewProfile() {
        await this.hideContent();
        this.model = new Profile();
        this.updateFieldsWithModel();
        this.form.classList.remove('hidden');
    }

    public async showProfile(profile: Profile) {
        if(this.model && profile._id === this.model._id) {
            return;
        }

        await this.hideContent();
        this.model = profile;
        this.updateFieldsWithModel();
        
        this.form.classList.remove('hidden');
    }

    private updateFieldsWithModel() {
        const inputs: CzInputElement[] = this.form.querySelectorAll('cz-input') as any;
        for (const input of Array.from(inputs)) {
            const value = this.model[input.name];
            if(value instanceof  Date) {
                input.value = this.dateToInputValue(value);
            } else {
                input.value =  value || '';
            }
            
        }
    }

    private dateToInputValue(date: Date) {
        if (!date) {
            return '';
        }
    
        const d = date.getDate();
        const m = date.getMonth() + 1;
        const y = date.getFullYear();
    
        return `${y}-${m <= 9 ? `0${m}` : m}-${d <= 9 ? `0${d}` : d}`;
    }

    private async hideContent() {
        if(this.model){
            this.form.classList.add('hidden');
            await new Promise(r => setTimeout(r, 600));
        } else {
            this.noContent.classList.add('hidden');
            await new Promise(r => setTimeout(r, 200));
        }
    }

    private async onRemove(event) {
        event.preventDefault();
        if(this.model._id) {
            await this.profileService.delete(this.model);
        }

        await this.hideContent();
        this.model = undefined;
        this.noContent.classList.remove('hidden');
    }

    private async onSubmit(event) {
        event.preventDefault();
        let isValid = true;

        const inputs: CzInputElement[] = this.form.querySelectorAll('cz-input') as any;
        for (const input of Array.from(inputs)) {
            const value = input.value;
            if(input.required && !value) {
                input.showError();
                isValid = false;
            } else {            
                this.model[input.name] = input.value;
            }
        }

        if(isValid){

            if(this.model._id){
                this.profileService.update(this.model);
            } else {
                const model = await this.profileService.create(this.model);
                this.model._id = model._id;
            }
        }
    }
}

customElements.define('cz-profile-details', CzProfileDetailsElement);