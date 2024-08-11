const algorithms = ['bclone', 'ibc', 'dagger', 'gail', 'act', 'diffusion'];
const numTaus = [50, 100, 200];
const seeds = [1, 2, 3];
const environments = ['quad_insert_a0o0', 'quad_insert_aLoL', 'quad_insert_aMoM'];
const percents = [10, 50, 100];

let currentAlgorithmIndex = 0;
let currentTauIndex = 0;
let currentSeedIndex = 0;

const algNameMap = {
    'bclone' : 'BC',
    'ibc' : 'IBC',
    'dagger' : 'DAgger',
    'gail' : 'GAIL',
    'act' : 'ACT',
    'diffusion' : 'Diffusion',
};


function buildGridData() {
    const gridData = {};
    algorithms.forEach(algorithm => {
        numTaus.forEach(numTau => {
            seeds.forEach(seed => {
                const gridKey = `${algorithm}-${numTau}-${seed}`;
                gridData[gridKey] = [];
                percents.forEach(percent => {
                    environments.forEach(env => {
                        const fileName = `static/grid_vids/alg=${algorithm},env=${env},num_trajs=${numTau.toString().padStart(3, '0')},run=${(seed-1).toString().padStart(3, '0')},pct=${percent.toString().padStart(3, '0')},rollout_000.mp4`;
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
    // const numTau = numTaus[currentTauIndex];
    let numTau = numTaus[currentTauIndex];

    if (algorithm == "dagger") {
        numTau = 200;
    }
    
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
    
        const intToStringMap = {
            1: "Low Noise",
            2: "High Noise",
            3: "50%",
            6: "100%"
        };

        if (isTopLeft) {
            // Add unique text overlays for the top-left cell
            const textOverlayTop = document.createElement('div');
            textOverlayTop.className = 'text-overlay-top';
            textOverlayTop.textContent = `Zero Noise`; // Customize your text here
            gridItem.appendChild(textOverlayTop);
    
            const textOverlayLeft = document.createElement('div');
            textOverlayLeft.className = 'text-overlay-left';
            textOverlayLeft.textContent = `10%`; // Customize your text here
            gridItem.appendChild(textOverlayLeft);
        } else if (isTopRow || isLeftColumn) {
            // Handle other cells in the top row or left column
            const textOverlay = document.createElement('div');
            textOverlay.className = isTopRow ? 'text-overlay-top' : 'text-overlay-left';
            textOverlay.textContent = intToStringMap[index]; // Customize your text here
            gridItem.appendChild(textOverlay);
        }
    
        gridContainer.appendChild(gridItem);
    });
    
    // document.getElementById('display-info').textContent = formatDisplayText(algorithm, numTau, seed);
}

const labelMap = {
    'currentAlgorithmIndex': 'Algorithm',
    'currentTauIndex': 'Num Expert',
    'currentSeedIndex': 'Seed'
};

function getArrayForVariable(variableName) {
    switch (variableName) {
        case 'currentAlgorithmIndex':
            return algorithms;
        case 'currentTauIndex':
            return numTaus;
        case 'currentSeedIndex':
            return seeds;
        default:
            return [];
    }
}

function formatValue(variableName, index) {
    const array = getArrayForVariable(variableName);
    const arrayLength = array.length;
    
    let value;
    if (variableName === 'currentAlgorithmIndex') {
        value = algNameMap[array[index]];
    } else {
        value = array[index];
    }
    
    // Ensure index is within bounds
    index = (index + arrayLength) % arrayLength;

    // Formatting values: assuming fixed widths
    const labelWidth = 10; // Adjust based on your needs
    const valueWidth = 10; // Adjust based on your needs

    const label = labelMap[variableName] || '';
    const formattedLabel = label.padEnd(labelWidth, ' ');

    // Format the value with left alignment
    const formattedValue = value.toString().padEnd(valueWidth, ' ');

    // Return formatted string ensuring that value is left-aligned
    return `${formattedLabel}: ${formattedValue}`;
}

function updateGlobalIndex(element) {
    const buttonContainer = element.parentElement;
    const variableName = buttonContainer.getAttribute('data-variable');
    
    let index = parseInt(buttonContainer.getAttribute('data-index'));
    const array = getArrayForVariable(variableName);
    const arrayLength = array.length;

    
    if (element.classList.contains('right')) {
        index = (index + 1) % arrayLength;
    } else if (element.classList.contains('left')) {
        index = (index + arrayLength - 1) % arrayLength;
    }

    if ((variableName === 'currentAlgorithmIndex') && (algorithms[index] == "dagger")) {
        const ntau = document.querySelector('.button-container.middle');
        ntau.querySelector('.button-text pre').innerText = "N/A";
    }
    else if (variableName === 'currentAlgorithmIndex') {
        const ntau = document.querySelector('.button-container.middle');
        ntau.querySelector('.button-text pre').innerText = formatValue('currentTauIndex', currentTauIndex);
    }

    
    if ((variableName === 'currentTauIndex') && (algorithms[currentAlgorithmIndex] == "dagger")) {
        buttonContainer.querySelector('.button-text pre').innerText = "N/A";
    }
    else{
        buttonContainer.querySelector('.button-text pre').innerText = formatValue(variableName, index);
    } 
    
    buttonContainer.setAttribute('data-index', index);

    if (variableName === 'currentAlgorithmIndex') {
        currentAlgorithmIndex = index;
    } else if (variableName === 'currentTauIndex') {
        currentTauIndex = index;
    } else if (variableName === 'currentSeedIndex') {
        currentSeedIndex = index;
    }

    updateGrid();
}


// Initialize button values
document.querySelectorAll('.button-container').forEach(buttonContainer => {
    const variableName = buttonContainer.getAttribute('data-variable');
    const index = parseInt(buttonContainer.getAttribute('data-index'));

    buttonContainer.querySelector('.button-text pre').innerText = formatValue(variableName, index);
});

updateGrid();
