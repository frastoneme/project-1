let baseUrl = 'http://localhost:3000';

// Select the form 
let form = document.querySelector("#profile-form");
// Attach the event to the form 
form.addEventListener('submit', handleSubmit);



// Handle form submission
function handleSubmit(e) {
    e.preventDefault();
    let formData = {
        name: e.target.name.value,
        age: e.target.age.value,
        gender: e.target.gender.value,
        status: e.target.status.value,
        reside: e.target.reside.value,
        story: e.target.story.value,
        image: e.target.image.value,
        mobile: e.target.mobile.value
    };

    // Reset the form
    e.target.reset();

    // CREATE
    fetch(`${baseUrl}/profiles`, {
        method: 'POST',
        headers: {
            "Content-Type": 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(res => {
        if(res.ok) {
            return res.json();
        } else {
            throw new Error("Failed to create a resource!!");
        }
    })
    .then(data => {
        addItem(data);
    })
    .catch(err => console.error({ "Error": err }));
}

// Read request
// GET /profiles
function getProfiles() {
    fetch(`${baseUrl}/profiles`,{
        method: 'GET' ,
        headers:{
            "Content-Type": 'application/json'
        }
    })
    .then(res => {
        if(res.ok) {
            return res.json();
        } else {
            throw new Error("Failed to fetch resource");
        }
    })
    .then(data => {
        // Array iteration 
        data.map((item) => {
            addItem(item);
        });
    });
}
getProfiles();

// Add item to the UI
function addItem(profile) {
    let listItem = document.querySelector("#item-list");
    let card = document.createElement('li');
    card.className = "card col-2 m-2";
    card.innerHTML = `
        <img src="${profile.image}" class="card-img-top mt-2" alt="${profile.name}">
        <div class="card-body">
            <h5 class="card-title">Name: ${profile.name}</h5>
            <p class="card-text">Location: ${profile.reside}<span style="font-weight: bold"><br>
            Mobile: ${profile.mobile}</span></p>
            <p class="card-text">Age: ${profile.age}</p>
            <p> Gender:${profile.gender}</p>
            <p>Current status: ${profile.status}</p>
            <p>My view on Life: ${profile.story}</p>
            <button class="btn m-2 edit-btn">Edit</button>
            <button class="btn delete-btn">Delete</button>
        </div>
    `;
    listItem.append(card);

    // Select the delete button 
    let deleteBtn = card.querySelector('.delete-btn');
    // Attach an event 
    deleteBtn.addEventListener('click', () => {
        fetch(`${baseUrl}/profiles/${profile.id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => {
            if(res.ok) {
                alert("Deleted successfully!!");
                card.remove(); // Remove the card from the UI
            }
        });
    });

    let editBtn = card.querySelector('.edit-btn');
    editBtn.addEventListener('click', () => {
        // Populate form fields with profile data
        document.querySelector('#name').value = profile.name;
        document.querySelector('#age').value = profile.age;
        document.querySelector('#gender').value = profile.gender;
        document.querySelector('#status').value = profile.status;
        document.querySelector('#reside').value = profile.reside;
        document.querySelector('#story').value = profile.story;
        document.querySelector('#image').value = profile.image;
        document.querySelector('#mobile').value = profile.mobile;
    
        // Update form submission to PUT method for editing
        form.removeEventListener('submit', handleSubmit); // Remove the existing event listener
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            let updatedFormData = {
                name: e.target.name.value,
                age: e.target.age.value,
                gender: e.target.gender.value,
                status: e.target.status.value,
                reside: e.target.reside.value,
                story: e.target.story.value,
                image: e.target.image.value,
                mobile: e.target.mobile.value,
            };
    
            // Reset the form
            e.target.reset();
    
            // Update the profile with PUT method
            fetch(`${baseUrl}/profiles/${profile.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedFormData),
            })
            .then((res) => {
                if (res.ok) {
                    // Update the UI with the new profile data
                    card.querySelector('.card-title').textContent = `Name: ${updatedFormData.name}`;
                    card.querySelector('.card-text:nth-of-type(3)').textContent = `Age: ${updatedFormData.age}`;
                    card.querySelector('.card-text:nth-of-type(4)').textContent = `Gender: ${updatedFormData.gender}`;
                    card.querySelector('.card-text:nth-of-type(5)').textContent = `Current status: ${updatedFormData.status}`;
                    card.querySelector('.card-text:nth-of-type(2)').textContent = `Location: ${updatedFormData.reside}`;
                    card.querySelector('.card-text:nth-of-type(6)').textContent = `My view on Life: ${updatedFormData.story}`;
                    card.querySelector('.card-img-top').src = updatedFormData.image;
                    card.querySelector('.card-text:nth-of-type(2) span').textContent = `Mobile: ${updatedFormData.mobile}`;
                } else {
                    throw new Error('Failed to update profile!');
                }
            })
            .catch((err) => console.error({ Error: err }));
        });
    });
    // Add mouseover event listener for cards
card.addEventListener('mouseover', () => {
    card.style.backgroundColor = 'lightgray';
});

// Remove mouseover effect when mouse leaves the card
card.addEventListener('mouseleave', () => {
    card.style.backgroundColor = '';
});

// Add keyup event listener for the age input field
let ageInput = document.querySelector('#age');
ageInput.addEventListener('keyup', (e) => {
    let ageValue = parseInt(e.target.value);
    if (isNaN(ageValue) || ageValue < 18) {
        ageInput.classList.add('is-invalid');
    } else {
        ageInput.classList.remove('is-invalid');
    }
});

  
}
