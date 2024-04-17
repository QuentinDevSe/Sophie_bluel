import { login } from './login.js';

// Appel de la fonction login lors du chargement du document
document.addEventListener('DOMContentLoaded', () => {
    login();
});

let works = [];
// Récupération des travaux depuis l'API
async function fetchWorks() {
    const reponse = await fetch('http://localhost:5678/api/works');
    works = await reponse.json();
    genererWorks(works);
}

fetchWorks();

function genererWorks(works) {
    for (let i = 0; i < works.length; i++) {

        const article = works[i];
        // Récupération de l'élément du DOM qui accueillera les fiches
        const sectionFiches = document.querySelector(".gallery");
        // Création d’une balise dédiée à un travail de l'architecte
        const worksElement = document.createElement("article");
        worksElement.dataset.id = works[i].id
        // Création des balises 
        const imageElement = document.createElement("img");
        imageElement.src = article.imageUrl;
        const nomElement = document.createElement("p");
        nomElement.innerText = article.title;
        // On rattache la balise article a la section Fiches
        sectionFiches.appendChild(worksElement);
        worksElement.appendChild(imageElement);
        worksElement.appendChild(nomElement);
    }
    
}

const boutonFiltrerObjets = document.querySelector(".btn-filters-objects");
boutonFiltrerObjets.addEventListener("click", function () {
    const worksFiltresObjects = works.filter(function (work) {
        return work.category.id === 1;
    });
    document.querySelector(".gallery").innerHTML = "";
    genererWorks(worksFiltresObjects);
});

const boutonFiltrerAppartements = document.querySelector(".btn-filters-appartements");
boutonFiltrerAppartements.addEventListener("click", function () {
    const worksFiltresAppartements = works.filter(function (work) {
        return work.category.id === 2;
    });
    document.querySelector(".gallery").innerHTML = "";
    genererWorks(worksFiltresAppartements);
});

const boutonFiltrerHotelRestaurant = document.querySelector(".btn-filters-hotelrestaurant");
boutonFiltrerHotelRestaurant.addEventListener("click", function () {
    const worksFiltresHotelRestaurant = works.filter(function (work) {
        return work.category.id === 3;
    });
    document.querySelector(".gallery").innerHTML = "";
    genererWorks(worksFiltresHotelRestaurant);
});

const boutonFiltrerAll = document.querySelector(".btn-filters-all");
boutonFiltrerAll.addEventListener("click", function () {
    document.querySelector(".gallery").innerHTML = "";
    genererWorks(works); // Affiche tous les travaux
});