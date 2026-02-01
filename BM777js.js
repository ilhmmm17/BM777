/**
 * BIBIRMEKAR777 - FINAL INTEGRATED SCRIPT (SUPER RUNGKAD MODE)
 * Algoritma: 1x (60%), 2x (20%), 3-5x (15%), 6-100x (5%)
 */

// --- 1. STATE PERMAINAN ---
let balance = 0;             
let currentBet = 0;          
let multiplier = 1.00;       
let isPlaying = false;       
let gameInterval;            
let crashPoint;              

// --- 2. SELECTOR ELEMEN ---
const balanceDisplay = document.getElementById('balance');
const display = document.getElementById('multiplier');
const statusMsg = document.getElementById('status-msg');
const spacemanContainer = document.getElementById('spaceman-container');
const thrust = document.getElementById('thrust');
const gameScreen = document.getElementById('game-screen');
const betInput = document.getElementById('bet-amount');
const autoStopInput = document.getElementById('auto-stop');
const autoStopCheck = document.getElementById('auto-stop-active'); 
const btnPlay = document.getElementById('btn-play');
const btnCashout = document.getElementById('btn-cashout');
const modal = document.getElementById('deposit-modal');

// --- 3. FUNGSI UTILITAS ---

function formatRupiah(amount) {
    return "IDR " + amount.toLocaleString('id-ID');
}

function updateUI() {
    balanceDisplay.innerText = formatRupiah(balance);
}

// ALGORITMA PELUANG CUSTOM
function calculateCrashPoint() {
    const rand = Math.random() * 100; 

    if (rand <= 60) {
        // 60% peluang: 1.00x - 1.20x
        return parseFloat((1.00 + Math.random() * 0.2).toFixed(2));
    } 
    else if (rand <= 80) {
        // 20% peluang: 1.21x - 2.00x
        return parseFloat((1.21 + Math.random() * 0.79).toFixed(2));
    } 
    else if (rand <= 95) {
        // 15% peluang: 2.01x - 5.00x
        return parseFloat((2.01 + Math.random() * 2.99).toFixed(2));
    } 
    else {
        // 5% peluang: 6.00x - 100.00x
        return parseFloat((6.00 + Math.random() * 94.0).toFixed(2));
    }
}

// --- 4. LOGIKA DEPOSIT ---

function processDeposit(amount) {
    balance += amount;
    updateUI();
    modal.style.display = "none";
    statusMsg.innerText = `Berhasil Isi Saldo ${formatRupiah(amount)}!`;
    statusMsg.style.color = "#28a745";
}

function processCustomDeposit() {
    const customInput = document.getElementById('custom-amount');
    const amount = parseInt(customInput.value);
    if (isNaN(amount) || amount < 5000) {
        alert("Minimal IDR 5.000 boss!");
        return;
    }
    processDeposit(amount);
    customInput.value = ""; 
}

// --- 5. LOGIKA INTI PERMAINAN ---

function startGame() {
    currentBet = parseInt(betInput.value);
    
    if (balance <= 0 || currentBet > balance) {
        alert("Saldo habis! Silakan deposit.");
        modal.style.display = "block";
        return;
    }

    // Pengurangan Saldo
    balance -= currentBet;
    updateUI();
    
    // Reset State
    isPlaying = true;
    multiplier = 1.00;
    crashPoint = calculateCrashPoint();

    // Lock Kontrol
    btnPlay.disabled = true;
    betInput.disabled = true;
    autoStopInput.disabled = true;
    autoStopCheck.disabled = true;
    btnCashout.disabled = false;

    // Visual Reset
    display.style.color = "#fff";
    statusMsg.innerText = "🚀 Awas nabrak"; 
    statusMsg.style.color = "#00d4ff";
    gameScreen.classList.remove('crashing-screen');
    spacemanContainer.classList.remove('exploding-spaceman');
    spacemanContainer.style.bottom = "20px";
    thrust.classList.remove('hidden');

    // Jalankan Game
    gameInterval = setInterval(() => {
        multiplier += 0.01;
        display.innerText = multiplier.toFixed(2) + "x";
        
        let isAutoStopOn = autoStopCheck.checked;
        let autoTarget = parseFloat(autoStopInput.value);

        // Animasi Gerak
        let currentPos = parseFloat(spacemanContainer.style.bottom) || 20;
        if (currentPos < 180) {
            spacemanContainer.style.bottom = (currentPos + 0.6) + "px";
        }

        // Cek Kondisi Kalah
        if (multiplier >= crashPoint) {
            endGame(true);
        } 
        // Cek Kondisi Auto Stop
        else if (isAutoStopOn && multiplier >= autoTarget) {
            endGame(false);
        }
    }, 50); // Kecepatan disetel 50ms agar lebih intens
}

function endGame(isCrash) {
    clearInterval(gameInterval);
    isPlaying = false;
    
    // Unlock Kontrol
    btnPlay.disabled = false;
    betInput.disabled = false;
    autoStopInput.disabled = false;
    autoStopCheck.disabled = false;
    btnCashout.disabled = true;
    thrust.classList.add('hidden');

    if (isCrash) {
        statusMsg.innerText = `💥 Rungkad boss! Meledak di ${multiplier.toFixed(2)}x`; 
        statusMsg.style.color = "#ff3333";
        display.style.color = "#ff3333";
        gameScreen.classList.add('crashing-screen');
        spacemanContainer.classList.add('exploding-spaceman');
    } else {
        let totalWin = Math.floor(currentBet * multiplier);
        balance += totalWin;
        updateUI();

        statusMsg.innerText = `🤑 MANTEP! Anda menang ${formatRupiah(totalWin)}`;
        statusMsg.style.color = "#ffd700";
        display.style.color = "#ffd700";
    }
}

// --- 6. EVENT LISTENERS ---
btnPlay.addEventListener('click', startGame);
btnCashout.addEventListener('click', () => { if (isPlaying) endGame(false); });

// Modal Handlers
document.getElementById('btn-deposit').onclick = () => modal.style.display = "block";
document.querySelector('.close-modal').onclick = () => modal.style.display = "none";
window.onclick = (event) => { if (event.target == modal) modal.style.display = "none"; };

// Initial UI
updateUI();