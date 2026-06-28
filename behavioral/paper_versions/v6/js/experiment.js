(function() {
    
    let prolificId = ''; // Initialize globally
    let results = {
        tasks: {
            '1D_congruent_Spatial': { trials: [], summary: { correct: 0, incorrect: 0, average_response_time: 0 } },
            '1D_congruent_Categorization': { trials: [], summary: { correct: 0, incorrect: 0, average_response_time: 0 } },
            '1D_incongruent_Spatial': { trials: [], summary: { correct: 0, incorrect: 0, average_response_time: 0 } },
            '1D_incongruent_Categorization': { trials: [], summary: { correct: 0, incorrect: 0, average_response_time: 0 } },
            'inter_Spatial': { trials: [], summary: { correct: 0, incorrect: 0, average_response_time: 0 } },
            'inter_Categorization': { trials: [], summary: { correct: 0, incorrect: 0, average_response_time: 0 } }
        },
        spatialMappings1D_congruent: {},
        spatialMappings1D_incongruent: {},
        spatialMappingsinter: {},

        correctAnswers1D_congruent: {},
        correctAnswers1D_incongruent: {},
        correctAnswersinter: {},

        taskOrder: [],
        prolificId: '',

        keyMappings1D_congruent: {},
        keyMappings1D_incongruent: {},
        keyMappingsinter: {},

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
        phaseOrderIndex: null

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
        // const daplenBtn = document.getElementById('daplen-btn');
        // const brispoBtn = document.getElementById('brispo-btn');
        const dragItem = document.getElementById('draggable-image');
        const dropZones = document.querySelectorAll('.grid-square');
        const restScreen = document.getElementById('rest-screen');
        const restScreenCenterCross = document.querySelector('.center-cross');
        const categorizationImage = document.getElementById('categorization-image');
        const objects = [
            "NOUN_objects_48/1.jpg", "NOUN_objects_48/2.jpg", "NOUN_objects_48/3.jpg", "NOUN_objects_48/4.jpg",
            "NOUN_objects_48/5.jpg", "NOUN_objects_48/6.jpg", "NOUN_objects_48/7.jpg", "NOUN_objects_48/8.jpg",
            "NOUN_objects_48/9.jpg", "NOUN_objects_48/10.jpg", "NOUN_objects_48/11.jpg", "NOUN_objects_48/12.jpg",
            "NOUN_objects_48/13.jpg", "NOUN_objects_48/14.jpg", "NOUN_objects_48/15.jpg", "NOUN_objects_48/16.jpg",
            "NOUN_objects_48/17.jpg", "NOUN_objects_48/18.jpg", "NOUN_objects_48/19.jpg", "NOUN_objects_48/20.jpg",
            "NOUN_objects_48/21.jpg", "NOUN_objects_48/22.jpg", "NOUN_objects_48/23.jpg", "NOUN_objects_48/24.jpg",
            "NOUN_objects_48/25.jpg", "NOUN_objects_48/26.jpg", "NOUN_objects_48/27.jpg", "NOUN_objects_48/28.jpg",
            "NOUN_objects_48/29.jpg", "NOUN_objects_48/30.jpg", "NOUN_objects_48/31.jpg", "NOUN_objects_48/32.jpg",
            "NOUN_objects_48/33.jpeg", "NOUN_objects_48/34.jpg", "NOUN_objects_48/35.jpg", "NOUN_objects_48/36.jpg",
            "NOUN_objects_48/37.jpg", "NOUN_objects_48/38.jpg", "NOUN_objects_48/39.jpg", "NOUN_objects_48/40.jpg",
            "NOUN_objects_48/41.jpg", "NOUN_objects_48/42.jpg", "NOUN_objects_48/43.jpg", "NOUN_objects_48/44.jpg",
            "NOUN_objects_48/45.jpg", "NOUN_objects_48/46.jpg", "NOUN_objects_48/47.jpg", "NOUN_objects_48/48.jpg"
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


        // Updated generateSequences function to create sequence and avoid duplicates
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
            const spatialMappings = {};
            const correctAnswers = {};
        
            const subgrids = [
                ['square-1', 'square-2', 'square-5', 'square-6'],
                ['square-3', 'square-4', 'square-7', 'square-8'],
                ['square-9', 'square-10', 'square-13', 'square-14'],
                ['square-11', 'square-12', 'square-15', 'square-16']
            ];
        
            subgrids.forEach((subgrid, index) => {
                const shuffledSubgrid = fisherYatesShuffle(subgrid);
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
            ["Fazor", "Glint"]
        ];

        const shuffledPairs = fisherYatesShuffle([...categoryNamePairs]);

        const nameMap = {
            "1D_congruent": shuffledPairs[0],
            "1D_incongruent": shuffledPairs[1],
            "inter": shuffledPairs[2]
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
        const objectsInter = shuffledObjects.slice(32, 48);

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
        const fullSpatialTaskSequenceInter = generatePhaseSequences(objectsInter, spatialBlockRepetitions, spatialBlocks);

        const fullCategorizationTaskSequence1D_congruent = generatePhaseSequences(objects1D_congruent, categorizationBlockRepetitions, categorizationBlocks);
        const fullCategorizationTaskSequence1D_incongruent = generatePhaseSequences(objects1D_incongruent, categorizationBlockRepetitions, categorizationBlocks);
        const fullCategorizationTaskSequenceInter = generatePhaseSequences(objectsInter, categorizationBlockRepetitions, categorizationBlocks);

        // Assign categories for each phase
        const [label1_congruent, label2_congruent] = nameMap["1D_congruent"];
        const [label1_incongruent, label2_incongruent] = nameMap["1D_incongruent"];
        const [label1_inter, label2_inter] = nameMap["inter"];

        const categories1D_congruent = assignCategories(objects1D_congruent, label1_congruent, label2_congruent);
        const categories1D_incongruent = assignCategories(objects1D_incongruent, label1_incongruent, label2_incongruent);
        const categoriesInter = assignCategories(objectsInter, label1_inter, label2_inter);

        console.log("Full Categorization Task Sequence (1D Cong):", fullCategorizationTaskSequence1D_congruent);
        console.log("Full Categorization Task Sequence (1D Incong):", fullCategorizationTaskSequence1D_incongruent);
        console.log("Full Categorization Task Sequence (Inter):", fullCategorizationTaskSequenceInter);

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

        const { spatialMappings: spatialMappingsInter, correctAnswers: correctAnswersInter } =
        assignQuadrantsint(categoriesInter, label1_inter, label2_inter);
        const keyMappingsInter = assignKeyMappings(label1_inter, label2_inter, "inter", Math.random() < 0.5 ? "congruent" : "incongruent");

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
        

        // Preload all images used
        const allImages = [
            ...fullSpatialTaskSequence1D_congruent,
            ...fullCategorizationTaskSequence1D_congruent,
            ...fullSpatialTaskSequence1D_incongruent,
            ...fullCategorizationTaskSequence1D_incongruent,
            ...fullSpatialTaskSequenceInter,
            ...fullCategorizationTaskSequenceInter
        ];
        preloadImages(allImages, () => {
            console.log('All images preloaded');
        });

        // Logging mappings and sequence lengths for verification
        console.log("1D Congruent Spatial Mappings:", spatialMappings1D_congruent);
        console.log("1D Incongruent Spatial Mappings:", spatialMappings1D_incongruent);
        console.log("Inter Spatial Mappings:", spatialMappingsInter);

        console.log("1D Congruent Correct Answers:", correctAnswers1D_congruent);
        console.log("1D Incongruent Correct Answers:", correctAnswers1D_incongruent);
        console.log("Inter Correct Answers:", correctAnswersInter);

        console.log("1D Congruent Spatial Sequence Length:", fullSpatialTaskSequence1D_congruent.length);
        console.log("1D Incongruent Spatial Sequence Length:", fullSpatialTaskSequence1D_incongruent.length);
        console.log("Inter Spatial Sequence Length:", fullSpatialTaskSequenceInter.length);

        console.log("1D Congruent Categorization Sequence Length:", fullCategorizationTaskSequence1D_congruent.length);
        console.log("1D Incongruent Categorization Sequence Length:", fullCategorizationTaskSequence1D_incongruent.length);
        console.log("Inter Categorization Sequence Length:", fullCategorizationTaskSequenceInter.length);

        console.log("1D Congruent Key Mappings:", keyMappings1D_congruent);
        console.log("1D Incongruent Key Mappings:", keyMappings1D_incongruent);
        console.log("Inter Key Mappings:", keyMappingsInter);

        console.log("1D Congruent Congruency:", results.congruency1D_congruent);
        console.log("1D Incongruent Congruency:", results.congruency1D_incongruent);

        // Optional: dynamically generate key mapping instructions for each phase
        const keyMappingsText_1D_congruent = `Press '${keyMappings1D_congruent[label1_congruent].toUpperCase()}' for ${label1_congruent} and '${keyMappings1D_congruent[label2_congruent].toUpperCase()}' for ${label2_congruent}.`;
        const keyMappingsText_1D_incongruent = `Press '${keyMappings1D_incongruent[label1_incongruent].toUpperCase()}' for ${label1_incongruent} and '${keyMappings1D_incongruent[label2_incongruent].toUpperCase()}' for ${label2_incongruent}.`;
        const keyMappingsText_inter = `Press '${keyMappingsInter[label1_inter].toUpperCase()}' for ${label1_inter} and '${keyMappingsInter[label2_inter].toUpperCase()}' for ${label2_inter}.`;

        console.log("1D Congruent Key Instructions:", keyMappingsText_1D_congruent);
        console.log("1D Incongruent Key Instructions:", keyMappingsText_1D_incongruent);
        console.log("Inter Key Instructions:", keyMappingsText_inter);


        let taskOrder = [];

        // Retrieve the unique JATOS study result ID
        const resultId = jatos.studyResultId;
        console.log("JATOS Study Result ID:", resultId);

        // Define all 6 possible phase orders
        const phasePermutations = [
            ["1D_congruent", "1D_incongruent", "inter"],
            ["1D_congruent", "inter", "1D_incongruent"],
            ["1D_incongruent", "1D_congruent", "inter"],
            ["1D_incongruent", "inter", "1D_congruent"],
            ["inter", "1D_congruent", "1D_incongruent"],
            ["inter", "1D_incongruent", "1D_congruent"]
        ];

        // Use study result ID to assign one of the 6 orders
        const orderIndex = resultId % 6;
        const selectedPhaseOrder = phasePermutations[orderIndex];
        console.log("Selected Phase Order:", selectedPhaseOrder);

        // Expand each phase into its spatial → categorization pair
        selectedPhaseOrder.forEach(phase => {
            taskOrder.push(`${phase}_Spatial`);
            taskOrder.push(`${phase}_Categorization`);
        });

        // Save to results for later reference
        results.phaseOrderIndex = orderIndex;
        results.taskOrder = taskOrder;

        console.log("Assigned Task Order:", taskOrder);

    
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
    results.spatialMappingsinter = spatialMappingsInter;

    results.correctAnswers1D_congruent = correctAnswers1D_congruent;
    results.correctAnswers1D_incongruent = correctAnswers1D_incongruent;
    results.correctAnswersinter = correctAnswersInter;

    results.keyMappings1D_congruent = keyMappings1D_congruent;
    results.keyMappings1D_incongruent = keyMappings1D_incongruent;
    results.keyMappingsinter = keyMappingsInter;

    results.sequence1D_congruent = {
        spatial: fullSpatialTaskSequence1D_congruent,
        categorization: fullCategorizationTaskSequence1D_congruent
    };
    results.sequence1D_incongruent = {
        spatial: fullSpatialTaskSequence1D_incongruent,
        categorization: fullCategorizationTaskSequence1D_incongruent
    };
    results.sequenceinter = {
        spatial: fullSpatialTaskSequenceInter,
        categorization: fullCategorizationTaskSequenceInter
    };

    results.spatial1DOrientation = {
        "1D_congruent": {
            orientation: results.spatial_1D_congruent_orientation.orientation,
            leftCategory: Object.entries(results.spatial_1D_congruent_orientation.sides).find(([_, side]) => side === "left")[0],
            rightCategory: Object.entries(results.spatial_1D_congruent_orientation.sides).find(([_, side]) => side === "right")[0]
        },
        "1D_incongruent": {
            orientation: results.spatial_1D_incongruent_orientation.orientation,
            leftCategory: Object.entries(results.spatial_1D_incongruent_orientation.sides).find(([_, side]) => side === "left")[0],
            rightCategory: Object.entries(results.spatial_1D_incongruent_orientation.sides).find(([_, side]) => side === "right")[0]
        }
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
        "inter": {}
    };

    let objectCounts = {};
    for (let i = 1; i <= 48; i++) {
        objectCounts[`NOUN_objects_48/${i}.jpg`] = 0;
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
        categorizationTask.style.display = 'none';  // Ensure categorization task is hidden
        const correctSquare = spatialMapping[object];
        console.log("Showing spatial task for object:", object, "at index", taskIndex);
        const dragItem = document.getElementById('draggable-image');
       
        if (imageCache[object]) {
            dragItem.src = imageCache[object].src;
        } else {
            dragItem.src = object; // Fallback in case the image is not preloaded
        }
        resetPosition(); // Reset the position of the draggable item
        dragItem.setAttribute('draggable', 'true');
    
        // --- Count tracking ---
        if (!objectCounts[object]) {
            objectCounts[object] = 0;
        }
        objectCounts[object]++;

        // Dynamic phase + category count logic
        let phaseKey;
        const task = currentTask();
        if (task.startsWith("inter")) {
            phaseKey = "inter";
        } else {
            phaseKey = task.split('_').slice(0, 2).join('_');
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
    const totalBlocks = 24; // Total number of blocks in the experiment
    const progress = ((totalBlocksCompleted / totalBlocks) * 100).toFixed(2);
    progressBar.style.width = `${progress}%`;
}
function displayBlockResults() {
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
// Clear any timeout before showing the categorization instructions
function showCategorizationInstructions() {
    clearTimeout(timeoutId); // Clear any existing timeout
    classificationInstructionOverlay.style.display = 'flex';
    // Determine phaseKey from current task
    let phaseKey;
    const task = currentTask();
    if (task.startsWith("inter")) {
        phaseKey = "inter";
    } else {
        phaseKey = task.split('_').slice(0, 2).join('_');
    }
    const [label1, label2] = nameMap[phaseKey];


    // Use the top-level key mappings instead of results
    let currentKeyMap;
    if (phaseKey === "1D_congruent") currentKeyMap = keyMappings1D_congruent;
    else if (phaseKey === "1D_incongruent") currentKeyMap = keyMappings1D_incongruent;
    else if (phaseKey === "inter") currentKeyMap = keyMappingsInter;

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
    if (task.startsWith("inter")) {
        phaseKey = "inter";
    } else {
        phaseKey = task.split('_').slice(0, 2).join('_');
    }
    const currentCorrectAnswers = results[`correctAnswers${phaseKey}`];
    const [label1, label2] = nameMap[phaseKey];
    let currentKeyMap;
    if (phaseKey === "1D_congruent") currentKeyMap = keyMappings1D_congruent;
    else if (phaseKey === "1D_incongruent") currentKeyMap = keyMappings1D_incongruent;
    else if (phaseKey === "inter") currentKeyMap = keyMappingsInter;
    
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
                if (taskOrder.length === 0) {
                    concludeExperiment(); // Conclude the experiment if no tasks remain
                } else {
                    proceedToNextTrial(); // Proceed to the next trial
                }
            };
            // Dynamically log counts by category label
            const taskKey = currentTaskKey(); // e.g., "1D_congruent_Spatial" or "inter_Spatial"
            let phaseKey;

            if (taskKey.toLowerCase().startsWith("inter")) {
                phaseKey = "inter";
            } else {
                phaseKey = taskKey
                    .replace(/_(spatial|categorization)$/i, '')
                    .replace(/^1d_/, "1D_"); // Capitalize "1d_" to "1D_"
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
        if (taskIndex % 32 === 0 && taskIndex !== 0 && !fromRestScreen && !isTransitioning) {
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
            console.log("Resetting task index and shifting task order.");
            taskIndex = 0;
            currentBlock = 1;  // Reset block count for the new task/condition
            taskOrder.shift();
            console.log("Task order after shift:", taskOrder);
    
            if (taskOrder.length === 0) {
                console.log("No more tasks in task order. Concluding experiment.");
                concludeExperiment();
                return;
            }
    
            // Check if we are at the halfway point after shifting task order
            if (taskOrder.length === 3 && currentTask().includes('Categorization')) {
                console.log("Showing halfway point screen after spatial tasks.");
                showHalfwayPointScreen();
                return;  // Return to show halfway screen
            }
    
            console.log("Preparing for next task. Current task:", currentTask());
            isTransitioning = true; // Set transitioning flag

            setTimeout(() => {
                if (taskOrder.length === 0) {
                    console.log("No more tasks in task order. Concluding experiment.");
                    concludeExperiment();
                } else if (currentTask().includes('Spatial')) {
                    console.log("Transitioning to Spatial task.");
                    document.getElementById('spatial-overlay').style.display = 'flex';
                } else if (currentTask().includes('Categorization')) {
                    console.log("Transitioning to categorization instructions.");
                    showCategorizationInstructions(); // Only show instructions
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
            case '1D_congruent_Categorization':
                return fullCategorizationTaskSequence1D_congruent;
            case '1D_incongruent_Spatial':
                return fullSpatialTaskSequence1D_incongruent;
            case '1D_incongruent_Categorization':
                return fullCategorizationTaskSequence1D_incongruent;
            case 'inter_Spatial':
                return fullSpatialTaskSequenceInter;
            case 'inter_Categorization':
                return fullCategorizationTaskSequenceInter;
            default:
                return [];
        }
    }
    
    function currentGroupLabel() {
        switch (currentTask()) {
            case '1D_congruent_Spatial':
                return "fullSpatialTaskSequence1D_congruent";
            case '1D_congruent_Categorization':
                return "fullCategorizationTaskSequence1D_congruent";
            case '1D_incongruent_Spatial':
                return "fullSpatialTaskSequence1D_incongruent";
            case '1D_incongruent_Categorization':
                return "fullCategorizationTaskSequence1D_incongruent";
            case 'inter_Spatial':
                return "fullSpatialTaskSequenceInter";
            case 'inter_Categorization':
                return "fullCategorizationTaskSequenceInter";
            default:
                return "Unknown Task";
        }
    }
    
    
    function currentSpatialMappings() {
        switch (currentTask()) {
            case '1D_congruent_Spatial':
                return spatialMappings1D_congruent;
            case '1D_incongruent_Spatial':
                return spatialMappings1D_incongruent;
            case 'inter_Spatial':
                return spatialMappingsInter;
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
            case 'inter_Categorization':
                return correctAnswersInter;
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
            if (typeof jatos !== 'undefined') {
                jatos.endStudy()
                    .then(() => {
                        console.log("Final results successfully submitted to JATOS and study ended.");
                        // can add window.close() here after marking as finished.
                        // window.close();
                    })
                    .catch((err) => {
                        console.error("Error ending study and submitting final results to JATOS:", err);
                    });
            } else {
                console.log("Final results JSON:", JSON.stringify(results));
                // can add window.close() here if non-JATOS environments:
                // window.close();
            }
        });
};

if (typeof jatos !== 'undefined') {
    jatos.onLoad(initializeExperiment);
} else {
    document.addEventListener('DOMContentLoaded', initializeExperiment);
}
})();