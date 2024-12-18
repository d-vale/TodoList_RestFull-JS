"use strict";

//Sélecteur --------------------------------------------------------------------------------------------
const formSignUp = document.querySelector(`form[name='signup'`);
const formLogin = document.querySelector(`form[name='login'`);
const logoutButton = document.querySelector(`button[name='logout'`);
const formPostTodo = document.querySelector(`form[name='todo'`);
const todosContainer = document.querySelector(`ul`);

//EventListeners FORM --------------------------------------------------------------------------------------------
//EventListener SignUp
formSignUp.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(formSignUp);
  createUser(Object.fromEntries(formData));
  formSignUp.reset(); //Enlever les valeurs dans les champs
});

//EventListener Login
formLogin.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(formLogin);
  const data = Object.fromEntries(formData);
  loginUser(data);
  formLogin.reset(); //Enlever les valeurs dans les champs
});

//EventListener Logout
logoutButton.addEventListener("click", function () {
  localStorage.removeItem("token");
  displayMessage("");
  pageLoad(); //Reload la page en mettant tout en place
});

//EventListener add todo
formPostTodo.addEventListener("submit", function (e) {
  e.preventDefault();
  const formData = new FormData(formPostTodo);
  const data = Object.fromEntries(formData);
  if (data.body && data.tags) {
    addTodos(data);
    formPostTodo.reset(); //Enlever les valeurs dans les champs
  } else {
    displayMessage("Champs vides !");
  }
});

//EventListener delete todo
todosContainer.addEventListener("click", function (e) {
  if (e.target.tagName === "DIV") {
    deleteTodo(e.target.parentElement.id); //Envoie de l'id
  }
});

//API REST --------------------------------------------------------------------------------------------
// Création d'un compte utilisateur
const createUser = async (formData) => {
  try {
    //Les options pour le POST
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    };
    const reponse = await fetch(
      "https://progweb-todo-api.onrender.com/users/",
      options
    ); //Recup API
    const data = await reponse.json(); //Transformation en JSON
    displayMessage(data.message); //Mise à jour du message selon la réponse de l'API
  } catch (e) {
    displayMessage(e); //Affiche message d'erreur en cas d'erreur
  }
};

// Login d'un utilisateur
const loginUser = async (mailAndPassword) => {
  try {
    const options = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mailAndPassword),
    };
    //API LOGIN
    const reponse = await fetch(
      "https://progweb-todo-api.onrender.com/users/login",
      options
    ); //Recup API
    const data = await reponse.json(); //Transformation JSON
    displayMessage(data.message); //Mets le message
    localStorage.setItem("token", data.token); //Enregistre le token dans le localStorage
    pageLoad(); //Reload les éléments de la page
  } catch (e) {
    displayMessage(e); //Affiche message d'erreur en cas d'erreur
  }
};

//Récupérer les todos
const getTodos = async () => {
  try {
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    };
    const reponse = await fetch(
      "https://progweb-todo-api.onrender.com/todos/",
      options
    ); //Recup API
    const data = await reponse.json(); //Transformer en object JS
    displayTodos(data.todos); //Appel fonction affichage des todos
  } catch (e) {
    displayMessage(e); //Affiche message d'erreur en cas d'erreur
  }
};

//Fonction ajouter des todos !
const addTodos = async (todo) => {
  try {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(todo),
    };

    const reponse = await fetch(
      "https://progweb-todo-api.onrender.com/todos/",
      options
    ); //Recup API
    const data = await reponse.json();
    displayMessage(data.message); //Mettre le message reçu
    pageLoad(); //Refresh la page en appellant la fonction
  } catch (e) {
    displayMessage(e); //Affiche message d'erreur en cas d'erreur
  }
};

//Fonction supprimer des todos
const deleteTodo = async (todoID) => {
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(null),
  };

  const reponse = await fetch(
    `https://progweb-todo-api.onrender.com/todos/${todoID}`,
    options
  );
  const data = await reponse.json();
  await displayMessage(data.message);
  await pageLoad();
};

//Base function --------------------------------------------------------------------------------------------
//Display todos
const displayTodos = (todos) => {
  todosContainer.replaceChildren();
  todos.forEach((el) => {
    const html = `
    <li id=${el.id}>
    <p class="body">${el.body}</p>
    <p class="tags">${el.tags}</p>
    <div class="delete"></div>
  </li>
    `;
    todosContainer.insertAdjacentHTML("afterbegin", html);
  });
};

//True si l'utilisateur est logé, sinon false
const isAuthenticated = () => !!localStorage.getItem("token");

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

// Initialisation de la page
const initEventListeners = () => {
  document.querySelector(".tab-container").addEventListener("click", (e) => {
    // Gère les clics sur les onglets.
    if (e.target.classList.contains("tab")) {
      toggleForm(e.target.id); // Bascule le formulaire actif en fonction de l'onglet cliqué.
    }
  });
};

//Reload la page en mettant à jour l'interface selon le login et les todos
const pageLoad = () => {
  handleInterfaceAuth(); //Interface selon si user login ou non
  initEventListeners(); //Interface initialisation
  if (isAuthenticated()) {
    getTodos(); //Récuperer les todos si login et les afficher
  }
};

pageLoad();
