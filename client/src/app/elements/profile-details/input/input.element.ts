const css = require('./input.scss');

const template = document.createElement('template');
template.innerHTML = `
    <style>${css.toString()}</style>
`;

export class CzInputElement extends HTMLElement {
    private input: HTMLTextAreaElement | HTMLInputElement;

    constructor() {
        super();

        this.onInput = this.onInput.bind(this);

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }

    public set value(val) {
        this.input.value = val;
        this.onInput();
    }

    public get value() {
        return this.input.value;
    }

    public get name() {
        return this.input.name;
    }

    public get required() {
        return this.input.hasAttribute('required');
    }

    public connectedCallback() {
        const type = this.getAttribute('type');
        const name = this.getAttribute('name');
        const required = this.hasAttribute('required');

        let label = document.createElement('label');
        label.textContent = `${this.getAttribute('label')}${required? '*' :''}`;
        label.htmlFor = name;

        if(type === 'textarea') {
            this.input = document.createElement('textarea');
        } else {
            this.input = document.createElement('input');
            this.input.type = type;
            this.input.setAttribute('autocomplete', 'off');
        }

        this.input.id = name;
        this.input.name = name;
        this.input.value = this.getAttribute('value');
        if(required) {
            this.input.setAttribute('required', '');
        }

        this.shadowRoot.appendChild(this.input);
        this.shadowRoot.appendChild(label);

        this.input.addEventListener('input', this.onInput);
    }

    public showError(){
        this.input.classList.add('error');
    }

    private onInput() {
        this.input.classList.remove('error');
        if(this.input.value) {
            this.input.classList.add('has-value');
        } else {
            this.input.classList.remove('has-value');
        }
    }
}

customElements.define('cz-input', CzInputElement);