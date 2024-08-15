/*

import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.jsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
*/

const NUM_DEFAULT_IMPORTS = 13;

let pyop = document.querySelector("#python-out");
let runBtn = document.querySelector("#run-btn");
let testBtn = document.querySelector("#test-btn");

const codemirrorEditor = CodeMirror.fromTextArea(
	document.querySelector("#codearea"),
	{
		lineNumbers: true,
		mode: "python",
		theme: "base16-dark",
	}
);

codemirrorEditor.setValue(`print("Hello World")\nimport math\nexec("print(\\\"help\\\")")\nx=10\ny=True`)

function makeop(s){
	console.log(s);
	pyop.innerHTML = s;
}

runBtn.addEventListener("click", (e) => {
	let pycode = codemirrorEditor.getValue();
	//pyop.innerHTML = "";
	runPython(pycode);
})

testBtn.addEventListener("click", (e) => {
	let pycode = codemirrorEditor.getValue();
	//pyop.innerHTML = "";
	runPython(pycode);
  console.log(pyodide.globals);
  const button = e.target;
  const parent = button.parentNode;
  checkSubmission(parent.id, globalTopic);
})

/*
var autorun =

setInterval(function(){

let pycode = codemirrorEditor.getValue();

pyop.innerHTML = "";

runPython(pycode);

}, 2000);
*/

let startcode = `
import sys, io, traceback
#namespace = {}  # use separate namespace to hide run_code, modules, etc.

def run_code(code):
    """run specified code and return stdout and stderr"""
    allowed_imports = {"math": True, "cmath": True, "numpy": True}

    out = io.StringIO()
    oldout = sys.stdout
    olderr = sys.stderr
    sys.stdout = sys.stderr = out
    # do not allow multi-statement lines
    # for security purposes
    if (";" not in code):
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
      out.write("Please do not use semicolons")
    sys.stdout = oldout
    sys.stderr = olderr
    return out.getvalue()
`
function setup_pyodide(startcode) {
	// setup pyodide environment to run code blocks as needed
	pyodide.runPython(startcode)
  }

  /*
languagePluginLoader.then(() => {
	// Pyodide is now ready to use...
	setup_pyodide(startcode)
	pyodide.globals.code_to_run = `print("Hello World")`;
	makeop(pyodide.runPythonAsync(`run_code(code_to_run)`));
  });
*/
loadPyodide({ indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full"}).then((pyodide) => {
  globalThis.pyodide = pyodide

  //setup_pyodide(startcode)
	//let code_to_run = `print("Hello World")`;
	//makeop(pyodide.runPython(`run_code(code_to_run)`));
  
  // edit this for available python package imports
  pyodide.loadPackage(['numpy']).then(() => {
  //pyodide.loadPackage([]).then(() => {
  //pyodide.runPython(`   
  //My python code here
  console.log("finished loading packages");
  setup_pyodide(startcode)
  /*
	const code = startcode;
  const str1 = '';
  const str2 = str1.concat('run_code(', code, ')');
  console.log(str2);
	makeop(pyodide.runPython(str2)); */
//`);
}); });



function runPython(pycode) {
// run code currently stored in editor
	//pyodide.globals.code_to_run = pycode
  const code = pycode;
  const str1 = 'run_code(';
  const str2 = str1.concat(code, ')');
  console.log(str2);
	//makeop(pyodide.runPython(str2));
  pyodide.globals.set("code_to_run", pycode);
  makeop(pyodide.runPython('run_code(code_to_run)'));
}

function evaluatePython(pycode) {
	pyodide.runPythonAsync(pycode)
    .then(output => makeop(output))
    .catch((err) => { makeop(err) });
}

  //export default App
let globalTopic = 'syntax';

  //for tabs
function openCity(evt, cityName) {
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
  document.getElementById(cityName).style.display = "block";
  evt.currentTarget.className += " active";

  updateLesson(cityName, globalTopic);
}

  //for sidebar
  /* Set the width of the side navigation to 250px */
function openNav() {
  document.getElementById("mySidenav").style.width = "100%";
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
}

/* set the lesson content body to the correct text file */
function updateLesson(id, topic) {
  path = "../content/" + topic + "/" + id + ".txt";
  fetch(path)
  .then((res) => res.text())
  .then((text) => {
    // do something with "text"
    console.log(text);
    const thing = document.getElementById(id).getElementsByClassName("tabbody");
    console.log(thing);
    //console.log(thing[0].outerText);
    thing[0].outerText = text;
   })
  .catch((e) => console.error(e));
}

function replacer(key, value) {
  if(value instanceof Map) {
    return {
      dataType: 'Map',
      value: Array.from(value.entries()), // or with spread: value: [...value]
    };
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
  console.log("enter checkSub");
  console.log(id +", " + topic);
  path = "../content/" + topic + "/" + id + "_sol.txt";
  fetch(path)
  .then((res) => res.text())
  .then(async (text) => {
    // parse text to get each line
    console.log(JSON.stringify(text));
    const lines = text.split("\r\n");
    console.log(lines);

    let short_map = new Map();
    let map = pyodide.globals.toJs();
    keys = map.keys().toArray();
    for (let i = NUM_DEFAULT_IMPORTS; i < keys.length; i ++) {
      console.log(keys[i], map[keys[i]]);
      short_map.set(keys[i], map[keys[i]]);
    }

    const str = JSON.stringify(short_map, replacer);
    const newValue = JSON.parse(str, reviver);
    console.log("here");
    console.log(short_map);
    console.log('break1');
    console.log(str);
    console.log('break2');
    console.log(newValue);

    const request = new Request('http://localhost:8000/', {
      method: "POST",
      //body: JSON.stringify({ username: "test"}),
      body: str,
    });
    
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
    })
    .catch(error => {
        console.error('Fetch error ', error);
    });




    // update the result
    const thing = document.getElementById(id).getElementsByClassName("result");
    console.log(thing);
    //console.log(thing[0].outerText);
    thing[0].style.visibility='visible';
  
   })
  .catch((e) => console.error(e));
}

window.addEventListener('load', () => {
  console.log("fully loaded");
})