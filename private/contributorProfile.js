
let contributorUser = null;
async function getCurrentUser() {
    const res = await fetch('/infoRetrieval');
    const result = await res.json();
    if (res.status === 200) {
        contributorUser = result;
        document.querySelector("#image-out").setAttribute("src", `/${contributorUser.image}`)
        document.querySelector('#contributorusername').innerHTML = `<h3>Welcome! Dear ${contributorUser.first_name}!</h3>`;
        document.querySelector('#userInfo').innerHTML = `
               <h5>Name: ${contributorUser.last_name}</h5>
                <h5>Email: ${contributorUser.email}</h5>
               <h5>Tel: ${contributorUser.phone_number}</h5> 
              <h5>experience: ${contributorUser.experience}</h5> 
              <h5>Qualification: ${contributorUser.qualification}</h5> 
                                    `;
    }
}
getCurrentUser()

// logout
async function logOut() {
    const res = await fetch('/logOut');
    const result = await res.json();
    console.log(result)
}


//photo upload
document.querySelector("#profile-picture").addEventListener("change", async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData();

    formData.append('image', form.image.files[0]);

    const res = await fetch('/profile-picture', {
        method: "POST",
        body: formData
    });
    const result = await res.json();
    console.log(result)
    document.querySelector("#image-out").setAttribute("src", `/${result}`);
    getCurrentUser()
})

//info edit
function openForm() {
    document.getElementById("editForm").style.display = "block";
}

function closeForm() {
    document.getElementById("editForm").style.display = "none";
}


document.querySelector('#memberinfo')
    .addEventListener('submit', async function (event) {
        event.preventDefault();

        // Serialize the Form afterwards
        const form = event.target;
        const formObject = {};
        formObject['first_name'] = form.first_name.value;
        formObject['last_name'] = form.last_name.value;
        formObject['password'] = form.password.value;
        formObject['phone_number'] = form.phone_number.value;
        formObject['occupation'] = form.occupation.value;
        formObject['qualification'] = form.qualification.value;
        const res = await fetch('/editInfo', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formObject)
        });

        if (res.status === 200) {
            const result = await res.json()
            console.log(result)
            getCurrentUser()
        } else {
            const result = await res.json();
            console.log(result)
        }
        form.reset();
    })

