var http = require("http");
var fs = require("fs");

//method
var check_and_read = filename => {
  try {
    fs.statSync(filename);
    return fs.readFileSync(filename);
  } catch (err) {
    throw err;
  }
};
var error404 = "./not_found.html";
var error = "";
try {
  error = check_and_read(error404);
} catch (err) {
  error = "<html><body><h1>404 Not Found</h1></body></html>";
}
var smart_read = filename => {
  try {
    let text = check_and_read(filename);
    return { code: 200, text: text };
  } catch (err) {
    return { code: 404, text: error };
  }
};

var count = 0;

//create a server object:
http
  .createServer(function(req, res) {
    let url = "." + req["url"];
    if (url.match(/counter$/)) {
      count++;
      res.writeHead(200, {
        "Content-Type": "text/html; charset=utf-8"
      });
      res.write(
        "<html><body>あなたは" + count + "番目の来場者です</body></html>"
      );
    } else {
      if (url.match(/\/$/)) url += "index.html";
      console.log("URL = " + url);
      let result = smart_read(url);
      res.writeHead(result.code, {
        "Content-Type": "text/html; charset=utf-8"
      });
      res.write(result.text);
    }
    res.end(); //end the response
  })
  .listen(8080); //the server object listens on port 8080
