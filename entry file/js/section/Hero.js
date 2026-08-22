import gsap from "gsap";
import ScrollToPlugin from "gsap/src/ScrollToPlugin";
import HeroChip from "../webgl/heroChip.js";
gsap.registerPlugin(ScrollToPlugin);

export default class Hero {
    constructor(device) {
        this.device = device;
        this.element = document.createElement('div');
        if (this.device === 'mobile') {
            this.createMobile();
        } else {
            this.createDesktop();
        }
        this.eventListener();
        document.body.appendChild(this.element);

        // Mount the standalone hero chip scene once the canvas exists in the DOM
        this.chipCanvas = this.element.querySelector('#hero-chip-canvas');
        if (this.chipCanvas) {
            this.heroChip = new HeroChip(this.chipCanvas);
        }
    }

    createMobile() {
        this.element.innerHTML = `
        <section id="introduction" class="relative h-screen w-full flex items-center bg-[#05070d] overflow-hidden">
            <canvas id="hero-chip-canvas" class="absolute inset-0 w-full h-full"></canvas>
            <div class="relative z-10 text-left px-6">
                <h1 class="text-4xl font-bold tracking-tight bg-gradient-to-r from-white to-[#7fc8ff] bg-clip-text text-transparent leading-tight">
                    QUANTUM<br/>MEASUREMENT<br/>LAB
                </h1>
                <p class="text-base mt-4 text-white/60 max-w-sm">Exploring the behavior of quantum systems through <span class="text-[#7fc8ff]">real-time measurement</span>.</p>
                <button id="explore-btn" class="mt-8 text-sm tracking-[0.2em] uppercase text-[#7fc8ff] border border-[#7fc8ff]/40 px-6 py-3 rounded-full hover:bg-[#7fc8ff]/10 hover:border-[#7fc8ff] transition-all duration-500">
                    Enter the Lab &rarr;
                </button>
            </div>
            <div class="absolute bottom-6 left-6 z-10 flex items-center gap-2 text-white/40 text-xs tracking-widest uppercase">
                <span class="w-2 h-2 rounded-full bg-[#7fc8ff] animate-pulse"></span> Scroll to explore
            </div>
        </section>
        `;
    }

    createDesktop() {
        this.element.innerHTML = `
        <section id="introduction" class="relative h-screen w-full flex items-center bg-[#05070d] overflow-hidden">
            <canvas id="hero-chip-canvas" class="absolute inset-0 w-full h-full"></canvas>
            <div class="relative z-10 text-left px-24 max-w-2xl">
                <h1 class="text-7xl font-bold tracking-tight bg-gradient-to-r from-white to-[#7fc8ff] bg-clip-text text-transparent leading-[1.05]">
                    QUANTUM<br/>MEASUREMENT<br/>LAB
                </h1>
                <p class="text-xl mt-6 text-white/60 max-w-md">Exploring the behavior of quantum systems through <span class="text-[#7fc8ff]">real-time measurement</span>.</p>
                <button id="explore-btn" class="mt-10 text-sm tracking-[0.25em] uppercase text-[#7fc8ff] border border-[#7fc8ff]/40 px-8 py-4 rounded-full hover:bg-[#7fc8ff]/10 hover:border-[#7fc8ff] transition-all duration-500">
                    Enter the Lab &rarr;
                </button>
            </div>
            <div class="absolute bottom-10 left-24 z-10 flex items-center gap-2 text-white/40 text-xs tracking-[0.2em] uppercase">
                <span class="w-2 h-2 rounded-full bg-[#7fc8ff] animate-pulse"></span> Scroll to explore
            </div>
            
        </section>
        `;
    }

    eventListener() {
        this._entered = false;

        this.element.querySelector("#explore-btn").addEventListener('click', () => {
            const button = this.element.querySelector("#explore-btn");
            button.disabled = true; // prevent double-clicks mid-transition
            this._entered = true;

            const startScroll = () => {
                gsap.to(window, {
                    duration: 1.2,
                    scrollTo: '#lab',
                    ease: "power2.inOut"
                });
            };

            if (this.heroChip) {
                gsap.to(this.element.querySelector('.relative.z-10'), {
                    opacity: 0,
                    duration: 0.6,
                    ease: "power1.out"
                });
                this.heroChip.flyIn(gsap, startScroll);
            } else {
                startScroll();
            }
        });

        // If the user scrolls back up near the top after having "entered",
        // reverse the zoom/glow so the hero resets to its resting state.
        this._scrollHandler = () => {
            if (this._entered && window.scrollY < 80) {
                this._entered = false;
                const button = this.element.querySelector("#explore-btn");
                button.disabled = false;

                gsap.to(this.element.querySelector('.relative.z-10'), {
                    opacity: 1,
                    duration: 0.6,
                    ease: "power1.out"
                });

                if (this.heroChip) {
                    this.heroChip.flyOut(gsap);
                }
            }
        };
        window.addEventListener('scroll', this._scrollHandler);
    }
}