$(window).scroll(function () {
    $('.navbar').toggleClass('scrolled', $(this).scrollTop() > 200);
});

const startDiagnosisBtn = document.querySelector('#startDiagnosisBtn');
startDiagnosisBtn.addEventListener('click', addDecisionTree)

function addDecisionTree() {
    document.querySelector('#startDiagnosisPanel').innerHTML = `
    <form action="/decision" method="POST" id="decision-form">
        <div id="formContainer" class="animate__animated animate__fadeIn">
            <div class="mb-3" id="questionContainer">
                <label for="exampleInputPassword1" class="form-label" id="questionShowLabel">Where is your pain?</label>
            </div>
            <div class="mb-3" id="choicesContainer">
                <div>
                    <input type="radio" name="userInput" value="Upper limb">
                    <label for="Upper limb">Upper limb</label>
                </div>
                <div>
                    <input type="radio" name="userInput" value="Lower limb">
                    <label for="Lower limb">Lower limb</label>
                </div>
            </div>
            <div class="mb-3" id="stepsContainer">
                <button type="button" onclick="goBack()" class="btn btn-primary" id="backBtn" style="display: none">
                    <i class="fas fa-chevron-left"></i>
                </button>
                <button type="submit" class="btn btn-primary">
                    <i class="fas fa-chevron-right"></i>
                </button>
            </div>
        </div>
    </form>
    `
    decisionTree()
}

check();

async function getCurrentUser() {
    const res = await fetch('/infoRetrieval');
    const user = await res.json();
    console.log(user)
    if (res.status === 200) {
        document.querySelector("#startDiagnosisPanel").innerHTML = `
            <p>Welcome ${user.first_name}!</p>
            <button type="button" id="startDiagnosisBtn">Start diagnosis</button>
            `
            const startDiagnosisBtn = document.querySelector('#startDiagnosisBtn');
            startDiagnosisBtn.addEventListener('click',addDecisionTree)
    }
}

async function checkLogin() {
    const res = await fetch('/loginStatus');
    const result = await res.json();
    if (res.status === 200 && result.loginStatus === true) {
        return true
    } else if (res.status === 401 && result.loginStatus === false) {
        return false
    }
}

async function check() {
    const check = await checkLogin();
    if (check === true) {
        getCurrentUser();
    }
}



