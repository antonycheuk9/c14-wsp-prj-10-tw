const input = {
    userInput: []
};

// decisionTree();

const backBtn = document.getElementById('backBtn');

backBtn.onclick = function () {
    if (input.userInput.length > 0) {
        goBack();
        console.log('clicked backBtn')
        console.log(input.userInput.length)
    }
}

function decisionTree() {
    document.querySelector('#decision-form')
        .addEventListener('submit', async function (event) {

            event.preventDefault();

            const form = event.target;
            if (form.userInput.value != '') {
                input.userInput.push(form.userInput.value);
                const res = await fetch('/decision', {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(input)
                });

                console.log(input)

                if (res.status === 200) {
                    const node = await res.json();
                    // console.log(node, typeof node, node.question, node.answers)
                    if (typeof node === "string") {
                        if (node === "Sorry we cannot diagnosis") {
                            loadFail(node);
                        } else loadResults(node)
                    } else {
                        loadChoices(node);
                    }
                }
                form.reset();
            } else alert('Please select');

        });
}

function loadChoices(node) {
    const backBtn = document.getElementById('backBtn');
    backBtn.style.display = 'block';

    const questionShowLabel = document.querySelector('#questionShowLabel');
    questionShowLabel.innerText = node.question;
    
    const choicesContainer = document.querySelector('#choicesContainer');
    choicesContainer.innerHTML = ''
    for (let choice in node.answers) {
        console.log(choice)
        choicesContainer.innerHTML += `
            <div>
            <input type="radio" name="userInput" value="${choice}">
            <label for="${choice}">${choice}</label>
            </div>
            `
    }
}

async function saveMedLog() {
    const res = await fetch('/saveMedLog');
    const result = await res.json();
    if (res.status === 200) {
        alert(`${result.message}`)
    }
}

async function getInjuryLink(node) {
    const res = await fetch('/getLink', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({injury_name: node})
    });

    if (res.status === 200) {
        const link = await res.json();
        console.log(link);
        return link;
    }
}

async function checkForResults(node) {
    const link = await getInjuryLink(node);
    const check = await checkLogin();
    if (check === true) {
        console.log('is member');
        const formContainer = document.querySelector('#formContainer');
        formContainer.innerHTML = `
        <div id="resultContainer" class="animate__animated animate__fadeIn">
            <h2>You are possibly suffering from ... </h2>
            <h1><a href="${link}" target="_blank">${node}</a></h1>
            <button type="button" onclick="reset()" class="btn btn-primary" id="resetBtn">Re-attempt</button>
            <p>Click to save to your own medical log</p>
            <button type="button" onclick="saveMedLog()" class="btn btn-primary" id="saveMedLogBtn">Save</button>
        </div>
        `
        const resetBtn = document.querySelector('#resetBtn');
        resetBtn.onclick = function () {
            reset();
        };

        const saveMedLogBtn = document.querySelector('#saveMedLogBtn');
        saveMedLogBtn.onclick = function () {
            saveMedLog();
        }
    } else {
        console.log('not member');
        const formContainer = document.querySelector('#formContainer');
        formContainer.innerHTML = `
        <div id="resultContainer" class="animate__animated animate__fadeIn">
            <h3>You are possibly suffering from ... </h3>
            <h1><a href="${link}" target="_blank">${node}</a></h1>
            <button type="button" onclick="reset()" class="btn btn-primary" id="resetBtn">Re-attempt</button>
            <p>You can create your own medical log via registrating as our member</p>
            <button type="button" class="btn btn-primary" id="signUpBtn"><a href="registration-form.html">Sign Up</a></button>
        </div>
        `
        const resetBtn = document.querySelector('#resetBtn');
        resetBtn.onclick = function () {
            reset()
        };
    }
}

function loadFail(node) {
    const formContainer = document.querySelector('#formContainer');
    formContainer.innerHTML = `
        <div id="resultContainer" class="animate__animated animate__fadeIn">
            <h1>${node}</h1>
            <button type="button" onclick="reset()" class="btn btn-primary" id="resetBtn">Re-attempt</button>
        `
    const resetBtn = document.querySelector('#resetBtn');
    resetBtn.onclick = function () {
        reset()
    };
}

function loadResults(node) {
    checkForResults(node);
}

function reset() {
    const formContainer = document.querySelector('#formContainer');
    formContainer.innerHTML = `
    <div class="mb-3" id="questionContainer">
        <label for="exampleInputPassword1" class="form-label" id="questionShowLabel">Where is your pain?</label>
    </div>
    <div class="mb-3" id="choicesContainer">
        <div><input type="radio" name="userInput" value="Upper limb"><label for="Upper limb">Upper limb</label></div>
        <div><input type="radio" name="userInput" value="Lower limb"><label for="Lower limb">Lower limb</label></div>
    </div>
    <div class="mb-3" id="stepsContainer">
        <button type="button" onclick="goBack()" class="btn btn-primary" id="backBtn" style="display: none"><i class="fas fa-chevron-left"></i></button>
        <button type="submit" class="btn btn-primary"><i class="fas fa-chevron-right"></i></button>
    </div>
    `;
    input.userInput = [];
    console.log('clicked reset')
}

async function goBack() {
    input.userInput.pop();
    if (input.userInput.length == 0) {
        reset();
    } else {
        const res = await fetch('/decision', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(input)
        });

        console.log(input)

        if (res.status === 200) {
            const node = await res.json();
            // console.log(node, typeof node, node.question, node.answers)
            if (typeof node === "string") {
                loadResults(node)
            } else {
                loadChoices(node);
            }
        }
    }
}