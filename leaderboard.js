// Funkcja do aktualizacji leaderboarda
function updateLeaderboard() {
    const leaderboardList = document.getElementById('leaderboard-list');
    const leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];

    // Sortowanie wyników malejąco według punktów
    leaderboardData.sort((a, b) => b.score - a.score);

    // Ograniczenie do 10 najlepszych graczy
    const topPlayers = leaderboardData.slice(0, 10);

    // Czyszczenie poprzedniego leaderboarda
    leaderboardList.innerHTML = '';

    // Wyświetlanie najlepszych 10 wyników
    topPlayers.forEach((entry, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${entry.nickname}: ${entry.score} Buszonki`;
        leaderboardList.appendChild(listItem);
    });
}

// Funkcja do zapisania wyniku
function saveScore(nickname, score) {
    const leaderboardData = JSON.parse(localStorage.getItem('leaderboard')) || [];

    // Dodanie nowego wyniku do leaderboarda
    leaderboardData.push({ nickname, score });

    // Zapisanie leaderboarda w localStorage
    localStorage.setItem('leaderboard', JSON.stringify(leaderboardData));

    // Zaktualizowanie leaderboarda
    updateLeaderboard();
}

// Przykład: Zapisz wynik po kliknięciu przycisku (można zmienić logikę w zależności od Twojej aplikacji)
document.getElementById('nickname-form').addEventListener('submit', function(e) {
    e.preventDefault();

    const nickname = document.getElementById('nickname').value;
    const score = parseInt(document.getElementById('score').value);

    if (nickname && score) {
        saveScore(nickname, score);

        // Wyczyść pola po zapisaniu
        document.getElementById('nickname').value = '';
        document.getElementById('score').value = '';
    } else {
        alert('Proszę podać nazwę i wynik.');
    }
});

// Przykład aktualizacji wyników na stronie po załadowaniu
window.onload = function() {
    updateLeaderboard();
}
