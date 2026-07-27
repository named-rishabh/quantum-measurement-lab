const menuConfig = {
    exploration: [
        {
            title: "1. Cryogenic System",
            target: "cryostat",
            desc: "The primary cryogenic enclosure and thermal shielding for the setup.",
            subItems: [
                { title: "1.1 50K Plate", target: "plate_50k", desc: "The 50K thermal stage." },
                { title: "1.2 4K Plate", target: "plate_4k", desc: "The 4K thermal stage." },
                { title: "1.3 Still", target: "still", desc: "The distillation stage." },
                { title: "1.4 100mK Plate", target: "plate_100mk", desc: "The 100mK thermal plate." },
                { title: "1.5 Mixing Chamber", target: "mixing_chamber", desc: "The mixing chamber for base temperature." },
                { title: "1.6 Sample Shield", target: "sample_shield", desc: "Magnetic and thermal shielding for the sample." }
            ]
        },
        {
            title: "2. Spectroscopy Circuit",
            target: "circuit",
            desc: "The entire room-temperature and cryogenic circuit architecture.",
            subItems: [
                { title: "2.1 Microwave Source", target: "mw_source", desc: "Room temperature microwave source." },
                { title: "2.2 Attenuators", target: "attenuators", desc: "Thermal noise attenuation lines." },
                { title: "2.3 Qubit Chip", target: "qubit_chip", desc: "The primary sample chip." },
                { title: "2.4 Resonator", target: "resonator", desc: "Readout resonator cavity." },
                { title: "2.5 Circulator", target: "circulator", desc: "Directional signal routing." },
                { title: "2.6 HEMT Amplifier", target: "hemt_amp", desc: "Cryogenic HEMT amplifier for readout." }
            ]
        }
    ],
    experiment: [
        {
            title: "1. Stimulus Control",
            target: "microwave_pulse",
            desc: "Control system for initiating and formatting microwave pulse flows.",
            subItems: [
                { title: "1.1 Pulse Duration", target: "pulse_time", desc: "Adjust the temporal length of the pulse." },
                { title: "1.2 Amplitude", target: "pulse_amp", desc: "Set the peak amplitude of the signal." }
            ]
        },
        {
            title: "2. Readout & Analysis",
            target: "rabi_oscillation",
            desc: "Measurement output visualization for Rabi oscillations.",
            subItems: [
                { title: "2.1 Population State", target: "state_pop", desc: "Ground vs Excited state probabilities." },
                { title: "2.2 Coherence Time", target: "coherence", desc: "T1 and T2 relaxation metrics." }
            ]
        }
    ]
};

export function generateMenuHTML(mode) {
    const currentData = menuConfig[mode];
    if (!currentData) return '';

    let menuItemsHTML = '';
    
    currentData.forEach(group => {
        let subItemsHTML = '';
        if (group.subItems && group.subItems.length > 0) {
            subItemsHTML = `<ul class="sub-menu pl-4 mt-1 mb-4 list-none">`;
            group.subItems.forEach(sub => {
                subItemsHTML += `<li class="menu-item cursor-pointer py-1 text-sm text-text/70 hover:text-blue-400 transition-colors" data-target="${sub.target}" data-desc="${sub.desc}">${sub.title}</li>`;
            });
            subItemsHTML += `</ul>`;
        }

        menuItemsHTML += `
            <li class="menu-group mb-2">
                <div class="group-title font-bold cursor-pointer py-2 border-b border-border/50 hover:text-blue-400 transition-colors" data-target="${group.target}" data-desc="${group.desc}">${group.title}</div>
                ${subItemsHTML}
            </li>
        `;
    });

    return `
        <div class="ui-layer absolute inset-0 pointer-events-none flex justify-between p-4 z-20">
            <nav class="left-menu pointer-events-auto bg-panel/85 border border-border rounded-lg p-5 w-[300px] max-h-full overflow-y-auto backdrop-blur-sm">
                <ul class="main-menu text-text list-none p-0 m-0">
                    ${menuItemsHTML}
                </ul>
            </nav>

            <aside class="right-panel pointer-events-auto bg-panel/85 border border-border rounded-lg p-5 w-[350px] h-fit backdrop-blur-sm">
                <h2 id="desc-title" class="text-xl font-bold mb-4 border-b border-border pb-2 text-text">Component Info</h2>
                <p id="desc-content" class="text-text/80 leading-relaxed">Select a component from the left menu to view its description.</p>
            </aside>
        </div>
    `;
}