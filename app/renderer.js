// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// No Node.js APIs are available in this process because
// `nodeIntegration` is turned off. Use `preload.js` to
// selectively enable features needed in the rendering
// process.
const marked = require('marked');
const DOMPurify = require('dompurify');
const path = require('path');
const { remote, ipcRenderer } = require('electron');

const mainProcess = remote.require("./main");
const currentWindow = remote.getCurrentWindow();

let filePath = null;
let originalContent = "";

const markdownView = document.querySelector('#markdown');
const htmlView = document.querySelector('#html');
const newFileButton = document.querySelector('#new-file');
const openFileButton = document.querySelector('#open-file');
const saveMarkdownButton = document.querySelector('#save-markdown');
const revertButton = document.querySelector('#revert');
const saveHtmlButton = document.querySelector('#save-html');
const showFileButton = document.querySelector('#show-file');
const openInDefaultButton = document.querySelector('#open-in-default');

const renderMarkdownToHtml = markdown => {
  htmlView.innerHTML = DOMPurify.sanitize(marked(markdown));
};

markdownView.addEventListener('keyup', event => {
    updateUserInterface(originalContent !== event.target.value);

    const currentContent = event.target.value;
    renderMarkdownToHtml(currentContent);
});

openFileButton.addEventListener('click', () => {
    mainProcess.getFileFromUser();
});

const updateUserInterface = (isEdited) => {
    let title = "Fire Sale"

    if (filePath) {
        title = `${path.basename(filePath)} - ${title}`;
    }

    currentWindow.setTitle(title);

    console.log(isEdited);
};

ipcRenderer.on('file-opened', (e, file, content) => {
    filePath = file;
    originalContent = content;

    markdownView.innerHTML = content;
    renderMarkdownToHtml(content);

    updateUserInterface();
});