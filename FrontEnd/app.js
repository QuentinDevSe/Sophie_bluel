
let modal = null;
const focusableSelector = "button, a, input, textarea";
let focusables = [];

const openModal = function (event) {
    event.preventDefault();
    modal = document.querySelector(event.target.getAttribute('href'));
    focusables = Array.from(modal.querySelectorAll(focusableSelector));
    modal.style.display = null;
    modal.removeAttribute('aria-hidden');
    modal.setAttribute('aria-modal', 'true');
    modal.addEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation);

    // Mettez à jour le contenu du modal-wrapper avec les images de la galerie
    updateModalContent();
};


const closeModal = function (event) {
    if (modal === null) return;
    event.preventDefault();
    modal.style.display = "none";
    modal.setAttribute('aria-hidden', 'true');
    modal.removeAttribute('aria-modal');
    modal.removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal);
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation);
    modal = null;
};

const stopPropagation = function (event) {
    event.stopPropagation();
};

const focusInModal = function(event) {
    event.preventDefault;
    let index = focusables.findIndex(f => f === modal.querySelector(':focus'));
    index++
    if (index >= focusables.lenght) {
        index = 0;
    };
    focusables[index].focus();
};

const updateModalContent = function () {
    const galleryImages = document.querySelectorAll('.gallery img');
    const modalContent = modal.querySelector('.modal-wrapper');
    const minGrid = modalContent.querySelector('.min-grid');

    // Supprimez le contenu actuel du modalContent
    minGrid.innerHTML = "";

    // Parcourez toutes les images de la galerie et créez des miniatures d'images correspondantes dans le modalContent
    galleryImages.forEach(image => {
        const modalImageContainer = document.createElement('div');
        modalImageContainer.classList.add('modal-image-container');

        const modalImage = document.createElement('img');
        modalImage.src = image.src;
        modalImage.alt = image.alt;
        modalImage.classList.add('min');

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-button');
        deleteButton.textContent = 'Supprimer';
         // Ajoutez l'ID du travail comme un attribut data-id
         deleteButton.dataset.id = image.parentElement.dataset.id;
        
         deleteButton.addEventListener('click', async function () {
             const workId = deleteButton.dataset.id; // Récupérez l'ID du travail depuis l'attribut data-id
             await deleteWorkAndUpdateDOM(workId, modalImageContainer);
         });

        modalImageContainer.appendChild(deleteButton);
        modalImageContainer.appendChild(modalImage);
        minGrid.appendChild(modalImageContainer);
    });


    const addWorkButton = document.createElement('button');
    addWorkButton.textContent = 'Ajouter un travail';
    addWorkButton.classList.add('add-work-button');
    addWorkButton.addEventListener('click', function () {
            // Afficher le formulaire pour ajouter un travail
        displayAddWorkForm();
    
    });

    modalContent.appendChild(addWorkButton);
};

// Fonction pour supprimer un travail de l'API
const deleteWork = async function(workId) {
    try {
        // Récupération du token d'authentification depuis la variable authToken
        const authToken = sessionStorage.getItem("token");

        // Préparation des en-têtes de la requête avec le token d'authentification
        const headers = {
            'Authorization': `Bearer ${authToken}`, // Utilisation du token d'authentification
            'Content-Type': 'application/json'
        };

        const response = await fetch(`http://localhost:5678/api/works/${workId}`, {
            method: 'DELETE',
            headers: headers // Inclusion des en-têtes dans la requête
        });
        
        if (!response.ok) {
            throw new Error('Erreur lors de la suppression du travail');
        }
        return response;
    } catch (error) {
        console.error(error);
    }
};

const deleteWorkAndUpdateDOM = async function(workId, imageContainer) {
    await deleteWork(workId); // Supprimez le travail de l'API
    // Supprimez l'image de la galerie principale
    imageContainer.parentElement.remove();
    // Supprimez l'image de la modale
    imageContainer.remove();
};

const displayAddWorkForm = function () {
    const modalContent = modal.querySelector('.modal-wrapper');
    modalContent.innerHTML = ''; 

    const addWorkForm = document.createElement('form');
    addWorkForm.classList.add('add-work-form');
    // Ajoutez les champs nécessaires pour ajouter un travail (par exemple, titre, image, catégorie, etc.)
    // Ajoutez des éléments au formulaire

    // Ajout d'un bouton "Ajouter" pour soumettre le formulaire
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Ajouter';
    submitButton.type = 'submit';
    addWorkForm.appendChild(submitButton);

    modalContent.appendChild(addWorkForm);
};

// Sélection des éléments avec la classe 'js-modal' et ajout d'un écouteur d'événements à chacun
Array.from(document.querySelectorAll('.js-modal')).forEach(a => {
    a.addEventListener('click', openModal);
});

window.addEventListener('keydown', function(event) {
    if (event.key === "Escape" || event.key === "Esc") {
        closeModal(event);
    };
    if (event.key === 'Tab' && modal !== null) {
        focusInModal(event);
    };
});