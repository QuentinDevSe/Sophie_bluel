
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

     // Ajoutez l'écouteur d'événement pour afficher le formulaire d'ajout de travail
     const addWorkButton = modal.querySelector('.add-work-button');
     addWorkButton.addEventListener('click', function () {
         // Afficher le formulaire pour ajouter un travail
         displayAddFormWork();

});
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
            headers: headers 
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

const displayAddFormWork = function () {
    const modalContent = modal.querySelector('.modal-wrapper');
    modalContent.innerHTML = ''; 

    const addWorkForm = document.createElement('form');
    addWorkForm.classList.add('add-work-form');
    // Ajoutez un gestionnaire d'événements pour l'événement "submit" du formulaire
    addWorkForm.addEventListener('submit', async function (event) {
        event.preventDefault();
    
        const formData = new FormData(); // Créez un objet FormData vide
    
        
        // Vérifiez d'abord si l'utilisateur a sélectionné une image
        if (imageInput.files.length > 0) {
            // Ajoutez l'image au FormData avec le nom "image"
            formData.append('image', imageInput.files[0]);
        }
    
        // Ajoutez le titre au FormData avec le nom "title"
        formData.append('title', titleInput.value);
        
        // Ajoutez la catégorie au FormData avec le nom "category"
        formData.append('category', categorySelect.value);
        
        const authToken = sessionStorage.getItem("token");

        const headers = {
            'Authorization': `Bearer ${authToken}`, // Utilisation du token d'authentification
            'Content-Type': 'application/json'
        };
    
        try {
            const response = await fetch('http://localhost:5678/api/works', {
                method: 'POST',
                body: JSON.stringify(formData),
                headers: headers
            });
    
            if (!response.ok) {
                throw new Error('Erreur lors de l\'ajout du travail');
            }
    
            // Mettez à jour le contenu de la modale pour afficher le travail nouvellement ajouté
            updateModalContent();
        } catch (error) {
            console.error(error);
        }
    });
    // Ajouter un travail
    // Image (glisser-déposer)
    const imageLabel = document.createElement('label');
    imageLabel.textContent = 'jpg, png (4 Mo max) :';
    const imageInput = document.createElement('input');
    imageInput.type = 'file';
    imageInput.id = 'imageInput';
    imageInput.accept = 'image/jpeg, image/png';
    imageInput.style.display = 'none';
    imageLabel.appendChild(imageInput);
    addWorkForm.appendChild(imageLabel);

    const dropZone = document.createElement('div');
    dropZone.id = 'dropZone';
    dropZone.textContent = '+ Ajouter une photo';
    addWorkForm.appendChild(dropZone);

    const imagePreview = document.createElement('img');
    imagePreview.id = 'imagePreview';
    imagePreview.alt = 'Aperçu de l\'image';
    addWorkForm.appendChild(imagePreview);
    
    // Titre
    const titleLabel = document.createElement('label');
    titleLabel.textContent = 'Titre';
    const titleInput = document.createElement('input');
    titleInput.type = 'text';
    titleInput.name = 'title';
    titleLabel.appendChild(titleInput);
    addWorkForm.appendChild(titleLabel);

    // Catégorie
    const categoryLabel = document.createElement('label');
    categoryLabel.textContent = 'Catégorie';
    const categorySelect = document.createElement('select');
    categorySelect.name = 'category';
    const categories = ['Objets', 'Appartements', 'Hôtels & Restaurants'];
    categories.forEach((category, index) => {
        const option = document.createElement('option');
        option.value = index + 1;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
    categoryLabel.appendChild(categorySelect);
    addWorkForm.appendChild(categoryLabel);

    
    const submitButton = document.createElement('button');
    submitButton.textContent = 'Ajouter';
    submitButton.type = 'submit';
    addWorkForm.appendChild(submitButton);

    modalContent.appendChild(addWorkForm);

    // Gestion du glisser-déposer d'images
    const handleDrop = function (event) {
        event.preventDefault();
        event.stopPropagation();

        const file = event.dataTransfer.files[0];

        if (validateFile(file)) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imagePreview = document.getElementById('imagePreview');
                imagePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    const validateFile = function (file) {
        const allowedTypes = ['image/jpeg', 'image/png'];
        const maxSize = 4 * 1024 * 1024; // 4 Mo en octets

        if (!allowedTypes.includes(file.type)) {
            alert('Veuillez sélectionner une image au format JPG ou PNG.');
            return false;
        }

        if (file.size > maxSize) {
            alert('La taille de l\'image ne doit pas dépasser 4 Mo.');
            return false;
        }

        return true;
    };

    dropZone.addEventListener('dragover', function (event) {
        event.preventDefault();
        event.stopPropagation();
    });

    dropZone.addEventListener('drop', handleDrop);

    const fileInput = document.getElementById('imageInput');
    fileInput.addEventListener('change', function (event) {
        const file = event.target.files[0];
        const maxSize = 4 * 1024 * 1024; // 4 Mo en octets

        if (file.size > maxSize) {
            alert('La taille de l\'image ne doit pas dépasser 4 Mo.');
            this.value = ''; // Réinitialisez l'élément input pour effacer le fichier sélectionné
            return;
        }

        if (validateFile(file)) {
            const reader = new FileReader();
            reader.onload = function (e) {
                const imagePreview = document.getElementById('imagePreview');
                imagePreview.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
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