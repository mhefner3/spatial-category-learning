(function() {
    
    let prolificId = ''; // Initialize globally
    let results = {
        tasks: {
            '1D_congruent_Spatial': { trials: [], summary: { correct: 0, incorrect: 0, average_response_time: 0 } },
            '1D_congruent_SpatialRefresher': { trials: [], summary: { correct: 0, incorrect: 0, average_response_time: 0 } },
            '1D_congruent_Categorization': { trials: [], summary: { correct: 0, incorrect: 0, average_response_time: 0 } },
            '1D_incongruent_Spatial': { trials: [], summary: { correct: 0, incorrect: 0, average_response_time: 0 } },
            '1D_incongruent_SpatialRefresher': { trials: [], summary: { correct: 0, incorrect: 0, average_response_time: 0 } },
            '1D_incongruent_Categorization': { trials: [], summary: { correct: 0, incorrect: 0, average_response_time: 0 } },
            'inter_A_Spatial': { trials: [], summary: { correct: 0, incorrect: 0, average_response_time: 0 } },
            'inter_A_SpatialRefresher': { trials: [], summary: { correct: 0, incorrect: 0, average_response_time: 0 } },
            'inter_A_Categorization': { trials: [], summary: { correct: 0, incorrect: 0, average_response_time: 0 } },
            'inter_B_Spatial': { trials: [], summary: { correct: 0, incorrect: 0, average_response_time: 0 } },
            'inter_B_SpatialRefresher': { trials: [], summary: { correct: 0, incorrect: 0, average_response_time: 0 } },
            'inter_B_Categorization': { trials: [], summary: { correct: 0, incorrect: 0, average_response_time: 0 } }
        },

        spatialMappings1D_congruent: {},
        spatialMappings1D_incongruent: {},
        spatialMappingsinter_A: {},
        spatialMappingsinter_B: {},

        correctAnswers1D_congruent: {},
        correctAnswers1D_incongruent: {},
        correctAnswersinter_A: {},
        correctAnswersinter_B: {},

        taskOrder: [],
        prolificId: '',

        keyMappings1D_congruent: {},
        keyMappings1D_incongruent: {},
        keyMappingsinter_A: {},
        keyMappingsinter_B: {},

        spatial1DOrientation: {
            "1D_congruent": {
                orientation: "",
                leftCategory: "",
                rightCategory: ""
            },
            "1D_incongruent": {
                orientation: "",
                leftCategory: "",
                rightCategory: ""
            }
        },
        
        congruency1D_congruent: null,
        congruency1D_incongruent: null,
        phaseOrderIndex: null,
        phaseColors: {}

    };
   

    function showInformationSheet() {
        console.log('showInformationSheet called');
        document.getElementById('information-sheet').style.display = 'block';
    }
    function showConsentForm() {
        document.getElementById('information-sheet').style.display = 'none';
        document.getElementById('consent-form').style.display = 'block';
    }
    function showProlificIdForm() {
        document.getElementById('consent-form').style.display = 'none';
        document.getElementById('prolific-id-form').style.display = 'block';
    }
    function submitProlificId() {
        const prolificIdInput = document.getElementById('prolificIdInput').value;
        if (prolificIdInput.trim() !== "") {
            prolificId = prolificIdInput.trim();  // Assign Prolific ID correctly
            console.log("Prolific ID submitted:", prolificId);  // Log the Prolific ID
            document.getElementById('prolific-id-form').style.display = 'none';
            document.getElementById('welcomeScreen').style.display = 'block'; // Show the welcome screen
            updateResultsWithProlificId(prolificId); // Update results with the Prolific ID
        } else {
            document.getElementById('error').style.display = 'block';
        }
    }
    function updateResultsWithProlificId(id) {
        results.prolificId = id;
        console.log("Updated results with Prolific ID:", results.prolificId);
    }

    // Expose functions to the global scope for inline HTML event handlers
    window.showInformationSheet = showInformationSheet;
    window.showConsentForm = showConsentForm;
    window.showProlificIdForm = showProlificIdForm;
    window.submitProlificId = submitProlificId;
    
    
    const initializeExperiment = function() {
        console.log("Experiment initialization with Prolific ID:", prolificId);

        const welcomeScreen = document.getElementById('welcomeScreen');
        const beginExperimentBtn = document.getElementById('begin-experiment-btn');
        const spatialOverlay = document.getElementById('spatial-overlay');
        const startBtn = document.getElementById('start-btn');
        const startCategorizationBtn = document.getElementById('start-classification-btn');
        const jsPsychTarget = document.getElementById('jspsych-target');
        const classificationInstructionOverlay = document.getElementById('classification-instruction-overlay');
        const categorizationTask = document.getElementById('categorization-task');
        const closeButton = document.getElementById('close-btn');
        const continueBtn = document.getElementById('classification-continue-btn');
        const dragItem = document.getElementById('draggable-image');
        const dropZones = document.querySelectorAll('.grid-square');
        const restScreen = document.getElementById('rest-screen');
        const restScreenCenterCross = document.querySelector('.center-cross');
        const categorizationImage = document.getElementById('categorization-image');
        const objects = [
            "NOUN_objects_64/1.png", "NOUN_objects_64/2.png", "NOUN_objects_64/3.png", "NOUN_objects_64/4.png",
            "NOUN_objects_64/5.png", "NOUN_objects_64/6.png", "NOUN_objects_64/7.png", "NOUN_objects_64/8.png",
            "NOUN_objects_64/9.png", "NOUN_objects_64/10.png", "NOUN_objects_64/11.png", "NOUN_objects_64/12.png",
            "NOUN_objects_64/13.png", "NOUN_objects_64/14.png", "NOUN_objects_64/15.png", "NOUN_objects_64/16.png",
            "NOUN_objects_64/17.png", "NOUN_objects_64/18.png", "NOUN_objects_64/19.png", "NOUN_objects_64/20.png",
            "NOUN_objects_64/21.png", "NOUN_objects_64/22.png", "NOUN_objects_64/23.png", "NOUN_objects_64/24.png",
            "NOUN_objects_64/25.png", "NOUN_objects_64/26.png", "NOUN_objects_64/27.png", "NOUN_objects_64/28.png",
            "NOUN_objects_64/29.png", "NOUN_objects_64/30.png", "NOUN_objects_64/31.png", "NOUN_objects_64/32.png",
            "NOUN_objects_64/33.png", "NOUN_objects_64/34.png", "NOUN_objects_64/35.png", "NOUN_objects_64/36.png",
            "NOUN_objects_64/37.png", "NOUN_objects_64/38.png", "NOUN_objects_64/39.png", "NOUN_objects_64/40.png",
            "NOUN_objects_64/41.png", "NOUN_objects_64/42.png", "NOUN_objects_64/43.png", "NOUN_objects_64/44.png",
            "NOUN_objects_64/45.png", "NOUN_objects_64/46.png", "NOUN_objects_64/47.png", "NOUN_objects_64/48.png",
            "NOUN_objects_64/49.png", "NOUN_objects_64/50.png", "NOUN_objects_64/51.png", "NOUN_objects_64/52.png",
            "NOUN_objects_64/53.png", "NOUN_objects_64/54.png", "NOUN_objects_64/55.png", "NOUN_objects_64/56.png",
            "NOUN_objects_64/57.png", "NOUN_objects_64/58.png", "NOUN_objects_64/59.png", "NOUN_objects_64/60.png",
            "NOUN_objects_64/61.png", "NOUN_objects_64/62.png", "NOUN_objects_64/63.png", "NOUN_objects_64/64.png"
        ];
            
        let timeoutId;  
        let experimentConcluded = false;
        let currentBlock = 1;
        let taskIndex = 0;

        // Fisher-Yates Shuffle function
        function fisherYatesShuffle(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        // Enhanced function to avoid consecutive duplicates with a final verification step
        function avoidConsecutiveDuplicates(seq) {
            let maxAttempts = 10; // Limit the attempts to avoid infinite loops

            while (maxAttempts > 0) {
                let hasConsecutive = false;

                for (let i = 1; i < seq.length; i++) {
                    if (seq[i] === seq[i - 1]) {
                        hasConsecutive = true;
                        let swapIndex = i + 1;

                        // Look ahead for a non-duplicate item
                        while (swapIndex < seq.length && seq[swapIndex] === seq[i]) {
                            swapIndex++;
                        }

                        // If found, swap; otherwise, try looking back if possible
                        if (swapIndex < seq.length) {
                            [seq[i], seq[swapIndex]] = [seq[swapIndex], seq[i]];
                        } else if (i > 1 && seq[i] !== seq[i - 2]) {
                            [seq[i], seq[i - 2]] = [seq[i - 2], seq[i]];
                        } else {
                            // Perform a random swap within the range to prevent a stuck sequence
                            const randomIndex = Math.floor(Math.random() * (i - 1));
                            if (seq[i] !== seq[randomIndex]) {
                                [seq[i], seq[randomIndex]] = [seq[randomIndex], seq[i]];
                            }
                        }
                    }
                }

                // If no consecutive duplicates found, break the loop
                if (!hasConsecutive) break;
                maxAttempts--;
            }

            // Final verification pass
            for (let i = 1; i < seq.length; i++) {
                if (seq[i] === seq[i - 1]) {
                    console.error("Consecutive duplicate detected after max attempts:", seq[i], "at position", i);
                }
            }
        }

        function generateSequences(objects, numRepetitions) {
            let sequence = [];
            objects.forEach(obj => {
                for (let i = 0; i < numRepetitions; i++) {
                    sequence.push(obj);
                }
            });
            
            avoidConsecutiveDuplicates(sequence); // Apply check to generated sequence
            return sequence;
        }

    
        const imageCache = {};

        function preloadImages(images, callback) {
            let loadedImagesCount = 0;
            const totalImages = images.length;
        
            images.forEach(src => {
                const img = new Image();
                img.src = src;
                img.onload = () => {
                    loadedImagesCount++;
                    imageCache[src] = img; // Store the preloaded image in the cache
                    if (loadedImagesCount === totalImages && typeof callback === 'function') {
                        callback(); // All images loaded, execute callback
                    }
                };
                img.onerror = () => {
                    loadedImagesCount++;
                    if (loadedImagesCount === totalImages && typeof callback === 'function') {
                        callback(); // Proceed even if some images fail to load
                    }
                };
            });
        }

        // Assign categories
        function assignCategories(objects, label1, label2) {
        fisherYatesShuffle(objects);
        const category1 = objects.slice(0, 8);
        const category2 = objects.slice(8);
        return { [label1]: category1, [label2]: category2 }; // assigns category names dynamically for each phase
        }

        // Assign quadrants for 1D condition
        function assignQuadrants1D(categories, label1, label2, phaseKey) {
            const spatialMappings = {};
            const correctAnswers = {};
        
            const orientation = "left-right";
            const label1First = Math.random() < 0.5;
        
            const leftSquares = ['square-1', 'square-2', 'square-5', 'square-6',
                                 'square-9', 'square-10', 'square-13', 'square-14'];
            const rightSquares = ['square-3', 'square-4', 'square-7', 'square-8',
                                  'square-11', 'square-12', 'square-15', 'square-16'];
        
            const side1 = label1First ? leftSquares : rightSquares;
            const side2 = label1First ? rightSquares : leftSquares;
        
            categories[label1].forEach((obj, idx) => {
                spatialMappings[obj] = side1[idx];
                correctAnswers[obj] = label1;
            });
            categories[label2].forEach((obj, idx) => {
                spatialMappings[obj] = side2[idx];
                correctAnswers[obj] = label2;
            });
        
            const sideMap = {
                [label1]: label1First ? "left" : "right",
                [label2]: label1First ? "right" : "left"
            };
        
            results[`spatial_${phaseKey}_orientation`] = {
                sides: sideMap,
                orientation: orientation
            };
        
            return { spatialMappings, correctAnswers, sideMap };
        }        

        function assignQuadrantsint(categories, label1, label2) {
   
            const subgrids = [
                ['square-1', 'square-2', 'square-5', 'square-6'],
                ['square-3', 'square-4', 'square-7', 'square-8'],
                ['square-9', 'square-10', 'square-13', 'square-14'],
                ['square-11', 'square-12', 'square-15', 'square-16']
            ];
        
            // Helper to create a mapping once
            function createMapping() {
                const spatialMappings = {};
                const correctAnswers = {};

                subgrids.forEach((subgrid, index) => {
                    const shuffledSubgrid = fisherYatesShuffle([...subgrid]);
                    const label1Subset = categories[label1].slice(index * 2, index * 2 + 2);
                    const label2Subset = categories[label2].slice(index * 2, index * 2 + 2);
                    const combinedObjects = [...label1Subset, ...label2Subset];

                    shuffledSubgrid.forEach((square, i) => {
                        const obj = combinedObjects[i];
                        spatialMappings[obj] = square;
                        correctAnswers[obj] = categories[label1].includes(obj) ? label1 : label2;
                    });
                });

                return { spatialMappings, correctAnswers };
            }

            // Helper to check forbidden patterns
            function violatesConstraints(correctAnswers) {
                const squaresByCategory = {};
                for (const [obj, cat] of Object.entries(correctAnswers)) {
                    const squareNum = parseInt(spatialMappings[obj].split('-')[1]);
                    if (!squaresByCategory[cat]) squaresByCategory[cat] = [];
                    squaresByCategory[cat].push(squareNum);
                }

                // sets for middle rows / middle columns
                const midRows = [5,6,7,8,9,10,11,12];
                const midCols = [2,3,6,7,10,11,14,15];

                const allSameCategory = (indices) => {
                    const cats = Object.entries(correctAnswers)
                        .filter(([obj]) => indices.includes(parseInt(spatialMappings[obj].split('-')[1])))
                        .map(([,cat]) => cat);
                    return cats.every(c => c === cats[0]);
                };

                if (allSameCategory(midRows) || allSameCategory(midCols)) return true;
                return false;
            }

            // Retry until constraints are satisfied (should converge fast)
            let spatialMappings, correctAnswers;
            let tries = 0;
            do {
                ({ spatialMappings, correctAnswers } = createMapping());
                tries++;
                if (tries > 1000) {
                    console.warn("assignQuadrantsint: failed to satisfy constraints after 1000 tries");
                    break;
                }
            } while (violatesConstraints(correctAnswers));

            return { spatialMappings, correctAnswers };
        }
        
        // Assign the key mappings (congruent must be congruent, incongruent must be incongruent)
        function assignKeyMappings(label1, label2, sideMap, congruencyTarget) {
            const side1 = sideMap[label1];
        
            return (congruencyTarget === "congruent")
                ? (side1 === "left"
                    ? { [label1]: 'a', [label2]: 'l' }
                    : { [label1]: 'l', [label2]: 'a' })
                : (side1 === "left"
                    ? { [label1]: 'l', [label2]: 'a' }
                    : { [label1]: 'a', [label2]: 'l' });
        } 
     

        // Define and randomly assign unique category name pairs to the three phases
        const categoryNamePairs = [
            ["Brispo", "Daplen"],
            ["Nirpa", "Velto"],
            ["Fazor", "Glint"],
            ["Trevik", "Sornel"]
        ];

        const shuffledPairs = fisherYatesShuffle([...categoryNamePairs]);

        const nameMap = {
            "1D_congruent": shuffledPairs[0],
            "1D_incongruent": shuffledPairs[1],
            "inter_A": shuffledPairs[2],
            "inter_B": shuffledPairs[3]
        };
     
       // Set repetition and block parameters
        const spatialBlockRepetitions = 2;  // Each object appears twice per spatial block
        const spatialBlocks = 5;  // Total blocks in spatial task
        const categorizationBlockRepetitions = 2;  // Each object appears twice per categorization block
        const categorizationBlocks = 3;  // Total blocks in categorization task

        // Separate objects for each phase of the task
        const shuffledObjects = fisherYatesShuffle([...objects]);
        const objects1D_congruent = shuffledObjects.slice(0, 16);
        const objects1D_incongruent = shuffledObjects.slice(16, 32);
        const objectsInter_A = shuffledObjects.slice(32, 48);
        const objectsInter_B = shuffledObjects.slice(48, 64);       
        
        function generatePhaseSequences(objects, repetitions, blocks) {
            const phaseSequences = [];
            for (let i = 0; i < blocks; i++) {
                let blockSequence = generateSequences([...objects], repetitions);
                blockSequence = fisherYatesShuffle(blockSequence);
                avoidConsecutiveDuplicates(blockSequence);
                phaseSequences.push(blockSequence);
            }
            return phaseSequences.flat();
        }

        const fullSpatialTaskSequence1D_congruent = generatePhaseSequences(objects1D_congruent, spatialBlockRepetitions, spatialBlocks);
        const fullSpatialTaskSequence1D_incongruent = generatePhaseSequences(objects1D_incongruent, spatialBlockRepetitions, spatialBlocks);
        const fullSpatialTaskSequenceInter_A = generatePhaseSequences(objectsInter_A, spatialBlockRepetitions, spatialBlocks);
        const fullSpatialTaskSequenceInter_B = generatePhaseSequences(objectsInter_B, spatialBlockRepetitions, spatialBlocks);

        const spatialRefresherSequence1D_congruent = fisherYatesShuffle([...objects1D_congruent]);
        const spatialRefresherSequence1D_incongruent = fisherYatesShuffle([...objects1D_incongruent]);
        const spatialRefresherSequenceInter_A = fisherYatesShuffle([...objectsInter_A]);
        const spatialRefresherSequenceInter_B = fisherYatesShuffle([...objectsInter_B]);

        const fullCategorizationTaskSequence1D_congruent = generatePhaseSequences(objects1D_congruent, categorizationBlockRepetitions, categorizationBlocks);
        const fullCategorizationTaskSequence1D_incongruent = generatePhaseSequences(objects1D_incongruent, categorizationBlockRepetitions, categorizationBlocks);
        const fullCategorizationTaskSequenceInter_A = generatePhaseSequences(objectsInter_A, categorizationBlockRepetitions, categorizationBlocks);
        const fullCategorizationTaskSequenceInter_B = generatePhaseSequences(objectsInter_B, categorizationBlockRepetitions, categorizationBlocks);
        
        // Assign categories for each phase
        const [label1_congruent, label2_congruent] = nameMap["1D_congruent"];
        const [label1_incongruent, label2_incongruent] = nameMap["1D_incongruent"];
        const [label1_inter_A, label2_inter_A] = nameMap["inter_A"];
        const [label1_inter_B, label2_inter_B] = nameMap["inter_B"];

        const categories1D_congruent = assignCategories(objects1D_congruent, label1_congruent, label2_congruent);
        const categories1D_incongruent = assignCategories(objects1D_incongruent, label1_incongruent, label2_incongruent);
        const categoriesInter_A = assignCategories(objectsInter_A, label1_inter_A, label2_inter_A);
        const categoriesInter_B = assignCategories(objectsInter_B, label1_inter_B, label2_inter_B);

        console.log("Full Categorization Task Sequence (1D_congruent):", fullCategorizationTaskSequence1D_congruent);
        console.log("Full Categorization Task Sequence (1D_incongruent):", fullCategorizationTaskSequence1D_incongruent);
        console.log("Full Categorization Task Sequence (Inter_A):", fullCategorizationTaskSequenceInter_A);
        console.log("Full Categorization Task Sequence (Inter_B):", fullCategorizationTaskSequenceInter_B);

        // Assign spatial mappings
        const {
            spatialMappings: spatialMappings1D_congruent,
            correctAnswers: correctAnswers1D_congruent,
            sideMap: sideMap1D_congruent
        } = assignQuadrants1D(categories1D_congruent, label1_congruent, label2_congruent, "1D_congruent");
        const keyMappings1D_congruent = assignKeyMappings(label1_congruent, label2_congruent, sideMap1D_congruent, "congruent");
        
        const {
            spatialMappings: spatialMappings1D_incongruent,
            correctAnswers: correctAnswers1D_incongruent,
            sideMap: sideMap1D_incongruent
        } = assignQuadrants1D(categories1D_incongruent, label1_incongruent, label2_incongruent, "1D_incongruent");
        const keyMappings1D_incongruent = assignKeyMappings(label1_incongruent, label2_incongruent, sideMap1D_incongruent, "incongruent");

        const { spatialMappings: spatialMappingsInter_A, correctAnswers: correctAnswersInter_A } =
            assignQuadrantsint(categoriesInter_A, label1_inter_A, label2_inter_A);
        const keyMappingsInter_A = assignKeyMappings(label1_inter_A, label2_inter_A, "inter_A", Math.random() < 0.5 ? "congruent" : "incongruent");

        const { spatialMappings: spatialMappingsInter_B, correctAnswers: correctAnswersInter_B } =
            assignQuadrantsint(categoriesInter_B, label1_inter_B, label2_inter_B);
        const keyMappingsInter_B = assignKeyMappings(label1_inter_B, label2_inter_B, "inter_B", Math.random() < 0.5 ? "congruent" : "incongruent");


        // Congruency check function
        function checkCongruency(orientationInfo, keyMap, label1, label2) {
            const side1 = orientationInfo.sides[label1];
            const side2 = orientationInfo.sides[label2];
            const key1 = keyMap[label1];
            const key2 = keyMap[label2];
        
            const isCongruent =
                (side1 === "left" && key1 === "a" && side2 === "right" && key2 === "l") ||
                (side1 === "right" && key1 === "l" && side2 === "left" && key2 === "a");
        
            return isCongruent ? "congruent" : "incongruent";
        }      

        results.congruency1D_congruent = checkCongruency(results.spatial_1D_congruent_orientation, keyMappings1D_congruent, label1_congruent, label2_congruent);
        results.congruency1D_incongruent = checkCongruency(results.spatial_1D_incongruent_orientation, keyMappings1D_incongruent, label1_incongruent, label2_incongruent);
        results.leftRightLabels = {
            "1D_congruent": results.spatial_1D_congruent_orientation.sides,
            "1D_incongruent": results.spatial_1D_incongruent_orientation.sides
        };
        
        // Save sideMap and key mappings
        results.sideMaps = {
            "1D_congruent": sideMap1D_congruent,
            "1D_incongruent": sideMap1D_incongruent
        };

        results.keyMappings = {
            "1D_congruent": keyMappings1D_congruent,
            "1D_incongruent": keyMappings1D_incongruent,
            "inter_A": keyMappingsInter_A,
            "inter_B": keyMappingsInter_B
        };

        results.labelOrder = {
            "1D_congruent": [label1_congruent, label2_congruent],
            "1D_incongruent": [label1_incongruent, label2_incongruent],
            "inter_A": [label1_inter_A, label2_inter_A],
            "inter_B": [label1_inter_B, label2_inter_B]
        };

        console.log("Side Maps:", results.sideMaps);
        console.log("Key Mappings:", results.keyMappings);
        console.log("Label Order:", results.labelOrder);


        // Preload all images used
        const allImages = [
            ...fullSpatialTaskSequence1D_congruent,
            ...spatialRefresherSequence1D_congruent,
            ...fullCategorizationTaskSequence1D_congruent,
            ...fullSpatialTaskSequence1D_incongruent,
            ...spatialRefresherSequence1D_incongruent,
            ...fullCategorizationTaskSequence1D_incongruent,
            ...fullSpatialTaskSequenceInter_A,
            ...spatialRefresherSequenceInter_A,
            ...fullCategorizationTaskSequenceInter_A,
            ...fullSpatialTaskSequenceInter_B,
            ...spatialRefresherSequenceInter_B,
            ...fullCategorizationTaskSequenceInter_B
        ];
        preloadImages(allImages, () => {
            console.log('All images preloaded');
        });

        // Logging mappings and sequence lengths for verification
        console.log("1D_congruent Spatial Mappings:", spatialMappings1D_congruent);
        console.log("1D_incongruent Spatial Mappings:", spatialMappings1D_incongruent);
        console.log("Inter_A Spatial Mappings:", spatialMappingsInter_A);
        console.log("Inter_B Spatial Mappings:", spatialMappingsInter_B);

        console.log("1D_congruent Correct Answers:", correctAnswers1D_congruent);
        console.log("1D_incongruent Correct Answers:", correctAnswers1D_incongruent);
        console.log("Inter_A Correct Answers:", correctAnswersInter_A);
        console.log("Inter_B Correct Answers:", correctAnswersInter_B);

        console.log("1D_congruent Spatial Sequence Length:", fullSpatialTaskSequence1D_congruent.length);
        console.log("1D_incongruent Spatial Sequence Length:", fullSpatialTaskSequence1D_incongruent.length);
        console.log("Inter_A Spatial Sequence Length:", fullSpatialTaskSequenceInter_A.length);
        console.log("Inter_B Spatial Sequence Length:", fullSpatialTaskSequenceInter_B.length);

        console.log("1D_congruent Refresher Sequence:", spatialRefresherSequence1D_congruent);
        console.log("1D_incongruent Refresher Sequence:", spatialRefresherSequence1D_incongruent);
        console.log("Inter_A Refresher Sequence:", spatialRefresherSequenceInter_A);
        console.log("Inter_B Refresher Sequence:", spatialRefresherSequenceInter_B);

        console.log("1D_congruent Refresher Length:", spatialRefresherSequence1D_congruent.length);
        console.log("1D_incongruent Refresher Length:", spatialRefresherSequence1D_incongruent.length);
        console.log("Inter_A Refresher Length:", spatialRefresherSequenceInter_A.length);
        console.log("Inter_B Refresher Length:", spatialRefresherSequenceInter_B.length);

        console.log("1D_congruent Categorization Sequence Length:", fullCategorizationTaskSequence1D_congruent.length);
        console.log("1D_incongruent Categorization Sequence Length:", fullCategorizationTaskSequence1D_incongruent.length);
        console.log("Inter_A Categorization Sequence Length:", fullCategorizationTaskSequenceInter_A.length);
        console.log("Inter_B Categorization Sequence Length:", fullCategorizationTaskSequenceInter_B.length);

        console.log("1D_congruent Key Mappings:", keyMappings1D_congruent);
        console.log("1D_incongruent Key Mappings:", keyMappings1D_incongruent);
        console.log("Inter_A Key Mappings:", keyMappingsInter_A);
        console.log("Inter_B Key Mappings:", keyMappingsInter_B);

        const keyMappingsText_1D_congruent = `Press '${keyMappings1D_congruent[label1_congruent].toUpperCase()}' for ${label1_congruent} and '${keyMappings1D_congruent[label2_congruent].toUpperCase()}' for ${label2_congruent}.`;
        const keyMappingsText_1D_incongruent = `Press '${keyMappings1D_incongruent[label1_incongruent].toUpperCase()}' for ${label1_incongruent} and '${keyMappings1D_incongruent[label2_incongruent].toUpperCase()}' for ${label2_incongruent}.`;
        const keyMappingsText_inter_A = `Press '${keyMappingsInter_A[label1_inter_A].toUpperCase()}' for ${label1_inter_A} and '${keyMappingsInter_A[label2_inter_A].toUpperCase()}' for ${label2_inter_A}.`;
        const keyMappingsText_inter_B = `Press '${keyMappingsInter_B[label1_inter_B].toUpperCase()}' for ${label1_inter_B} and '${keyMappingsInter_B[label2_inter_B].toUpperCase()}' for ${label2_inter_B}.`;

        // console.log("1D_congruent Key Instructions:", keyMappingsText_1D_congruent);
        // console.log("1D_incongruent Key Instructions:", keyMappingsText_1D_incongruent);
        // console.log("Inter_A Key Instructions:", keyMappingsText_inter_A);
        // console.log("Inter_B Key Instructions:", keyMappingsText_inter_B);

        let taskOrder = [];

        // Retrieve the unique JATOS study result ID
        const resultId = jatos.studyResultId;
        console.log("JATOS Study Result ID:", resultId);

        /// Utility: generate all permutations of an array
        function permute(arr) {
            if (arr.length <= 1) return [arr];
            const result = [];
            for (let i = 0; i < arr.length; i++) {
                const current = arr[i];
                const remaining = [...arr.slice(0, i), ...arr.slice(i + 1)];
                for (const sub of permute(remaining)) {
                    result.push([current, ...sub]);
                }
            }
            return result;
        }

        // Utility: shuffle an array in place (Fisher-Yates)
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [array[i], array[j]] = [array[j], array[i]];
            }
            return array;
        }

        const basePhases = ["1D_congruent", "1D_incongruent", "inter_A", "inter_B"];
        const allPermutations = permute(basePhases);

        // Filter out permutations that group 1D or inter phases together
        const filteredPermutations = allPermutations.filter(p => {
        const joined = p.join(",");
        // Exclude if 1D phases are consecutive
        if (joined.includes("1D_congruent,1D_incongruent") || joined.includes("1D_incongruent,1D_congruent")) return false;
        // Exclude if inter phases are consecutive
        if (joined.includes("inter_A,inter_B") || joined.includes("inter_B,inter_A")) return false;
        return true;
        });

        // Now pick deterministically using the same modulo rule
        const selectedPhaseOrder = filteredPermutations[resultId % filteredPermutations.length];
        console.log("Selected Phase Order (filtered):", selectedPhaseOrder);

        // Define 4 grid colors
        const gridColors = ["#e6f7ff", "#fff2cc", "#e6ffe6", "#f9e6ff"];
        // Deterministically shuffle the color order for this participant
        const colorOrder = shuffleArray([...gridColors]);
        const selectedColorOrder = colorOrder.slice(0, selectedPhaseOrder.length);

        // Map each phase to a color
        const phaseColors = {};
        selectedPhaseOrder.forEach((phase, i) => {
        phaseColors[phase] = selectedColorOrder[i];
        });
        console.log("Phase color mapping:", phaseColors);

        // Train-then-test: first add all spatial tasks, then all categorization tasks
        selectedPhaseOrder.forEach(phase => {
            taskOrder.push(`${phase}_Spatial`);
        });
        selectedPhaseOrder.forEach(phase => {
            taskOrder.push(`${phase}_SpatialRefresher`);
            taskOrder.push(`${phase}_Categorization`);
        });

        // Save to results for later reference
        results.phaseOrderIndex = resultId % allPermutations.length;
        results.taskOrder = taskOrder;
        results.phaseColors = phaseColors; 
    
    //======================================================================//
    //======================== SKIP LOGIC FOR TESTING =====================//
    //=====================================================================//
    // Enhanced skip to the next object/block logic (comment out for production)

    // document.addEventListener('keydown', function(event) {
    //     if (event.key === "ArrowDown") {
    //         console.log("Skip to next task triggered by ArrowDown key.");
    
    //         clearTimeout(timeoutId);
    
    //         // Conditionally remove the handleKeyPress listener if defined
    //         if (typeof handleKeyPress === 'function') {
    //             document.removeEventListener('keydown', handleKeyPress);
    //         } else {
    //             console.log("handleKeyPress not active or already removed.");
    //         }
    
    //         // Clear feedback display if it's showing
    //         const feedbackLabel = document.getElementById('categorization-feedback-label');
    //         if (feedbackLabel) {
    //             feedbackLabel.style.display = 'none';
    //         }
    
    //         // Save current object as skipped (NaN response time, incorrect) 
    //         const group = currentGroup();
    //         const object = group[taskIndex];
    //         console.log("Skipping trial for object:", object);
    //         saveAndDisplayDetailedData(false, object, NaN);
    
    //         proceedToNextTrial();
    //     }
    // });    
    //=====================================================================//
    //=====================================================================//


    
    restScreenCenterCross.addEventListener('click', function() {
        if (isTransitioning || isHalfwayScreenActive) {
            console.log("Transition is in progress or halfway screen is active, skipping rest screen click action.");
            return; // Prevent triggering next task during transition or when halfway screen is active
        }
        console.log("Rest screen cross clicked. Proceeding to next task.");
        restScreen.style.display = 'none';
        isTransitioning = false; // Set transitioning flag
        proceedToNextTrial(true); // Proceed to next task directly without checking for rest screen again
    });



    results.spatialMappings1D_congruent = spatialMappings1D_congruent;
    results.spatialMappings1D_incongruent = spatialMappings1D_incongruent;
    results.spatialMappingsinter_A = spatialMappingsInter_A;
    results.spatialMappingsinter_B = spatialMappingsInter_B;

    results.correctAnswers1D_congruent = correctAnswers1D_congruent;
    results.correctAnswers1D_incongruent = correctAnswers1D_incongruent;
    results.correctAnswersinter_A = correctAnswersInter_A;
    results.correctAnswersinter_B = correctAnswersInter_B;

    results.keyMappings1D_congruent = keyMappings1D_congruent;
    results.keyMappings1D_incongruent = keyMappings1D_incongruent;
    results.keyMappingsinter_A = keyMappingsInter_A;
    results.keyMappingsinter_B = keyMappingsInter_B;

    results.sequence1D_congruent = {
        spatial: fullSpatialTaskSequence1D_congruent,
        categorization: fullCategorizationTaskSequence1D_congruent
    };
    results.sequence1D_incongruent = {
        spatial: fullSpatialTaskSequence1D_incongruent,
        categorization: fullCategorizationTaskSequence1D_incongruent
    };
    results.sequenceinter_A = {
        spatial: fullSpatialTaskSequenceInter_A,
        categorization: fullCategorizationTaskSequenceInter_A
    };
    results.sequenceinter_B = {
        spatial: fullSpatialTaskSequenceInter_B,
        categorization: fullCategorizationTaskSequenceInter_B
    };

    results.spatialRefreshers = {
        "1D_congruent": spatialRefresherSequence1D_congruent,
        "1D_incongruent": spatialRefresherSequence1D_incongruent,
        "inter_A": spatialRefresherSequenceInter_A,
        "inter_B": spatialRefresherSequenceInter_B
    };

    results.taskOrder = taskOrder;
    results.prolificId = prolificId;
 

    let blockResults = {
        correct: 0,
        incorrect: 0,
        
    };    

    let startTime; // Variable to hold the start time of each task

    function resetPosition() {
        // Move the image back to its central parent container
        const centerArea = document.getElementById('center-area');
        centerArea.appendChild(dragItem);

        // Set styles to ensure consistency
        dragItem.style.position = 'initial';
        dragItem.style.width = '125px';
        dragItem.style.height = '125px';
    }
    
    let categoryCounts = {
        "1D_congruent": {},
        "1D_incongruent": {},
        "inter_A": {},
        "inter_B": {}
    };

    let objectCounts = {};
    for (let i = 1; i <= 64; i++) {
        objectCounts[`NOUN_objects_64/${i}.png`] = 0;
    }

    function showSpatialTask(group, spatialMapping) {
        clearTimeout(timeoutId);  // Clear any existing timeout
        if (!group || taskIndex >= group.length) {
            console.error("Group is undefined or taskIndex is out of bounds in showSpatialTask");
            return; // Early exit if group is undefined or taskIndex is out of bounds
        }
        startTime = Date.now();  // Start timing the task
        const object = group[taskIndex];
        jsPsychTarget.style.display = 'grid';
        jsPsychTarget.style.gridTemplateColumns = 'repeat(4, 1fr)';
        jsPsychTarget.style.gridTemplateRows = 'repeat(4, 1fr)';
        const currentPhaseName = currentTask().split("_").slice(0, 2).join("_");
        const phaseColor = phaseColors?.[currentPhaseName] || "#ffffff";
        document.querySelectorAll(".grid-square").forEach(square => {
            square.style.backgroundColor = phaseColor;
        });
        console.log("Setting grid color:", currentPhaseName, phaseColor);
        categorizationTask.style.display = 'none';  // Ensure categorization task is hidden
        const correctSquare = spatialMapping[object];
        console.log("Showing spatial task for object:", object, "at index", taskIndex);
        const dragItem = document.getElementById('draggable-image');

       resetPosition();
        if (imageCache[object]) {
            dragItem.src = imageCache[object].src;
        } else {
            dragItem.src = object; // Fallback in case the image is not preloaded
        }
        dragItem.setAttribute('draggable', 'true');
    
        // --- Count tracking ---
        if (!objectCounts[object]) {
            objectCounts[object] = 0;
        }
        objectCounts[object]++;

        // Dynamic phase + category count logic
        let phaseKey;
        const task = currentTask();
        if (task.startsWith("inter_A")) {
            phaseKey = "inter_A";
        } else if (task.startsWith("inter_B")) {
            phaseKey = "inter_B";
        } else if (task.startsWith("1D_congruent")) {
            phaseKey = "1D_congruent";
        } else if (task.startsWith("1D_incongruent")) {
            phaseKey = "1D_incongruent";
        }

        const currentCorrectAnswers = results[`correctAnswers${phaseKey}`];
        const [label1, label2] = nameMap[phaseKey];

        if (!categoryCounts[phaseKey]) categoryCounts[phaseKey] = {};
        if (!categoryCounts[phaseKey][label1]) categoryCounts[phaseKey][label1] = 0;
        if (!categoryCounts[phaseKey][label2]) categoryCounts[phaseKey][label2] = 0;

        if (currentCorrectAnswers && currentCorrectAnswers[object] === label1) {
            categoryCounts[phaseKey][label1]++;
        } else if (currentCorrectAnswers && currentCorrectAnswers[object] === label2) {
            categoryCounts[phaseKey][label2]++;
        }
    
        dropZones.forEach(zone => {
            zone.removeEventListener('drop', zone.dropHandler);
            zone.removeEventListener('dragover', zone.dragOverHandler);
            zone.dragOverHandler = function(event) {
                event.preventDefault();
            };
            zone.dropHandler = function(event) {
                event.preventDefault();
                clearTimeout(timeoutId);  // Clear the timeout as soon as a drop is detected
                const droppedElement = document.getElementById('draggable-image');
                event.target.appendChild(droppedElement);
    
                console.log("Dropped in:", event.target.id, "Expected:", correctSquare);
    
                const selectedSquare = event.target.id;  // The grid square the object was dropped into
                const responseTime = Date.now() - startTime;
                const isCorrect = checkCorrectness(selectedSquare, correctSquare);

                saveAndDisplayDetailedData(isCorrect, object, responseTime, selectedSquare, correctSquare);

                if (isCorrect) {
                    showSpatialFeedback(true, group, spatialMapping, object);
                } else {
                    showSpatialFeedback(false, group, spatialMapping, object);
                }
                // Disable dragging after initial response
                dragItem.setAttribute('draggable', 'false');
                
            };
            zone.addEventListener('dragover', zone.dragOverHandler);
            zone.addEventListener('drop', zone.dropHandler);
        });
    
        timeoutId = setTimeout(() => {
            const responseTime = Date.now() - startTime;
            clearTimeout(timeoutId);  // Clear the timeout to prevent multiple triggers
            console.log("Timeout occurred.");  // Log that a timeout has occurred
            alert("You took too long, please respond quicker. Moving to the next trial.");
            saveAndDisplayDetailedData(false, object, NaN); // Correctly reference the current object
            proceedToNextTrial();  // Move to the next trial or handle end of the group

        }, 10000);  // Set timeout for 10 seconds
        
    
        isTransitioning = false; // Ensure transition flag is reset
    }
    

    function saveAndDisplayDetailedData(correct, stimulus, responseTime, selectedSquare = null, correctSquare = null) {
        const taskKey = currentTask().toLowerCase().replace(/ /g, '_');
        const timestamp = new Date().toISOString();
        const taskType = currentTask(); // Capture the current task type
    
        const isTimeout = isNaN(responseTime);

        // Ensure the taskKey exists in results.tasks
        if (!results.tasks[taskKey]) {
            results.tasks[taskKey] = {
                trials: [],
                summary: {
                    correct: 0,
                    incorrect: 0,
                    average_response_time: 0
                }
            };
        }
    
        // Collect trial-level data
        const trialData = {
            stimulus: stimulus,
            response: isTimeout ? "timeout" : (correct ? "correct" : "incorrect"),
            correct: isTimeout ? null : correct,
            response_time: isTimeout ? "NaN" : responseTime,
            timestamp: timestamp,
            task_type: taskType 
        };

        if (taskType.includes("Spatial") && typeof phaseColors !== "undefined") {
            const phaseKey = taskType.split("_")[0]; // e.g., "1D_congruent"
            trialData.grid_color = phaseColors[phaseKey] || null;
        }

        if (taskKey.includes("spatial")) {
            trialData.selected_square = selectedSquare;  // Where the participant placed the object
            trialData.correct_square = correctSquare;   // The actual correct placement
        }
    
        // Add trial data to the results object
        results.tasks[taskKey].trials.push(trialData);
    
        // Update summary data
        if (correct) {
            results.tasks[taskKey].summary.correct++;
            blockResults.correct++; // Update block-specific results
        } else {
            results.tasks[taskKey].summary.incorrect++;
            blockResults.incorrect++; // Update block-specific results
        }
    
        // Update average response time
        if (!isTimeout) {
            const totalTrials = results.tasks[taskKey].trials.filter(trial => !isNaN(trial.response_time)).length;
            const totalTime = results.tasks[taskKey].trials.reduce((acc, trial) => acc + (isNaN(trial.response_time) ? 0 : trial.response_time), 0);
            results.tasks[taskKey].summary.average_response_time = totalTrials > 0 ? totalTime / totalTrials : 0;
        }
        
        // Log detailed data to console (for your review)
        console.log("Detailed Data: ", trialData);
    
        // Display detailed data in an HTML element
        const detailedDataElement = document.getElementById('detailed-data');
        if (detailedDataElement) {
            detailedDataElement.textContent = JSON.stringify(results.tasks[taskKey], null, 2);
            detailedDataElement.style.display = 'block';
        }
    }    
let totalBlocksCompleted = 1; // Global tracker for blocks completed across tasks
function updateProgressBar() {
    const progressBar = document.getElementById('progress-bar');
    const totalBlocks = 32; // 4 phases × (5 spatial + 3 categorization) = 32 blocks
    const progress = ((totalBlocksCompleted / totalBlocks) * 100).toFixed(2);
    progressBar.style.width = `${progress}%`;
}
function displayBlockResults() {
     if (currentTask().includes('SpatialRefresher')) {
        console.log("Skipping block results for Spatial Refresher — showing task results only.");
        const taskKey = currentTask().toLowerCase().replace(/ /g, '_');
        displayTaskResults(taskKey);
        return;
    }
    const blockResultsOverlay = document.getElementById('blockResultsOverlay');
    const blockResultsElement = document.getElementById('block-results');
    
    const totalAttempts = blockResults.correct + blockResults.incorrect;
    const accuracy = (totalAttempts > 0) ? ((blockResults.correct / totalAttempts) * 100).toFixed(2) : "0.00";

    // Display results along with current task and condition
    blockResultsElement.innerHTML = `
        <p><strong>Correct answers:</strong> ${blockResults.correct}</p>
        <p><strong>Incorrect answers:</strong> ${blockResults.incorrect}</p>
        <p><strong>Accuracy:</strong> ${accuracy}%</p>
    `;

    blockResultsOverlay.style.display = 'flex';

    const continueBtn = document.getElementById('continue-btn');
    continueBtn.onclick = () => {
        blockResultsOverlay.style.display = 'none';

        // Define block limit based on task type
        const blockLimit = currentTask().includes('Spatial') ? 5 : 3;

        if (currentBlock >= blockLimit) {
            console.log(`Reached end of blocks, triggering task results.`);
            currentBlock = 1;  // Reset block count
            const taskKey = currentTask().toLowerCase().replace(/ /g, '_'); 
            displayTaskResults(taskKey);
        } else {
            currentBlock++; // Continue to the next block in the same task and condition
            showRestScreen(); // Show rest screen if more blocks are remaining
        }
        totalBlocksCompleted++; // Increment global block counter
        updateProgressBar();
        resetBlockResults();

    };
}


function resetBlockResults() {
    blockResults = {
        correct: 0,
        incorrect: 0
    };
}

function showSpatialFeedback(isCorrect, group, spatialMapping, object) {
    const feedbackLabel = document.getElementById('feedback-label');
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    feedbackLabel.innerText = isCorrect ? 'Correct' : 'Incorrect';
    feedbackLabel.style.color = isCorrect ? 'green' : 'red';

    const dragItemRect = dragItem.getBoundingClientRect();
    const centerAreaRect = document.getElementById('center-area').getBoundingClientRect();

    feedbackLabel.style.left = `${dragItemRect.left - centerAreaRect.left + dragItemRect.width / 2}px`;
    feedbackLabel.style.top = `${dragItemRect.top - centerAreaRect.top - 50}px`;
    feedbackLabel.style.transform = 'translateX(-50%)';

    if (isCorrect) {
        setTimeout(() => {
            dragItem.style.border = '5px solid green';
            feedbackLabel.style.display = 'block'
            setTimeout(() => {
                dragItem.style.border = 'none';
                feedbackLabel.style.display = 'none';
                proceedToNextTrial();
            }, 1000);
        }, 500);
    } else {
        setTimeout(() => {
            dragItem.style.border = '5px solid red';
            feedbackLabel.style.display = 'block'
            setTimeout(() => {
                dragItem.style.border = 'none';
                feedbackLabel.style.display = 'none';
                handleIncorrectSpatialResponse(object, spatialMapping[object]);
            }, 1000);
        }, 500);
    }
}

// Function to handle incorrect response for spatial task
function handleIncorrectSpatialResponse(imageSrc, correctSquare) {
    const dragItem = document.getElementById('draggable-image');
    const feedbackLabel = document.getElementById('feedback-label');

    setTimeout(() => {
        dragItem.src = imageSrc;
        dragItem.style.border = '5px solid green';
        const correctDropZone = document.getElementById(correctSquare);
        correctDropZone.appendChild(dragItem);
        const newDragItemRect = dragItem.getBoundingClientRect();
        const centerAreaRect = document.getElementById('center-area').getBoundingClientRect();
        feedbackLabel.innerText = 'Correct';
        feedbackLabel.style.color = 'green';
        feedbackLabel.style.left = `${newDragItemRect.left - centerAreaRect.left + newDragItemRect.width / 2}px`;
        feedbackLabel.style.top = `${newDragItemRect.top - centerAreaRect.top - 50}px`; // Adjust -50px to move higher above the image
        feedbackLabel.style.transform = 'translateX(-50%)';
        feedbackLabel.style.display = 'block';
        setTimeout(() => {
            dragItem.style.border = 'none';
            feedbackLabel.style.display = 'none';
            proceedToNextTrial();
        }, 1000);
    }, 500);
    
}
 
function checkCorrectness(selectedAnswer, correctAnswer) {
    return selectedAnswer === correctAnswer;
}


 // Clear any timeout before showing the spatial task instructions
 function showSpatialInstructions() {
    clearTimeout(timeoutId); // Clear any existing timeout
    spatialOverlay.style.display = 'flex';
}
function showSpatialRefresherInstructions() {
    clearTimeout(timeoutId); // Safety: clear any pending trial timeout
    console.log("Showing spatial refresher overlay.");
    const refresherOverlay = document.getElementById('spatial-refresher-overlay');
    refresherOverlay.style.display = 'flex';

    const continueBtn = document.getElementById('spatial-refresher-continue-btn');
    continueBtn.onclick = () => {
        console.log("Starting spatial refresher task...");
        refresherOverlay.style.display = 'none';
        showSpatialTask(currentGroup(), currentSpatialMappings());
    };
}
// Clear any timeout before showing the categorization instructions
function showCategorizationInstructions() {
    clearTimeout(timeoutId); // Clear any existing timeout
    classificationInstructionOverlay.style.display = 'flex';
    // Determine phaseKey from current task
    const task = currentTask();
    let phaseKey = task.split('_').slice(0, 2).join('_');  // Handles 1D_congruent, 1D_incongruent, inter_A, inter_B
    const [label1, label2] = nameMap[phaseKey];

    // Use the top-level key mappings instead of results
    let currentKeyMap;
    if (phaseKey === "1D_congruent") currentKeyMap = keyMappings1D_congruent;
    else if (phaseKey === "1D_incongruent") currentKeyMap = keyMappings1D_incongruent;
    else if (phaseKey === "inter_A") currentKeyMap = keyMappingsInter_A;
    else if (phaseKey === "inter_B") currentKeyMap = keyMappingsInter_B;

    if (!currentKeyMap || !label1 || !label2) {
        console.error("Missing key mappings or labels for phaseKey:", phaseKey);
        return;
    }

    const keyMappingsText = `Press '${currentKeyMap[label1].toUpperCase()}' for ${label1} and '${currentKeyMap[label2].toUpperCase()}' for ${label2}.`;
    document.getElementById('key-mapping-text').innerText = keyMappingsText;
}



function showCategorizationTask(group, correctAnswers) {
    clearTimeout(timeoutId);  // Clear any existing timeout
    
    if (!group || taskIndex >= group.length) {
        console.error("Group is undefined or taskIndex is out of bounds in showCategorizationTask");
        return; // Early exit if group is undefined or taskIndex is out of bounds
    }
    startTime = Date.now();  // Record start time when task is shown
    const object = group[taskIndex];
    console.log("Displaying object: ", object, "at index", taskIndex); // Log the pre-generated sequence object

    // Ensure categorization task is displayed and spatial task is hidden
    categorizationTask.style.display = 'flex';
    jsPsychTarget.style.display = 'none';
    const categorizationImage = document.getElementById('categorization-image');
    const feedbackLabel = document.getElementById('feedback-label');
    // Remove any previous event listeners to avoid multiple updates
    categorizationImage.onload = null;
     // Set the image source once and use onload to display it only after fully loaded
    categorizationImage.onload = () => {
        categorizationImage.style.display = 'block';
    };
    categorizationImage.src = object; // Set image source once
    categorizationImage.style.display = 'block';
    categorizationImage.style.width = '150px';
    categorizationImage.style.height = '150px';

    // --- Dynamic category and key mapping logic ---
    let phaseKey;
    const task = currentTask();
    phaseKey = task.split('_').slice(0, 2).join('_');  // Supports "inter_A", "inter_B", etc.
    const currentCorrectAnswers = results[`correctAnswers${phaseKey}`];
    const [label1, label2] = nameMap[phaseKey];
    let currentKeyMap;
    if (phaseKey === "1D_congruent") currentKeyMap = keyMappings1D_congruent;
    else if (phaseKey === "1D_incongruent") currentKeyMap = keyMappings1D_incongruent;
    else if (phaseKey === "inter_A") currentKeyMap = keyMappingsInter_A;
    else if (phaseKey === "inter_B") currentKeyMap = keyMappingsInter_B;
    
    // Track object count and category count
    objectCounts[object] = (objectCounts[object] || 0) + 1;

    if (!categoryCounts[phaseKey]) categoryCounts[phaseKey] = {};
    if (!categoryCounts[phaseKey][label1]) categoryCounts[phaseKey][label1] = 0;
    if (!categoryCounts[phaseKey][label2]) categoryCounts[phaseKey][label2] = 0;

    if (currentCorrectAnswers && currentCorrectAnswers[object] === label1) {
        categoryCounts[phaseKey][label1]++;
    } else if (currentCorrectAnswers && currentCorrectAnswers[object] === label2) {
        categoryCounts[phaseKey][label2]++;
    }

    let responseRegistered = false; // Flag to check if a response was recorded
    // Event listener for key-based responses
    function handleKeyPress(event) {
        if (responseRegistered) {
            return; // Ignore if already responded
        }
    
        let response;
        if (event.key === currentKeyMap[label1]) {
            response = label1;
            console.log(`Key '${currentKeyMap[label1]}' pressed for ${label1}.`);
        } else if (event.key === currentKeyMap[label2]) {
            response = label2;
            console.log(`Key '${currentKeyMap[label2]}' pressed for ${label2}.`);
        } else {
            return;
        }
    
        responseRegistered = true;
        document.removeEventListener('keydown', handleKeyPress);
        clearTimeout(timeoutId);    

        const correctAnswer = currentCorrectAnswers[object];
        const isCorrect = checkCorrectness(response, correctAnswer);
        const responseTime = Date.now() - startTime;

        saveAndDisplayDetailedData(isCorrect, object, responseTime);
        showCategorizationFeedback(isCorrect);
    }

    document.addEventListener('keydown', handleKeyPress);

    // Start a timeout to display an alert and skip if no response is recorded
    timeoutId = setTimeout(() => {
        if (!responseRegistered) { // Ensure it only triggers if no response was registered
            document.removeEventListener('keydown', handleKeyPress);
            clearTimeout(timeoutId);
            console.log("Timeout occurred.");  // Log that a timeout has occurred
            alert("You took too long, please respond quicker. Moving to the next trial.");
            saveAndDisplayDetailedData(false, object, NaN); // Record timeout as incorrect
            proceedToNextTrial();  // Move to the next trial
        }
    }, 10000);  // Set timeout for 10 seconds
    
    isTransitioning = false; // Ensure transition flag is reset
}


// Function to show feedback for categorization
function showCategorizationFeedback(isCorrect) {
    const feedbackLabel = document.getElementById('categorization-feedback-label');
    const categorizationImage = document.getElementById('categorization-image');

    const imageRect = categorizationImage.getBoundingClientRect();
    feedbackLabel.style.left = `${imageRect.left + window.scrollX + imageRect.width / 2}px`;
    feedbackLabel.style.top = `${imageRect.top + window.scrollY - 50}px`; // Adjust -50px to move slightly above the image
    feedbackLabel.style.transform = 'translateX(-50%)';

    feedbackLabel.style.display = 'block';
    feedbackLabel.innerText = isCorrect ? 'Correct' : 'Incorrect';
    feedbackLabel.style.color = isCorrect ? 'green' : 'red';
    categorizationImage.style.border = isCorrect ? '5px solid green' : '5px solid red';

    setTimeout(() => {
        feedbackLabel.style.display = 'none';
        categorizationImage.style.border = 'none';
        proceedToNextTrial(); // Move to next trial after feedback
    }, 1000); // Delay for feedback display
}


let isTransitioning = false; // Flag to indicate if transitioning to next task

function displayTaskResults(taskKey) {
    if (!taskKey || !results.tasks.hasOwnProperty(taskKey)) {
        console.error("Invalid taskKey or uninitialized results object for key:", taskKey);
        return; // Exit the function if taskKey is invalid
    }
        jsPsychTarget.style.display = 'none';
        categorizationTask.style.display = 'none';
        const taskResults = results.tasks[taskKey];
        const totalAttempts = taskResults.summary.correct + taskResults.summary.incorrect;
        const accuracy = (totalAttempts > 0) ? ((taskResults.summary.correct / totalAttempts) * 100).toFixed(2) : "0.00";

        const resultsOverlay = document.getElementById('resultsOverlay');
        if (resultsOverlay) {
            resultsOverlay.innerHTML = `
                <div style="text-align: center; padding: 20px; border-radius: 10px; background-color: #f7f7f7; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);">
                    <h1 style="font-size: 36px; color: #333;">Here are your results for this task:</h1>
                    <p style="font-size: 24px; margin-bottom: 10px;"><strong>Correct answers:</strong> ${taskResults.summary.correct}</p>
                    <p style="font-size: 24px; margin-bottom: 10px;"><strong>Incorrect answers:</strong> ${taskResults.summary.incorrect}</p>
                    <p style="font-size: 24px; margin-bottom: 20px;"><strong>Accuracy:</strong> ${accuracy}%</p>
                    <button id="closeResultsBtn" style="padding: 15px 30px; font-size: 20px; cursor: pointer; border: none; background-color: #4CAF50; color: white; border-radius: 5px;">Continue</button>
                </div>`;
            resultsOverlay.style.display = 'flex';
            resultsOverlay.style.justifyContent = 'center';
            resultsOverlay.style.alignItems = 'center';
            resultsOverlay.style.position = 'fixed';
            resultsOverlay.style.top = '0';
            resultsOverlay.style.left = '0';
            resultsOverlay.style.width = '100%';
            resultsOverlay.style.height = '100%';
            resultsOverlay.style.backgroundColor = 'rgba(0,0,0,0.5)'; // Darker background with increased opacity
            resultsOverlay.style.backdropFilter = 'blur(10px)'; // Apply a blur effect to the background

            const closeResultsBtn = document.getElementById('closeResultsBtn');
            closeResultsBtn.onclick = () => {
                resultsOverlay.style.display = 'none';

                if (currentTask().includes('SpatialRefresher')) {
                    console.log("Finished refresher, advancing to next task...");
                    resetBlockResults();  
                    taskIndex = 0;
                    currentBlock = 1;
                    taskOrder.shift(); // Move to the categorization task
                    if (taskOrder.length > 0 && taskOrder[0].includes('Categorization')) {
                        console.log("Next task is categorization — showing instructions.");
                        showCategorizationInstructions();
                    } else {
                        proceedToNextTrial(true);
                    }
                    return;
                }
                if (taskOrder.length === 0) {
                    concludeExperiment(); // Conclude the experiment if no tasks remain
                } else {
                    proceedToNextTrial(); // Proceed to the next trial
                }
            };
            
            const taskKeyLower = taskKey.toLowerCase();
            let phaseKey;

            if (taskKeyLower.startsWith("inter_a")) phaseKey = "inter_A";
            else if (taskKeyLower.startsWith("inter_b")) phaseKey = "inter_B";
            else if (taskKeyLower.startsWith("1d_congruent")) phaseKey = "1D_congruent";
            else if (taskKeyLower.startsWith("1d_incongruent")) phaseKey = "1D_incongruent";
            else {
                console.warn("Unrecognized phaseKey for taskKey:", taskKey);
                return;
            }

            if (!nameMap[phaseKey]) {
                console.warn("nameMap missing entry for phaseKey:", phaseKey);
                return;
            }

            const [label1, label2] = nameMap[phaseKey];
            const catCounts = categoryCounts[phaseKey] || {};

            console.log(`Category counts after ${phaseKey}:`);
            console.log(`${label1} Count:`, catCounts[label1] || 0);
            console.log(`${label2} Count:`, catCounts[label2] || 0);
        } else {
            console.error("resultsOverlay element not found!");
        }

}


    function currentTaskKey() {
        return currentTask().toLowerCase().replace(/ /g, '_');
    }

    function saveResultsToJATOS() {
        const resultsJSON = JSON.stringify(results);
        // Submit the results to JATOS
        jatos.submitResultData(resultsJSON)
            .then(() => {
                console.log("Results successfully submitted to JATOS.");
            })
            .catch((err) => {
                console.error("Error submitting results to JATOS:", err);
            });
    }
    
    
    function concludeExperiment() {
        console.log("Concluding experiment...");
        const experimentConcludedOverlay = document.getElementById('experiment-concluded-overlay');
        experimentConcludedOverlay.style.display = 'flex';
    
        const resultsOverlay = document.getElementById('resultsOverlay');
        if (resultsOverlay) {
            resultsOverlay.style.display = 'none';
        }
    
        saveResultsToJATOS();
        
        // Submit interim results to JATOS
        if (typeof jatos !== 'undefined') {
            jatos.submitResultData(JSON.stringify(results))
                .then(() => {
                    console.log("Interim results successfully submitted to JATOS.");
                })
                .catch((err) => {
                    console.error("Error submitting interim results to JATOS:", err);
                });
        } else {
            console.log("Final results JSON:", JSON.stringify(results));
        }
    }
    

    function proceedToNextTrial(fromRestScreen = false) {
        if (isHalfwayScreenActive) {
            console.log("Halfway screen is active, skipping proceedToNextTrial call.");
            return; // Prevent proceeding while the halfway screen is active
        }
    
        if (isTransitioning) {
            console.log("Transition is in progress, skipping proceedToNextTrial call.");
            return; // Prevent multiple transitions
        }
        clearTimeout(timeoutId); // Clear the timeout timer when moving to the next task
    
        if (experimentConcluded) {
            return; // Do not proceed if the experiment has concluded
        }
        
        if (!fromRestScreen) {
            taskIndex++;
        }
    
        // Show block results every 32 trials directly using taskIndex
        if (taskIndex % 32 === 0 && taskIndex !== 0 && !fromRestScreen && !isTransitioning && !currentTask().includes('SpatialRefresher')) {
            console.log("Triggering block results display at Task Index:", taskIndex);
            displayBlockResults();
            return;
        }
    
        // Hide current task display elements
        jsPsychTarget.style.display = 'none';
        categorizationTask.style.display = 'none';
    
        const group = currentGroup();
        const groupLabel = currentGroupLabel();
        if (!group || taskIndex >= group.length) {
            const finishedTask = currentTask(); 
            console.log("Reached end of group:", currentTask());

                if (currentTask().includes('SpatialRefresher')) {
                    const taskKey = currentTask().toLowerCase().replace(/ /g, '_');
                    console.log("Displaying task results for spatial refresher:", taskKey);
                    displayTaskResults(taskKey);
                    return;
                }

            console.log("Resetting task index and shifting task order.");
            taskIndex = 0;
            currentBlock = 1;  // Reset block count for the new task/condition
            taskOrder.shift();
            console.log("Task order after shift:", taskOrder);

            // Check if we are at the halfway point after shifting task order
            if (
                finishedTask.includes('Spatial') && !finishedTask.includes('Refresher') &&
                taskOrder.length > 0 && currentTask().includes('SpatialRefresher')
            ) {
                console.log("All main spatial tasks complete — showing halfway point screen.");
                showHalfwayPointScreen();
                return;
            }
    
            if (taskOrder.length === 0) {
                console.log("No more tasks in task order. Concluding experiment.");
                concludeExperiment();
                return;
            }
    
            console.log("Preparing for next task. Current task:", currentTask());
            isTransitioning = true; // Set transitioning flag

            setTimeout(() => {
                if (taskOrder.length === 0) {
                    console.log("No more tasks in task order. Concluding experiment.");
                    concludeExperiment();
                } else if (currentTask().includes('SpatialRefresher')) {
                    console.log("Transitioning to Spatial Refresher task.");
                    showSpatialRefresherInstructions(); 
                } else if (currentTask().includes('Spatial')) {
                    console.log("Transitioning to Spatial task.");
                    document.getElementById('spatial-overlay').style.display = 'flex';
                } else if (currentTask().includes('Categorization')) {
                    console.log("Transitioning to Categorization task.");
                    showCategorizationInstructions();
                }
                isTransitioning = false; // Reset transitioning flag after transition
            }, 100); // Adjust delay to 100ms
        } else {
            console.log("Continuing with task. Task index:", taskIndex, "Current task:", currentTask());
            if (taskOrder.length === 0) {
                console.log("No more tasks in task order. Concluding experiment.");
                concludeExperiment();
            } else {
                isTransitioning = true; // Set transitioning flag
                if (currentTask().includes('Spatial')) {
                    showSpatialTask(currentGroup(), currentSpatialMappings());
                } else {
                    showCategorizationTask(currentGroup(), currentCorrectAnswers());
                }
                isTransitioning = false; // Reset transitioning flag after task display
            }
        }
    }
    

    function showRestScreen() {
    if (taskOrder.length === 0) {
        console.log("No more tasks in task order. Concluding experiment instead of showing rest screen.");
        concludeExperiment();
    } else {
        console.log("Displaying rest screen.");
        restScreen.style.display = 'flex';
    }
    }
    
    let isHalfwayScreenActive = false;
    function showHalfwayPointScreen() {
        console.log("Displaying halfway point screen.");
        isHalfwayScreenActive = true; // Set the flag to true
        const halfwayScreen = document.getElementById('halfway-screen');
        halfwayScreen.style.display = 'flex';
    
        const continueHalfwayBtn = document.getElementById('halfway-continue-btn');
        continueHalfwayBtn.onclick = () => {
            console.log("Continue button clicked on halfway screen.");
            halfwayScreen.style.display = 'none';
            isHalfwayScreenActive = false; // Reset the flag to false
            // Check if the next task is spatial or categorization
            if (currentTask().includes('Spatial')) {
                showSpatialInstructions(); // Show spatial task instructions
            } else if (currentTask().includes('Categorization')) {
                showCategorizationInstructions(); // Show categorization instructions instead
            } else {
                proceedToNextTrial(true); // Proceed to next trial directly if needed
            }
        };
    }
    

    function currentTask() {
        return taskOrder.length > 0 ? taskOrder[0] : "";
    }
    
    function currentGroup() {
        switch (currentTask()) {
            case '1D_congruent_Spatial':
                return fullSpatialTaskSequence1D_congruent;
            case '1D_congruent_SpatialRefresher':
                return spatialRefresherSequence1D_congruent;
            case '1D_congruent_Categorization':
                return fullCategorizationTaskSequence1D_congruent;

            case '1D_incongruent_Spatial':
                return fullSpatialTaskSequence1D_incongruent;
            case '1D_incongruent_SpatialRefresher':
                return spatialRefresherSequence1D_incongruent;
            case '1D_incongruent_Categorization':
                return fullCategorizationTaskSequence1D_incongruent;

            case 'inter_A_Spatial':
                return fullSpatialTaskSequenceInter_A;
            case 'inter_A_SpatialRefresher':
                return spatialRefresherSequenceInter_A;
            case 'inter_A_Categorization':
                return fullCategorizationTaskSequenceInter_A;

            case 'inter_B_Spatial':
                return fullSpatialTaskSequenceInter_B;
            case 'inter_B_SpatialRefresher':
                return spatialRefresherSequenceInter_B;
            case 'inter_B_Categorization':
                return fullCategorizationTaskSequenceInter_B;

            default:
                return [];
        }
    }

    
    function currentGroupLabel() {
        switch (currentTask()) {
            case '1D_congruent_Spatial':
                return "fullSpatialTaskSequence1D_congruent";
            case '1D_congruent_SpatialRefresher':
                return "spatialRefresherSequence1D_congruent";
            case '1D_congruent_Categorization':
                return "fullCategorizationTaskSequence1D_congruent";

            case '1D_incongruent_Spatial':
                return "fullSpatialTaskSequence1D_incongruent";
            case '1D_incongruent_SpatialRefresher':
                return "spatialRefresherSequence1D_incongruent";
            case '1D_incongruent_Categorization':
                return "fullCategorizationTaskSequence1D_incongruent";

            case 'inter_A_Spatial':
                return "fullSpatialTaskSequenceInter_A";
            case 'inter_A_SpatialRefresher':
                return "spatialRefresherSequenceInter_A";
            case 'inter_A_Categorization':
                return "fullCategorizationTaskSequenceInter_A";

            case 'inter_B_Spatial':
                return "fullSpatialTaskSequenceInter_B";
            case 'inter_B_SpatialRefresher':
                return "spatialRefresherSequenceInter_B";
            case 'inter_B_Categorization':
                return "fullCategorizationTaskSequenceInter_B";

            default:
                return "Unknown Task";
        }
    }

     
    function currentSpatialMappings() {
        switch (currentTask()) {
            case '1D_congruent_Spatial':
            case '1D_congruent_SpatialRefresher':
                return spatialMappings1D_congruent;
            case '1D_incongruent_Spatial':
            case '1D_incongruent_SpatialRefresher':
                return spatialMappings1D_incongruent;
            case 'inter_A_Spatial':
            case 'inter_A_SpatialRefresher':
                return spatialMappingsInter_A;
            case 'inter_B_Spatial':
            case 'inter_B_SpatialRefresher':
                return spatialMappingsInter_B;
            default:
                return {};
        }
    }


    function currentCorrectAnswers() {
        switch (currentTask()) {
            case '1D_congruent_Categorization':
                return correctAnswers1D_congruent;
            case '1D_incongruent_Categorization':
                return correctAnswers1D_incongruent;
            case 'inter_A_Categorization':
                return correctAnswersInter_A;
            case 'inter_B_Categorization':
                return correctAnswersInter_B;
            default:
                return {};
        }
    }

        
        beginExperimentBtn.addEventListener('click', function() {
            welcomeScreen.style.display = 'none';
            reminderScreen.style.display = 'block';
            updateProgressBar(); // Initialize progress bar at the start
        });
        document.getElementById('proceed-to-experiment-btn').addEventListener('click', function() {
            document.getElementById('reminderScreen').style.display = 'none';
            showSpatialInstructions(); // Show the spatial instructions screens
        });
    
        startBtn.addEventListener('click', function() {
            spatialOverlay.style.display = 'none'; // Hide the instructions overlay
            // Make sure the jsPsychTarget is displayed as a grid
            jsPsychTarget.style.display = 'grid';
            jsPsychTarget.style.gridTemplateColumns = 'repeat(4, 1fr)';
            jsPsychTarget.style.gridTemplateRows = 'repeat(4, 1fr)';
            
            showSpatialTask(currentGroup(), currentSpatialMappings());
        });  
        
        startCategorizationBtn.addEventListener('click', function() {
            classificationInstructionOverlay.style.display = 'none'; // Hide the instructions overlay
        
            // Ensure the categorization task is displayed and spatial task is hidden
            categorizationTask.style.display = 'flex';
            jsPsychTarget.style.display = 'none';
        
           // Dynamically retrieve the current group and correct answers
            showCategorizationTask(currentGroup(), currentCorrectAnswers());

            console.log(currentTask() + " task started.");
        });

        document.getElementById('close-btn').addEventListener('click', function() {
            console.log("Final results JSON:", JSON.stringify(results));

            if (typeof jatos !== 'undefined' && jatos.submitResultData) {
                jatos.submitResultData(results) // ← don't stringify
                    .then(() => {
                        console.log("Results submitted. Ending study...");
                        jatos.endStudy(); // ← no .then()
                    })
                    .catch(err => {
                        console.error("Error submitting results:", err);
                        jatos.endStudy(); // still end the study even if submit fails
                    });
            } else {
                console.warn("JATOS not available (running locally or outside server).");
                // window.close(); // optional local close
            }
        });
};

if (typeof jatos !== 'undefined') {
    jatos.onLoad(initializeExperiment);
} else {
    document.addEventListener('DOMContentLoaded', initializeExperiment);
}
})();