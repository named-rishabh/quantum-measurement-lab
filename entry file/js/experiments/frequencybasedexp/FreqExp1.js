export default class FreqExp1 {
    constructor(device) {
        this.device = device;
        this.element = document.createElement('div');
        this.state = {
            vnaPower: -50.00,
            centerFreq: 6.74,
            sweepSpan: 40.00
        };

        if (this.device === 'desktop') {
            this.createDesktop();
            this.eventListenerDesktop();
        }
    }

    createDesktop() {
        this.element.innerHTML = `
        <div id="experiment-desktop" class="min-h-screen bg-background text-text p-8 flex justify-center items-center">
            
            <!-- Main Grid: Left Column (Sidebar) & Right Column (Experimental Setup) -->
            <div class="w-full max-w-7xl h-[88vh] grid grid-cols-12 gap-6">

                <!-- Left Column: Context and Control stacked in a Flexbox -->
                <div class="col-span-4 h-full flex flex-col gap-6">

                    <!-- Top: Context Card -->
                    <div class="bg-panel border border-border rounded-3xl p-6 flex flex-col justify-between shadow-sm flex-1">
                        <div>
                            <span class="px-4 py-1 rounded-full border border-border text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                Context
                            </span>
                            <h2 class="mt-4 text-2xl font-bold tracking-tight">
                                One-Tone <span class="text-primary">Spectroscopy</span>
                            </h2>
                            <p class="mt-3 text-sm text-muted-foreground leading-relaxed">
                                One-Tone Spectroscopy is the foundational characterization technique used to identify the bare and dressed resonance frequencies of a superconducting readout resonator. By sweeping a single microwave probe tone across the device using a Vector Network Analyzer (VNA), we measure the complex transmission coefficient (S21) or reflection coefficient (S11) along the feedline
                            </p>
                        </div>
                    </div>

                    <!-- Bottom: Control Panel Card -->
                    <div class="bg-panel border border-border rounded-3xl p-6 flex flex-col justify-between shadow-sm flex-1">
                        <div class="flex items-center justify-between">
                            <span class="px-4 py-1 rounded-full border border-border text-xs uppercase tracking-[0.3em] text-muted-foreground">
                                Control
                            </span>
                            <button id="reset-controls" class="text-xs uppercase tracking-wider text-muted-foreground hover:text-primary transition-colors">
                                Reset
                            </button>
                        </div>

                        <!-- Sliders Stack -->
                        <div class="space-y-4 my-auto">
                            <!-- VNA Power -->
                            <div class="space-y-1.5">
                                <div class="flex justify-between text-sm font-medium">
                                    <label for="vna-power">VNA Power (dBm):</label>
                                    <span id="vna-power-val" class="font-mono text-sm text-text">-50.00</span>
                                </div>
                                <input id="vna-power" type="range" min="-80" max="0" step="0.5" value="-50" 
                                    class="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary">
                            </div>

                            <!-- Center Frequency -->
                            <div class="space-y-1.5">
                                <div class="flex justify-between text-sm font-medium">
                                    <label for="center-freq">Center Freq (GHz):</label>
                                    <span id="center-freq-val" class="font-mono text-sm text-text">6.74</span>
                                </div>
                                <input id="center-freq" type="range" min="4.00" max="8.00" step="0.01" value="6.74" 
                                    class="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary">
                            </div>

                            <!-- Sweep Span -->
                            <div class="space-y-1.5">
                                <div class="flex justify-between text-sm font-medium">
                                    <label for="sweep-span">Sweep Span (MHz):</label>
                                    <span id="sweep-span-val" class="font-mono text-sm text-text">40.00</span>
                                </div>
                                <input id="sweep-span" type="range" min="1.00" max="100.00" step="0.5" value="40" 
                                    class="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary">
                            </div>
                        </div>
                    </div>

                </div>

                <!-- Right Column: Experimental Setup Card -->
                <div class="col-span-8 h-full bg-panel border border-border rounded-3xl p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
                    <div class="flex items-center justify-between">
                        <span class="px-4 py-1 rounded-full border border-border text-xs uppercase tracking-[0.3em] text-muted-foreground">
                            Experimental Setup
                        </span>
                    </div>

                    <!-- Visualizer / Schematic Container -->
                    <div id="setup-canvas-container" class="mt-4 flex-1 w-full border border-dashed border-border/70 rounded-2xl flex flex-col items-center justify-center gap-3 bg-background/50">
                        <svg class="w-12 h-12 text-muted-foreground/60 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                        </svg>
                        <p class="text-sm font-medium text-muted-foreground">
                            Experimental Setup Visualizer (Dilution Refrigerator / Qubit Schematic)
                        </p>
                    </div>
                </div>

            </div>
        </div>
        `;
        document.body.appendChild(this.element);
    }

    eventListenerDesktop() {
        const sliders = [
            { id: 'vna-power', valId: 'vna-power-val', key: 'vnaPower', decimals: 2 },
            { id: 'center-freq', valId: 'center-freq-val', key: 'centerFreq', decimals: 2 },
            { id: 'sweep-span', valId: 'sweep-span-val', key: 'sweepSpan', decimals: 2 }
        ];

        sliders.forEach(({ id, valId, key, decimals }) => {
            const input = this.element.querySelector(`#${id}`);
            const label = this.element.querySelector(`#${valId}`);
            if (input && label) {
                input.addEventListener('input', (e) => {
                    const parsed = parseFloat(e.target.value);
                    this.state[key] = parsed;
                    label.textContent = parsed.toFixed(decimals);
                });
            }
        });

        const resetBtn = this.element.querySelector('#reset-controls');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                const defaults = { 'vna-power': -50.00, 'center-freq': 6.74, 'sweep-span': 40.00 };
                Object.entries(defaults).forEach(([id, val]) => {
                    const el = this.element.querySelector(`#${id}`);
                    const valEl = this.element.querySelector(`#${id}-val`);
                    if (el && valEl) {
                        el.value = val;
                        valEl.textContent = val.toFixed(2);
                        const keyMap = { 'vna-power': 'vnaPower', 'center-freq': 'centerFreq', 'sweep-span': 'sweepSpan' };
                        this.state[keyMap[id]] = val;
                    }
                });
            });
        }
    }
}