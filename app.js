const express = require("express");
const app = express();
const port = 3001;
const errorHandler = require("./middlewares/errorhandlers");
const router = require("./routes");

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));


app.use(router);
app.use(errorHandler);




app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});