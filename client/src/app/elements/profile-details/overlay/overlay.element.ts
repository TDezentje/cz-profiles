const css = require('./overlay.scss');

const template = document.createElement('template');
template.innerHTML = `
    <style>${css.toString()}</style>
    <div id="drop-files" class="dropping-files hidden">
        <span class="icon">file_upload</span>
        <div class="title">Upload foto</div>
    </div>
    <div class="toast-container">
        <div id="toast" class="hidden"></div>
    </div>
`;

export class CzOverlayElement extends HTMLElement {
    public fileListener;
    private dropFileElement: HTMLElement;
    private toast: HTMLElement;

    constructor() {
        super();

        this.onDrop = this.onDrop.bind(this);
        this.onDragEnter = this.onDragEnter.bind(this);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);

        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }


    public connectedCallback() {
        document.addEventListener('dragenter', this.onDragEnter);
        this.addEventListener('drop', this.onDrop);
        this.addEventListener('dragover', this.onDragOver);
        this.addEventListener('dragleave', this.onDragLeave);

        this.toast = this.shadowRoot.getElementById('toast');
        this.dropFileElement = this.shadowRoot.getElementById('drop-files')
    }

    public async showToast(text: string) {
        this.toast.textContent = text;
        this.toast.classList.remove('hidden');
    }

    public async finishToast(text: string) {
        this.toast.textContent = text;
        setTimeout(() => {
            this.toast.classList.add('hidden');
        }, 1000);
    }

    private onDrop(e) {
        if (this.fileListener) {
            e.preventDefault();
            this.fileListener(e.dataTransfer.files);
            this.hideDropFileOverlay();
        }
    }

    private onDragEnter(e) {
        var me = this;

        if (this.fileListener) {
            e.preventDefault();
            this.classList.add('interactive');
            this.dropFileElement.classList.remove('hidden');
        }
    }

    private onDragOver(e) {
        if (this.fileListener) {
            e.preventDefault();
        }
    }

    private onDragLeave(e) {
        if (this.fileListener) {
            e.preventDefault();

            if (this.dropFileElement) {
                this.hideDropFileOverlay();
            }
        }
    }

    private hideDropFileOverlay() {
        this.dropFileElement.classList.add('hidden');
        this.classList.remove('interactive');
    }
}

customElements.define('cz-overlay', CzOverlayElement);