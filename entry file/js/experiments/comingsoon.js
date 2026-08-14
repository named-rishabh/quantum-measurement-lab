export default class ExperimentComingSoon {
    constructor(device) {
        this.device = device;
        this.element = document.createElement('div');

        if (this.device === 'desktop')  {
            this.createDesktop();
            this.eventListenerDesktop();
        }

        this.eventListener();
        
    }
    getPixelAnimationHTML() {
        return `
        <div class="relative w-full h-52 bg-[#0d1117] rounded-2xl border border-border/60 flex flex-col items-center justify-center overflow-hidden select-none p-4">
            <!-- Retro CRT scanline effect -->
            <div class="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-size-[100%_4px] pointer-events-none opacity-40 z-10"></div>
            
            <!-- Terminal Title Bar -->
            <div class="absolute top-3 left-4 flex items-center gap-1.5 z-20">
                <span class="w-2.5 h-2.5 rounded-full bg-[#ff5f56]"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-[#ffbd2e]"></span>
                <span class="w-2.5 h-2.5 rounded-full bg-[#27c93f]"></span>
                <span class="ml-2 text-[10px] font-mono text-muted-foreground uppercase tracking-wider">quantum_lab.exe</span>
            </div>

            <!-- Pixel Character Scene (Pure Crisp Vector) -->
            <div class="relative flex flex-col items-center justify-center mt-4">
                <svg width="180" height="110" viewBox="0 0 180 110" fill="none" xmlns="http://www.w3.org/2000/svg" class="rendering-pixelated drop-shadow-[0_0_15px_rgba(59,130,246,0.3)]">
                    <style>
                        @keyframes pixelTyping {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-2px); }
                        }
                        @keyframes pixelBlink {
                            0%, 49% { opacity: 1; }
                            50%, 100% { opacity: 0; }
                        }
                        @keyframes screenFlicker {
                            0%, 100% { fill-opacity: 0.18; }
                            50% { fill-opacity: 0.28; }
                        }
                        .typing-hands { animation: pixelTyping 0.25s infinite ease-in-out; }
                        .blink-cursor { animation: pixelBlink 0.8s infinite; }
                        .screen-glow { animation: screenFlicker 1.8s infinite alternate; }
                    </style>

                    <!-- Desk Base -->
                    <rect x="20" y="86" width="140" height="6" fill="#30363d" />
                    <rect x="35" y="92" width="6" height="18" fill="#21262d" />
                    <rect x="139" y="92" width="6" height="18" fill="#21262d" />

                    <!-- Monitor Stand & Screen -->
                    <rect x="52" y="74" width="20" height="12" fill="#484f58" />
                    <rect x="42" y="84" width="40" height="3" fill="#30363d" />
                    <rect x="30" y="32" width="64" height="44" rx="2" fill="#161b22" stroke="#30363d" stroke-width="2" />
                    <rect x="34" y="36" width="56" height="36" fill="#0d1117" />
                    
                    <!-- Monitor Ambient Glow Cone -->
                    <polygon points="34,36 90,36 128,78 128,86 100,86" fill="var(--primary, #3b82f6)" class="screen-glow" />

                    <!-- Terminal Code Lines inside Monitor -->
                    <rect x="38" y="42" width="24" height="2" fill="#22c55e" />
                    <rect x="38" y="47" width="36" height="2" fill="#38bdf8" />
                    <rect x="38" y="52" width="18" height="2" fill="#e2e8f0" />
                    <rect x="38" y="57" width="28" height="2" fill="#a855f7" />
                    <rect x="68" y="57" width="4" height="2" fill="#22c55e" class="blink-cursor" />

                    <!-- Keyboard -->
                    <rect x="96" y="80" width="28" height="6" rx="1" fill="#21262d" />
                    <rect x="98" y="82" width="24" height="2" fill="#484f58" />

                    <!-- Coffee Mug with Pixel Steam -->
                    <rect x="24" y="78" width="6" height="8" rx="1" fill="#e2e8f0" />
                    <rect x="22" y="80" width="2" height="4" fill="#94a3b8" />
                    <rect x="25" y="74" width="2" height="2" fill="#64748b" class="blink-cursor" />

                    <!-- Pixel Developer (Head, Hair, Eyes) -->
                    <rect x="134" y="36" width="18" height="18" fill="#ffd1a4" /> <!-- Face -->
                    <rect x="132" y="32" width="22" height="8" fill="#334155" /> <!-- Hair Top -->
                    <rect x="150" y="36" width="4" height="10" fill="#334155" /> <!-- Hair Back -->
                    <rect x="138" y="42" width="3" height="3" fill="#0f172a" /> <!-- Eye -->

                    <!-- Body / Hoodie -->
                    <rect x="128" y="54" width="28" height="28" rx="2" fill="#2563eb" />
                    <rect x="136" y="54" width="8" height="10" fill="#1d4ed8" /> <!-- Collar -->

                    <!-- Animated Arms / Typing Hands -->
                    <g class="typing-hands">
                        <rect x="114" y="72" width="18" height="6" rx="1" fill="#2563eb" />
                        <rect x="108" y="76" width="10" height="5" rx="1" fill="#ffd1a4" />
                    </g>
                    
                    <!-- Chair -->
                    <rect x="152" y="48" width="6" height="34" rx="2" fill="#1e293b" />
                    <rect x="134" y="82" width="24" height="4" fill="#0f172a" />
                </svg>
            </div>

            <!-- Subtitle status badge -->
            <div class="mt-2 flex items-center gap-2 text-xs font-mono text-muted-foreground">
                <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                <span>Compiling quantum Hamiltonians...</span>
            </div>
        </div>
        `;
    }

    createDesktop() {
        this.element.innerHTML = `
        <div id="experiment-coming-soon" class="min-h-screen flex flex-col justify-center items-center px-8 bg-background text-text py-12">

            <!-- Badge -->
            <span class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border text-xs uppercase tracking-[0.3em] text-muted-foreground">
                <span class="w-2 h-2 rounded-full bg-amber-400 animate-pulse"></span>
                Work In Progress
            </span>

            <!-- Main Heading -->
            <h2 class="mt-8 text-center text-5xl font-google font-bold tracking-tight">
                Quantum Lab
                <span class="text-primary">Experiments</span>
            </h2>

            <p class="mt-6 max-w-2xl text-center text-lg text-muted-foreground leading-8">
                Interactive real-time quantum circuit simulations, microwave drive pulse dynamics, and cryogenic signal-chain telemetry are being constructed.
            </p>

            <!-- Content Grid -->
            <div class="mt-14 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">

                <!-- Left Column: Work In Progress Pixel Animation -->
                <div class="bg-panel border border-border rounded-3xl p-8 flex flex-col justify-between">
                    <div>
                        <div class="flex items-center justify-between mb-6">
                            <p class="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                                Active Calibration
                            </p>
                            <span class="px-2.5 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-xs font-mono border border-amber-500/20">
                                WIP: v0.0.1-alpha
                            </span>
                        </div>

                        ${this.getPixelAnimationHTML()}
                    </div>

                    <!-- Progress Bar -->
                    <div class="mt-8 pt-6 border-t border-border/50">
                        <div class="flex justify-between text-xs uppercase tracking-wider text-muted-foreground mb-2">
                            <span>Status: Modeling Pulse Resonators</span>
                            <span class="text-primary font-mono font-semibold">65%</span>
                        </div>
                        <div class="w-full h-2 bg-border/40 rounded-full overflow-hidden">
                            <div class="h-full bg-primary rounded-full w-[65%]"></div>
                        </div>
                    </div>
                </div>

                <!-- Right Column: Subscription & Back Action -->
                <div class="bg-panel border border-border rounded-3xl p-8 flex flex-col justify-between items-start">
                    <div>
                        <h3 class="text-3xl font-semibold">
                            Get early access to interactive labs
                        </h3>

                        <p class="mt-5 text-muted-foreground leading-8">
                            Are you a quantum researcher, physics student, or developer? Sign up to test pre-release builds of these simulations or give early feedback.
                        </p>
                    </div>

                    <div class="w-full mt-8 space-y-4">
                        <button id="notifyBtnDesktop" class="w-full px-8 py-3.5 rounded-xl bg-primary text-white font-semibold hover:opacity-90 hover:scale-[1.02] transition-all duration-300 shadow-md">
                            Notify Me on Release
                        </button>
                        
                        <button id="backBtnDesktop" class="w-full px-8 py-3 rounded-xl border border-border text-text font-medium hover:bg-border/20 transition-all duration-300">
                            ← Return to 3D Refrigerator
                        </button>
                    </div>
                </div>

            </div>   
        </div>
        `;
        document.body.appendChild(this.element);
    }

    

    eventListenerDesktop() {
        const notifyBtn = this.element.querySelector('#notifyBtnDesktop');
        const backBtn = this.element.querySelector('#backBtnDesktop');

        notifyBtn?.addEventListener('click', () => {
            window.location.href = "mailto:rishabh@example.com?subject=Early%20Access%20Request%20-%20Quantum%20Experiments";
        });

        backBtn?.addEventListener('click', () => {
            this.destroy();
        });
    }


    destroy() {
        this.element.remove();
    }
}