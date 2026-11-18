// Filter the project cards by the pressed button.
const buttons=/** @type {NodeListOf<HTMLButtonElement>} */(document.querySelectorAll(".filters button"));
const cards=/** @type {NodeListOf<HTMLElement>} */(document.querySelectorAll("#cards .card"));
buttons.forEach(b => b.onclick = () => {
  buttons.forEach(x => x.setAttribute("aria-pressed", String(x === b)));
  cards.forEach(c => c.hidden = b.dataset.f !== "all" && c.dataset.k !== b.dataset.f);
});
