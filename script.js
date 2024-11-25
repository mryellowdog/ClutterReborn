var type = "none";
var studio = "none";
var plist = document.getElementById("project-list");
var frame = document.getElementById("frame");
var pre = document.getElementById("prev");
var nex = document.getElementById("next");
pre.style.visibility = "hidden";
const list = [];
var slide = 0;
let input = document.getElementById("input");
let mostRecent;
async function get(url) {
  let obj = await fetch(url);
  let out = await obj.text();
  let json = JSON.parse(out);
  plist.innerHTML = plist.innerHTML + json.title + ", ";
  console.log('updated HTML');
  mostRecent = json.title;
}
let projectTitle = document.getElementById('currentProject');
/*function updateProjectTitle(refresh = false) { //Someone else deal with fixing this.
  if(refresh === true) {
    get('https://trampoline.turbowarp.org/api/projects/' + list[slide].substring(33));
  };
  projectTitle.innerText = mostRecent;
};*/
//console.log(get("https://api.allorigins.win/raw?url=https://api.scratch.mit.edu/"))
function getStringBetween(str, startStr, endStr) {
  const startIndex = str.indexOf(startStr) + startStr.length;
  const endIndex = str.indexOf(endStr, startIndex);
  console.log('got string', str.substring(startIndex, endIndex));
  return str.substring(startIndex, endIndex);
}
async function getFromStudio(id = input.valu) {
  let projectURLs = [];
  let response = await fetch(`https://trampoline.turbowarp.org/api/studios/${id}/projects/`)
  let json = await response.json()
  json.forEach((project) => {
    projectURLs.push(project.id);
  });
  console.log('fetched studio data', projectURLs);
  return projectURLs;
};
async function add() {
  let url = input.value;
  if (url.startsWith("https://scratch.mit.edu/projects")) {
    type = "projects";
    list.push(url);
    slide = 0;
    frame.src = list[slide] + "embed";
    if (list.length > 1) {
      nex.style.visibility = "visible";
    }
    //updateProjectTitle();
    let id = getStringBetween(
      url,
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
  } else if (url.startsWith("https://scratch.mit.edu/studios")) {
    if (type !== "studios")
    {
      type = "studios";
      studio = url.replace("https://scratch.mit.edu/studios/", "");
      studio = studio.replace("/", "");
    } else {
      type = "projects";
    }
    let id = getStringBetween(
      url,
      "https://scratch.mit.edu/studios/",
      "/"
    );
    let studioProjects = await getFromStudio(id);
    for(let i = 0; i < studioProjects.length; i++) {
      console.log(studioProjects[i]);
      get('https://trampoline.turbowarp.org/api/projects/' + studioProjects[i]);
      list.push('https://scratch.mit.edu/projects/' + studioProjects[i] + '/');
      if (list.length > 1) {
        nex.style.visibility = "visible";
      }
    };
    frame.src = list[0] + "embed";
    slide = 0;
    //updateProjectTitle();
  } else {
    console.warn('invalid URL', url);
    alert("You can only submit valid Scratch project links.");
  }
}
var sharelink = "hi";
function share() {
  if (type !== "none") {
    if (type == "projects") {
      sharelink = window.location.href;
      sharelink = sharelink.replace(window.location.hash,"");
      sharelink = sharelink + "#projects:"
      for (let i = 0; i < list.length; i++) {
        l = getStringBetween(
          list[i],
          "https://scratch.mit.edu/projects/",
          "/"
        );
        if (i == 0) {
          sharelink = sharelink + l; 
        } else {
          sharelink = sharelink + "," + l; 
        }
        
      }
      document.getElementById("sharelink").innerHTML = sharelink;
      }
       else if (type == "studios") {
      
      sharelink = window.location.href;
      sharelink = sharelink.replace(window.location.hash,"");
      sharelink = sharelink + "#studio:";
      sharelink = sharelink + studio;
      document.getElementById("sharelink").innerHTML = sharelink;
    } else {
      alert("No projects in your Clutter yet.")
  }
  document.getElementById("copybutton").style.visibility = "visible";
}
}

document.getElementById("copybutton").style.visibility = "hidden";
function copy() {
  navigator.clipboard.writeText(sharelink);
  document.getElementById("copybutton").innerHTML = "Copied";
}

if (list.length !== 0) {
  frame.src = list[slide] + "embed";
} else {
  nex.style.visibility = "hidden";
}
//updateProjectTitle(true);
function next() {
  slide++;
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
  //updateProjectTitle(true);
}
function prev() {
  slide--;
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
  //updateProjectTitle(true);
}
if(window.location.hash) {
  var hash = window.location.hash.substring(1);
  if (hash.includes("studio:")) {
    hash = hash.replace("studio:", "");
    input.value = "https://scratch.mit.edu/studios/" + hash + "/";
    console.log("Found hash: " + hash);
    console.log("https://scratch.mit.edu/studios/" + hash + "/");
    add();
  } else if (hash.includes("projects:")) {
    hash = hash.replace("projects:", "");
    hash = hash.split('-').map(word => word.trim());
    console.log(hash);
    for (var i = 0; i < hash.length; i++) {
      input.value = "https://scratch.mit.edu/projects/" + hash[i] + "/";
      add();
    }
  }
} else {
  console.log("Found no hash.");
}
