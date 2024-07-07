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

languagePluginLoader.then(() => {
	// Pyodide is now ready to use...
	setup_pyodide(startcode)
	pyodide.globals.code_to_run = `print("Hello World")`;
	makeop(pyodide.runPythonAsync(`run_code(code_to_run)`));
  });


function runPython(pycode) {
// run code currently stored in editor
	pyodide.globals.code_to_run = pycode
	makeop(pyodide.runPython('run_code(code_to_run)'))
}

function evaluatePython(pycode) {
	pyodide.runPythonAsync(pycode)
    .then(output => makeop(output))
    .catch((err) => { makeop(err) });
}

  //export default App