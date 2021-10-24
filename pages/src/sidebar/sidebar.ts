import { ESLPanel } from "../../../src/modules/all";

document!.getElementById("list-trigger")!.addEventListener("click", function () {
  const panels = Array.from(document.querySelectorAll('.sb-dropdown-content')) as ESLPanel[];
  panels.filter((panel) => {
    panel.open && panel.toggle();
  })
});
