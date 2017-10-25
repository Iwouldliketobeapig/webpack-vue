var fs = require("fs");
var path = require("path");

global.Vue = require("vue");

// Get the HTML layout
var layout = fs.readFileSync("./dist/templates/test/index.html", "utf8");

// Create a renderer
var renderer = require("vue-server-renderer").createRenderer();

// Create an express server
var express = require("express");
var server = express();
server.use("/dist/static", express.static(
  path.resolve(__dirname, "/dist/static")
));

// Handle all GET requests
server.get("/test", function (request, response) {

  // Render our Vue app to a string
  renderer.renderToString(

    // Create an app instance
    require("./dist/static/js/test/app.bundle.server.js"),

    // Handle the rendered result
    function (error, html) {

      // If an error occurred while rendering...
      if (error) {

        // Log the error in the console
        console.error(error);

        // Tell the client something went wrong
        return response
          .status(500)
          .send("Server Error");
      }

      // Send the layout with the rendered app's HTML
      response.send(layout.replace("<div id=\"app\"></div>", html));
    }
  );
});

// Listen on port 5000
server.listen(5000, function (error) {
  if (error) {throw error;};
  console.log("Server is running at localhost:5000");
});
