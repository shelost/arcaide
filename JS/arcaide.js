// constants
const S = 1000;
const fileInput = Id("file");
const uploadButton = Id("upload");
const canvas = Id("canvas");
const ctx = canvas.getContext("2d");
const plus = Id("plus");
const minus = Id("minus");
const submit = Id("submit");
const objects = Id("objects");
const link = Id("link");

let ACTIVE = 0;
let ARRAYS = [];
let INPUT = [];
let OUTPUT = [];
let OBJ = {};
let PROB = {};
let SOLS = [];
let OBJS = [];
let SPEC = {
  xm: 0,
  ym: 0,
  c: 0,
};
let NAME = "";
let ACTIVE_OBJ = 1;
let TOTAL = 0;
let MOUSEDOWN = false;
let CLICKED = [];
let MX,
  MY,
  EX,
  EY = 0;

// functions

function setCanvases() {
  for (let i = 0; i < Tag("canvas").length; i++) {
    let canvas = Tag("canvas")[i];
    canvas.width = S;
    canvas.height = S;
  }
}

function loadJson(str) {
  window
    .fetch("data/" + str + ".json")
    .then((response) => response.json())
    .then((json) => {
      drawProblems(json);
      OBJ = copyJson(json);
      for (let i = 0; i < OBJ.train.length; i++) {
        let input = OBJ.train[i].input;
        let output = OBJ.train[i].output;
        OBJ.train[i].sol = {
          input: emptyGrid(input[0].length, input.length),
          output: emptyGrid(output[0].length, output.length),
          names: ["Item 1"],
          num: 0,
        };
      }
      for (let i = 0; i < OBJ.test.length; i++) {
        let input = OBJ.test[i].input;
        let output = OBJ.test[i].output;
        OBJ.test[i].sol = {
          input: emptyGrid(input[0].length, input.length),
          output: emptyGrid(output[0].length, output.length),
          names: ["Item 1"],
          num: 0,
        };
      }
      NAME = str;
      Id("id").innerHTML = str;
    });
}

let q = "1fad071e";
let r = "150deff5";
loadJson(q);

function setParams() {
  if (ACTIVE < OBJ.train.length) {
    PROB = OBJ.train[ACTIVE];
  } else {
    PROB = OBJ.test[0];
  }
  INPUT = ARRAYS[ACTIVE].input;
  OUTPUT = ARRAYS[ACTIVE].output;
  SOLS = [PROB.sol.input, PROB.sol.output];
  let n = 0;
  let objs = [];
  for (let k = 0; k < SOLS.length; k++) {
    let grid = SOLS[k];
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        let val = grid[i][j];
        if (!objs.includes(val) && val != 0) {
          objs.push(val);
          n++;
        }
      }
    }
  }
  OBJS = objs;
  PROB.sol.num = n;
}

function copyGrid(source) {
  let res = [];
  for (let i = 0; i < source.length; i++) {
    res.push([]);
    for (let j = 0; j < source[i].length; j++) {
      res[i].push(source[i][j]);
    }
  }
  return res;
}

function selectObject(i) {
  let canv = Id(`obj-box-${i}`);
  if (canv == undefined) {
    return;
  }
  for (let j = 0; j < Class("obj-box").length; j++) {
    let other = Class("obj-box")[j];
    other.classList.remove("active");
  }
  ACTIVE_OBJ = i;
  canv.classList.add("active");
}
function emptyGrid(width, height) {
  let res = [];
  for (let i = 0; i < height; i++) {
    res.push([]);
    for (let j = 0; j < width; j++) {
      res[i].push(0);
    }
  }
  return res;
}

function copyJson(source) {
  return JSON.parse(JSON.stringify(source));
}

function hover(grid, i, j, ex, ey, output) {
  let x = SPEC.xm + SPEC.c * (j - 0.5);
  let y = SPEC.ym + SPEC.c * i;

  if (output) {
    x = SPEC.xm + SPEC.c * (j + INPUT[0].length + 0.5);
  }

  if (x < ex && ex < x + SPEC.c && y < ey && ey < y + SPEC.c) {
    return true;
  }
  return false;
}

function colorCell(n) {
  switch (n) {
    case 1:
      return "#0074d9";
    case 2:
      return "#ff4126";
    case 3:
      return "#2ecc40";
    case 4:
      return "#ffdc00";
    case 5:
      return "#aaaaaa";
    case 6:
      return "#ef11be";
    case 7:
      return "#ff841a";
    case 8:
      return "#7fdbff";
    default:
      return "black";
  }
}

function drawProblems(json) {
  let arr = json.train.concat(json.test);
  let n = 0;
  ARRAYS = arr;
  drawProblem(ARRAYS[ACTIVE], ctx, true);
  for (let i = 0; i < arr.length; i++) {
    let obj = arr[i];
    let canv = Class("canvas")[i];
    let cont = canv.getContext("2d");
    canv.classList.remove("null");
    drawProblem(obj, cont, false);
    n = i;
  }
  for (let i = n + 1; i < Class("canvas").length; i++) {
    let canv = Class("canvas")[i];
    canv.classList.add("null");
  }
}

function drawProblem(obj, ctx, spec) {
  let inp = obj.input;
  let out = obj.output;
  let width = inp[0].length + out[0].length;
  let height = Math.max(inp.length, out.length);

  let c = (S * 0.9) / Math.max(width + 1, height);
  let xm = (S - c * width) / 2;
  let ym = (S - c * height) / 2;

  ctx.clearRect(0, 0, S, S);
  ctx.strokeStyle = "#d0d0d0";

  for (let i = 0; i < inp.length; i++) {
    for (let j = 0; j < inp[i].length; j++) {
      ctx.fillStyle = colorCell(obj.input[i][j]);
      ctx.fillRect(xm + c * (j - 0.5), ym + c * i, c, c);
      ctx.strokeRect(xm + c * (j - 0.5), ym + c * i, c, c);
    }
  }

  for (let i = 0; i < out.length; i++) {
    for (let j = 0; j < out[i].length; j++) {
      ctx.fillStyle = colorCell(obj.output[i][j]);
      ctx.fillRect(xm + c * (j + inp[0].length + 0.5), ym + c * i, c, c);
      ctx.strokeRect(xm + c * (j + inp[0].length + 0.5), ym + c * i, c, c);
    }
  }

  if (spec) {
    SPEC.xm = xm;
    SPEC.ym = ym;
    SPEC.c = c;
  }
}

function drawObjects() {
  for (let i = 0; i < Class("object").length; i++) {
    let canv = Class("object")[i];
    let ctx = canv.getContext("2d");
    let id = canv.id.substring(6);
    let type = canv.id.substring(0, 1);
    if (type == "i") {
      drawObject(PROB.sol, ctx, id, false);
    } else {
      drawObject(PROB.sol, ctx, id, true);
    }
  }
}

function drawObject(sol, ctx, num, out) {
  // determine bounds

  let grid = sol.input;
  let data = INPUT;
  if (out) {
    grid = sol.output;
    data = OUTPUT;
  }

  let coords = [];
  let b = {
    xmin: grid[0].length,
    xmax: 0,
    ymin: grid.length,
    ymax: 0,
  };
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      if (grid[i][j] == num) {
        coords.push([i, j]);
        if (i < b.ymin) {
          b.ymin = i;
        }
        if (i > b.ymax) {
          b.ymax = i;
        }
        if (j < b.xmin) {
          b.xmin = j;
        }
        if (j > b.xmax) {
          b.xmax = j;
        }
      }
    }
  }

  // draw

  let width = b.xmax - b.xmin + 1;
  let height = b.ymax - b.ymin + 1;

  let c = (S * 0.9) / Math.max(width, height);
  let xm = (S - c * width) / 2;
  let ym = (S - c * height) / 2;
  ctx.clearRect(0, 0, S, S);

  for (let k = 0; k < coords.length; k++) {
    let i = coords[k][0];
    let j = coords[k][1];
    let i2 = i - b.ymin;
    let j2 = j - b.xmin;
    ctx.fillStyle = colorCell(data[i][j]);
    ctx.strokeStyle = "#d0d0d0";
    ctx.fillRect(xm + c * j2, ym + c * i2, c, c);
    ctx.strokeRect(xm + c * j2, ym + c * i2, c, c);
  }
}

// upload

/*
uploadButton.onclick = () => {
  let val = fileInput.value;
  let ext = val.substring(val.lastIndexOf(".") + 1);

  if (ext == "json") {
  } else {
    fileInput.value = "";
    alert("Please upload a valid .json file.");
  }
};
*/

// action

setCanvases();

window.addEventListener("mousemove", (e) => {
  let rect = canvas.getBoundingClientRect();
  let scale = S / rect.width;
  MX = e.clientX;
  MY = e.clientY;
  EX = (MX - rect.left) * scale;
  EY = (MY - rect.top) * scale;
});

window.addEventListener("mousedown", (e) => {
  MOUSEDOWN = true;
});

window.addEventListener("touchstart", (e) => {
  MOUSEDOWN = true;
  let rect = canvas.getBoundingClientRect();
  let scale = S / rect.width;
  MX = e.touches[0].clientX;
  MY = e.touches[0].clientY;
  EX = (MX - rect.left) * scale;
  EY = (MY - rect.top) * scale;
});

window.addEventListener("touchmove", (e) => {
  MOUSEDOWN = true;
  let rect = canvas.getBoundingClientRect();
  let scale = S / rect.width;
  MX = e.touches[0].clientX;
  MY = e.touches[0].clientY;
  EX = (MX - rect.left) * scale;
  EY = (MY - rect.top) * scale;
});

window.addEventListener("mouseup", (e) => {
  CLICKED = [];
  MOUSEDOWN = false;
});

window.addEventListener("touchend", (e) => {
  CLICKED = [];
  MOUSEDOWN = false;
});
// listeners

function drawCanvases() {
  objects.innerHTML = ``;
  let objs = [];

  for (let i = 0; i < OBJS.length; i++) {
    let val = OBJS[i];
    let name = PROB.sol.names[val - 1];
    if (name == undefined) {
      name = `Item ${val}`;
    }
    objs[val] = `
          <div id='obj-box-${val}' class='obj-box'>
            <div class='flex'>
                <canvas id='icanv-${val}' class='object'></canvas>
                <p class='arrow'> ➔ </p>
                <canvas id='ocanv-${val}' class='object'></canvas>
            </div>
             <input id='label-${val}' class='label' value='${name}'></input>
          </div>
          `;
  }

  objs.sort();
  for (let i = 0; i < objs.length; i++) {
    let div = objs[i];
    if (div != null) {
      objects.innerHTML += div;
    }
  }
  if (objs.length == 0) {
    ACTIVE_OBJ = 1;
    PROB.sol.names = ["Item 1"];
    objects.innerHTML = `
          <div id='obj-box-1' class='obj-box active'>
            <div class='flex'>
                <canvas id='icanv-1' class='object'></canvas>
                <p class='arrow'> ➔ </p>
                <canvas id='ocanv-1' class='object'></canvas>
            </div>
            <input id='label-1' class='label' value='Item 1'></input>
          </div>
          `;
  } else {
    selectObject(objs[objs.length - 1]);
  }
}

for (let i = 0; i < Class("canvas").length; i++) {
  let canv = Class("canvas")[i];
  canv.onclick = () => {
    if (i < ARRAYS.length) {
      // set param
      for (let j = 0; j < Class("canvas").length; j++) {
        let other = Class("canvas")[j];
        other.classList.remove("active");
      }
      ACTIVE = i;
      setParams();
      canv.classList.add("active");

      // draw
      drawProblem(ARRAYS[i], ctx, true);

      // draw objects
      drawCanvases();
      drawObjects();
      selectObject(PROB.sol.num);
    }
  };
}

plus.onclick = () => {
  let filled = false;
  let objs = [];
  let arrs = [PROB.sol.input, PROB.sol.output];

  for (let k = 0; k < arrs.length; k++) {
    let grid = arrs[k];
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        let val = grid[i][j];
        if (!objs.includes(val) && val != 0) {
          objs.push(val);
        }
      }
    }
  }

  if (objs.length == Class("obj-box").length) {
    filled = true;
  }

  if (filled) {
    ACTIVE_OBJ = Math.max(...objs.map((x) => x)) + 1;
    PROB.sol.names.push(`Item ${ACTIVE_OBJ}`);
    let str = `
          <div id='obj-box-${ACTIVE_OBJ}' class='obj-box'>
            <div class='flex'>
                <canvas id='icanv-${ACTIVE_OBJ}' class='object'></canvas>
                <p class='arrow'> ➔ </p>
                <canvas id='ocanv-${ACTIVE_OBJ}' class='object'></canvas>
            </div>
            <input id='label-${ACTIVE_OBJ}' class='label' value='Item ${ACTIVE_OBJ}'></input>
          </div>
          `;
    objects.innerHTML += str;
    objects.scrollTop = objects.scrollHeight;
    selectObject(ACTIVE_OBJ);
    drawObjects();
  } else {
    alert("please");
  }
};

minus.onclick = () => {
  let arrs = [PROB.sol.input, PROB.sol.output];
  for (let k = 0; k < arrs.length; k++) {
    let sol = arrs[k];
    for (let i = 0; i < sol.length; i++) {
      for (let j = 0; j < sol[i].length; j++) {
        let val = sol[i][j];
        if (val == ACTIVE_OBJ) {
          sol[i][j] = 0;
        }
      }
    }
  }

  if (ACTIVE_OBJ > 1) {
    Id(`obj-box-${ACTIVE_OBJ}`).remove();
    ACTIVE_OBJ -= 1;
  } else if (PROB.sol.num > 1) {
    Id(`obj-box-${ACTIVE_OBJ}`).remove();
    ACTIVE_OBJ = JSON.parse(
      Class("obj-box")[Class("obj-box").length - 1].id.substring(8)
    );
  }
  selectObject(ACTIVE_OBJ);
};

submit.onclick = () => {
  console.log(OBJ);
};

var textFile = null;

function makeTextFile(text) {
  var data = new Blob([text], { type: "text/plain" });

  // If we are replacing a previously generated file we need to
  // manually revoke the object URL to avoid memory leaks.
  if (textFile !== null) {
    window.URL.revokeObjectURL(textFile);
  }

  textFile = window.URL.createObjectURL(data);
  return textFile;
}

submit.addEventListener(
  "click",
  function () {
    link.href = makeTextFile(JSON.stringify(OBJ));
    link.download = NAME + "_annotated.json";
    link.style.opacity = 1;
    link.style.width = "100%";
    submit.style.opacity = 0;
    submit.style.width = "0%";
    link.onclick = () => {
      link.style.opacity = 0;
      link.style.width = "0%";
      submit.style.opacity = 1;
      submit.style.width = "100%";
    };
  },
  false
);

// loop

let loop = () => {
  //Id("label").innerHTML = `ACTIVE_OBJ = ${ACTIVE_OBJ} | PROB.sol.num = ${PROB.sol.num}`;
  setCanvases();
  ctx.clearRect(0, 0, S, S);
  if (OBJ.train != null) {
    drawProblems(OBJ);
    setParams();
    drawObjects();
    canvas.style.cursor = "default";

    // select objects
    for (let i = 0; i < Class("obj-box").length; i++) {
      let canv = Class("obj-box")[i];
      let label = Class("label")[i];
      let id = JSON.parse(canv.id.substring(8));
      canv.onclick = () => {
        selectObject(id);
      };
      label.oninput = () => {
        PROB.sol.names[id - 1] = label.value;
      };
    }

    // draw

    if (PROB.sol == undefined) {
      PROB.sol = {
        input: emptyGrid(INPUT[0].length, INPUT.length),
        output: emptyGrid(OUTPUT[0].length, OUTPUT.length),
        names: ["Item 1"],
        num: 0,
      };
    }
    let GRIDS = [
      [INPUT, PROB.sol.input],
      [OUTPUT, PROB.sol.output],
    ];

    for (let k = 0; k < GRIDS.length; k++) {
      let grid = GRIDS[k][0];
      let sol = GRIDS[k][1];
      for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
          // constants
          let left = SPEC.xm + SPEC.c * (j - 0.5);
          let right = left + SPEC.c;
          let top = SPEC.ym + SPEC.c * i;
          let bottom = top + SPEC.c;
          let val = sol[i][j];
          let out = k == 0 ? false : true;
          if (out) {
            left = SPEC.xm + SPEC.c * (j + INPUT[0].length + 0.5);
            right = left + SPEC.c;
          }

          // annotate

          if (val > 0) {
            ctx.beginPath();
            ctx.strokeStyle = "#e0e0e0";
            ctx.lineWidth = 5;
            if (val == ACTIVE_OBJ) {
              ctx.strokeStyle = "white";
              ctx.lineWidth = 7;
            }
            if (i > 0 && sol[i - 1][j] != val) {
              // lines
              ctx.moveTo(left, top);
              ctx.lineTo(right, top);
            }
            if (i < sol.length - 1 && sol[i + 1][j] != val) {
              ctx.moveTo(left, bottom);
              ctx.lineTo(right, bottom);
            }
            if (j > 0 && sol[i][j - 1] != val) {
              ctx.moveTo(left, top);
              ctx.lineTo(left, bottom);
            }
            if (j < sol[0].length - 1 && sol[i][j + 1] != val) {
              ctx.moveTo(right, top);
              ctx.lineTo(right, bottom);
            }

            ctx.stroke();
            ctx.lineWidth = 1;
          }

          // hover & click

          if (
            hover(grid, i, j, EX, EY, out) &&
            !CLICKED.includes(k + "@" + i + "+" + j)
          ) {
            if (window.innerWidth > 800) {
              ctx.globalAlpha = 0.5;
              ctx.fillStyle = "#ffce00";
              ctx.fillRect(left, top, SPEC.c, SPEC.c);

              ctx.globalAlpha = 1;
              ctx.lineWidth = 3;
              ctx.strokeStyle = "#ffce00";

              ctx.strokeRect(left, top, SPEC.c, SPEC.c);
              ctx.lineWidth = 1;
              canvas.style.cursor = "pointer";
            }

            if (MOUSEDOWN) {
              if (sol[i][j] != ACTIVE_OBJ) {
                sol[i][j] = ACTIVE_OBJ;
              } else {
                sol[i][j] = 0;
              }

              CLICKED.push(k + "@" + i + "+" + j);
            }
          }
        }
      }
    }
  }

  window.requestAnimationFrame(loop);
};
window.requestAnimationFrame(loop);
