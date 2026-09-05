let match = {
    teamA: "",
    teamB: "",
    battingTeam: "",
    oversLimit: 10,

    runs: 0,
    wickets: 0,
    balls: 0,

    striker: {
        name: "Batsman 1",
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0
    },

    nonStriker: {
        name: "Batsman 2",
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0
    },

    history: []
};


function startMatch() {

    const teamA =
        document.getElementById("teamA").value.trim();

    const teamB =
        document.getElementById("teamB").value.trim();

    const striker =
        document.getElementById("strikerInput").value.trim();

    const nonStriker =
        document.getElementById("nonStrikerInput").value.trim();

    const bowler =
        document.getElementById("bowlerInput").value.trim();

    const overs =
        Number(document.getElementById("totalOvers").value);

    if (!teamA || !teamB) {
        alert("Please enter both team names.");
        return;
    }

    if (!striker || !nonStriker) {
        alert("Please enter both batsmen names.");
        return;
    }

    if (!bowler) {
        alert("Please enter the bowler name.");
        return;
    }

    match.teamA = teamA;
    match.teamB = teamB;
    match.battingTeam = teamA;
    match.oversLimit = overs;

    match.striker = {
        name: striker,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0
    };

    match.nonStriker = {
        name: nonStriker,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0
    };

    match.bowler = {
        name: bowler,
        overs: 0,
        balls: 0,
        runs: 0,
        wickets: 0
    };

    document.getElementById("battingTeam").textContent =
        match.battingTeam;

    updateDisplay();

    alert(
        `${striker} and ${nonStriker} are opening for ${teamA}`
    );
}


function scoreRun(runs) {

    if (match.wickets >= 10) {
        alert("All out!");
        return;
    }

    saveState();

    match.runs += runs;

    match.striker.runs += runs;
    match.striker.balls++;

    if (runs === 4) {
        match.striker.fours++;
    }

    if (runs === 6) {
        match.striker.sixes++;
    }

    match.balls++;

    addBallHistory(runs);

    if (runs % 2 === 1) {
        swapStrike();
    }

    endOfOverCheck();

    updateDisplay();
}

function wicket() {

    if (match.wickets >= 10) {
        alert("All out!");
        return;
    }

    const newBatsman =
        prompt("Enter new batsman name:");

    if (!newBatsman) {
        return;
    }

    match.wickets++;

    match.striker.balls++;
    match.balls++;

    if (match.bowler) {
        match.bowler.wickets++;
        match.bowler.balls++;
    }

    addBallHistory("W");

    match.striker = {
        name: newBatsman,
        runs: 0,
        balls: 0,
        fours: 0,
        sixes: 0
    };

    endOfOverCheck();

    updateDisplay();
}


function extra(type) {

    saveState();

    if (type === "wide") {

        match.runs++;

        addBallHistory("Wd");

        updateDisplay();

        return;
    }

    if (type === "noball") {

        match.runs++;

        match.striker.runs++;
        match.striker.balls;

        addBallHistory("Nb");

        updateDisplay();

        return;
    }

    if (type === "bye") {

        match.runs++;

        match.balls++;

        addBallHistory("B");

        endOfOverCheck();

        updateDisplay();

        return;
    }

    if (type === "legbye") {

        match.runs++;

        match.balls++;

        addBallHistory("Lb");

        endOfOverCheck();

        updateDisplay();

        return;
    }
}


function endOfOverCheck() {

    if (match.balls % 6 === 0) {

        swapStrike();

        const currentOver =
            match.balls / 6;

        if (currentOver >= match.oversLimit) {

            alert("Overs completed!");

        }
    }
}


function swapStrike() {

    const temp = match.striker;

    match.striker =
        match.nonStriker;

    match.nonStriker =
        temp;
}


function addBallHistory(value) {

    match.history.push(value);
}

function saveState() {

    match.history.push({
        type: "STATE",
        state: JSON.parse(JSON.stringify(match))
    });

    match.history.pop();

    match.previousState =
        JSON.parse(JSON.stringify(match));
}


function undoBall() {

    if (!match.previousState) {
        alert("Nothing to undo.");
        return;
    }

    const currentHistory =
        [...match.history];

    match =
        JSON.parse(JSON.stringify(match.previousState));

    match.history =
        currentHistory.slice(0, -1);

    updateDisplay();
}


if (match.bowler) {

    document.getElementById("currentBowler").textContent =
        match.bowler.name;

    document.getElementById("bowlerOvers").textContent =
        `${Math.floor(match.bowler.balls / 6)}.${match.bowler.balls % 6}`;

    document.getElementById("bowlerRuns").textContent =
        match.bowler.runs;

    document.getElementById("bowlerWickets").textContent =
        match.bowler.wickets;
}

function updateHistory() {

    const container =
        document.getElementById("ballHistory");

    if (match.history.length === 0) {

        container.innerHTML =
            "No balls yet.";

        return;
    }

    container.innerHTML =
        match.history
            .map(ball =>
                `<span class="ball">${ball}</span>`
            )
            .join("");
}


function updateScorecard() {

    const table =
        document.getElementById("scorecard");

    table.innerHTML = `

        <tr>
            <td>${match.striker.name}</td>
            <td>${match.striker.runs}</td>
            <td>${match.striker.balls}</td>
            <td>${match.striker.fours}</td>
            <td>${match.striker.sixes}</td>
        </tr>

        <tr>
            <td>${match.nonStriker.name}</td>
            <td>${match.nonStriker.runs}</td>
            <td>${match.nonStriker.balls}</td>
            <td>${match.nonStriker.fours}</td>
            <td>${match.nonStriker.sixes}</td>
        </tr>
    `;
}