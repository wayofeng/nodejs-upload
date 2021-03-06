var exec = require("child_process").exec;
var querystring = require("querystring");
var fs = require("fs");
var formidable = require("formidable");

function start(response){
	console.log("request start");

	 var body = `<html>
				    <head>
				        <meta charset="utf-8">
				        <title></title>
				    </head>
				    <body>
				        <form action="/upload" 
						enctype="multipart/form-data"
				        method="post">
				        	<input type="file" name="upload" multiple="multiple"/>
				            <input type="submit" value="submit">
				        </form> 
				    </body>
				</html>
				`;
		response.writeHead(200, {"Content-Type":"text/html"});
		response.write(body);
		response.end();
	 
}

function upload(response, request){
	console.log("request upload");

	var form = new formidable.IncomingForm();
	form.uploadDir='tmp';
	console.log("parsing done");
	form.parse(request,function(error, fields, files){
		console.log("parsing done");

		fs.renameSync(files.upload.path, "./tmp/test.png");
	response.writeHead(200, {"Content-Type":"text/html"});
	response.write(`received img`);
	response.write("<img src='/show' />");
	response.end();

})
}

function show(response){
	console.log(`Request handler 'show' was called`);
	fs.readFile("./tmp/test.png", "binary", function(error, file){
		if(error){
			response.writeHead(500,{"Content-Type":"text/plain"});
			response.write(error + "\n");
			response.end();
		}else{
			response.writeHead(200,{"Content-Type":"text/plain"});
			response.write(file,"binary");
			response.end();
		}
	});
}
exports.start = start;
exports.upload = upload;
exports.show = show;