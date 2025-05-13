//used CoPilot to transform pcode again
function tsp_ls(distance_matrix) {
  // Handle edge cases
  if (!distance_matrix || distance_matrix.length <= 1) {
    return 0;
  }
  
  const n = distance_matrix.length;
  
  // If only zeros, return 0
  if (distance_matrix.every(row => row.every(val => val === 0))) {
    return 0;
  }
  
  // Create initial random route (a permutation of city indices)
  function createRandomRoute() {
    const route = Array.from({ length: n }, (_, i) => i);
    
    // Fisher-Yates shuffle
    for (let i = route.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [route[i], route[j]] = [route[j], route[i]];
    }
    
    return route;
  }
  
  // Calculate the total distance of a route
  function calculateDistance(route) {
    let distance = 0;
    for (let i = 0; i < route.length - 1; i++) {
      distance += distance_matrix[route[i]][route[i + 1]];
    }
    return distance;
  }
  
  // Perform 2-opt swap
  function twoOptSwap(route, i, k) {
    // Create a new route
    const newRoute = [...route];
    
    // Reverse the segment from i to k
    let left = i;
    let right = k;
    while (left < right) {
      [newRoute[left], newRoute[right]] = [newRoute[right], newRoute[left]];
      left++;
      right--;
    }
    
    return newRoute;
  }
  
  // Initialize variables for the search
  let currentRoute = createRandomRoute();
  let bestDistance = calculateDistance(currentRoute);
  let improved = true;
  
  // Stopping criteria parameters
  const MAX_ITERATIONS = n * 20; // Scale with problem size
  const MAX_NO_IMPROVEMENT = n * 2; // Scale with problem size
  let iterations = 0;
  let noImprovementCount = 0;
  
  // Main loop - continue while improvements are found and 
  // we haven't exceeded maximum iterations
  while (improved && iterations < MAX_ITERATIONS && noImprovementCount < MAX_NO_IMPROVEMENT) {
    improved = false;
    iterations++;
    
    // Select random i and k values for this iteration
    // Using randomized approach to explore different parts of the solution space
    const i = Math.floor(Math.random() * (n - 1));
    // Ensure k is at least i+1 to have a valid segment to reverse
    const k = i + 1 + Math.floor(Math.random() * (n - i - 1));
    
    // Generate new route by swapping
    const newRoute = twoOptSwap(currentRoute, i, k);
    const newDistance = calculateDistance(newRoute);
    
    // If new route is better, keep it
    if (newDistance < bestDistance) {
      currentRoute = newRoute;
      bestDistance = newDistance;
      improved = true;
      noImprovementCount = 0;
    } else {
      noImprovementCount++;
    }
  }
  
  return bestDistance;
}
