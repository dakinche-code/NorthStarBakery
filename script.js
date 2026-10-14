"use strict";
// Two data structures: product objects and an array of saved product IDs.
const products = [
  { id: "signature-loaf", label: "Signature Loaf" },
  { id: "pastries", label: "Pastries" },
  { id: "celebration-cake", label: "Celebration Cake" }
];
const storageKey = "northStarBakeryFavorites";
function loadFavorites() {
  try {
    const value = JSON.parse(localStorage.getItem(storageKey) || "[]");
    return Array.isArray(value) ? value.filter(id => products.some(product => product.id === id)) : [];
  } catch (_) { return []; }
}
let favorites = loadFavorites();
function saveFavorites() {
  try { localStorage.setItem(storageKey, JSON.stringify(favorites)); }
  catch (_) { document.getElementById("favorite-summary").textContent = "Your choices work now, but this browser cannot save them."; }
}
function renderFavorites() {
  const container = document.getElementById("favorite-options");
  if (!container) return;
  container.replaceChildren();
  products.forEach(product => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice";
    button.textContent = product.label;
    button.setAttribute("aria-pressed", String(favorites.includes(product.id)));
    button.addEventListener("click", () => toggleFavorite(product.id));
    container.append(button);
  });
  const names = products.filter(product => favorites.includes(product.id)).map(product => product.label);
  document.getElementById("favorite-summary").textContent = names.length ? "Saved favorites: " + names.join(", ") : "No favorites selected yet.";
}
function toggleFavorite(id) {
  favorites = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
  saveFavorites(); renderFavorites();
}
function showError(fieldId, errorId, message) {
  document.getElementById(errorId).textContent = message;
  document.getElementById(fieldId).setAttribute("aria-invalid", String(Boolean(message)));
  return !message;
}
function validateForm() {
  const name = document.getElementById("customer-name").value.trim();
  const email = document.getElementById("customer-email").value.trim();
  const type = document.getElementById("request-type").value;
  const details = document.getElementById("request-details").value.trim();
  const checks = [
    showError("customer-name", "name-error", name.length < 2 ? "Enter your name (at least 2 characters)." : ""),
    showError("customer-email", "email-error", /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? "" : "Enter a valid email address."),
    showError("request-type", "type-error", type ? "" : "Select a request type."),
    showError("request-details", "details-error", details.length < 10 ? "Describe your request in at least 10 characters." : "")
  ];
  return checks.every(Boolean);
}
function initializeForm() {
  const form = document.getElementById("preorder-form");
  if (!form) return;
  form.addEventListener("submit", event => {
    event.preventDefault();
    const valid = validateForm();
    document.getElementById("form-result").textContent = valid ? "Your request looks ready. This demo does not send orders; contact the bakery to confirm." : "Please correct the highlighted fields before continuing.";
    if (!valid) form.querySelector('[aria-invalid="true"]').focus();
  });
  form.querySelectorAll("input,select,textarea").forEach(field => field.addEventListener("input", () => {
    if (field.getAttribute("aria-invalid") === "true") validateForm();
  }));
}
document.addEventListener("DOMContentLoaded", () => {
  renderFavorites();
  const clear = document.getElementById("clear-favorites");
  if (clear) clear.addEventListener("click", () => { favorites = []; saveFavorites(); renderFavorites(); });
  initializeForm();
});
