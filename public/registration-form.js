//pop up form

function regOpenForm() {
    document.getElementById("newMemberForm").style.display = "block";
    regCloseForm1()
}
function regCloseForm() {
    document.getElementById("newMemberForm").style.display = "none";
}


function regOpenForm1() {
    document.getElementById("newContributorForm").style.display = "block";
    regCloseForm()
}
function regCloseForm1() {
    document.getElementById("newContributorForm").style.display = "none";
}



//member registration form
document.querySelector('#memberForm') // change route
    .addEventListener('submit', async function (event) {

        event.preventDefault();

        const form = event.target;
        const formData = new FormData();
        formData.append('first_name', form.first_name.value);
        formData.append('last_name', form.last_name.value);
        formData.append('email', form.email.value);
        formData.append('password', form.password.value);
        formData.append('phone_number', form.phone_number.value);
        formData.append('gender', form.gender.value);
        formData.append('age', form.age.value);
        // formData.append('occupation', form.occupation.value);
        // formData.append('qualification', form.qualification.value);
        // formData.append('experience', form.experience.value);
        formData.append('is_active', true);
        formData.append('is_contributor', form.is_contributor.value);

        // if (form.image.files[0]) {
        //     formData.append('image', form.image.files[0]);
        // }
        console.log(typeof form.phone_number.value, typeof form.gender.value, typeof form.age.value)

        const res = await fetch('/memberRegistration', { // change route
            method: "POST",
            body: formData
        });

        if (res.status === 200) {
            const result = await res.json()
            window.location = 'userProfile.html'; // change to a suitable html
        } else {
            const result = await res.json();
            console.log(result)
        }

        form.reset();

    });

//contributor registration form

document.querySelector('#newContributorForm') // change route
    .addEventListener('submit', async function (event) {

        event.preventDefault();

        const form = event.target;
        const formData = new FormData();
        formData.append('first_name', form.first_name.value);
        formData.append('last_name', form.last_name.value);
        formData.append('email', form.email.value);
        formData.append('password', form.password.value);
        formData.append('phone_number', form.phone_number.value);
        formData.append('gender', form.gender.value);
        formData.append('age', form.age.value);
        // formData.append('occupation', form.occupation.value);
        // formData.append('qualification', form.qualification.value);
        formData.append('experience', form.experience.value);
        formData.append('is_active', true);
        formData.append('is_contributor', form.is_contributor.value);

        // if (form.image.files[0]) {
        //     formData.append('image', form.image.files[0]);
        // }
        console.log(typeof form.phone_number.value, typeof form.gender.value, typeof form.age.value)

        const res = await fetch('/contributorRegistration', { // change route
            method: "POST",
            body: formData
        });

        if (res.status === 200) {
            const result = await res.json()
            window.location = 'contributorProfile.html'; // change to a suitable html
        }
        form.reset();

    });