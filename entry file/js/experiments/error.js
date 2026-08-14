export default class DeviceError {
    constructor(device) {
        this.device = device;
        this.element = document.createElement('div');

        if (this.device === 'mobile') {
            this.createMobile();
            this.eventListenerMobile();
        } 
        
    }

    createMobile() {
        this.element.innerHTML = `
        <div id="device-error" class="min-h-screen flex flex-col justify-center items-center px-6 bg-background text-text py-12 select-none">
            
            <!-- Badge -->
            <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <span class="w-2 h-2 rounded-full bg-red-400"></span>
                Desktop Required
            </span>

            <!-- Monitor / Laptop Icon -->
            <div class="mt-8 p-5 rounded-3xl bg-panel border border-border flex items-center justify-center shadow-lg">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-14 h-14 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                    <rect width="20" height="14" x="2" y="3" rx="2"></rect>
                    <line x1="8" x2="16" y1="21" y2="21"></line>
                    <line x1="12" x2="12" y1="17" y2="21"></line>
                </svg>
            </div>

            <!-- Title & Description -->
            <h2 class="mt-8 text-center text-3xl font-google font-bold tracking-tight">
                Switch to a
                <span class="text-primary">Laptop or PC</span>
            </h2>

            <p class="mt-4 text-center text-base text-muted-foreground leading-7 max-w-md">
                This quantum visualization relies on high-fidelity WebGL shaders, real-time 3D assemblies, and complex GPU instancing optimized for large screens and desktop performance.
            </p>

            <!-- Card Container -->
            <div class="mt-10 w-full max-w-sm flex flex-col gap-4">
                
                <div class="bg-panel border border-border rounded-2xl p-5 text-left">
                    <div class="flex items-center gap-3">
                        <span class="p-2 rounded-lg bg-primary/10 text-primary">
                            <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 6h16M4 12h16M4 18h7"/></svg>
                        </span>
                        <div>
                            <h4 class="font-semibold text-sm">Recommended Specs</h4>
                            <p class="text-xs text-muted-foreground mt-0.5">Desktop Browser • Hardware Acceleration On</p>
                        </div>
                    </div>
                </div>

                

            </div>
        </div>
        `;
        document.body.appendChild(this.element);
    }

    eventListenerMobile() {
      //
    }

    destroy() {
        this.element.remove();
    }
}