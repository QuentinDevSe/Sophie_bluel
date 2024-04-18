const openModal = function (event) {
    event.preventDefault();
    const target = document.querySelector(event.target.getAttribute('href'));
    target.style.display = null;
    target.removeAttribute('aria-hidden');
    target.setAttribute('aria-modal', 'true');
};

// Sélection des éléments avec la classe 'js-modal' et ajout d'un écouteur d'événements à chacun
Array.from(document.querySelectorAll('.js-modal')).forEach(a => {
    a.addEventListener('click', openModal);
});