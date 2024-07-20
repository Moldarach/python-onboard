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


let pyop = document.querySelector("#python-out");
let runBtn = document.querySelector("#run-btn");

const codemirrorEditor = CodeMirror.fromTextArea(
	document.querySelector("#codearea"),
	{
		lineNumbers: true,
		mode: "python",
		theme: "base16-dark",
	}
);

codemirrorEditor.setValue(`print("Hello World")`)

function makeop(s){
	console.log(s);
	pyop.innerHTML = s;
}

runBtn.addEventListener("click", (e) => {
	let pycode = codemirrorEditor.getValue();
	//pyop.innerHTML = "";
	runPython(pycode);
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
namespace = {}  # use separate namespace to hide run_code, modules, etc.
def run_code(code):
    """run specified code and return stdout and stderr"""
    out = io.StringIO()
    oldout = sys.stdout
    olderr = sys.stderr
    sys.stdout = sys.stderr = out
    try:
        # change next line to exec(code, {}) if you want to clear vars each time
        #print(code)
        exec(code, {})
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
  //pyodide.runPython(`   
  //My python code here

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

  //for tabs
  function openCity(evt, cityName) {
    // Declare all variables
    var i, tabcontent, tablinks;
  
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