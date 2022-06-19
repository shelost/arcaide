function Id(arg) {
  return document.getElementById(arg);
}

function Class(arg) {
  return document.getElementsByClassName(arg);
}

function Tag(arg) {
  return document.getElementsByTagName(arg);
}

function El(arg) {
  return document.createElement(arg);
}

function TextNode(arg) {
  return document.createTextNode(arg);
}

function Contains(el, arg) {
  return el.classList.contains(arg);
}

function Add(elem, args) {
  for (let i = 0; i < args.length; i++) {
    elem.appendChild(args[i]);
  }
}

function Classes(elem, arg) {
  var arr = arg.split(" ");

  for (let i = 0; i < arr.length; i++) {
    elem.classList.add(arr[i]);
  }
}

function parse(arg) {
  return JSON.parse(arg);
}

function random(arg) {
  return Math.random() * arg;
}

function floor(arg) {
  return Math.floor(arg);
}

function string(arg) {
  return JSON.stringify(arg);
}

function round(arg) {
  return Math.round(arg);
}

function Search(searchID) {
  if (searchID.length == 6 && !isNaN(searchID)) {
    window.location.search = "id=" + searchID;
  }
}

function trim(arg) {
  return arg.split(" ").join("");
}

function max(arr) {
  if (arr.length == 0) {
    return 0;
  }
  let max = arr[0];
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}
