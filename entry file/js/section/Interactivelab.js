import { generateMenuHTML } from '../explorationlab/menu.js';

export default class InteractiveLab {
    constructor(device, mode = 'exploration') {
        this.element = document.createElement('div');
        this.device = device;
        this.mode = mode;
        this.firstvideo = true;
        
        if (this.device === 'mobile') {
            this.createMobile();
            this.eventListenerMobile();
        } else if (this.device === 'desktop') {
            this.createDesktop();
            this.eventListenerDesktop();
            this.initMenuEventListeners();
        }
    }

    createMobile() {
        this.element.className = `w-screen h-screen bg-background text-text`;
        this.element.id = 'lab';
        this.element.innerHTML = `
        <div class='flex items-center justify-center'>
            <span class="px-4 py-1 rounded-full border border-border text-xs uppercase tracking-[0.3em] text-text text-center mb-2 mt-2">
            Laboratory
            </span>
            <div class='h-[82vh] w-screen mb-2'>
                <video class='webgl inset-0 flex ml-2 bg-panel h-[80vh] w-[96vw] items-center justify-center rounded-b-lg object-cover' autoplay muted loop playsinline>
                    <source src="../assets/video/background-video.mp4" type="video/mp4">
                </video>
            </div>
        </div>
        `;
        document.body.appendChild(this.element);
    }

    createDesktop() {
        this.element.className = 'min-h-screen w-screen top-0 left-0 text-text';
        this.element.id = 'lab';
        
        const isLabPage = window.location.pathname.endsWith('lab.html') || window.location.pathname.includes('/lab');
        const isIndexPage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/';

        this.element.innerHTML = `
        <div class='canvas_wrapper h-full w-full flex flex-col items-center text-text relative'>
            <span class="rounded-full border border-border text-xs uppercase tracking-[0.3em] mb-4 px-4 py-1 -mt-10">
                Laboratory - ${this.mode}
            </span>
            <div class='relative min-h-[90vh] w-[80vw] mb-2'>
                <canvas class='webgl max-h-[90vh] max-w-[80vw] rounded-lg border-border'></canvas>
                
                ${isIndexPage ? 
                    `
                    <div class="flex pointer-events-none absolute left-4 top-4 z-10 text-sm text-text justify-end gap-2">
                        <span class="rounded-md bg-black/60 px-3 py-1.5 backdrop-blur-sm">💡 <b>Scroll</b> to zoom/overview </span>
                        <span class="rounded-md bg-black/60 px-3 py-1.5 backdrop-blur-sm"> <b>Double-click</b> for detailed exploration of lab</span>
                    </div>
                    ` : ''}   
            </div>
            ${isLabPage ? generateMenuHTML(this.mode) : ''}
        <span class="px-4 py-1 rounded-full border border-border text-xs uppercase tracking-[0.3em] mt-4 mb-2">
            Laboratory - ${this.mode}
        </span>
        <div class='canvas_wrapper relative min-h-[90vh] w-[80vw] mb-2'>
            <canvas class='webgl max-h-[90vh] max-w-[80vw] rounded-lg border-border'></canvas>
            
            <div class="flex pointer-events-none absolute left-4 top-4 z-10 text-sm text-text justify-end gap-2">
                <span class="rounded-md bg-black/60 px-3 py-1.5 backdrop-blur-sm">💡 <b>Scroll</b> to zoom/overview </span>
                <span class="rounded-md bg-black/60 px-3 py-1.5 backdrop-blur-sm"> <b>Double-click</b> for detailed exploration of lab</span>
            </div>

            <!-- Generate and inject the menu HTML based on current mode -->
            ${window.location.pathname === '/lab.html' ? generateMenuHTML(this.mode) : ''}
            
        </div>
        `;
        
        document.body.appendChild(this.element);

        const canvasWrapper = this.element.querySelector('.canvas_wrapper');
        const canvas = this.element.querySelector('.webgl');

        return { canvasWrapper, canvas };
    }

    eventListenerMobile() {
        // Mobile listener code
    }

    eventListenerDesktop() {
        this.element.querySelector('.canvas_wrapper').addEventListener('dblclick', () => { 
            if (!window.location.pathname.endsWith('lab.html')) {
                window.location.href = 'lab.html';
            }
        });
    }

    initMenuEventListeners() {
    document.body.addEventListener('click', (e) => {
        const item = e.target.closest('.group-title, .menu-item');
        if (!item) return;

        const descTitle = document.querySelector('#desc-title');
        const descContent = document.querySelector('#desc-content');

        if (descTitle && descContent) {
            descTitle.textContent = item.textContent.trim();
            descContent.textContent = item.getAttribute('data-desc') || '';
        }
    });
}
}