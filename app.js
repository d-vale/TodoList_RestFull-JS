"use strict";
//Variables
const token = "";

//Sélecteur
const formSignUp = document.querySelector(`form[name='signup'`);
const formLogin = document.querySelector(`form[name='login'`);

//EventListener SignUp
formSignUp.addEventListener("submit", function (e) {
  e.preventDefault();
/*   const InputMail = formSignUp.querySelector("input[name='email']");
  const InputPassword = formSignUp.querySelector("input[name='password']"); */
  const formData = new FormData(formSignUp);
  createUser(Object.fromEntries(formData));
  formSignUp.reset();
});

//EventListener Login
formLogin.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(formLogin);
  const data = Object.fromEntries(formData);
  loginUser(data.email, data.password);
  formLogin.reset();
})

// Création d'un compte utilisateur
const createUser = async (formData) => {
  //Les options pour le POST
  const options = {
    "method": "POST",
    "headers": { "Content-Type": "application/json" },
    "body": JSON.stringify(formData)
  };
  const reponse = await fetch("https://progweb-todo-api.onrender.com/users/", options); //Appel de l'API en POST avec l'options
  const data = await reponse.json(); //Transformation en JSON
  await displayMessage(data.message); //Mise à jour du message selon la réponse de l'API
};

// Login d'un utilisateur
const loginUser = async (mail, password) => {
const options = {

}
}

const isAuthenticated = () => false;

// Affiche un message à l'utilisateur.
const displayMessage = (message) => {
  document.querySelector(".message").textContent = message; // Sélectionne l'élément de message et met à jour son texte.
};

// Gère l'affichage des éléments de l'interface en fonction de l'état d'authentification.
const handleInterfaceAuth = () => {
  const auth = isAuthenticated(); // Vérifie si l'utilisateur est authentifié.
  document
    .querySelectorAll(".requires-auth")
    .forEach((el) => el.classList.toggle("hidden", !auth)); // Cache ou montre les éléments nécessitant une authentification.
  document
    .querySelectorAll(".requires-unauth")
    .forEach((el) => el.classList.toggle("hidden", auth)); // Cache ou montre les éléments ne nécessitant pas d'authentification.
};

// Basculer entre les formulaires de connexion et d'inscription.
const toggleForm = (formName) => {
  document
    .querySelectorAll("form")
    .forEach((form) => form.classList.remove("active")); // Désactive tous les formulaires.
  document.querySelector(`form[name='${formName}']`).classList.add("active"); // Active le formulaire spécifié.

  document
    .querySelectorAll(".tab")
    .forEach((tab) => tab.classList.remove("active")); // Désactive tous les onglets.
  document.querySelector(`.tab#${formName}`).classList.add("active"); // Active l'onglet spécifié.
};

// **À COMPLETER**
// Initialisation de la page
const initEventListeners = () => {
  document.querySelector(".tab-container").addEventListener("click", (e) => {
    // Gère les clics sur les onglets.
    if (e.target.classList.contains("tab")) {
      toggleForm(e.target.id); // Bascule le formulaire actif en fonction de l'onglet cliqué.
    }
  });
};

// **À COMPLETER**
const pageLoad = () => {
  handleInterfaceAuth();
  initEventListeners();
};

pageLoad();
