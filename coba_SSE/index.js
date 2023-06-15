const express = require("express");
const app = express();

const port = 3030;

//Define the route
app.get("/", (req, res) => {
  //   res.status(200).send("Hello World!");
  console.log("Client connected");
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Access-Control-Allow-Origin", "*");

  const interval = setInterval(() => {
    res.write(`data: ${new Date().toLocaleTimeString()}\n\n`);
  }, 1000);

  res.on("close", () => {
    console.log("Client disconnected");
    clearInterval(interval);
    res.end();
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
