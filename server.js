var express = require('express');
var app = express();
var markdown = require('markdown-js');
var fs = require('fs');
var formidable = require("formidable");

var html_head = '<head><link rel="stylesheet" type="text/css" href="/publicstyle/index.css">'+
                '<link rel="icon" href="/publicstyle/icon.ico">'+
                '<title>Markdown</title></head>';

app.use('/publicsrc',express.static('src'));
app.use('/publicstyle',express.static('style'));
app.use('/publicmd',express.static('public'));

app.get('/',(req,res)=>{
  /**************
   * first page
  ***************/
  var html_body='<h1 id="title">Markdown!!</h1> <div id="container">'
  fs.readdirSync('./public').forEach(file => {
    let name = file.split('.',1);
    html_body+='<a id="index_select" href="/md/'+name+'">'+name+'</a>';
  });
  html_body+='</div><div id="dropbox">drop file here</div><script src="/publicsrc/index.js"></script>'
  let html = html_head+html_body;
  res.send(html);
  res.end();
});

app.post('/',(req,res)=>{
  console.log("req from post");
  var form = new formidable.IncomingForm();
  form.parse(req, function(error, fields, files){
    var oldpath = files.file.path;
    //console.log(files.file)
    var newpath = 'C:/Users/donce/Desktop/web/mdserver/public/'+req.headers.filename+'.md';
    fs.rename(oldpath, newpath, function (err) {
      if (err) throw err;
      res.send('upload success!!');
      res.end();
    })
  })
})


app.get('/md/:mdindex',(req,res)=>{

  /*****************
   * md file display
  ******************/
  let str = fs.readFileSync('./public/'+req.params.mdindex+'.md', "utf8");
  let back_btn='<a id="back_btn" href="/"> << back to index</a>';
  let markdown_body = markdown.makeHtml(str);
  let html=html_head+back_btn+markdown_body;
  res.send(html);
  res.end()
});







app.listen(8000,()=>{
    console.log('server at 8000');
})

