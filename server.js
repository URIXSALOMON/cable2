const express = require("express");
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
const apiUrl = 'https://cable1-production.up.railway.app';

app.use(express.static("public"));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);

});
