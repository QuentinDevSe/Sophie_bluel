export async function login() {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    // Fonction pour gérer la soumission du formulaire
    const FormSubmit = async (event) => {
        event.preventDefault();

        // Stockage des identifiants saisis par l'utilisateur
        const email = emailInput.value;
        const password = passwordInput.value;

        try {
            // Appel de l'API pour l'authentification
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            // Vérification de la réponse HTTP
            if (response.ok) {
                // Récupération des données JSON renvoyées par l'API
                const data = await response.json();

                // Vérification des données et gestion de la redirection
                if (data.success) {
                    // Authentification réussie, redirection vers la page d'accueil
                    localStorage.setItem('token', data.token);
                    window.location.href = 'index.html';
                } else {
                    // Affichage d'un message d'erreur en cas d'authentification échouée
                    alert('Erreur dans l’identifiant ou le mot de passe');
                }
            } else {
                // Affichage d'un message d'erreur en cas de problème avec la requête
                alert('Une erreur s\'est produite lors de la connexion');
            }
        } catch (error) {
            // Affichage d'un message d'erreur en cas d'erreur inattendue
            console.error('Erreur lors de la connexion :', error);
            alert('Une erreur s\'est produite lors de la connexion');
        }
    };

    // Ajout du gestionnaire d'événements à la soumission du formulaire
    form.addEventListener('submit', FormSubmit);
}

// Appel de la fonction login lors du chargement du document
document.addEventListener('DOMContentLoaded', () => {
    login();
});
