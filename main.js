// Four forces of evolution

// 1. Natural Selection
//     - Adjustment for warm v. cold temperatures
// 2. Mutation
//     - Be able to adjust the percent of mutation seen in population (initially all valid combinations)
// 3. Gene Flow
//     - Bring in random genes to the population (as a percent of current population)
// 4. Random Genetic Drift
//     - Founder effect
//     - Population bottleneck
// Other trait to add that is influenced by others
//     - Eye Color


// ---------- Constants
// POPULATION_SIZE and GENERATIONS_PER_SECOND can be changed without consequences
const POPULATION_SIZE = 1000;
const GENERATIONS_PER_SECOND = 2;

// Indices into chromosome arrays are hard-coded so this can not be changed without consequences
const CHROMOSOME_LENGTH = 6;

// ---------- Non-constant global variables

// Generation & Population
const generationTextLabel = document.getElementById('generationText');
const populationSizeTextLabel = document.getElementById('populationSizeText');

let population = [];
let generation = 1;

// Eye Color
const eyeColorPTextLabel = document.getElementById('eyeColorP');
const eyeColorQTextLabel = document.getElementById('eyeColorQ');
const eyeColorP2TextLabel = document.getElementById('eyeColorP2');
const eyeColor2pqTextLabel = document.getElementById('eyeColor2pq');
const eyeColorQ2TextLabel = document.getElementById('eyeColorQ2');

let eyeColorP = 0;
let eyeColorQ = 0;

const totalGreenTextLabel = document.getElementById('totalGreen');
const totalBlueTextLabel = document.getElementById('totalBlue');
const totalBrownTextLabel = document.getElementById('totalBrown');
const totalGrayTextLabel = document.getElementById('totalGray');

let totalGreen = 0;
let totalBlue = 0;
let totalBrown = 0;
let totalGray = 0;

// Climate
const climatePTextLabel = document.getElementById('climateP');
const climateQTextLabel = document.getElementById('climateQ');
const climateP2TextLabel = document.getElementById('climateP2');
const climate2pqTextLabel = document.getElementById('climate2pq');
const climateQ2TextLabel = document.getElementById('climateQ2');

let climateP = 0;
let climateQ = 0;

const totalWarmTextLabel = document.getElementById('totalWarm');
const totalColdTextLabel = document.getElementById('totalCold');

let totalWarm = 0;
let totalCold = 0;

// Reproduce
const reproducePTextLabel = document.getElementById('reproduceP');
const reproduceQTextLabel = document.getElementById('reproduceQ');
const reproduceP2TextLabel = document.getElementById('reproduceP2');
const reproduce2pqTextLabel = document.getElementById('reproduce2pq');
const reproduceQ2TextLabel = document.getElementById('reproduceQ2');

let reproduceP = 0;
let reproduceQ = 0;

const totalYesTextLabel = document.getElementById('totalYes');
const totalNoTextLabel = document.getElementById('totalNo');

let totalYes = 0;
let totalNo = 0;

// Deaths
const totalDeathsTextLabel = document.getElementById('totalDeaths');

let totalDeaths = 0;

// Configuration
const climateTypeSelector = document.getElementById('climateType');
const mutationFrequencyTextBox = document.getElementById('mutationFrequency');
const geneFlowSelector = document.getElementById('geneFlowType');
const geneticDriftButton = document.getElementById('founderBottleneckEffect');

console.log('Climate type: ' + climateTypeSelector.selectedIndex);
console.log('Mutation frequency: ' + mutationFrequencyTextBox.value);
console.log('Gene Flow Type: ' + geneFlowSelector.selectedIndex);

// Start/stop/restart buttons
const startButton = document.getElementById('startButton');
const stopButton = document.getElementById('stopButton');
const restartButton = document.getElementById('restartButton');
let interval;

// ---------- Helper functions for initializing individuals and populations
const generateRandomIndividual = () => {
    let individual = [];
    for (let i = 0; i < CHROMOSOME_LENGTH; i++) {
        const ranNum = Math.floor((Math.random() * 2) + 1);
        if (ranNum === 1) {
            individual.push('a');
        } else {
            individual.push('A');
        }
    }
    return individual;
}

const generateRandomPopulation = () => {
    population = [];

    for (let i = 0; i < POPULATION_SIZE; i++) {
        population.push(generateRandomIndividual());
    }
}

// ---------- Helper functions for parsing features from the population

// Chromosome: Eye Color | Climate | Reproduce

// Eye Color
// AA - Green - 25%
// Aa - Blue - 50%
// aa - Brown - 25%
// Else - Gray - ~0
const extractEyeColorData = (indv) => {
    let doesSurvive;
    let p;
    let q;
    let color;

    if (indv[0] === 'A' && indv[1] === 'A') {
        doesSurvive = true;
        p = 2;
        q = 0;
        color = 'Green';
    } else if (indv[0] === 'A' && indv[1] === 'a') {
        doesSurvive = true;
        p = 1;
        q = 1;
        color = 'Blue';
    } else if (indv[0] === 'a' && indv[1] === 'A') {
        doesSurvive = true;
        p = 1;
        q = 1;
        color = 'Blue';
    } else if (indv[0] === 'a' && indv[1] === 'a') {
        doesSurvive = true;
        p = 0;
        q = 2;
        color = 'Brown';
    } else {
        doesSurvive = true;
    
        if (indv[0] === 'A' || indv[1] === 'A') {
            p = 1;
        } else {
            p = 0;
        }

        if (indv[0] === 'a' || indv[1] === 'a') {
            q = 1;
        } else {
            q = 0;
        }

        color = 'Gray';
    }

    return [doesSurvive, p, q, color];
}

// Survival - Adapted for warm climate v. Adapted for cold climate
// AA - Warm 
// Aa - Warm - 75%
// aa - Cold - 25%
// Else - Not survive
const extractClimateAdaptabilityData = (indv) => {
    let doesSurvive;
    let p;
    let q;
    let climateType;

    if (indv[2] === 'A' && indv[3] === 'A') {
        doesSurvive = true;
        p = 2;
        q = 0;
        climateType = 'Warm';
    } else if (indv[2] === 'A' && indv[3] === 'a') {
        doesSurvive = true;
        p = 1;
        q = 1;
        climateType = 'Warm';
    } else if (indv[2] === 'a' && indv[3] === 'A') {
        doesSurvive = true;
        p = 1;
        q = 1;
        climateType = 'Warm';
    } else if (indv[2] === 'a' && indv[3] === 'a') {
        doesSurvive = true;
        p = 0;
        q = 2;
        climateType = 'Cold';
    } else {
        doesSurvive = false;
    }

    return [doesSurvive, p, q, climateType];
}

// Reproduce - Able to reproduce
// AA - Yes
// Aa - Yes
// aa - No 
// Else - Not survive
const extractReproduceData = (indv) => {
    let doesSurvive;
    let p;
    let q;
    let canReproduce;

    if (indv[4] === 'A' && indv[5] === 'A') {
        doesSurvive = true;
        p = 2;
        q = 0;
        canReproduce = true;
    } else if (indv[4] === 'A' && indv[5] === 'a') {
        doesSurvive = true;
        p = 1;
        q = 1;
        canReproduce = true;
    } else if (indv[4] === 'a' && indv[5] === 'A') {
        doesSurvive = true;
        p = 1;
        q = 1;
        canReproduce = true;
    } else if (indv[4] === 'a' && indv[5] === 'a') {
        doesSurvive = true;
        p = 0;
        q = 2;
        canReproduce = false;
    } else {
        doesSurvive = false;
    }

    return [doesSurvive, p, q, canReproduce];
}

// ---------- Helper functions for simulation
const updateText = () => {
    // Generation
    generationTextLabel.innerText = `Generation: ${generation}`;
    populationSizeTextLabel.innerText = `Size: ${population.length}`;

    // Eye Color Metrics
    let ep = eyeColorP / (eyeColorP + eyeColorQ);
    let eq = 1 - ep;
    if (eyeColorP + eyeColorQ === 0) {
        ep = 0;
        eq = 0;
    }
    eyeColorPTextLabel.innerText = `p = ${ep}`;
    eyeColorQTextLabel.innerText = `q = ${eq}`;
    eyeColorP2TextLabel.innerText = `p^2 = ${ep * ep}`;
    eyeColor2pqTextLabel.innerText = `2pq = ${2 * ep * eq}`;
    eyeColorQ2TextLabel.innerText = `q^2 = ${eq * eq}`;

    totalGreenTextLabel.innerText = `Green: ${totalGreen}`;
    totalBlueTextLabel.innerText = `Blue: ${totalBlue}`;
    totalBrownTextLabel.innerText = `Brown: ${totalBrown}`;
    totalGrayTextLabel.innerText = `Gray: ${totalGray}`;

    // Climate Metrics
    let cp = climateP / (climateP + climateQ);
    let cq = 1 - cp;
    if (climateP + climateQ === 0) {
        cp = 0;
        cq = 0;
    }
    climatePTextLabel.innerText = `p = ${cp}`;
    climateQTextLabel.innerText = `q = ${cq}`;
    climateP2TextLabel.innerText = `p^2 = ${cp * cp}`;
    climate2pqTextLabel.innerText = `2pq = ${2 * cp * cq}`;
    climateQ2TextLabel.innerText = `q^2 = ${cq * cq}`;

    totalWarmTextLabel.innerText = `Warmer Climates: ${totalWarm}`;
    totalColdTextLabel.innerText = `Colder Climates: ${totalCold}`;

    // Reproduce Metrics
    let rp = reproduceP / (reproduceP + reproduceQ);
    let rq = 1 - rp;
    if (reproduceP + reproduceQ === 0) {
        rp = 0;
        rq = 0;
    }
    reproducePTextLabel.innerText = `p = ${rp}`;
    reproduceQTextLabel.innerText = `q = ${rq}`;
    reproduceP2TextLabel.innerText = `p^2 = ${rp * rp}`;
    reproduce2pqTextLabel.innerText = `2pq = ${2 * rp * rq}`;
    reproduceQ2TextLabel.innerText = `q^2 = ${rq * rq}`;

    totalYesTextLabel.innerText = `Yes: ${totalYes}`;
    totalNoTextLabel.innerText = `No: ${totalNo}`;

    // Total deaths
    totalDeathsTextLabel.innerText = `Total: ${totalDeaths}`;
}

const resetMetrics = () => {
    eyeColorP = 0;
    eyeColorQ = 0;
    totalGreen = 0;
    totalBlue = 0;
    totalBrown = 0;
    totalGray = 0;
    climateP = 0;
    climateQ = 0;
    totalWarm = 0;
    totalCold = 0;
    reproduceP = 0;
    reproduceQ = 0;
    totalYes = 0;
    totalNo = 0;
    totalDeaths = 0;
}

const updateMetrics = () => {
    resetMetrics();
    const indexes = [];

    population.forEach((indv, index) => {
        const eyeColor = extractEyeColorData(indv);
        const climate = extractClimateAdaptabilityData(indv);
        const reproduce = extractReproduceData(indv);

        if (!eyeColor[0] || !climate[0] || !reproduce[0]) {
            totalDeaths++;
            indexes.push(index);
        } else {
            eyeColorP += eyeColor[1];
            eyeColorQ += eyeColor[2];

            if (eyeColor[3] === 'Green') {
                totalGreen++;
            } else if (eyeColor[3] === 'Blue') {
                totalBlue++;
            } else if (eyeColor[3] === 'Brown') {
                totalBrown++;
            } else if (eyeColor[3] === 'Gray') {
                totalGray++;
            }
    
            climateP += climate[1];
            climateQ += climate[2];

            if (climate[3] === 'Warm') {
                totalWarm++;
            } else if (climate[3] === 'Cold') {
                totalCold++;
            }
    
            reproduceP += reproduce[1];
            reproduceQ += reproduce[2];

            if (reproduce[3]) {
                totalYes++;
            } else {
                totalNo++;
            }
        }
    });

    indexes.forEach(index => {
        population.splice(index, 1);
    });
}

const start = (timeValue) => {
    if (population.length <= 0) {
        generateRandomPopulation();
    }

    interval = setInterval(() => {
        updateMetrics();
        updateText();
        generation++;
        runIteration();
    }, timeValue);
}

const getRandomNumber = (cap) => {
    return Math.floor(Math.random() * cap);
}

const performCrossover = (p1, p2) => {
    const eRandom = Math.random();

    let eyeColor;
    if (eRandom < 0.25) {
        eyeColor = [p1[0], p2[0]];
    } else if (eRandom < 0.5) {
        eyeColor = [p1[1], p2[0]];
    } else if (eRandom < 0.75) {
        eyeColor = [p1[0], p2[1]];
    } else {
        eyeColor = [p1[1], p2[1]];
    }

    const cRandom = Math.random();

    let climate;
    if (cRandom < 0.25) {
        climate = [p1[2], p2[2]];
    } else if (cRandom < 0.5) {
        climate = [p1[3], p2[2]];
    } else if (cRandom < 0.75) {
        climate = [p1[2], p2[3]];
    } else {
        climate = [p1[3], p2[3]];
    }

    const rRandom = Math.random();

    let reproduce;
    if (rRandom < 0.25) {
        reproduce = [p1[4], p2[4]];
    } else if (rRandom < 0.5) {
        reproduce = [p1[5], p2[4]];
    } else if (rRandom < 0.75) {
        reproduce = [p1[4], p2[5]];
    } else {
        reproduce = [p1[5], p2[5]];
    }

    const o1 = [...eyeColor, ...climate, ...reproduce];
    
    return o1;
}

const performMutation = (o, prob) => {
    for (let i = 0; i < o.length; i++) {
        if (Math.random() < prob) {
            if (o[i] === 'A') {
                o[i] = 'a';
            } else {
                o[i] = 'A';
            }
        }

        if (Math.random() < prob * 0.01) {
            o[i] = 'o';
        }
    }
}

const runIteration = () => {
    // Randomly select pairs of qualified parents
    const parentPairs = [];
    for (let i = 0; i < population.length; i++) {
        let p1 = getRandomNumber(population.length);

        while (!extractReproduceData(population[p1])[3]) {
            p1 = getRandomNumber(population.length);
        }

        let p2 = getRandomNumber(population.length);

        while (!extractReproduceData(population[p2])[3] || p1 === p2) {
            p2 = getRandomNumber(population.length);
        }

        // while (p1 === p2) {
        //     p2 = getRandomNumber(population.length);
        // }

        parentPairs.push([population[p1], population[p2]]);
    }

    // Reset population to prepare for next generation
    population = [];

    // Crossover
    for (let i = 0; i < parentPairs.length; i++) {
        const [p1, p2] = parentPairs[i];
        const o1 = performCrossover(p1, p2);
        population.push(o1);
    }

    // Mutation
    let mutationPercent = mutationFrequencyTextBox.value / 100;
    if (mutationFrequencyTextBox.value < 0 && mutationFrequencyTextBox.value > 1) {
        mutationPercent = 0.05;
    }

    for (let i = 0; i < population.length; i++) {
        performMutation(population[i], mutationPercent);
    }
}

const applyFounderBottleneckEffect = () => {
    let newPopulationSize = 100;

    if (population.length < 1000) {
        newPopulationSize = Math.ceil(population.length * 0.1);
    }

    const newPopulation = [];

    while (newPopulation.length < newPopulationSize) {
        const r = getRandomNumber(population.length);
        newPopulation.push(population[r]);
        population.slice(r, 1);
    }

    population = newPopulation;
    updateMetrics();
    updateText();
}

// ---------- Create listeners for buttons
startButton.addEventListener("click", () => {
    let num = GENERATIONS_PER_SECOND;
    // if (roomVisitedPerSecondTextInput !== "") {
    //   num = Math.round(roomVisitedPerSecondTextInput.value);
    //   roomVisitedPerSecondTextInput.value = num;
    // }
  
    let timeValue = 1000 / num;
    start(timeValue);
  
    startButton.disabled = true;
    startButton.classList.add("disabled");
    stopButton.disabled = false;
    stopButton.classList.remove("disabled");
    climateTypeSelector.disabled = true;
    mutationFrequencyTextBox.disabled = true;
    geneFlowSelector.disabled = true;
    geneticDriftButton.disabled = true;
});

stopButton.addEventListener("click", () => {
    clearInterval(interval);
  
    startButton.disabled = false;
    startButton.classList.remove("disabled");
    stopButton.disabled = true;
    stopButton.classList.add("disabled");
    climateTypeSelector.disabled = false;
    mutationFrequencyTextBox.disabled = false;
    geneFlowSelector.disabled = false;
    geneticDriftButton.disabled = false;
});

restartButton.addEventListener("click", () => {
    clearInterval(interval);
    resetMetrics();
    generation = 1;
    population = [];
    updateText();
  
    startButton.disabled = false;
    startButton.classList.remove("disabled");
    stopButton.disabled = true;
    stopButton.classList.add("disabled");
    climateTypeSelector.disabled = false;
    mutationFrequencyTextBox.disabled = false;
    geneFlowSelector.disabled = false;
    geneticDriftButton.disabled = false;
});

geneticDriftButton.addEventListener('click', () => {
    applyFounderBottleneckEffect();
});