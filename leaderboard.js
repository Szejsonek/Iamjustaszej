// Array to store the leaderboard data
let leaderboard = [];

// Example function to update leaderboard
function updateLeaderboard(username, score) {
    // Push new score to leaderboard
    leaderboard.push({ username: username, score: score });

    // Sort the leaderboard based on score (descending)
    leaderboard.sort((a, b) => b.score - a.score);

    // Trim leaderboard to top 10
    if (leaderboard.length > 10) {
        leaderboard = leaderboard.slice(0, 10);
    }

    // Update the leaderboard display
    displayLeaderboard();
}

// Function to display the leaderboard
function displayLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = ''; // Clear the previous list

    leaderboard.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${entry.username} - ${entry.score} pts`;
        leaderboardList.appendChild(li);
    });
}

// Example: call this function when user finishes game or clicks a button
function saveScore() {
    const username = prompt("Enter your username:"); // You can modify this to get username differently
    const score = getUserScore(); // Assume this function returns the current score of the user
    updateLeaderboard(username, score);
}

// Placeholder for getting user score (this should be implemented based on your game logic)
function getUserScore() {
    // Example: return random score for now, replace it with actual score logic
    return Math.floor(Math.random() * 1000); // This will return a random score between 0 and 999
}

// Initialize leaderboard on page load
window.onload = function() {
    displayLeaderboard();
};
