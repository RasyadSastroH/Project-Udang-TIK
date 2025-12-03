// main.js used in index.html and for small UI behaviors
document.addEventListener('DOMContentLoaded', () => {
  const y = new Date().getFullYear();
  const el = document.getElementById('year');
  if(el) el.textContent = y;
  const el2 = document.getElementById('year2');
  if(el2) el2.textContent = y;
  const el3 = document.getElementById('year3');
  if(el3) el3.textContent = y;
});
