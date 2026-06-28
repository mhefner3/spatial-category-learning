(function() {
    
    let prolificId = ''; // Initialize globally
    let results = {
        tasks: {
            '1d_spatial': {
                trials: [],
                summary: {
                    correct: 0,
                    incorrect: 0,
                    average_response_time: 0
                }
            },
            '1d_categorization': {
                trials: [],
                summary: {
                    correct: 0,
                    incorrect: 0,
                    average_response_time: 0
                }
            },
            'int_spatial': {
                trials: [],
                summary: {
                    correct: 0,
                    incorrect: 0,
                    average_response_time: 0
                }
            },
            'int_categorization': {
                trials: [],
                summary: {
                    correct: 0,
                    incorrect: 0,
                    average_response_time: 0
                }
            }
        },
        spatialMappings1D: {},
        spatialMappingsint: {},
        correctAnswers1D: {},
        correctAnswersint: {},
        taskOrder: [],
        prolificId: '',
        sequence1D: {},  
        sequenceint: {},
        spatial1DOrientation: {
            orientation: "",  // To store either "left-right" or "up-down"
            brispoSide: "",   // To store which side (left/right or top/bottom) brispo is on
            daplenSide: ""    // To store which side daplen is on
        },   
        keyMappings: {
            brispo: "",  // Will be set to 'a' or 'l'
            daplen: ""   // Will be set to the opposite key
        },
        congruency: null  // Will be set to 'congruent' or 'incongruent'

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
            "NOUN_objects_32/1.jpg", "NOUN_objects_32/2.jpg", "NOUN_objects_32/3.jpg", "NOUN_objects_32/4.jpg",
            "NOUN_objects_32/5.jpg", "NOUN_objects_32/6.jpg", "NOUN_objects_32/7.jpg", "NOUN_objects_32/8.jpg",
            "NOUN_objects_32/9.jpg", "NOUN_objects_32/10.jpg", "NOUN_objects_32/11.jpg", "NOUN_objects_32/12.jpg",
            "NOUN_objects_32/13.jpg", "NOUN_objects_32/14.jpg", "NOUN_objects_32/15.jpg", "NOUN_objects_32/16.jpg",
            "NOUN_objects_32/17.jpg", "NOUN_objects_32/18.jpg", "NOUN_objects_32/19.jpg", "NOUN_objects_32/20.jpg",
            "NOUN_objects_32/21.jpg", "NOUN_objects_32/22.jpg", "NOUN_objects_32/23.jpg", "NOUN_objects_32/24.jpg",
            "NOUN_objects_32/25.jpg", "NOUN_objects_32/26.jpg", "NOUN_objects_32/27.jpg", "NOUN_objects_32/28.jpg",
            "NOUN_objects_32/29.jpg", "NOUN_objects_32/30.jpg", "NOUN_objects_32/31.jpg", "NOUN_objects_32/32.jpg"
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
        function assignCategories(objects) {
            fisherYatesShuffle(objects);
            const brispo = objects.slice(0, 8);
            const daplen = objects.slice(8);
            return { brispo, daplen };
        }

          // Assign quadrants for 1D condition
          function assignQuadrants1D(categories) {
            const { brispo, daplen } = categories;
            const spatialMappings = {};
            const correctAnswers = {};
        
            // Enforce only 'left-right' orientation
            const orientation = "left-right";

            // Randomly decide whether brispo or daplen gets assigned to the first set of squares
            const brispoFirst = Math.random() < 0.5;

             // Define left and right squares according to the correct left-right configuration
            const leftSquares = ['square-1', 'square-2', 'square-5', 'square-6', 
                'square-9', 'square-10', 'square-13', 'square-14'];
            const rightSquares = ['square-3', 'square-4', 'square-7', 'square-8', 
                    'square-11', 'square-12', 'square-15', 'square-16'];

            if (brispoFirst) {
            // brispo on the left, daplen on the right
            brispo.forEach((obj, idx) => {
            spatialMappings[obj] = leftSquares[idx];
            correctAnswers[obj] = 'brispo';
            });
            daplen.forEach((obj, idx) => {
            spatialMappings[obj] = rightSquares[idx];
            correctAnswers[obj] = 'daplen';
            });

            results.spatial1DOrientation.brispoSide = "left";
            results.spatial1DOrientation.daplenSide = "right";
            } else {
            // brispo on the right, daplen on the left
            brispo.forEach((obj, idx) => {
            spatialMappings[obj] = rightSquares[idx];
            correctAnswers[obj] = 'brispo';
            });
            daplen.forEach((obj, idx) => {
            spatialMappings[obj] = leftSquares[idx];
            correctAnswers[obj] = 'daplen';
            });

            results.spatial1DOrientation.brispoSide = "right";
            results.spatial1DOrientation.daplenSide = "left";
            }

            results.spatial1DOrientation.orientation = "left-right";
            return { spatialMappings, correctAnswers };
        }


        function assignQuadrantsint(categories) {
            const { brispo, daplen } = categories;
            const spatialMappings = {};
            const correctAnswers = {};
        
            // Define the four 2x2 subgrids in the 4x4 grid
            const subgrids = [
                ['square-1', 'square-2', 'square-5', 'square-6'],  // Top-left 2x2
                ['square-3', 'square-4', 'square-7', 'square-8'],  // Top-right 2x2
                ['square-9', 'square-10', 'square-13', 'square-14'], // Bottom-left 2x2
                ['square-11', 'square-12', 'square-15', 'square-16'] // Bottom-right 2x2
            ];
        
            // Assign objects to each subgrid
            subgrids.forEach((subgrid, index) => {
                // Randomly shuffle the squares within the subgrid
                const shuffledSubgrid = fisherYatesShuffle(subgrid);
        
                // Select two brispo and two daplen for this subgrid without modifying the original arrays
                const brispoSubset = brispo.slice(index * 2, index * 2 + 2);
                const daplenSubset = daplen.slice(index * 2, index * 2 + 2);
                const combinedObjects = [...brispoSubset, ...daplenSubset];
        
                // Assign the shuffled squares: first two to Brispo, last two to Daplen
                shuffledSubgrid.forEach((square, i) => {
                    const obj = combinedObjects[i];
                    spatialMappings[obj] = square;
        
                    // Determine the category of the object and store it in correctAnswers
                    correctAnswers[obj] = brispo.includes(obj) ? 'brispo' : 'daplen';

                    // console.log(`Assigned ${obj} to ${square} as ${correctAnswers[obj]}`);

                });
            });
        
            return { spatialMappings, correctAnswers };
        }

        // Randomly assign 'a' or 'l' to brispo and daplen
        const keyMappings = Math.random() < 0.5 
        ? { brispo: 'a', daplen: 'l' } 
        : { brispo: 'l', daplen: 'a' };
        results.keyMappings = keyMappings; // Store the key mappings in results immediately
            
       // Set repetition and block parameters
        const spatialBlockRepetitions = 2;  // Each object appears twice per spatial block
        const spatialBlocks = 5;  // Total blocks in spatial task
        const categorizationBlockRepetitions = 2;  // Each object appears twice per categorization block
        const categorizationBlocks = 3;  // Total blocks in categorization task

        // Separate objects for each condition
        const shuffledObjects = fisherYatesShuffle([...objects]);
        const objects1D = shuffledObjects.slice(0, 16);  // First 16 objects for 1D
        const objectsint = shuffledObjects.slice(16);  // Last 16 objects for Inter

        // Generate sequences for Spatial Task (1D and Inter conditions)
        const spatialSequences1D = [];
        const spatialSequencesInter = [];

        for (let i = 0; i < spatialBlocks; i++) {
            let blockSequence1D = generateSequences([...objects1D], spatialBlockRepetitions);
            let blockSequenceInter = generateSequences([...objectsint], spatialBlockRepetitions);
            
            // Shuffle and then check each block sequence for consecutive duplicates
            blockSequence1D = fisherYatesShuffle(blockSequence1D);
            avoidConsecutiveDuplicates(blockSequence1D);
            
            blockSequenceInter = fisherYatesShuffle(blockSequenceInter);
            avoidConsecutiveDuplicates(blockSequenceInter);
            
            spatialSequences1D.push(blockSequence1D);
            spatialSequencesInter.push(blockSequenceInter);
        }

        const fullSpatialTaskSequence1D = spatialSequences1D.flat();
        const fullSpatialTaskSequenceInter = spatialSequencesInter.flat();
        console.log("Full Spatial Task Sequence (1D):", fullSpatialTaskSequence1D);
        console.log("Full Spatial Task Sequence (Inter):", fullSpatialTaskSequenceInter);

        // Generate sequences for Categorization Task (1D and Inter conditions)
        const categorizationSequences1D = [];
        const categorizationSequencesInter = [];

        for (let j = 0; j < categorizationBlocks; j++) {
            let blockSequence1D = generateSequences([...objects1D], categorizationBlockRepetitions);
            let blockSequenceInter = generateSequences([...objectsint], categorizationBlockRepetitions);
            
            // Shuffle and then check each block sequence for consecutive duplicates
            blockSequence1D = fisherYatesShuffle(blockSequence1D);
            avoidConsecutiveDuplicates(blockSequence1D);
            
            blockSequenceInter = fisherYatesShuffle(blockSequenceInter);
            avoidConsecutiveDuplicates(blockSequenceInter);
            
            categorizationSequences1D.push(blockSequence1D);
            categorizationSequencesInter.push(blockSequenceInter);
        }

        const fullCategorizationTaskSequence1D = categorizationSequences1D.flat();
        const fullCategorizationTaskSequenceInter = categorizationSequencesInter.flat();
        console.log("Full Categorization Task Sequence (1D):", fullCategorizationTaskSequence1D);
        console.log("Full Categorization Task Sequence (Inter):", fullCategorizationTaskSequenceInter);

        // Assign categories for each condition
        const categories1D = assignCategories(objects1D);
        const categoriesint = assignCategories(objectsint);

        // Assign quadrants and mappings for spatial tasks
        const { spatialMappings: spatialMappings1D, correctAnswers: correctAnswers1D } = assignQuadrants1D(categories1D);
        const { spatialMappings: spatialMappingsint, correctAnswers: correctAnswersint } = assignQuadrantsint(categoriesint);

        // Preload images for all sequences
        const allImages = [
            ...fullSpatialTaskSequence1D,
            ...fullSpatialTaskSequenceInter,
            ...fullCategorizationTaskSequence1D,
            ...fullCategorizationTaskSequenceInter
        ];
        preloadImages(allImages, () => {
            console.log('All images preloaded');
        });

        function checkCongruency() {
            const brispoSide = results.spatial1DOrientation.brispoSide; // 'left' or 'right'
            const daplenSide = results.spatial1DOrientation.daplenSide; // 'left' or 'right'
            const brispoKey = results.keyMappings.brispo; // 'a' or 'l'
            const daplenKey = results.keyMappings.daplen; // 'a' or 'l'
        
            // Congruency conditions:
            const isCongruent =
                (brispoSide === "left" && brispoKey === "a" && daplenSide === "right" && daplenKey === "l") ||
                (brispoSide === "right" && brispoKey === "l" && daplenSide === "left" && daplenKey === "a");
        
            results.congruency = isCongruent ? "congruent" : "incongruent";
    
        }
        checkCongruency();

        // Logging mappings and sequence lengths for verification
        console.log("1D Spatial Mappings:", spatialMappings1D);
        console.log("Inter Spatial Mappings:", spatialMappingsint);
        console.log("1D Correct Answers:", correctAnswers1D);
        console.log("Inter Correct Answers:", correctAnswersint);
        console.log("Full Spatial Task Sequence Length (1D):", fullSpatialTaskSequence1D.length);
        console.log("Full Spatial Task Sequence Length (Inter):", fullSpatialTaskSequenceInter.length);
        console.log("Full Categorization Task Sequence Length (1D):", fullCategorizationTaskSequence1D.length);
        console.log("Full Categorization Task Sequence Length (Inter):", fullCategorizationTaskSequenceInter.length);
        // console.log("Brispo Side:", results.spatial1DOrientation.brispoSide);
        // console.log("Daplen Side:", results.spatial1DOrientation.daplenSide);
        console.log("Assigned Key Mappings:", keyMappings);
        console.log("Congruency:", results.congruency);
        const keyMappingsText = `Press '${keyMappings.brispo.toUpperCase()}' for Brispo and '${keyMappings.daplen.toUpperCase()}' for Daplen.`;



        let taskOrder = [];

        // Retrieve the unique JATOS study result ID
        const resultId = jatos.studyResultId;
        console.log("JATOS Study Result ID:", resultId);

        // Check if the resultId is even or odd to assign the condition
        if (resultId % 2 === 0) {
            taskOrder = ['1D_Spatial', '1D_Categorization', 'Int_Spatial', 'Int_Categorization'];
            console.log("Assigned to 1D-first condition.");
        } else {
            taskOrder = ['Int_Spatial', 'Int_Categorization', '1D_Spatial', '1D_Categorization'];
            console.log("Assigned to int-first condition.");
        }

        // Save task order in results
        results.taskOrder = taskOrder;

        console.log("Assigned Task Order: ", taskOrder);
       




    // // Enhanced skip to the next object/block logic
    // document.addEventListener('keydown', function(event) {
    //     if (event.key === "ArrowDown") {  // Check if the down arrow key was pressed
    //         console.log("Skip to next task triggered by ArrowDown key.");

    //         // Clear any existing timeout for the current trial
    //         clearTimeout(timeoutId);

    //         // Conditionally remove the handleKeyPress listener if defined
    //         if (typeof handleKeyPress === 'function') {
    //             document.removeEventListener('keydown', handleKeyPress);  // Remove if handleKeyPress exists
    //         }
            
    //         // Clear feedback display if it's in the middle of showing
    //         const feedbackLabel = document.getElementById('categorization-feedback-label');
    //         if (feedbackLabel) {
    //             feedbackLabel.style.display = 'none';
    //         }

    //         // Move to the next trial, ensuring a clean state
    //         proceedToNextTrial();
    //     }
    // });



    
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



    results.spatialMappings1D = spatialMappings1D;
    results.spatialMappingsint = spatialMappingsint;
    results.correctAnswers1D = correctAnswers1D;
    results.correctAnswersint = correctAnswersint;
    results.taskOrder = taskOrder;
    results.prolificId = prolificId;
    results.sequence1D = {
        spatial: fullSpatialTaskSequence1D,
        categorization: fullCategorizationTaskSequence1D
    };
    results.sequenceint = {
        spatial: fullSpatialTaskSequenceInter,
        categorization: fullCategorizationTaskSequenceInter
    };


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
    
    
    let objectCounts = {};
    let brispoCount = 0;
    let daplenCount = 0;
        // Initialize counts for all objects
        objects.forEach((obj, index) => {
            objectCounts[`NOUN_objects_32/${index + 1}.jpg`] = 0;
    });


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
    
        // Increment object counter
        if (!objectCounts[object]) {
            objectCounts[object] = 0;
        }
        objectCounts[object]++;
        if (correctAnswers1D[object] === "brispo" || correctAnswersint[object] === "brispo") {
            brispoCount++;
        } else {
            daplenCount++;
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
    const totalBlocks = 16; // Total number of blocks in the experiment
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
            const taskKey = currentTask().toLowerCase().replace(/ /g, '_'); // E.g., "1D_Spatial"
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
    document.getElementById('key-mapping-text').innerText = keyMappingsText;  // This sets the key mappings message

}


// let leftRightOrderCounts = [0, 0]; // [daplen first, brispo first]
// let topBottomOrderCounts = [0, 0]; // [daplen first, brispo first]

// function randomizeButtonPositions() {
//     const buttonContainer = document.getElementById('button-container');
//     const buttonContainerTopBottom = document.getElementById('button-container-top-bottom');

//     // Determine the orientation randomly
//     const isTopBottom = Math.random() < 0.5;

//     if (isTopBottom) {
//         // Set button positions to top-bottom
//         buttonContainer.style.display = 'none';
//         buttonContainerTopBottom.style.display = 'flex';

//         const buttons = Array.from(buttonContainerTopBottom.querySelectorAll('.classification-btn'));

//         // Check if counts are even and shuffle accordingly
//         if (topBottomOrderCounts[0] === topBottomOrderCounts[1]) {
//             shuffleArray(buttons);
//         } else if (topBottomOrderCounts[0] < topBottomOrderCounts[1]) {
//             buttons.sort((a, b) => a.id === 'daplen-btn' ? -1 : 1);
//         } else {
//             buttons.sort((a, b) => a.id === 'brispo-btn' ? -1 : 1);
//         }

//         buttons.forEach((btn, index) => {
//             btn.style.order = index + 1;
//         });

//         // Update the counts
//         if (buttons[0].id === 'daplen-btn') {
//             topBottomOrderCounts[0]++;
//         } else {
//             topBottomOrderCounts[1]++;
//         }
//     } else {
//         // Set button positions to left-right
//         buttonContainer.style.display = 'flex';
//         buttonContainerTopBottom.style.display = 'none';

//         const buttons = Array.from(buttonContainer.querySelectorAll('.classification-btn'));

//         // Check if counts are even and shuffle accordingly
//         if (leftRightOrderCounts[0] === leftRightOrderCounts[1]) {
//             shuffleArray(buttons);
//         } else if (leftRightOrderCounts[0] < leftRightOrderCounts[1]) {
//             buttons.sort((a, b) => a.id === 'daplen-btn' ? -1 : 1);
//         } else {
//             buttons.sort((a, b) => a.id === 'brispo-btn' ? -1 : 1);
//         }

//         buttons.forEach((btn, index) => {
//             btn.style.order = index + 1;
//         });

//         // Update the counts
//         if (buttons[0].id === 'daplen-btn') {
//             leftRightOrderCounts[0]++;
//         } else {
//             leftRightOrderCounts[1]++;
//         }
//     }

// }

// // Utility function to shuffle an array
// function shuffleArray(array) {
//     for (let i = array.length - 1; i > 0; i--) {
//         const j = Math.floor(Math.random() * (i + 1));
//         [array[i], array[j]] = [array[j], array[i]];
//     }
// }
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

    // Increment object counter
    objectCounts[object] = (objectCounts[object] || 0) + 1;
    if (correctAnswers1D[object] === "brispo" || correctAnswersint[object] === "brispo") {
        brispoCount++;
    } else {
        daplenCount++;
    }

    let responseRegistered = false; // Flag to check if a response was recorded
    // Event listener for key-based responses
    function handleKeyPress(event) {
        let response;
        if (event.key === keyMappings.brispo) {  // Check if key matches brispo
            response = "brispo";
            console.log(`Key '${keyMappings.brispo}' pressed for Brispo.`);
        } else if (event.key === keyMappings.daplen) {  // Check if key matches daplen
            response = "daplen";
            console.log(`Key '${keyMappings.daplen}' pressed for Daplen.`);
        } else {
            return;  // Ignore other keys
        }

        document.removeEventListener('keydown', handleKeyPress);
        clearTimeout(timeoutId);

        const correctAnswer = correctAnswers[object];
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


// function classifyObject(answer, correctAnswers) {
//     clearTimeout(timeoutId);
//     const group = currentGroup(); // Ensure we are using the categorization group
//     const currentObject = group[taskIndex];
//     const correctAnswer = correctAnswers[currentObject];
    
//     if (!currentObject) {
//         console.error("Current object is undefined in classifyObject");
//         console.log(`taskIndex: ${taskIndex}, group length: ${group.length}`);
//         console.log(`Current group: ${JSON.stringify(group)}`);
//         return;
//     }
//     console.log("classifyObject called. Answer:", answer, "Correct Answer:", correctAnswer);

//     const isCorrect = checkCorrectness(answer, correctAnswer);

//     const taskKey = currentTaskKey();
//     const responseTime = Date.now() - startTime;
//     saveAndDisplayDetailedData(isCorrect, currentObject, responseTime);

//     if (isCorrect) {
//         showCategorizationFeedback(true);
//     } else {
//         showCategorizationFeedback(false);
//     }
// }


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
            // Log counts to console after each task (4 blocks)
            console.log("Object Counts after task:", objectCounts);
            console.log("Brispo Count after task:", brispoCount);
            console.log("Daplen Count after task:", daplenCount);
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
            console.log("Current Group in proceedToNextTrial:", groupLabel, "Task Index:", taskIndex);
    
            if (taskOrder.length === 0) {
                console.log("No more tasks in task order. Concluding experiment.");
                concludeExperiment();
                return;
            }
    
            // Check if we are at the halfway point after shifting task order
            if (taskOrder.length === 2 && currentTask().includes('Spatial')) {
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
        if (currentTask().includes('1D_Spatial')) {
            return fullSpatialTaskSequence1D;  // Use the full 1D spatial sequence
        } else if (currentTask().includes('1D_Categorization')) {
            return fullCategorizationTaskSequence1D;  // Use the full 1D categorization sequence
        } else if (currentTask().includes('Int_Spatial')) {
            return fullSpatialTaskSequenceInter;  // Use the full Inter spatial sequence
        } else if (currentTask().includes('Int_Categorization')) {
            return fullCategorizationTaskSequenceInter;  // Use the full Inter categorization sequence
        }
    }
    function currentGroupLabel() {
        if (currentTask().includes('1D_Spatial')) {
            return "fullSpatialTaskSequence1D";
        } else if (currentTask().includes('1D_Categorization')) {
            return "fullCategorizationTaskSequence1D";
        } else if (currentTask().includes('Int_Spatial')) {
            return "fullSpatialTaskSequenceInter";
        } else if (currentTask().includes('Int_Categorization')) {
            return "fullCategorizationTaskSequenceInter";
        }
        return "Unknown Task"; // Default label if none match
    }
    
    function currentSpatialMappings() {
        return currentTask().includes('1D') ? spatialMappings1D : spatialMappingsint;
    }
    
    function currentCorrectAnswers() {
        return currentTask().includes('1D') ? correctAnswers1D : correctAnswersint;
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