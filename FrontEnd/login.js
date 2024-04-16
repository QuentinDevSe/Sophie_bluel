export async function login() {
    const form = document.querySelector('form');
    const emailInput = document.getElementById('email');
    const passwordInput = document.getElementById('password');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        // Création de l’objet du nouvel avis.
        const  formData = {
        email: event.target.querySelector("[email=email").value,
        password: event.target.querySelector("[password=password]").value,
        };
        // Création de la charge utile au format JSON
        const chargeUtile = JSON.stringify(formData);

        try {
            const response = await fetch('http://localhost:5678/api/users/login', {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: chargeUtile
            });

            if (response.ok) {
                // Authentification réussie, rediriger l'utilisateur vers la page d'accueil
                window.location.href = 'index.html';
            } else {
                // Afficher un message d'erreur à l'utilisateur
                alert('Erreur dans l’identifiant ou le mot de passe');
            }
        } catch (error) {
            console.error('Erreur lors de la connexion :', error);
            alert('Une erreur s\'est produite lors de la connexion');
        }
    });
}