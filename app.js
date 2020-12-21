if (localStorage.getItem("editorContent") !== null) {
  var jsCode = localStorage.getItem("editorContent");
} else {
  var jsCode = 'write("Hi there!")';
}

const hotkeys = (e) => {
  let windowEvent = window.event ? event : e;

  if (windowEvent.keyCode === 13 && windowEvent.ctrlKey) {
    e.preventDefault();
    run();
  } else if (windowEvent.keyCode === 32 && windowEvent.ctrlKey) {
    clear();
  } else if (windowEvent.keyCode === 191 && windowEvent.ctrlKey) {
    commentSelection();
  }
};

document.onkeydown = hotkeys;

var inputField = CodeMirror(document.body, {
  // value: "function myScript(){return 100;}\n",
  value: jsCode,
  mode: "javascript",
  theme: "vscode-dark",
  tabSize: 2,
  lineNumbers: true,
  lineWrapping: false,
  matchBrackets: true,
  autoCloseBrackets: true,
  extraKeys: {
    "Ctrl-S": function (e) {
      run();
    },
    "Cmd-S": function (e) {
      run();
    },
  },
});

CodeMirror.commands["selectAll"](inputField);

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

setInterval(() => {
  // console.log(inputField.getCursor(false).line);
  let lineNumField = document.querySelector("#line-no");
  lineNum = Number(inputField.getCursor(false).line) + 1;
  lineNumField.innerText = "Ln " + lineNum;
}, 500);

function commentSelection(isComment) {
  var range = getSelectedRange();
  inputField.commentRange(isComment, range.from, range.to);
}

function getSelectedRange() {
  return { from: inputField.getCursor(true), to: inputField.getCursor(false) };
}

function clear() {
  output.document.body.innerHTML = "";
}

function prettify() {
  selectElementContents(inputField);
  var range = getSelectedRange();
  inputField.autoFormatRange(range.from, range.to);
}

setInterval(() => {
  changeIndicator = document.getElementById("unsavedchanges");
  if (localStorage.getItem("editorContent") != inputField.getValue()) {
    changeIndicator.innerHTML =
      "There are unsaved changes. Run your code to save them";
  } else if (localStorage.getItem("editorContent") == inputField.getValue()) {
    changeIndicator.innerHTML = "Saved";
  }
  unsavedchanges;
}, 2000);

document.addEventListener("DOMContentLoaded", function () {
  // Query the element
  const resizer = document.getElementById("dragme");
  const leftSide = document.querySelector(".cm-s-vscode-dark");
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
    if (newLeftWidth <= 99 && newLeftWidth >= 1) {
      document.documentElement.style.setProperty(
        "--editor-width",
        `${newLeftWidth}%`
      );
    }

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

function showPopup(selector) {
  var popup = document.querySelector(selector);
  popup.style.opacity = 1;
  popup.style.pointerEvents = "all";
}

function hidePopup(selector) {
  var popup = document.querySelector(selector);
  popup.style.opacity = 0;
  popup.style.pointerEvents = "none";
}

function fullscreenEditor() {
  document.documentElement.style.setProperty("--editor-width", "99%");
}
function fullscreenPreview() {
  document.documentElement.style.setProperty("--editor-width", "1%");
}
function sideBySide() {
  document.documentElement.style.setProperty("--editor-width", "70%");
}
