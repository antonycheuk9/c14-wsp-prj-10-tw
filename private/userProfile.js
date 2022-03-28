let memberUser = null;
async function getCurrentUser() {
    const res = await fetch('/infoRetrieval');
    const result = await res.json();
    console.log(result)
    if (res.status === 200) {
        memberUser = result;
        document.querySelector("#image-out").setAttribute("src", `/${memberUser.image}`)
        document.querySelector('#welcomeusername').innerHTML = `<h3>Welcome Dear ${memberUser.first_name}!</h3>`;
        document.querySelector('#userInfo').innerHTML = `
                                    <h5>Name: ${memberUser.first_name} ${memberUser.last_name}</h5>
                                    <h5>Email: ${memberUser.email}</h5>
                                    <h5>Tel: ${memberUser.phone_number}</h5>
                                    <h5>Qualification: ${memberUser.qualification}</h5>
                                    <h5>Occupation: ${memberUser.occupation}</h5>   
                                    `
    }
}
getCurrentUser()

getMedLog();

async function getMedLog() {
    const res = await fetch('/getMedLog');
    const results = await res.json();
    if (res.status === 200) {
        console.log(results)
        const medLogDetails = document.querySelector('#medLogDetails');
        for (let result of results) {
            medLogDetails.innerHTML += `
            <tr class="tr-formate">
                <td class="column1">2021-04-12</td>
                <td class="column2">${result.injury_name}</td>
                <td id="diagnosisDetails" class="column3"></td>
            </tr>
            `
            const diagnosisDetails = document.querySelector('#diagnosisDetails');
            
            let index = 1;
            for (let key in result.diagnosis) {
                diagnosisDetails.innerHTML += `
                    <p>${index++}. ${key}: ${result.diagnosis[key]}</p>
                `
            }
        }
    } else console.log(results.message)
}
// need modification depending

//logout
document.querySelector('#logOutBtn').addEventListener('click', logOut);

async function logOut() {
    const res = await fetch('/logOut');
    const result = await res.json();
    console.log('logout')
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


document.querySelector('#memberinfo').addEventListener('submit',
    async function (event) {
        event.preventDefault();
        const form = event.currentTarget;
        const formData = new FormData();

        formData.append('first_name', form.first_name.value);
        formData.append('last_name', form.last_name.value);
        // formData.append('email', form.email.value);
        formData.append('password', form.password.value);
        formData.append('phone_number', form.phone_number.value);
        // formData.append('gender', form.gender.value);
        // formData.append('age', form.age.value);
        formData.append('occupation', form.occupation.value);
        formData.append('qualification', form.qualification.value);
        // formData.append('image', form.image.files[0]);
        // formData.append('experience', form.experience.value);
        // formData.append('is_active', true);
        // formData.append('is_contributor', form.is_contributor.value);

        const res = await fetch('/editInfo', {
            method: "POST",
            body: formData
        });

        if (res.status === 200) {
            const result = await res.json()
            console.log(result)
            getCurrentUser()
        } else {
            const result = await res.json();

        }
        form.reset();

    })
