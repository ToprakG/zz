const colorMap = {
    "Red Orange": "#FF5733",
    "Lime Green": "#33FF57",
    "Bright Blue": "#3357FF",
    "Lemon Yellow": "#F3FF33",
    "Magenta": "#FF33F6",
    "Dark Orange": "#FF8C00",
    "Blue Violet": "#8A2BE2",
    "Tomato": "#FF6347",
    "Turquoise": "#40E0D0",
    "Saddle Brown": "#8B4513",
    "Sea Green": "#2E8B57",
    "Gold": "#FFD700",
    "Goldenrod": "#DAA520",
    "Deep Pink": "#FF1493",
    "Orange Red": "#FF4500",
    "Slate Blue": "#6A5ACD",
    "Lime": "#00FF00",
    "Dark Red": "#8B0000",
    "Aqua": "#00FFFF",
    "Hot Pink": "#FF69B4",
    "Indian Red": "#CD5C5C",
    "Indigo": "#4B0082",
    "Purple": "#800080",
    "Green": "#008000",
    "Pink": "#FFC0CB",
    "Chocolate": "#D2691E",
    "Khaki": "#F0E68C",
    "Medium Spring Green": "#00FA9A",
    "Chartreuse": "#7FFF00",
    "Gainsboro": "#DCDCDC",
    "White Smoke": "#F5F5F5",
    "Fuchsia": "#FF00FF",
    "Light Steel Blue": "#B0C4DE",
    "Brown": "#A52A2A",
    "Cadet Blue": "#5F9EA0",
    "Dark Slate Blue": "#483D8B",
    "Navajo White": "#FFDEAD",
    "Peach Puff": "#FFDAB9",
    "Alice Blue": "#F0F8FF",
    "Light Pink": "#FFB6C1",
    "Dark Gray": "#A9A9A9",
    "Firebrick": "#B22222",
    "Medium Sea Green": "#3CB371",
    "Light Gray": "#D3D3D3",
    "Crimson": "#DC143C",
    "Pale Green": "#B0E57C",
    "Red": "#FF0000",
    "Green": "#00FF00",
    "Blue": "#0000FF",
    "Yellow": "#FFFF00",
    "Cyan": "#00FFFF",
    "Magenta": "#FF00FF",
    "Black": "#000000",
    "White": "#FFFFFF",
    "Gray": "#808080",
    "Silver": "#C0C0C0",
    "Maroon": "#800000",
    "Olive": "#808000",
    "Purple": "#800080",
    "LightSeaGreen": "#20B2AA",
    "DarkOliveGreen": "#556B2F",
    "LightPink": "#FFB6C1",
    "Peru": "#CD853F",
    "PapayaWhip": "#FFEFD5",
    "PeachPuff": "#FFDAB9",
    "MistyRose": "#FFE4E1",
    "LavenderBlush": "#FFF0F5",
    "BlanchedAlmond": "#FFEBCD",
    "AliceBlue": "#F0F8FF",
    "AntiqueWhite": "#FAEBD7",
    "LemonChiffon": "#FFFACD",
    "LightGoldenrodYellow": "#FAFAD2",
    "Honeydew": "#F0FFF0",
    "MintCream": "#F5FFFA",
    "Azure": "#F0FFFF",
    "Snow": "#FFFAFA",
    "Wheat": "#F5DEB3",
    "BurlyWood": "#DEB887",
    "CadetBlue": "#5F9EA0",
    "SteelBlue": "#4682B4",
    "SlateGray": "#708090"
};

const colors = Object.keys(colorMap);
let sequence = [];
let userSequence = [];
let level = 0;
let isPlaying = false;

const colorButtons = document.querySelector("#game-board");
const statusText = document.querySelector("#status");
const startButton = document.querySelector("#start-game");

startButton.addEventListener("click", startGame);

function startGame() {
    level = 0;
    isPlaying = true;
    statusText.textContent = "Get ready!";
    nextLevel();
}

function nextLevel() {
    if (!isPlaying) return;
    
    level++;
    userSequence = [];
    sequence.push(getRandomColor());
    updateGameBoard();
    setTimeout(playSequence, 1000);
}

function getRandomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

function playSequence() {
    let i = 0;
    const interval = setInterval(() => {
        if (i >= sequence.length) {
            clearInterval(interval);
            statusText.textContent = "Your turn!";
            enableButtons();
            return;
        }
        
        highlightButton(sequence[i], true);
        speakColor(sequence[i]);
        i++;
    }, 1500); // Adjusted timing for sequence playback
}

function speakColor(color) {
    const utterance = new SpeechSynthesisUtterance(color);
    utterance.pitch = 1;
    utterance.rate = 1;
    speechSynthesis.speak(utterance);
}

function highlightButton(color, isSequence) {
    const button = document.querySelector(`[data-color="${colorMap[color]}"]`);
    if (isSequence) {
        button.classList.add("highlight");
        setTimeout(() => button.classList.remove("highlight"), 1000); // Extended highlight duration
    } else {
        button.style.opacity = 0.5;
        setTimeout(() => button.style.opacity = 1, 500);
    }

    // Smoothly scroll to the highlighted button
    button.scrollIntoView({
        behavior: 'smooth',
        block: 'center', // Align vertically to the center of the view
        inline: 'center' // Align horizontally to the center of the view
    });
}

function updateGameBoard() {
    colorButtons.innerHTML = colors.map(color => `
        <button class="color-button" data-color="${colorMap[color]}" style="background-color: ${colorMap[color]};" onclick="handleUserClick('${color}')"></button>
    `).join('');
}

function handleUserClick(color) {
    if (!isPlaying) return;

    highlightButton(color, false);
    userSequence.push(color);
    
    if (userSequence.length === sequence.length) {
        if (userSequence.join(',') === sequence.slice().reverse().join(',')) {
            statusText.textContent = "Correct! Moving to next level.";
            alert(userSequence);
            setTimeout(nextLevel, 1000);
        } else {
            statusText.textContent = "Game Over! Click 'Start Game' to try again.";
            alert(userSequence);
            isPlaying = false;
            setTimeout(location.reload(), 2000);
        }
    }
}

function enableButtons() {
    const buttons = document.querySelectorAll(".color-button");
    buttons.forEach(button => button.disabled = false);
}

function disableButtons() {
    const buttons = document.querySelectorAll(".color-button");
    buttons.forEach(button => button.disabled = true);
}

updateGameBoard(); // Initialize game board on load
