let score = 0;
let gameStarted = false;
let countdownTimeout;

function startNutellaGame() {
    if (gameStarted) return;
    gameStarted = true;
    score = 0;

    // Timer-Strahl anzeigen
    document.getElementById("timerflex").style.display = "flex";

    const emoji = document.getElementById("nutellaEmoji");
    const scoreDisplay = document.getElementById("score");

    emoji.style.display = "inline-block";
    scoreDisplay.style.display = "block";
    scoreDisplay.textContent = `Score: ${score}`;

    moveNutellaRandomly();

    emoji.addEventListener("click", increaseScore);

    // Starte das 60 Sekunden Timeout (Timer läuft im CSS)
    countdownTimeout = setTimeout(endGame, 60000);
}

function increaseScore() {
    score++;
    document.getElementById("score").textContent = `Score: ${score}`;
    moveNutellaRandomly();
}

function moveNutellaRandomly() {
    const emoji = document.getElementById("nutellaEmoji");
    const maxX = window.innerWidth - 50;
    const maxY = window.innerHeight - 50;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    emoji.style.left = x + "px";
    emoji.style.top = y + "px";
}

function endGame() {
    const emoji = document.getElementById("nutellaEmoji");
    emoji.style.display = "none";
    emoji.removeEventListener("click", increaseScore);

    // Timer-Strahl wieder verstecken
    document.getElementById("timerflex").style.display = "none";

    alert(`⏱️ Zeit ist um! Dein Score: ${score}`);
}
