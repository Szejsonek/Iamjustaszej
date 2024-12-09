// Zmienne śledzące stan gry
let coins = 0;
let baseCoinsPerClick = 1;
let coinsPerClick = baseCoinsPerClick;
let foodBuff = 0;
let currentSkin = 0;
let unlockedSkins = [true, false, false, false, false, false, false];
let activeHelpers = [false]; // Upewnij się, że to jest zainicjowane

// Elementy DOM
const coinDisplay = document.querySelector('.coiny');
const clickerImage = document.getElementById('buszko');
const foodItems = document.querySelectorAll('.food-item');
const skinImages = document.querySelectorAll('.skins .skin-item img');
const resetButton = document.getElementById('resetButton');

const skinPrices = [0, 750, 20000, 100000, 690000, 100000000, 69000000000000000];
const skinMultipliers = [1, 2, 5, 10, 55, 100, 500];
const foodPrices = [100, 2500, 100000, 4444444, 240000000, 5600000000];
const foodBuffs = [5, 25, 100, 444, 975, 1650];
const helperPrices = [125000];
const helperEarnings = [0.1]; // 10% aktualnych Buszonków na kliknięcie

// Funkcja aktualizująca wyświetlanie monet
function updateCoinDisplay() {
    coinDisplay.textContent = `Buszonki: ${Math.floor(coins)} (Buszonki na klikniecie: ${Math.floor(coinsPerClick)})`;
}

// Funkcja zapisywania postępu z czasem ostatniego online
function saveProgress() {
    const progress = {
        coins,
        baseCoinsPerClick,
        foodBuff,
        currentSkin,
        unlockedSkins,
        activeHelpers, // Zapisz stan aktywnych pomocników
        lastOnline: Date.now(), // Zapisz bieżący czas
    };
    localStorage.setItem('buszkoClickerProgress', JSON.stringify(progress));
}

// Funkcja ładowania postępu
function loadProgress() {
    const savedProgress = localStorage.getItem('buszkoClickerProgress');
    if (savedProgress) {
        const progress = JSON.parse(savedProgress);
        coins = progress.coins || 0;
        baseCoinsPerClick = progress.baseCoinsPerClick || 1;
        foodBuff = progress.foodBuff || 0;
        currentSkin = progress.currentSkin || 0;
        unlockedSkins = progress.unlockedSkins || [true, false, false, false, false, false, false];
        activeHelpers = progress.activeHelpers || [false];

        const lastOnline = progress.lastOnline || Date.now();
        const timeElapsed = (Date.now() - lastOnline) / 1000; // Czas w sekundach

        // Oblicz zarobki offline dla aktywnych pomocników
        activeHelpers.forEach((isActive, index) => {
            if (isActive) {
                const earnings = coinsPerClick * helperEarnings[index] * timeElapsed;
                coins += earnings;
            }
        });

        applySkin(currentSkin);
        updateCoinDisplay();
        updateSkinUI();

        // Ponownie uruchom aktywnych pomocników
        activeHelpers.forEach((isActive, index) => {
            if (isActive) {
                const helperDisplay = document.getElementById(`helperDisplay${index + 1}`);
                if (helperDisplay) {
                    helperDisplay.classList.remove('hidden');
                }
                startHelper(index); // Ponownie uruchom interwał pomocnika
            }
        });
    }
}
// Funkcja do wczytania leaderboarda
function loadLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
    const sortedLeaderboard = leaderboard.sort((a, b) => b.score - a.score); // Sortowanie po punktach
    const top10 = sortedLeaderboard.slice(0, 10); // Top 10 graczy

    // Wyświetlanie leaderboarda
    const leaderboardList = document.getElementById('leaderboard-list');
    leaderboardList.innerHTML = ''; // Czyszczenie listy przed załadowaniem nowych wyników

    top10.forEach((player, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${player.nickname} - ${player.score} pkt`;
        leaderboardList.appendChild(li);
    });
}

// Funkcja do zapisywania nowego wyniku
function saveScore(event) {
    event.preventDefault(); // Zapobiega przeładowaniu strony

    const nicknameInput = document.getElementById('nickname');
    const scoreInput = document.getElementById('score');

    const nickname = nicknameInput.value.trim();
    const score = parseInt(scoreInput.value);

    if (nickname && score >= 0) {
        const leaderboard = JSON.parse(localStorage.getItem('leaderboard')) || [];
        leaderboard.push({ nickname, score }); // Dodanie nowego wyniku

        localStorage.setItem('leaderboard', JSON.stringify(leaderboard)); // Zapisanie w localStorage
        nicknameInput.value = '';
        scoreInput.value = '';
        
        loadLeaderboard(); // Przeładuj leaderboard
    } else {
        alert("Proszę wprowadzić poprawne dane!");
    }
}

// Dodaj event listener do formularza
document.getElementById('nickname-form').addEventListener('submit', saveScore);

// Załaduj leaderboard na starcie
loadLeaderboard();

// Inicjalizacja gry
loadProgress();

// Okresowe zapisywanie postępu
setInterval(saveProgress, 10000); // Zapisuj co 10 sekund

// Funkcja resetująca postęp
function resetProgress() {
    if (confirm("Czy jesteś pewny, że chcesz zresetować cały postęp?")) {
        // Resetowanie wszystkich stanów gry
        coins = 0;
        baseCoinsPerClick = 1;
        coinsPerClick = baseCoinsPerClick;
        foodBuff = 0;
        currentSkin = 0;
        unlockedSkins = [true, false, false, false, false, false, false];
        activeHelpers = [false]; // Resetowanie wszystkich pomocników

        // Ukrywanie wszystkich pomocników
        document.querySelectorAll('.helper-item').forEach((helperItem, index) => {
            const helperDisplay = document.getElementById(`helperDisplay${index + 1}`);
            if (helperDisplay) {
                helperDisplay.classList.add('hidden');
            }
        });

        saveProgress();
        loadProgress();
        alert("Postęp zresetowany!");
    }
}

// Obsługa kliknięcia Buszko
function clickBuszko() {
    coins += coinsPerClick;
    updateCoinDisplay();
    saveProgress();
}

// Funkcja stosująca skin
function applySkin(skinIndex) {
    if (unlockedSkins[skinIndex]) {
        currentSkin = skinIndex;
        clickerImage.src = skinImages[skinIndex].src;
        calculateCoinsPerClick();
        updateSkinUI();
        saveProgress();
    } else {
        alert("Jeszcze nie odblokowałeś tego skina :/");
    }
}

// Funkcja obliczająca Buszonki na kliknięcie
function calculateCoinsPerClick() {
    const skinMultiplier = skinMultipliers[currentSkin];
    coinsPerClick = (baseCoinsPerClick + foodBuff) * skinMultiplier;
}

// Funkcja aktualizująca UI skina
function updateSkinUI() {
    skinImages.forEach((img, index) => {
        img.classList.toggle('unlocked', unlockedSkins[index]);
        img.style.opacity = unlockedSkins[index] ? '1' : '0.5';
        img.style.cursor = unlockedSkins[index] ? 'pointer' : 'not-allowed';
    });
}

// Obsługa kliknięcia skina
skinImages.forEach((img, index) => {
    img.addEventListener('click', () => {
        if (unlockedSkins[index]) {
            applySkin(index);
        } else if (coins >= skinPrices[index]) {
            coins -= skinPrices[index];
            unlockedSkins[index] = true;
            applySkin(index);
            alert(`Odblokowałeś skina :D`);
            updateCoinDisplay();
            saveProgress();
        } else {
            alert(`Nie masz wystarczająco Buszonków, żeby to kupić :(`);
        }
    });
});

// Obsługa zakupów jedzenia i logiki ilości
foodItems.forEach((foodItem, index) => {
    const buyButton = document.getElementById(`buy-food${index + 1}`);
    const quantityInput = document.getElementById(`food${index + 1}-quantity`);
    const maxQuantityDisplay = document.getElementById(`food${index + 1}-max`);

    // Funkcja do aktualizowania maksymalnej ilości jedzenia, które można kupić
    function updateMaxQuantity() {
        const maxQuantity = Math.floor(coins / foodPrices[index]); // Oblicz maksymalną ilość przedmiotów
        maxQuantityDisplay.textContent = `Max: ${maxQuantity}`; // Zaktualizuj wyświetlanie maksymalnej ilości
        quantityInput.setAttribute("max", maxQuantity); // Ustaw maksymalną wartość w polu wejściowym
    }

    // Zaktualizuj maksymalną ilość po załadowaniu strony i po zmianie monet
    updateMaxQuantity();
    
    // Recalculuj maksymalną ilość, gdy gracz ma wystarczająco dużo monet
    buyButton.addEventListener('click', () => {
        const quantity = parseInt(quantityInput.value); // Pobierz ilość z pola wejściowego
        const totalCost = foodPrices[index] * quantity; // Oblicz całkowity koszt

        if (quantity <= 0) {
            alert("Wpisz dodatnią liczbę!");
            return;
        }

        if (coins >= totalCost) {
            coins -= totalCost; // Odejmij monety za całkowity koszt
            foodBuff += foodBuffs[index] * quantity; // Zastosuj buff jedzenia pomnożony przez ilość
            calculateCoinsPerClick(); // Ponownie oblicz Buszonki na kliknięcie
            alert(`Nakarmiłeś Buszona! Dostajesz więcej Buszonków: ${foodBuffs[index] * quantity}.`);
            updateCoinDisplay();
            saveProgress();
            updateMaxQuantity(); // Zaktualizuj maksymalną ilość po zakupie
        } else {
            alert(`Nie masz wystarczająco Buszonków, żeby to kupić!`);
        }
    });

    // Zaktualizuj maksymalną ilość, gdy monety się zmieniają (jeśli to konieczne)
    setInterval(updateMaxQuantity, 1000); // Aktualizuj co sekundę (lub gdy potrzeba)
});

// Obsługa kliknięcia Buszko
clickerImage.addEventListener('click', clickBuszko);

// Obsługa resetowania postępu
resetButton.addEventListener('click', resetProgress);

// Uruchomienie autoclickera pomocnika
function startHelper(index) {
    setInterval(() => {
        if (activeHelpers[index]) {
            const earnings = coinsPerClick * helperEarnings[index];
            coins += earnings;
            updateCoinDisplay();
            saveProgress(); // Regularnie zapisuj postęp
        }
    }, 1000); // Autoclicker co sekundę
}

// Zakup pomocnika
function purchaseHelper(index) {
    if (coins >= helperPrices[index] && !activeHelpers[index]) {
        coins -= helperPrices[index];
        activeHelpers[index] = true;

        const helperDisplay = document.getElementById(`helperDisplay${index + 1}`);
        if (helperDisplay) {
            helperDisplay.classList.remove('hidden');
        }

        startHelper(index);
        alert("Pomocnik kupiony!");
        updateCoinDisplay();
        saveProgress(); // Zapisz stan po zakupie
    } else if (activeHelpers[index]) {
        alert("Już masz tego pomocnika!");
    } else {
        alert("Nie masz wystarczająco Buszonków na tego pomocnika!");
    }
}

// Pokaż wyświetlanie pomocników tylko jeśli istnieją
activeHelpers.forEach((isActive, index) => {
    const helperDisplay = document.getElementById(`helperDisplay${index + 1}`);
    if (helperDisplay && isActive) {
        helperDisplay.classList.remove('hidden');
    }
});

// Dodaj event listenery dla pomocników
document.querySelectorAll('.helper-item').forEach((helperItem, index) => {
    helperItem.addEventListener('click', () => purchaseHelper(index));
});

// Dane utworów: Zaktualizowane ceny i stany
const songs = [
    { id: 'song1', cost: 0, src: 'bones.mp3', unlocked: true }, // Darmowy utwór, już odblokowany
    { id: 'song2', cost: 99999999999999999, src: 'enemy.mp3', unlocked: false },
];

// Śledzenie aktualnie odtwarzanej muzyki i jej ID
let currentAudio = null;
let currentSongId = null;

// Funkcja odblokowująca utwory
function unlockSong(song) {
    if (coins >= song.cost && !song.unlocked) {
        coins -= song.cost;
        song.unlocked = true;

        const songImage = document.getElementById(song.id);
        songImage.classList.remove('locked');
        songImage.classList.add('unlocked');
        songImage.title = "Kliknij, aby odtworzyć";

        alert(`Odblokowano "${song.id}"!`);
        updateCoinDisplay();
        saveProgress();
    } else if (song.unlocked) {
        alert("Już to odblokowałeś!");
    } else {
        alert("Nie masz wystarczająco Buszonków, żeby to kupić!");
    }
}

// Funkcja odtwarzająca lub zatrzymująca utwór
function toggleSongPlayback(song) {
    if (!song.unlocked) {
        alert("Musisz najpierw odblokować to");
        return;
    }

    if (currentAudio && currentSongId === song.id) {
        // Zatrzymaj obecny utwór
        currentAudio.pause();
        currentAudio.currentTime = 0;
        currentAudio = null;
        currentSongId = null;
        alert(`Zatrzymano "${song.id}".`);
    } else {
        // Wybierz nowy utwór do odtwarzania
        if (currentAudio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        currentAudio = new Audio(song.src);
        currentAudio.play();
        currentSongId = song.id;

        alert(`Odtwarzanie: "${song.id}"`);
    }
}

// Dodaj event listenery dla utworów
songs.forEach(song => {
    const songElement = document.getElementById(song.id);
    if (songElement) {
        songElement.addEventListener('click', () => {
            if (song.unlocked) {
                toggleSongPlayback(song);
            } else {
                unlockSong(song);
            }
        });
    }
});

