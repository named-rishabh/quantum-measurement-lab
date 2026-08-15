export default class Experiments {
    constructor(device) {
        this.device = device;
        this.element = document.createElement('div');
        if (this.device === 'mobile') {
            this.createMobile();
            this.eventListenerMobile();
        } else {
            this.createDesktop();
            this.eventListenerDesktop();
        }
    }

    createMobile() {
        this.element.innerHTML = `
        <div id="experiments" class="min-h-screen flex flex-col justify-center items-center px-6 bg-background text-text py-12">

            <span class="px-4 py-1 rounded-full border border-border text-xs uppercase tracking-[0.3em] text-muted-foreground">
                Laboratory Catalog
            </span>

            <h2 class="mt-6 text-center text-4xl font-google font-bold tracking-tight">
                Quantum <span class="text-primary">Experiments</span>
            </h2>

            <p class="mt-4 max-w-xl text-center text-base text-muted-foreground leading-relaxed">
                Explore interactive lab simulations categorized by foundational physics and modern quantum control architectures.
            </p>

            <div class="mt-10 grid grid-cols-1 gap-8 w-full max-w-5xl">

                <!-- Card 1 -->
                <div class="bg-panel border border-border rounded-3xl p-6 shadow-sm">
                    <div class="flex items-center space-x-3 mb-6">
                        <div class="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary font-bold">
                            01
                        </div>
                        <h3 class="text-2xl font-semibold">Frequency Domain Measurement</h3>
                    </div>

                    <div class="mt-6">
                        <h4 class="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
                            Experiments
                        </h4>
                        <ul class="space-y-2">
                            <li>
                                <a href="experiment.html"  data-experiment="one-tone-spectroscopy" class="experiment-link block p-3 rounded-xl bg-background/50 border border-border/50 text-sm font-medium hover:text-primary hover:border-primary/50 transition-colors">
                                    One-Tone Spectroscopy &rarr;
                                </a>
                            </li>
                            <li>
                                <a href="experiment.html"  data-experiment="two-tone-spectroscopy" class="experiment-link block p-3 rounded-xl bg-background/50 border border-border/50 text-sm font-medium hover:text-primary hover:border-primary/50 transition-colors">
                                    Two-Tone Spectroscopy &rarr;
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <!-- Card 2 -->
                <div class="bg-panel border border-border rounded-3xl p-6 shadow-sm">
                    <div class="flex items-center space-x-3 mb-6">
                        <div class="h-10 w-10 rounded-xl bg-primary/15 flex items-center justify-center text-primary font-bold">
                            02
                        </div>
                        <h3 class="text-2xl font-semibold">Time Domain Measurement</h3>
                    </div>

                    <div class="mt-6">
                        <h4 class="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
                            Experiments
                        </h4>
                        <ul class="space-y-2">
                            <li>
                                <a href="experiment.html"  data-experiment="rabi-oscillations" class="experiment-link block p-3 rounded-xl bg-background/50 border border-border/50 text-sm font-medium hover:text-primary hover:border-primary/50 transition-colors">
                                    Rabi Oscillations & Pulse Shaping &rarr;
                                </a>
                            </li>
                            <li>
                                <a href="experiment.html"  data-experiment="ramsey-interferometry" class="experiment-link block p-3 rounded-xl bg-background/50 border border-border/50 text-sm font-medium hover:text-primary hover:border-primary/50 transition-colors">
                                    Ramsey Interferometry &rarr;
                                </a>
                            </li>
                        </ul>
                    </div>

                </div>

            </div>
        </div>
        `;
        document.body.appendChild(this.element);
    }

    createDesktop() {
        this.element.innerHTML = `
        <div id="experiments" class="min-h-screen flex flex-col justify-center items-center px-8 bg-background text-text py-16">

            <span class="px-4 py-1 rounded-full border border-border text-xs uppercase tracking-[0.3em] text-muted-foreground mt-4 mb-2">
                Laboratory Catalog
            </span>

            <h2 class="mt-6 max-w-4xl text-center text-5xl font-google font-bold tracking-tight">
                Quantum <span class="text-primary">Experiments</span>
            </h2>

            <p class="mt-6 max-w-2xl text-center text-lg text-muted-foreground leading-8">
                Explore interactive lab simulations categorized by foundational physics and modern quantum control architectures.
            </p>

            <div class="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">

                <!-- Card 1-->
                <div class="bg-panel border border-border rounded-3xl p-8 hover:bg-panel-alt transition-all duration-300 flex flex-col justify-between">
                    <div>
                        <div class="flex items-center space-x-4 mb-8">
                            <div class="h-12 w-12 rounded-2xl bg-primary/15 flex items-center justify-center text-xl font-bold text-primary">
                                01
                            </div>
                            <h3 class="text-2xl font-semibold">Frequency Domain Measurement</h3>
                        </div>
                        <div class="mt-6">
                            <h4 class="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
                                Experiments
                            </h4>
                            <ul class="space-y-3">
                                <li>
                                    <a href="experiment.html"  data-experiment="one-tone-spectroscopy" class="experiment-link group flex items-center justify-between p-3.5 rounded-2xl bg-background/40 border border-border/60 hover:border-primary/60 hover:bg-background/80 transition-all duration-200">
                                        <span class="text-sm font-medium group-hover:text-primary transition-colors">
                                            One-Tone Spectroscopy
                                        </span>
                                        <span class="text-xs text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all">&rarr;</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="experiment.html"  data-experiment="two-tone-spectroscopy" class="experiment-link group flex items-center justify-between p-3.5 rounded-2xl bg-background/40 border border-border/60 hover:border-primary/60 hover:bg-background/80 transition-all duration-200">
                                        <span class="text-sm font-medium group-hover:text-primary transition-colors">
                                            Two-Tone Spectroscopy
                                        </span>
                                        <span class="text-xs text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all">&rarr;</span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        
                    </div>
                </div>

                <!-- Card 2 -->
                <div class="bg-panel border border-border rounded-3xl p-8 hover:bg-panel-alt transition-all duration-300 flex flex-col justify-between">
                    <div>
                        <div class="flex items-center space-x-4 mb-8">
                            <div class="h-12 w-12 rounded-2xl bg-primary/15 flex items-center justify-center text-xl font-bold text-primary">
                                02
                            </div>
                            <h3 class="text-2xl font-semibold">Time Domain Measurement</h3>
                        </div>

                        <div class="mt-6">
                            <h4 class="text-xs uppercase tracking-[0.2em] text-primary font-semibold mb-3">
                                Experiments
                            </h4>
                            <ul class="space-y-3">
                                <li>
                                    <a href="experiment.html"  data-experiment="rabi-oscillations" class="experiment-link group flex items-center justify-between p-3.5 rounded-2xl bg-background/40 border border-border/60 hover:border-primary/60 hover:bg-background/80 transition-all duration-200">
                                        <span class="text-sm font-medium group-hover:text-primary transition-colors">Rabi Oscillations & Pulse Shaping</span>
                                        <span class="text-xs text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all">&rarr;</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="experiment.html" data-experiment="ramsey-interferometry" class="experiment-link group flex items-center justify-between p-3.5 rounded-2xl bg-background/40 border border-border/60 hover:border-primary/60 hover:bg-background/80 transition-all duration-200">
                                        <span class="text-sm font-medium group-hover:text-primary transition-colors">Ramsey Interferometry</span>
                                        <span class="text-xs text-muted-foreground group-hover:translate-x-1 group-hover:text-primary transition-all">&rarr;</span>
                                    </a>
                                </li>
                            </ul>
                        </div>

                        
                    </div>
                </div>

            </div>

        </div>
        `;
        document.body.appendChild(this.element);
    }

    eventListenerMobile() {
        const links = this.element.querySelectorAll('.experiment-link');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const target = e.currentTarget.getAttribute('data-experiment');
                console.log(`Mobile navigating to experiment: ${target}`);
            });
        });
    }

    eventListenerDesktop() {
        const links = this.element.querySelectorAll('.experiment-link');
        window.localStorage.setItem('selectedExperiment', '');
        links.forEach(link => {
            link.addEventListener('click', (e) => {
                const target = e.currentTarget.getAttribute('data-experiment');
                if(window.localStorage.getItem('selectedExperiment') === '') {
                    window.localStorage.setItem('selectedExperiment', target);
                }
                else if(window.localStorage.getItem('selectedExperiment') !== target) {
                    window.localStorage.setItem('selectedExperiment', target);
                }
                
            });
        });
    }
}