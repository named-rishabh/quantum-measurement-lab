export default class InteractiveLab{
    constructor(device){
        this.element = document.createElement('div');
        this.device = device;
        this.firstvideo = true;
        if(this.device === 'mobile'){
            this.createMobile();
            this.eventListenerMobile();
        }
           
    };

    createMobile(){
        this.element.className = ` w-screen h-screen bg-background mt-25 text-text`;
        this.element.id = 'lab';
        this.element.innerHTML = `
        <div class='flex items-center justify-center'>
            <span class="px-4 py-1 rounded-full border border-border text-xs uppercase tracking-[0.3em] text-text text-center mb-2 mt-2">
                Laboratory
            </span>
        </div>
        <div class='h-[82vh] w-screen mb-2'>
            
            <video class='webgl inset-0 flex ml-2 bg-panel h-[80vh] w-[96vw] items-center justify-center rounded-b-lg object-cover'  autoplay muted loop playsinline>
                <source src="../assets/video/background-video.mp4" type="video/mp4">
            </video>
        </div>
        
        `
        document.body.appendChild(this.element);
    };

    createDesktop(){
        this.element.className = 'min-h-screen w-screen mt-4 flex flex-col justify-center items-center text-text';
        this.element.id = 'lab';
        this.element.innerHTML = `
        <span class="px-4 py-1 rounded-full border border-border text-xs uppercase tracking-[0.3em] mt-4 mb-2">
            Laboratory
        </span>
        <div class='canvas_wrapper min-h-[90vh] w-[80vw] mb-2'>
            <canvas class='webgl max-h-[90vh] max-w-[80vw] rounded-lg border-border'></canvas>
            <div class="flex pointer-events-none absolute left-4 top-4 z-10  text-sm text-text justify-end gap-2">
                <span class="rounded-md bg-black/60 px-3 py-1.5 backdrop-blur-sm">💡 <b>Scroll</b> to zoom/overview </span>
                <span class="rounded-md bg-black/60 px-3 py-1.5 backdrop-blur-sm"> <b>Double-click</b> for detailed exploration of lab</span>
            </div>
            
        </div>
    
        `
        document.body.appendChild(this.element);

        const canvasWrapper = this.element.querySelector('.canvas_wrapper');
        const canvas = this.element.querySelector('.webgl');

        return { canvasWrapper, canvas };
    };

    eventListenerMobile(){
        
    };

    eventListenerDesktop(){
        this.element.querySelector('.canvas_wrapper').addEventListener('dblclick', ()=>{ 
            if(window.location.pathname != "/lab.html" ){
                window.location.href = 'lab.html'
            }
        })
    };
};