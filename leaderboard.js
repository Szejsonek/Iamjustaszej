// Array to store the leaderboard data
let leaderboard = [];

// Variable to store the current score
let currentScore = 0;

// Update the leaderboard by adding the player's score
function updateLeaderboard(username, score) {
    leaderboard.push({ username: username, score: score });

    // Sort the leaderboard based on score (descending order)
    leaderboard.sort((a, b) => b.score - a.score);

    // Keep only the top 10 players
    if (leaderboard.length > 10) {
        leaderboard = leaderboard.slice(0, 10);
    }

    // Display the leaderboard
    displayLeaderboard();
}

// Display the leaderboard on the page
function displayLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = ''; // Clear previous leaderboard

    leaderboard.forEach((entry, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${entry.username} - ${entry.score} pkt`;
        leaderboardList.appendChild(li);
    });
}

// Increment score when the clicker button is clicked
document.getElementById('clicker-button').addEventListener('click', () => {
    currentScore++;
    document.getElementById('score').textContent = currentScore; // Update the displayed score
});

// Save the score after clicking the "Save Score" button
function saveScore() {
    const username = prompt("Podaj swoją nazwę:"); // Prompt user for their username
    if (username) {
        updateLeaderboard(username, currentScore); // Update leaderboard with the player's score
    }
}

// For demonstration, save score after 10 seconds (you can remove this or call it when the game ends)
setTimeout(saveScore, 10000); // Simulate a score save after 10 seconds
