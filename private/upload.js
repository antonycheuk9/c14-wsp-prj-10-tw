document.querySelector("#image-input").addEventListener("change", async (event) => {
    console.log(event);
    const formData = new FormData();
    formData.append('image', event.target.files[0]);

    const res = await fetch('/profile-picture', {
        method: "POST",
        body: formData
    });
    const result = await res.json();
    console.log(result);
    document.querySelector("#image-output").src = result;

})