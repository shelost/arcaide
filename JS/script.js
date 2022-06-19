let MENU = false;
const dark = Id("dark");
const menuBox = Id("menu");
const id = Id("id");
const search = Id("search");
const items = Id("items");

function toggle(n) {
  if (n == 1) {
    dark.style.visibility = "visible";
    dark.style.opacity = 1;
    menuBox.style.visibility = "visible";
    menuBox.style.opacity = 1;
  } else {
    dark.style.visibility = "hidden";
    dark.style.opacity = 0;
    menuBox.style.visibility = "hidden";
    menuBox.style.opacity = 0;
  }
  search.value = "";
}

dark.onclick = () => {
  toggle(0);
};

id.onclick = () => {
  toggle(1);
};

search.oninput = () => {
  items.innerHTML = "";
  for (let i = 0; i < menu.length; i++) {
    let name = menu[i];
    if (
      name.substring(0, search.value.length) == search.value ||
      search.value == ""
    ) {
      items.innerHTML += `<p class = 'item' id = '${name}'> ${name} </p>`;
    }
  }
};

for (let i = 0; i < menu.length; i++) {
  let name = menu[i];
  items.innerHTML += `<p class = 'item' id = '${name}'> ${name} </p>`;
}

let main_loop = () => {
  for (let i = 0; i < menu.length; i++) {
    let name = menu[i];
    if (Id(name) != null) {
      Id(name).onclick = () => {
        loadJson(name);
        toggle(0);
        id.innerHTML = name;
      };
    }
  }
  window.requestAnimationFrame(main_loop);
};
window.requestAnimationFrame(main_loop);
