const algorithms = ['act', 'Alg2', 'Alg3'];
const numTaus = [100, 256];
const seeds = [0, 1, 2];
const environments = ['quad_insert_a0o0', 'Env2', 'Env3'];
const percents = [10, 50, 100];

let currentAlgorithmIndex = 0;
let currentTauIndex = 0;
let currentSeedIndex = 0;

function buildGridData() {
    const gridData = {};
    algorithms.forEach(algorithm => {
        numTaus.forEach(numTau => {
            seeds.forEach(seed => {
                const gridKey = `${algorithm}-${numTau}-${seed}`;
                gridData[gridKey] = [];
                percents.forEach(percent => {
                    environments.forEach(env => {
                        const fileName = `alg=${algorithm},env=${env},num_trajs=${numTau},run=${seed.toString().padStart(3, '0')},pct=${percent.toString().padStart(3, '0')},rollout_000.mp4`;
                        gridData[gridKey].push(fileName);
                    });
                });
            });
        });
    });
    return gridData;
}

const gridContent = buildGridData();

function updateGrid() {
    const algorithm = algorithms[currentAlgorithmIndex];
    const numTau = numTaus[currentTauIndex];
    const seed = seeds[currentSeedIndex];
    const gridKey = `${algorithm}-${numTau}-${seed}`;
    
    const gridContainer = document.querySelector('.grid');
    gridContainer.innerHTML = ''; // Clear any existing grid items

    gridContent[gridKey].forEach((fileName, index) => {
        const gridItem = document.createElement('div');
        gridItem.className = 'grid-item';
        
        const vid = document.createElement('video');
        vid.src = `${fileName}`;
        vid.alt = fileName;
        vid.autoplay = true;
        vid.loop = true;
        vid.muted = true;
    
        gridItem.appendChild(vid);
    
        // Check if the index is in the top row or the leftmost column
        const isTopRow = index >= 0 && index <= 2; // Top row (indices 0, 1, 2)
        const isLeftColumn = index % 3 === 0; // Leftmost column (indices 0, 3, 6)
        const isTopLeft = isTopRow && isLeftColumn; // Top-left cell (index 0 in a 3x3 grid)
    
        if (isTopLeft) {
            // Add unique text overlays for the top-left cell
            const textOverlayTop = document.createElement('div');
            textOverlayTop.className = 'text-overlay-top';
            textOverlayTop.textContent = `TL: ${index}`; // Customize your text here
            gridItem.appendChild(textOverlayTop);
    
            const textOverlayLeft = document.createElement('div');
            textOverlayLeft.className = 'text-overlay-left';
            textOverlayLeft.textContent = `LI: ${index}`; // Customize your text here
            gridItem.appendChild(textOverlayLeft);
        } else if (isTopRow || isLeftColumn) {
            // Handle other cells in the top row or left column
            const textOverlay = document.createElement('div');
            textOverlay.className = isTopRow ? 'text-overlay-top' : 'text-overlay-left';
            textOverlay.textContent = `Index: ${index}`; // Customize your text here
            gridItem.appendChild(textOverlay);
        }
    
        gridContainer.appendChild(gridItem);
    });
    

    document.getElementById('display-info').textContent = `Algorithm: ${algorithm} | Num Tau: ${numTau} | Seed: ${seed}`;
}

document.getElementById('nextAlgBtn').addEventListener('click', () => {
    currentAlgorithmIndex = (currentAlgorithmIndex + 1) % algorithms.length;
    updateGrid();
});

document.getElementById('prevAlgBtn').addEventListener('click', () => {
    currentAlgorithmIndex = (currentAlgorithmIndex - 1 + algorithms.length) % algorithms.length;
    updateGrid();
});

document.getElementById('nextTauBtn').addEventListener('click', () => {
    currentTauIndex = (currentTauIndex + 1) % numTaus.length;
    updateGrid();
});

document.getElementById('prevTauBtn').addEventListener('click', () => {
    currentTauIndex = (currentTauIndex - 1 + numTaus.length) % numTaus.length;
    updateGrid();
});

document.getElementById('nextSeedBtn').addEventListener('click', () => {
    currentSeedIndex = (currentSeedIndex + 1) % seeds.length;
    updateGrid();
});

document.getElementById('prevSeedBtn').addEventListener('click', () => {
    currentSeedIndex = (currentSeedIndex - 1 + seeds.length) % seeds.length;
    updateGrid();
});

updateGrid();
