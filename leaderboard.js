// script.js

let coins = 0; // Początkowy wynik

// Zmienna na przechowanie listy wyników
let leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];

// Funkcja do aktualizacji tabeli wyników
function updateLeaderboard() {
    const leaderboardTable = document.querySelector('#scoreboard tbody');
    leaderboardTable.innerHTML = ''; // Czyści tabelę przed dodaniem nowych danych

    // Sortowanie wyników malejąco (od najwyższego)
    leaderboard.sort((a, b) => b.coins - a.coins);

    // Przewiń tylko top 10 graczy
    leaderboard.slice(0, 10).forEach(player => {
        const row = document.createElement('tr');
        row.innerHTML = `<td>${player.nickname}</td><td>${player.coins}</td>`;
        leaderboardTable.appendChild(row);
    });
}

// Funkcja do dodania gracza do tabeli wyników
function addPlayerToLeaderboard(nickname, coins) {
    const player = { nickname, coins };
    leaderboard.push(player);

    // Zapisz leaderboard do localStorage
    localStorage.setItem('leaderboard', JSON.stringify(leaderboard));

    // Zaktualizuj tabelę wyników
    updateLeaderboard();
}

// Obsługa formularza do wpisania nicku
document.getElementById('submit-nickname').addEventListener('click', () => {
    const nicknameInput = document.getElementById('nickname');
    const nickname = nicknameInput.value.trim();

    if (nickname === '') {
        alert('Proszę podać swój nick!');
        return;
    }

    // Dodaj gracza do tabeli wyników
    addPlayerToLeaderboard(nickname, coins);

    // Ukryj formularz i pokaż tabelę wyników
    document.getElementById('nickname-form').style.display = 'none';
});

// Inicjalizacja tabeli wyników przy załadowaniu strony
updateLeaderboard();

// Inicjalizacja gry i aktualizacja wyników (w tej części musisz zintegrować swój kod z wynikiem)
function updateCoinDisplay() {
    document.querySelector('.coiny').textContent = `Buszonki: ${Math.floor(coins)}`;
}

// Funkcja kliknięcia Buszka (przykład z Twojego kodu)
document.getElementById('buszko').addEventListener('click', () => {
    coins += 1; // Dodajemy Buszonka za kliknięcie
    updateCoinDisplay();
});
