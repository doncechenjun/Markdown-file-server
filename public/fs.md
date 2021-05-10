# Using files from web application

Useing HTML tag <input type="file"> element or by drag anddrop

## Accessing selected file(s)

```
<input type="file" id="input" multiple>
````

the multiple allow user  to select multiple files

Accessing the first file useing a classical DOM selector

```
const selectedFile = document.getElementById('input').files[0]
```

### Accessing selected file(s) on change event

```
const inputElement = document.getElementById("input");
inputElement.addEventListener("change", handleFiles, false);
function handleFiles() {
  const fileList = this.files; /* now you can work with the file list */
}
```

## Getting information about selected file(s)

Multiple file object in the *FileList* object, can be access as list.

```
const number_file = filelist.length;
```

There are three attributes provided by the File object:

1. name
1. size
1. type

### Example : showing file(s) size

```
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>File(s) size</title>
</head>

<body>
  <form name="uploadForm">
    <div>
      <input id="uploadInput" type="file" name="myFiles" multiple>
      selected files: <span id="fileNum">0</span>;
      total size: <span id="fileSize">0</span>
    </div>
    <div><input type="submit" value="Send file"></div>
  </form>

  <script>
  function updateSize() {
    let nBytes = 0,
        oFiles = this.files,
        nFiles = oFiles.length;
    for (let nFileId = 0; nFileId < nFiles; nFileId++) {
      nBytes += oFiles[nFileId].size;
    }
    let sOutput = nBytes + " bytes";
    // optional code for multiples approximation
    const aMultiples = ["KiB", "MiB", "GiB", "TiB", "PiB", "EiB", "ZiB", "YiB"];
    for (nMultiple = 0, nApprox = nBytes / 1024; nApprox > 1; nApprox /= 1024, nMultiple++) {
      sOutput = nApprox.toFixed(3) + " " + aMultiples[nMultiple] + " (" + nBytes + " bytes)";
    }
    // end of optional code
    document.getElementById("fileNum").innerHTML = nFiles;
    document.getElementById("fileSize").innerHTML = sOutput;
  }

  document.getElementById("uploadInput").addEventListener("change", updateSize, false);
  </script>
</body>
</html>

```

## Selecting files useing drag and drop

Establish a drop zone, by adding listeners to a element 'dropbox'

```
let dropbox;

dropbox = document.getElementById("dropbox");
dropbox.addEventListener("dragenter", dragenter, false);
dropbox.addEventListener("dragover", dragover, false);
dropbox.addEventListener("drop", drop, false);

//as we don't need to do anything with dragenter and dragover
function dragenter(e) {
  e.stopPropagation();
  e.preventDefault();
}

function dragover(e) {
  e.stopPropagation();
  e.preventDefault();
}

//The drop() function
function drop(e) {
  e.stopPropagation();
  e.preventDefault();

  const dt = e.dataTransfer;
  const files = dt.files;

  handleFiles(files);
}
```

## Example : Showing thumbnails of users-selected images

```
function handleFiles(files) {
  for (let i = 0; i < files.length; i++) {
    const file = files[i];

    if (!file.type.startsWith('image/')){ continue }

    const img = document.createElement("img");
    img.classList.add("obj");
    img.file = file;
    preview.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.

    const reader = new FileReader();
    reader.onload = (function(aImg) { return function(e) { aImg.src = e.target.result; }; })(img);
    reader.readAsDataURL(file);
  }
}

```

handling the selected file type.

CSS class "obj" added for easy find in DOM tree.

File attribute in img let us fetch the images later.

readAsDataURL() start the read operation in the background. When the entire contents of the image file are loaded, they are converted into a data: URL which is passed to the onload callback. Our implementation of this routine sets the img element's src attribute to the loaded image.

## Using object URL

The DOM `URL.createObjectURL()` and `URL.revokeObjectURL()` can creat simple URL string that can be used to reference any data, including local files.

Reference a File object from HTML, create a object URL:

```
const objectURL = window.URL.createObjectURL(fileObj);
```

Memory will be released automatically when document unloaded.

Can also be released by 

```
URL.revokeObjectURL(objectURL);
```

## Example : Using objectURL to display images

The HTML presents the interface:

```
<input type="file" id="fileElem" multiple accept="image/*" style="display:none">
<a href="#" id="fileSelect">Select some files</a>
<div id="fileList">
  <p>No files selected!</p>
</div>
```
In js

```
const fileSelect = document.getElementById("fileSelect"),
  fileElem = document.getElementById("fileElem"),
  fileList = document.getElementById("fileList");

fileSelect.addEventListener("click", function (e) {
  if (fileElem) {
    fileElem.click();
  }
  e.preventDefault(); // prevent navigation to "#"
}, false);

fileElem.addEventListener("change", handleFiles, false);

function handleFiles() {
  if (!this.files.length) {
    fileList.innerHTML = "<p>No files selected!</p>";
  } else {
    fileList.innerHTML = "";
    const list = document.createElement("ul");
    fileList.appendChild(list);
    for (let i = 0; i < this.files.length; i++) {
      const li = document.createElement("li");
      list.appendChild(li);

      const img = document.createElement("img");
      img.src = URL.createObjectURL(this.files[i]);
      img.height = 60;
      img.onload = function() {
        URL.revokeObjectURL(this.src);
      }
      li.appendChild(img);
      const info = document.createElement("span");
      info.innerHTML = this.files[i].name + ": " + this.files[i].size + " bytes";
      li.appendChild(info);
    }
  }
}
```

In handleFiles:

the object URL since it's no longer needed once the image has been loaded. Call URL.revokeObjectURL()

### Creating the upload tasks

Useing querySelectorAll().

File attached in the .file attribute.

```
function sendFiles() {
  const imgs = document.querySelectorAll(".obj");

  for (let i = 0; i < imgs.length; i++) {
    new FileUpload(imgs[i], imgs[i].file); //Using HTTP method to define FileUpload()
  }
}
```