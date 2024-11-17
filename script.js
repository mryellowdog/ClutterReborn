var plist = document.getElementById("project-list");
async function get(url) {
  console.log(url);
  let obj = await fetch(url);
  console.log(obj);
  let out = await obj.text();
  console.log(out);
  let json = JSON.parse(out);
  console.log(json);
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
async function getFromStudio(id) {
  let projectURLs = [];
  let response = await fetch(`https://trampoline.turbowarp.org/api/studios/${id}/projects/`)
  let json = await response.json()
  json.forEach((project) => {
    projectURLs.push(project.id);
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
async function add() {
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
    let studioProjects = await getFromStudio(id);
    for(let i = 0; i < studioProjects.length; i++) {
      console.log(studioProjects[i]);
      get('https://trampoline.turbowarp.org/api/projects/' + studioProjects[i]);
      list.push('https://scratch.mit.edu/' + studioProjects[i]);
      frame.src = list[i] + "embed";
      if (list.length > 1) {
        nex.style.visibility = "visible";
      }
    };
    slide = 0;
  } else {
    console.warn('invalid URL', input.value);
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
