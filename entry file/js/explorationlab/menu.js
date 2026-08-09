const menuConfig = {
    exploration: [
        {
            title: "1. Dilution Refrigerator",
            target: "cryostat",
            desc: "The primary cryogenic enclosure and thermal shielding for the setup.",
            subItems: [
                { title: "1.1 50K Plate", target: "plate_50k", desc: "The 50K plate is a first cooling stage of dilution refigrator  done by incoming Helium-4 high pressure gas,this gas expand and absorbed heat from surronding of this plate  and cool down about 50k." },
                { title: "1.2 4K Plate", target: "plate_4k", desc: "The 4K thermal stage ,again Helium-4 gas absorbed heat from surronding cool down about 4k." },
                { title: "1.3 Still", target: "still", desc: "The distillation stage,is used to evaporate Helium-3 from the mixing of He-3/He-4,enabling continuous circulation in dilution refigrator " },
                { title: "1.4 100mK Plate", target: "plate_100mk", desc: "The 100mK thermal plate,provide an intermediate low tempreture before they reach the mixing chamber." },
                { title: "1.5 Mixing Chamber", target: "mixing_chamber", desc: "The mixing chamber for base temperature,is the coldest part of dilution refigrator where He-3 crosses from concentrated to diluted phase by absorbing heat from mixing chamber cool down about 10mk ." },
            ]
        },
        {
            title: "2. Control Unit",
            target: "ControlRack",
            desc: "The control rack contain VNA,octave and Thermometry unit,control the various instruments and system used in the experiments..",
            subItems: [
                { title: "2.1 VNA", target: "VNA", desc: "The vector network analyzer is used generate and measure microwave signals for characterizing the resonanter and qubit system ." },
                { title: "2.2 Octave", target: "Octave", desc: "The octave is a microwave control and readout system to generate process,measure signal for quantum experiment ." },
                { title: "2.3 Thermometry unit", target: "Thermometry", desc: "The thermometry unit measure the tempreture at different stage of cryogenic system ." },
            ]
        },
        {
            title: "3. GHS",
            target: "GHS",
            desc: "The Gass handling system contains the GHU and Dewar,manage the helium gas circulation ,storage and purification etc.",
            subItems: [
                { title: "3.1 GHU", target: "GHU", desc: "The gas handling unit manages the circulation ,storage,pressure control and purify the Helium-3or Helium mixture(He-3/He-4) gas used in dilution refigrator " },
                { title: "3.2 Dewar", target: "Dewar", desc: "The dewar is an isulated vessel used to store cryogenic liquid Helium-4 or Helium-3 /Helium-4 mixture while minimizing heat transfer from the surronding." },
            ]
        },
        {
            title: "4. Compressor",
            target: "Compressor",
            desc: "The compressor compress the Helium-4 gas to high pressure which is coming from PTC at low pressure,also it circulate this gas from PTC to compressor and vice versa so that maintain the cooling of cryostate .",
        },
                {
            title: "5. Classical computer",
            target: "Computer",
            desc: "The classical computer control the experimental setup,communicate with experimental equipment ,and proccess the measurement  data.",
        },
    ]
};

export function generateMenuHTML(mode) {
    const currentData = menuConfig[mode];
    if (!currentData) return '';

    let menuItemsHTML = '';
    
    currentData.forEach(group => {
        let subItemsHTML = '';
        if (group.subItems && group.subItems.length > 0) {
            subItemsHTML = `<ul class="sub-menu list-none pl-4 mt-1 mb-4 border-l-2 border-white/10 ml-2">`;
            group.subItems.forEach(sub => {
                subItemsHTML += `
                    <li class="menu-item cursor-pointer p-2 text-[0.9rem] opacity-70 rounded transition-all duration-200 ease-in-out hover:bg-white/5 hover:opacity-100 hover:pl-3 hover:text-primary" data-target="${sub.target}" data-desc="${sub.desc}">
                        <span class="pointer-events-none">${sub.title}</span>
                    </li>`;
            });
            subItemsHTML += `</ul>`;
        }

        menuItemsHTML += `
            <li class="menu-group mb-2">
                <div class="group-title font-bold cursor-pointer py-[0.7rem] px-[0.4rem] mb-1 border-b border-white/10 rounded transition-all duration-250 ease-in-out hover:bg-white/8 hover:text-primary hover:pl-[0.85rem]" data-target="${group.target}" data-desc="${group.desc}">
                    <span class="pointer-events-none">${group.title}</span>
                </div>
                ${subItemsHTML}
            </li>
        `;
    });

    return `
        <div class="absolute inset-0 pointer-events-none flex justify-between p-4 z-50 max-h-[92.5vh]">
            <nav class="left-menu custom-scrollbar pointer-events-auto bg-panel/85 border border-border rounded-lg p-5 w-[20vw] max-h-full overflow-y-auto backdrop-blur-sm">
                <ul class="main-menu text-text list-none p-0 m-0">
                    ${menuItemsHTML}
                </ul>
            </nav>

            <aside class="right-panel custom-scrollbar pointer-events-auto bg-panel/85 border border-border rounded-lg p-5 w-[25vw] h-fit backdrop-blur-sm">
                <h2 id="desc-title" class="text-xl font-bold mb-4 border-b border-border pb-2 text-text">Component Info</h2>
                <p id="desc-content" class="text-text/80 leading-relaxed">Select a component from the left menu to view its description.</p>
            </aside>
        </div>
    `;
}

export function setupMenuEventListeners(cameraControllerCallback) {
    document.addEventListener('click', (event) => {
        // Find if the clicked element (or its parent) is a menu item or group title
        const clickedItem = event.target.closest('.menu-item, .group-title');
        
        if (!clickedItem) return; // Exit if clicked outside our targets

        // Extract data attributes
        const targetComponent = clickedItem.getAttribute('data-target');
        const description = clickedItem.getAttribute('data-desc');
        const titleText = clickedItem.querySelector('span').innerText;

        // 1. Update the Right Panel UI
        const descTitleEl = document.getElementById('desc-title');
        const descContentEl = document.getElementById('desc-content');
        
        if (descTitleEl && descContentEl) {
            descTitleEl.innerText = titleText;
            descContentEl.innerText = description;
        }

        // 2. Trigger the Camera Zoom
        if (targetComponent && typeof cameraControllerCallback === 'function') {
            cameraControllerCallback(targetComponent);
        }
    });
}