async function login() {
    

    // Fonction pour gérer la soumission du formulaire
    const FormSubmit = async (event) => {
        event.preventDefault();

        // Stockage des identifiants saisis par l'utilisateur
        const identifiants = {
            email: event.target.querySelector("[name=email]").value,
            password: event.target.querySelector("[name=password]").value
        }

        try {
            // Appel de l'API pour l'authentification
            await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(identifiants)
                
            })

            .then(response => {
                if (response.ok) {
                // Récupération des données JSON renvoyées par l'API
                const data = response.json();
                return data;

                } else {
                    alert('Erreur dans l’identifiant ou le mot de passe');
                    throw new error ('Erreur dans l’identifiant ou le mot de passe');
                }
            })

            .then(data => {
                sessionStorage.setItem("user",identifiants.email);
                sessionStorage.setItem("isUser", "true");
                sessionStorage.setItem("token",data.token);
                window.location.href = "index.html";
            })
        
            
            } catch (error) {
                // Affichage d'un message d'erreur en cas d'erreur inattendue
                console.error('Erreur lors de la connexion :', error);
                alert('Une erreur s\'est produite lors de la connexion');
            }
        }   
        const form = document.querySelector('form');
        form.addEventListener('submit', FormSubmit);
};

    // Ajout du gestionnaire d'événements à la soumission du formulaire
    


// Appel de la fonction login lors du chargement du document
document.addEventListener('DOMContentLoaded', () => {
    login();
});
