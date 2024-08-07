document.addEventListener('DOMContentLoaded', () => {
    const player1Input = document.getElementById('player1');
    const player2Input = document.getElementById('player2');
    const startButton = document.getElementById('start-game');
    const gameContainer = document.getElementById('game-container');
    const player1Score = document.getElementById('player1-score');
    const player2Score = document.getElementById('player2-score');
    const passButton = document.getElementById('pass-button');
    const gameOverDiv = document.getElementById('gameOver');
    const replayButton = document.getElementById('replayButton');
    const timerElement = document.getElementById('timer'); // Declare timerElement here
    const winnerNameElement = document.getElementById('winner-name');
	const gameLogo = document.getElementById('game-logo');
	const rulesButton = document.getElementById('rules-button'); // Get the rules button element
	const timerLabel = document.getElementById('timer-label'); // Get the timer label element
	const backToHomeButton = document.getElementById('backToHomeButton'); // Get the back to home button element
	const categoryContainer = document.getElementById('category-container');
	const categoryName = document.getElementById('category-name');
	const categories = [
    "Girl's Name",
    "Boy's Name",
    "Fruits",
    "Vegetables",
    "Drinkings",
    "Animals",
    "Cities",
    "Countries",
    "Car Brands",
    "Clothing Brands",
    "Brands",
    "Football Clubs",
    "Basketball Clubs",
    "Celebrities",
    "Song Titles",
    "Book Titles",
    "Occupations",
    "Band or Artist",
    "TV Series",
    "Movies",
    "Fictional Characters",
    "Things That Are Hot",
    "Things That Are Cold",
    "Things in the House",
    "Author",
    "Mobile Apps"
];
	let usedCategories = []; // To keep track of used categories
	let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let currentPlayer = 1;
    let player1Name, player2Name;
    let scores = { player1: 0, player2: 0 };
    let passCount = { player1: 0, player2: 0 };
    let isGameOver = false;
	let timerInterval;
	let remainingTime = 10; // Start with 10 seconds
	let timerRunning = false; // Flag to track timer status
	
	
	function updateTimer() {
    timerElement.textContent = remainingTime;
    remainingTime--;
	
    if (remainingTime < 0) {
        clearInterval(timerInterval);
        timerElement.textContent = "0"; 
		
        if (!isGameOver) { // Check if the game is not over
            // Deduct 1 point from the current player
            const currentPlayerKey = currentPlayer === 1 ? 'player1' : 'player2';
            scores[currentPlayerKey]--; // Simply decrement the score
			
			updateScoreDisplay();
			
			currentPlayer = currentPlayer === 1 ? 2 : 1;
            checkGameOver();

            // Update the scoreboard and restart the timer *after* switching players
            updateScoreDisplay(); 
            startTimer(); 
        }
    }
}

	function startTimer() {
		remainingTime = 10;
		timerElement.textContent = remainingTime;
		clearInterval(timerInterval); // Clear any existing interval
		timerInterval = setInterval(updateTimer, 1000);
}

	function stopTimer() {
		clearInterval(timerInterval);
}

	function updateScoreDisplay() {
		// Reset styling of both player names
		player1Score.classList.remove('winner-blue', 'winner-red', 'current-player');
		player2Score.classList.remove('winner-blue', 'winner-red', 'current-player');

		// Update the scores in the text content
		player1Score.textContent = `${player1Name}: ${scores.player1}`;
		player2Score.textContent = `${player2Name}: ${scores.player2}`;


		// Apply styling to current player
			if (currentPlayer === 1) {
			player1Score.classList.add('winner-blue', 'current-player');
			} else {
			player2Score.classList.add('winner-red', 'current-player');
			}	
}

	function suggestCategory() {
    let availableCategories = categories.filter(category => !usedCategories.includes(category));

    if (availableCategories.length === 0) {
        // If all categories have been used, reset the usedCategories array
        usedCategories = [];
        availableCategories = categories;
    }

    const randomIndex = Math.floor(Math.random() * availableCategories.length);
    const suggestedCategory = availableCategories[randomIndex];
    usedCategories.push(suggestedCategory); // Add the suggested category to usedCategories

    return suggestedCategory;
}

	
	// CSS related things for starting
	gameContainer.style.display = 'none';
	passButton.style.display = 'none';
	timerElement.style.display = 'none';

	// Disable text selection
    document.onselectstart = function() {
        return false;
    };
    // Disable right-click
    document.addEventListener('contextmenu', (event) => {
        event.preventDefault();
    });

    startButton.addEventListener('click', () => {
        player1Name = player1Input.value || "Player 1"; // Default to "Player 1"
        player2Name = player2Input.value || "Player 2"; // Default to "Player 2"
        player1Score.textContent = `${player1Name}: ${scores.player1}`;
        player2Score.textContent = `${player2Name}: ${scores.player2}`;
		
		// Suggest and display a category
		const suggestedCategory = suggestCategory();
		categoryName.textContent = suggestedCategory;
		categoryContainer.style.display = 'block';
		
        document.getElementById('player-input').style.display = 'none';
        gameContainer.style.display = 'flex';

        // Call function to create letter boxes
        createLetterBoxes();
		updateScoreDisplay();
		timerElement.style.display = 'block';
		timerLabel.style.display = 'block'; // Show timer label
		scoreboard.style.display = 'block'; // Show the scoreboard after clicking Start Game 
		gameLogo.style.display = 'none';
		rulesButton.style.display = 'none'; 
    startTimer(); 

    });

		function createLetterBoxes() {
			gameContainer.innerHTML = ''; // clear game container
			passButton.style.display = 'none'; // hide pass button
			// Create letter boxes
			const radius = 250;
			const angleIncrement = (Math.PI * 2) / 26;

			for (let i = 0; i < letters.length; i++) {
				const box = document.createElement('div');
				box.classList.add('letter-box');
				box.textContent = letters[i];

				const angle = i * angleIncrement;
				const x = radius * Math.cos(angle) + radius;
				const y = radius * Math.sin(angle) + radius;

				box.style.left = `${x}px`;
				box.style.top = `${y}px`;
			
				box.addEventListener('click', () => handleClick(box));

				gameContainer.appendChild(box);
			}
			
			passButton.style.display = 'block'; // show pass button after boxes are created
        }
    
    
		function handleClick(box) {
			if (box.classList.contains('clicked')) return;
			if (isGameOver) return;
			stopTimer();
			box.classList.add('clicked', 'faded');
			box.classList.add(currentPlayer === 1 ? 'blue' : 'red');

			scores[currentPlayer === 1 ? 'player1' : 'player2']++;
			updateScoreDisplay();
			currentPlayer = currentPlayer === 1 ? 2 : 1;
			player1Score.textContent = `${player1Name}: ${scores.player1}`;
			player2Score.textContent = `${player2Name}: ${scores.player2}`;
 
				if (!isGameOver && timerRunning) { // Only restart if the timer is running
					stopTimer();
					startTimer();
				}

			checkGameOver();
			startTimer();
			// Call updateScoreDisplay() again after updating the currentPlayer
			updateScoreDisplay();
		}

	passButton.addEventListener('click', () => {
        const currentPlayerKey = currentPlayer === 1 ? 'player1' : 'player2';
		updateScoreDisplay();
		isTurnOver = true; // Set the flag when pass button is clicked
	
		passCount[currentPlayerKey]++;
        checkGameOver();
        currentPlayer = currentPlayer === 1 ? 2 : 1;
		startTimer();
		updateScoreDisplay(); // Update highlights after switching players
    });



    function checkGameOver() {
        const allFaded = [...document.querySelectorAll('.letter-box')].every(box => box.classList.contains('faded'));

        if (passCount.player1 >= 2 || passCount.player2 >= 2 || allFaded) {
            isGameOver = true;
			stopTimer();
			
			// Hide elements on replay
			timerElement.style.display = 'none'; 
			timerLabel.style.display = 'none';
			backToHomeButton.style.display = 'block';
			categoryContainer.style.display = 'none' ;
            gameOverDiv.style.display = 'flex';
            passButton.style.display = 'none'; 
			document.querySelectorAll('.letter-box').forEach(box => {
            box.style.display = 'none';
            box.removeEventListener('click', handleClick); 
			});
		
	   // Determine the winner and display their name with "won!"
       
		let winnerName, winnerColorClass;
        if (scores.player1 > scores.player2) {
            winnerName = player1Name + " Won! \ud83e\udd73 \ud83c\udf89"; // Add "Won!" to the name
            winnerColorClass = 'winner-blue';
        } else if (scores.player2 > scores.player1) {
            winnerName = player2Name + " Won! \ud83e\udd73 \ud83c\udf89"; // Add "Won!" to the name
            winnerColorClass = 'winner-red';
        } else {
            winnerName = "It's a Tie! \ud83e\udd1d";
			winnerColorClass = 'winner-tie';
            
        }

        winnerNameElement.textContent = winnerName;
        winnerNameElement.classList.add(winnerColorClass);
		

        updateScoreDisplay()
		
		}
    }


    replayButton.addEventListener('click', () => {
        isGameOver = false;
        passCount = { player1: 0, player2: 0 }; // Reset pass counts
       
        currentPlayer = 1;
        gameOverDiv.style.display = 'none'; // Hide "Game Over"
        timerElement.style.display = 'block'; 
		timerLabel.style.display = 'block';
		scores = { player1: 0, player2: 0 };
		updateScoreDisplay();
		backToHomeButton.style.display = 'none';


		// Hide the category container on replay
		categoryContainer.style.display = 'none';
		// Suggest and display a new category
		const suggestedCategory = suggestCategory();
		categoryName.textContent = suggestedCategory;
		categoryContainer.style.display = 'block';
        createLetterBoxes(); // Recreate letter boxes
		
		document.querySelectorAll('.letter-box').forEach(box => {
        box.addEventListener('click', () => handleClick(box));
		});
		
		updateScoreDisplay();
        // Update score display to reflect reset scores
        player1Score.textContent = `${player1Name}: ${scores.player1}`;
        player2Score.textContent = `${player2Name}: ${scores.player2}`;
		stopTimer(); 
		gameLogo.style.display = 'block';
		scoreboard.style.display = 'block';
		timerElement.textContent = '10';
		timerElement.style.display = 'block';
		winnerNameElement.textContent = ''; // Clear winner name on replay
		winnerNameElement.classList.remove('winner-blue', 'winner-red', 'winner-tie'); // Remove any color classes
		startTimer();
	});
	
		// Add an event listener to the "Back to Home" button
	backToHomeButton.addEventListener('click', () => {
		// Implement the logic to navigate back to the home page here
		// For example, you might want to redirect to a different HTML file or reload the current page
		window.location.href = 'index.html'; // Replace 'index.html' with your actual home page file
});
	
	
});
