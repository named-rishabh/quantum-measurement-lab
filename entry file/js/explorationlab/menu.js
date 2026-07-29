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
            ]
        },
        {
            title: "2. Spectroscopy Circuit",
            target: "circuit",
            desc: "The entire room-temperature and cryogenic circuit architecture.",
            subItems: [
                { title: "2.1 VNA", target: "VNA", desc: "..." },
                { title: "2.2 Octave", target: "Octave", desc: "..." },
                { title: "2.3 Thermometry unit", target: "Thermometry", desc: "..." },
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
            subItemsHTML = `<ul class="sub-menu">`;
            group.subItems.forEach(sub => {
                subItemsHTML += `<li class="menu-item" data-target="${sub.target}" data-desc="${sub.desc}">${sub.title}</li>`;
            });
            subItemsHTML += `</ul>`;
        }

        menuItemsHTML += `
            <li class="menu-group">
                <div class="group-title" data-target="${group.target}" data-desc="${group.desc}">${group.title}</div>
                ${subItemsHTML}
            </li>
        `;
    });

    return `
        <div class="ui-layer">
            <nav class="left-menu glass-panel">
                <ul class="main-menu" style="list-style: none; padding: 0; margin: 0;">
                    ${menuItemsHTML}
                </ul>
            </nav>

            <aside class="right-panel glass-panel">
                <h2 id="desc-title">Component Info</h2>
                <p id="desc-content">Select a component from the left menu to view its description.</p>
            </aside>
        </div>
    `;
}