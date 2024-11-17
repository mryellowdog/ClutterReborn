var plist = document.getElementById("project-list");
async function get(url) {
  let obj = await fetch(url);
  let out = await obj.text();
  let json = JSON.parse(out);
  plist.innerHTML = plist.innerHTML + json.title + ", ";
  console.log('updated HTML');
}
//console.log(get("https://api.allorigins.win/raw?url=https://api.scratch.mit.edu/"))
function getStringBetween(str, startStr, endStr) {
  const startIndex = str.indexOf(startStr) + startStr.length;
  const endIndex = str.indexOf(endStr, startIndex);
  console.log('got string', str.substring(startIndex, endIndex));
  return str.substring(startIndex, endIndex);
}
function getFromStudio(id) {
  let projectURLs = [];
  fetch(`https://trampoline.turbowarp.org/api/studios/${id}/projects/`).then((response) => {
    response.json().then((json) => {
      console.log(json);
      json.forEach((project) => {
        console.log(project.id);
        projectURLs.push(`https://scratch.mit.edu/projects/${project.id}`);
      });
    });
  });
  console.log('fetched studio data', projectURLs);
  return projectURLs;
};
var frame = document.getElementById("frame");
var pre = document.getElementById("prev");
var nex = document.getElementById("next");
pre.style.visibility = "hidden";
const list = [];
var slide = 0;
input = document.getElementById("input");
function add() {
  if (input.value.startsWith("https://scratch.mit.edu/projects")) {
    list.push(input.value);
    slide = 0;
    frame.src = list[slide] + "embed";
    if (list.length > 1) {
      nex.style.visibility = "visible";
    }
    let id = getStringBetween(
      input.value,
      "https://scratch.mit.edu/projects/",
      "/"
    );
    get(
      "https://trampoline.turbowarp.org/api/projects/" +
        id
    );
    /*let json = get("https://api.codetabs.com/v1/proxy/?quest=https://api.scratch.mit.edu/projects/" + id);
          console.log(json.PromiseResult);
          let o = JSON.parse(json);
          plist.innerHTML = plist.innerHTML + ", " + o.title["0"];
          */
  } else if (input.value.startsWith("https://scratch.mit.edu/studios")) {
    let id = getStringBetween(
      input.value,
      "https://scratch.mit.edu/studios/",
      "/"
    );
    const studioProjects = getFromStudio(id);
    studioProjects.forEach((el) => {
      get('https://trampoline.turbowarp.org/api/projects/' + el);
    });
  } else {
    alert("You can only submit valid Scratch project links.");
  }
}

if (list.length !== 0) {
  frame.src = list[slide] + "/embed";
} else {
  nex.style.visibility = "hidden";
}
function next() {
  slide += 1;
  if (slide == list.length - 1) {
    slide = list.length - 1;
    nex.style.visibility = "hidden";
  }
  frame.src = list[slide] + "embed";
  if (slide == 0) {
    pre.style.visibility = "hidden";
    nex.style.visibility = "visible";
  }
  if (slide !== 0) {
    pre.style.visibility = "visible";
  }
}
function prev() {
  slide -= 1;
  if (slide == list.length - 1) {
    slide = list.length - 1;
    nex.style.visibility = "hidden";
  } else {
    nex.style.visibility = "visible";
  }
  frame.src = list[slide] + "embed";
  if (slide == 0) {
    pre.style.visibility = "hidden";
    nex.style.visibility = "visible";
  }
  if (slide !== 0) {
    pre.style.visibility = "visible";
  }
}
