// Missing mutations for the InspirationShop component

// Increase the number of searches per manual click
INCREASE_MANUAL_SEARCH_AMOUNT(state, amount) {
    state.manualSearchAmount += amount;
},

// Increase the number of pitches per manual click
INCREASE_MANUAL_PITCH_AMOUNT(state, amount) {
    state.manualPitchAmount += amount;
},

// Increase the search speed for workers
INCREASE_WORKER_SEARCH_SPEED(state, amount) {
    state.workerSearchSpeed += amount;
},

// Increase the pitch speed for workers
INCREASE_WORKER_PITCH_SPEED(state, amount) {
    state.workerPitchSpeed += amount;
},

// Decrease the search range to make searching faster
DECREASE_SEARCH_RANGE(state) {
    // Decrease the upper and lower bounds by a percentage (e.g., 10%)
    const currentRange = state.ranges.searchAmount;
    const lowerBound = Math.max(5, Math.floor(currentRange[0] * 0.9)); // Don't go below 5
    const upperBound = Math.max(10, Math.floor(currentRange[1] * 0.9)); // Don't go below 10
    
    state.ranges.searchAmount = [lowerBound, upperBound];
}, 