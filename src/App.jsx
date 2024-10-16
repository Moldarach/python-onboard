const NUM_DEFAULT_IMPORTS = 13;
const lessonCount = new Map();
let globalTopic = 'syntax';
let globalId;

let pyop = document.querySelector("#python-out");
let runBtn = document.querySelector("#run-btn");
let testBtn = document.querySelector("#test-btn");

getTabCount();
//downloadContent();

const codemirrorEditor = CodeMirror.fromTextArea(
	document.querySelector("#codearea"),
	{
		lineNumbers: true,
		mode: "python",
		theme: "base16-dark",
	}
);

codemirrorEditor.setValue(`import numpy as np
import math
import cmath
x=4
y=2j
z=complex(1, 3)
a1 = np.array([1, 9-7, 3])
a2 = np.array([[4, 5], [6, 7]])
print(a1)
print(a2)
print(x, y, z)`);

function makeop(s){
	console.log(s);
	pyop.innerHTML = s;
}

runBtn.addEventListener("click", (e) => {
	let pycode = codemirrorEditor.getValue();
	runPython(pycode);
})

testBtn.addEventListener("click", (e) => {
	let pycode = codemirrorEditor.getValue();
	runPython(pycode);
  console.log(pyodide.globals);
  const button = e.target;
  checkSubmission(globalId, globalTopic);
})

/*
# do not allow multi-statement lines
    # for security purposes
    if (";" not in code):
      if ("exec" not in code and "eval" not in code):
        #raw = repr(code)[1:-1]
        #src = code
        #print("raw: ", src)
        lines = code.splitlines()
        #print("list: ", lines)

        line_number = 1
        # parse input and check for illegal imports
        for word in lines:
          if (word.find("import") == 0):
            imports = word[len("import"):].split(",")
            #print("imports: ", imports)
            for i in imports:
              if i.strip() not in allowed_imports:
                out.write("Illegal import " + i + " on line " + str(line_number) + ".\\n")
                return out.getvalue()
          line_number += 1

        try:
            # change next line to exec(code, {}) if you want to clear vars each time
            #print("code: ", repr(code))
            exec(code, globals() )
        except:
            traceback.print_exc()
      else:
        out.write("Please do not use 'exec' or 'eval' statements, even in comments")
    else:
      out.write("Please do not use semicolons")
*/
async function downloadContent() {
  let zipResponse = await fetch("https://students.washington.edu/myu97/sols.zip");
  let zipBinary = await zipResponse.arrayBuffer();
  pyodide.unpackArchive(zipBinary, "zip");
}

let startcode = `
import sys, io, traceback
#namespace = {}  # use separate namespace to hide run_code, modules, etc.

def run_code(code):
    """run specified code and return stdout and stderr"""
    allowed_imports = {"math": True, "cmath": True, "numpy": True, "numpy as np": True, "scipy": True, "scipy as sp": True}

    out = io.StringIO()
    oldout = sys.stdout
    olderr = sys.stderr
    sys.stdout = sys.stderr = out
    
    try:
      # change next line to exec(code, {}) if you want to clear vars each time
      #print("code: ", repr(code))
      exec(code, globals() )
    except:
      traceback.print_exc()

    sys.stdout = oldout
    sys.stderr = olderr
    return out.getvalue()
`
 function setup_pyodide(startcode) {
	// setup pyodide environment to run code blocks as needed
	pyodide.runPython(startcode)
  }

 loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full"}).then((pyodide) => {
  globalThis.pyodide = pyodide
 
  // edit this for available python package imports
  pyodide.loadPackage(['numpy', 'scipy']).then(() => {
  //pyodide.loadPackage([]).then(() => {
  console.log("finished loading packages");
  closeLoading();
  setup_pyodide(startcode)
  }); 
  downloadContent();
});



function runPython(pycode) {
// run code currently stored in editor
	//pyodide.globals.code_to_run = pycode
  const code = pycode;
  const str1 = 'run_code(';
  const str2 = str1.concat(code, ')');
  console.log(str2);
  pyodide.globals.set("code_to_run", pycode);
  makeop(pyodide.runPython('run_code(code_to_run)'));
}

function evaluatePython(pycode) {
	pyodide.runPythonAsync(pycode)
    .then(output => makeop(output))
    .catch((err) => { makeop(err) });
}

//for tabs
function openTab(evt, id) {
  
  // Declare all variables
  let i, tabcontent, tablinks;

  // Get all elements with class="tabcontent" and hide them
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }

  // Get all elements with class="tablinks" and remove the class "active"
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  
  // Show the current tab, and add an "active" class to the button that opened the tab
  document.getElementById('tabcontent').style.display = "block";
  evt.currentTarget.className += " active";
  globalId = id;
  // @TODO fix this to not use globalTopic
  updateLesson(id, globalTopic);
}

/* set the lesson content body to the correct text file */
function updateLesson(id, topic) {
  
  path = "../content/" + topic + "/" + id + ".txt";
  fetch(path)
  .then((res) => res.text())
  .then((text) => {
    // do something with "text"
    console.log(text);
    const body = document.getElementById('tabcontent').getElementsByClassName("tabbody");
    console.log(body[0]);
    body[0].innerHTML = text;
    
   })
  .catch((e) => console.error(e));
  
  hideResult();
}

  //for sidebar
  /* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("sidenav").style.width = "100%";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("sidenav").style.width = "0";
}

function closeLoading() {
  document.getElementById("loadingScreen").style.height = "0";
}

function updateTopic(evt, topic) {
  const size = lessonCount.get(topic);
  // display correct number of tabs
  tablinks = document.getElementsByClassName("tablinks");
  console.log(size);
  console.log(tablinks.length);

  for (i = 1; i < tablinks.length; i++) {
    tablinks[i].style.display = "none";
  }
  for (i = 1; i <= size; i++) {
    tablinks[i].style.display = "block";
  }
  clearTabContent();
  hideResult();
  globalTopic = topic;
  closeNav();
}

function getTabCount() {
  const request = new Request('http://localhost:8001/filecount', {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  console.log(request);
  fetch(request)
    .then(response => {
      if (!response.ok) {
        // Handle HTTP errors
        throw new Error('Network error ' + response.statusText);
      }
      return response.json(); // Parse the JSON from the response
    })
    .then(data => { // process the response
      let temp = new Map(Object.entries(JSON.parse(data)));
      // update the map
      temp.forEach((value, key) => {
        lessonCount.set(key, value);
      });
    })
  .catch(error => {
      console.error('Fetch error ', error);
  });
}

function replacer(key, value) {
  if(value instanceof Map) {
    const arr = Array.from(value.entries());
    console.log('replacing ', arr);
    console.log('is array? ', Array.isArray(arr[0]));
    json_obj = {};
    json_obj['GLOBAL_TOPIC'] = globalTopic;
    json_obj['GLOBAL_ID'] = globalId;
    for (const curr of arr) {
      json_obj[curr[0]] = curr[1];
    }
    return json_obj;
  } else {
    return value;
  }
}
function reviver(key, value) {
  if(typeof value === 'object' && value !== null) {
    if (value.dataType === 'Map') {
      return new Map(value.value);
    }
  }
  return value;
}

async function checkSubmission(id, topic) {
  globalId = id;
  globalTopic = topic;
  console.log("enter checkSub");
  console.log(id +", " + topic);
  
  let short_map = new Map();
  let map = pyodide.globals.toJs();
  keys = map.keys().toArray();
  for (let i = NUM_DEFAULT_IMPORTS; i < keys.length; i ++) {
    const key = keys[i];
    const val = map[key];
    console.log(key, val, typeof(val));
    if (typeof(val) === 'object') {
      // only add obj if it is an Int32Array or normal array
      if (val.constructor === Int32Array || Array.isArray(val)) {
        short_map.set(key, val);
      }
    } else {
      short_map.set(key, val);
    }
  }

  const str = JSON.stringify(short_map, replacer);
  const newValue = JSON.parse(str, reviver);
 console.log(str);
  const request = new Request('http://localhost:8001/', {
    method: "POST",
    body: str,
  });
  console.log(request);
  //first get access to elements
  const container = document.getElementById("tabcontent").getElementsByClassName("result");
  const word = document.getElementById('help');
  const icon = document.getElementById("tabcontent").getElementsByClassName("material-icons left");
  console.log('container is ', container);
  console.log('word is ', word);
  console.log('icon is ', icon);
  fetch(request)
    .then(response => {
      if (!response.ok) {
        // Handle HTTP errors
        throw new Error('Network error ' + response.statusText);
      }
      return response.json(); // Parse the JSON from the response
    })
    .then(data => {
        console.log(data); // Use the JSON data
        // update the result
        container[0].style.display='block';
        if (data['status'] === 'good') {
          icon[0].textContent = 'check';
          icon[0].style.color = 'green'
          word.textContent = 'correct!'
        } else {
          icon[0].textContent = 'close';
          icon[0].style.color = 'red'
          word.textContent = 'wrong'
        }
        
    })
  .catch(error => {
      console.error('Fetch error ', error);
  });
}

function hideResult() {
  // use of globalId here might cause issues
  const container = document.getElementById("tabcontent").getElementsByClassName("result");
  container[0].style.display='none';
}

function clearTabContent() {
  // hide the tab itself
  const tab = document.getElementById('tabcontent');
  tab.style.display = "none"
  // clear the inner text
  const body = tab.getElementsByClassName("tabbody");
  body[0].innerHTML = "";
  // clear 'active' status
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
}

window.addEventListener('load', () => {
  console.log("fully loaded");
})