if (localStorage.getItem("editorContent") !== null) {
  var jsCode = localStorage.getItem("editorContent");
} else {
  var jsCode = `write(\`
	<hr>
	<h1>Welcome to rapidJS!</h1>
  <p>
  rapidJS is a simple-yet-powerful JavaScript playground, with a code editor and an output pane.
  </p>
  <h2>Basic Usage:</h2>
  <p>
  rapidJS only supports JavaScript, but it can be used to insert HTML into place, like this example.
  <br /><br />
  For this very purpose, we have a cool built-in function, called <b>write()</b>. This function can be used to direct output to the output pane.
  <br /><br />
  The code is autosaved everytime you run it.
  </p>
  <h3>
  Keyboard Shortcuts:
  </h3>
  <ul>
  	<li>Ctrl + Enter/Return to run</li>
    <li>Ctrl + Space to clear output</li>
  </ul>
  <hr>
  <h2>Examples:</h2>
\`)

let person = {
    firstName: 'John',
    lastName: 'Doe',
    age: 128
  }

  write('<u>' + person.firstName + ' ' + person.lastName +  ' is ' + person.age + ' years old. </u>' )
  
	write(\`
  This is a freaking <b>input</b> field in an <b>output</b> console!!!
  \`)

write(\`
	<input type="text" id="awesome">
  <button onclick="printText()">Print</button>
\`)


function printText(){
  let input = document.querySelector('#awesome');
  write(input.value)
}
  `;
}

const hotkeys = (e) => {
  let windowEvent = window.event ? event : e;

  if (windowEvent.keyCode === 13 && windowEvent.ctrlKey) {
    run();
  } else if (windowEvent.keyCode === 32 && windowEvent.ctrlKey) {
    clear();
  }
};

document.onkeydown = hotkeys;

var inputField = CodeMirror(document.body, {
  // value: "function myScript(){return 100;}\n",
  value: jsCode,
  mode: "javascript",
  theme: "monokai",
  tabSize: 2,
  lineNumbers: true,
  lineWrapping: false,
  matchBrackets: true,
  autoCloseBrackets: true,
});

let inputElement = document.querySelector(".editor");
let runBtn = document.querySelector("#run");

// runBtn.addEventListener("click", run());

function run() {
  output.document.body.innerHTML = "";
  output.document.head.innerHTML = `
  <style>
  *{
    background: #000;
    color: #fff;
    font-family: 'Roboto', sans-serif;
    font-size: 1rem;
  }
  p{
    line-height: 1.5rem;
  }
  ::selection{
    background: #fff;
    color: #000;
  }
  input, button{
    border: 1px solid #fff;
    padding: 10px;
    margin: 10px 0;
  }
  h1{
    font-size: 2rem;
    font-weight: normal;
    line-height: 4rem;
  }
  h2{
    font-size: 1.5rem;
    font-weight: normal;
    line-height: 3rem;
  }
  h3{
    font-size: 1.3rem;
    font-weight: normal;
    line-height: 2.6rem;
  }
  <style>
  `;
  let predefinedScripts = `
  function write(value){
    document.body.innerHTML += '<br />' +  value;
  }
  `;
  jsCode = inputField.getValue();
  output.window.eval(predefinedScripts + jsCode);
  localStorage.setItem("editorContent", jsCode);
}

function clear() {
  output.document.body.innerHTML = "";
}

document.addEventListener("DOMContentLoaded", function () {
  // Query the element
  const resizer = document.getElementById("dragme");
  const leftSide = document.querySelector(".cm-s-monokai");
  const rightSide = resizer.nextElementSibling;

  // The current position of mouse
  let x = 0;
  let y = 0;
  let leftWidth = 0;

  console.log(leftSide);

  // Handle the mousedown event
  // that's triggered when user drags the resizer
  const mouseDownHandler = function (e) {
    // Get the current mouse position
    x = e.clientX;
    y = e.clientY;
    leftWidth = leftSide.getBoundingClientRect().width;

    // Attach the listeners to `document`
    document.addEventListener("mousemove", mouseMoveHandler);
    document.addEventListener("mouseup", mouseUpHandler);
  };

  const mouseMoveHandler = function (e) {
    // How far the mouse has been moved
    const dx = e.clientX - x;
    const dy = e.clientY - y;

    const newLeftWidth =
      ((leftWidth + dx) * 100) /
      resizer.parentNode.getBoundingClientRect().width;

    // if (document.documentElement.style.getProperty("--mobile") == 1) {
    //   const newLeftWidth =
    //     ((leftWidth + dy) * 100) /
    //     resizer.parentNode.getBoundingClientRect().width;
    // } else {
    //   const newLeftWidth =
    //     ((leftWidth + dx) * 100) /
    //     resizer.parentNode.getBoundingClientRect().width;
    // }

    // leftSide.style.width = `${newLeftWidth}%`;
    document.documentElement.style.setProperty(
      "--editor-width",
      `${newLeftWidth}%`
    );

    resizer.style.cursor = "col-resize";
    document.body.style.cursor = "col-resize";

    leftSide.style.userSelect = "none";
    leftSide.style.pointerEvents = "none";

    rightSide.style.userSelect = "none";
    rightSide.style.pointerEvents = "none";
  };

  const mouseUpHandler = function () {
    resizer.style.removeProperty("cursor");
    document.body.style.removeProperty("cursor");

    leftSide.style.removeProperty("user-select");
    leftSide.style.removeProperty("pointer-events");

    rightSide.style.removeProperty("user-select");
    rightSide.style.removeProperty("pointer-events");

    // Remove the handlers of `mousemove` and `mouseup`
    document.removeEventListener("mousemove", mouseMoveHandler);
    document.removeEventListener("mouseup", mouseUpHandler);
  };

  // Attach the handler
  resizer.addEventListener("mousedown", mouseDownHandler);
});
