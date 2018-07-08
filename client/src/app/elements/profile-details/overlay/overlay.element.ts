const css = require('./overlay.scss');

const template = document.createElement('template');
template.innerHTML = `
    <style>${css.toString()}</style>
    <div id="drop-files" class="dropping-files hidden">
        <span class="icon">file_upload</span>
        <div class="title">Upload foto</div>
    </div>
`;

export class CzOverlayElement extends HTMLElement {
    public fileListener;
    private dropFileElement: HTMLElement;

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

        this.dropFileElement = this.shadowRoot.getElementById('drop-files')
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