"use strict";
//Variables
const token = "";

//Sélecteur
const formSignUp = document.querySelector(`form[name='signup'`);
const formLogin = document.querySelector(`form[name='login'`);
const logoutButton = document.querySelector(`button[name='logout'`);
const formPostTodo = document.querySelector(`form[name='todo'`);
const todosContainer = document.querySelector(`ul`);

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

// Création d'un compte utilisateur
const createUser = async (formData) => {
  //Les options pour le POST
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(formData),
  };
  const reponse = await fetch(
    "https://progweb-todo-api.onrender.com/users/",
    options
  ); //Appel de l'API en POST avec l'options
  const data = await reponse.json(); //Transformation en JSON
  await displayMessage(data.message); //Mise à jour du message selon la réponse de l'API
};

// Login d'un utilisateur
const loginUser = async (mailAndPassword) => {
  const options = {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(mailAndPassword),
  };
  //API LOGIN
  const reponse = await fetch(
    "https://progweb-todo-api.onrender.com/users/login",
    options
  );
  const data = await reponse.json(); //Transformation JSON
  await displayMessage(data.message); //Mets le message
  await localStorage.setItem("token", data.token); //Enregistre le token dans le localStorage
  await pageLoad(); //Reload les éléments de la page
};

//Récupérer les todos
const getTodos = async () => {
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
  await displayTodos(data.todos);
};

//Afficher les todos
const displayTodos = async (todos) => {
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

//Fonction ajouter des todos !
const addTodos = async (todo) => {
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
  displayMessage(data.message);
  pageLoad();
};

//Fonction supprimer des todos
const deleteTodo = async (todoID) => {
  const options = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body : JSON.stringify(null)
  };

  const reponse = await fetch(
    `https://progweb-todo-api.onrender.com/todos/${todoID}`,
    options
  );
  const data = await reponse.json();
  await displayMessage(data.message);
  await pageLoad();
};

//True si l'utilisateur est logé, sinon false
const isAuthenticated = () => {
  if (localStorage.getItem("token")) {
    return true;
  } else {
    return false;
  }
};

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
  getTodos();
};

pageLoad();
