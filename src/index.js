

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

function handleFiles(files){
    for(let i=0;i < files.length;i++){
        // display on web page
        let file=files[i];
        let name = file.name.split('.',1);
        let a =  document.createElement("a");
        a.id = "index_select";
        a.href = "/md/"+name;
        a.innerHTML = name;
        document.getElementById('container').appendChild(a);
    
        const reader = new FileReader();
        reader.onload = function (e){
            let filetoupload = e.target.result
            filetoupload.name = name;
            fetch("http://localhost:8000/",{
                method:"POST",
                headers:{
                    "Content-Type":'application/octet-stream',
                    "filename":name
                },
                body:filetoupload,
            }).then(res=>{
              if(res.status == 200){
                alert('upload success!!')
              }
            })
        };
        reader.readAsBinaryString(file);
    }
}