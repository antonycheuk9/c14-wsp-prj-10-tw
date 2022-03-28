
function openForm1() {
    document.getElementById("registorForm").style.display = "block";
    closeForm2()
}

function closeForm1() {
    document.getElementById("registorForm").style.display = "none";

}
function openForm2() {
    document.getElementById("contributorForm").style.display = "block";
    closeForm1()
}

function closeForm2() {
    document.getElementById("contributorForm").style.display = "none";

}



//login (member)
document.querySelector('#userLoginForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const form = event.target;
    const loginInfo = {};
    loginInfo.email = form.email.value; // change name and field
    loginInfo.password = form.password.value; // change name and field
    const res = await fetch('/memberLogin', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginInfo)
    });

    if (res.status === 200) {
        console.log("login")
        const result = await res.json();

        window.location = '/userProfile.html'; // change to a suitable html
    }
    if (res.status === 400) {
        const result = await res.json();
        const errorBox = document.querySelector('#memberError')
        errorBox.innerHTML = `
        <div class="alert alert-danger" role="alert">${result.message}</div>
        `
    }
    else if (res.status === 401) {
        const result = await res.json();
        const errorBox = document.querySelector('#memberError')
        errorBox.innerHTML = `
        <div class="alert alert-danger" role="alert">${result.message}</div>
        `
        // alert(`${result.message}`)
    }
    form.reset();
})


//login (contributor)
document.querySelector('#contributorLoginForm').addEventListener('submit', async function (event) {

    event.preventDefault();
    //console.log('clicked')
    const form = event.target;
    const loginInfo = {};
    loginInfo.email = form.email.value; // change name and field
    loginInfo.password = form.password.value; // change name and field

    const res = await fetch('/contributorLogin', {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(loginInfo)
    });

    if (res.status === 200) {
        const result = await res.json();
        // console.log(result)
        window.location = '/contributorProfile.html'; // change to a suitable html

    }

    if (res.status === 400) {
        const result = await res.json();
        const errorBox = document.querySelector('#contributorError')
        errorBox.innerHTML = `
        <div class="alert alert-danger" role="alert">${result.message}</div>
        `

    }
    else if (res.status === 401) {
        const result = await res.json();
        const errorBox = document.querySelector('#contributorError')
        errorBox.innerHTML = `
        <div class="alert alert-danger" role="alert">${result.message}</div>
        `
        // alert(`${result.message}`)
    }
    form.reset();
});

