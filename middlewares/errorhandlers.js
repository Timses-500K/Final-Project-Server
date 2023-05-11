const errorHandler = (err, req, res, next) => {
  console.log(err);
  if (err.name === "ErrorNotFound") {
    console.log("Error Not Found");
    res.status(404).json({
      message: "Error Not Found",
    });
  } else if (err.name === "CategoryNotFound") {
    console.log("Category Not Found");
    res.status(404).json({
      message: "Category Not Found",
    });
  } else if (err.name === "ItemNotFound") {
    console.log("Item Not Found");
    res.status(404).json({
      message: "Item Not Found",
    });
  } else if (err.name === "SizeNotFound") {
    console.log("Size Not Found");
    res.status(404).json({
      message: "Size Not Found",
    });
  } else if (err.name === "UserNotFound") {
    console.log("User Not Found");
    res.status(404).json({
      message: "User Not Found",
    });
  } else if (err.name === "WrongEmail") {
    console.log("Wrong Email");
    res.status(404).json({
      message: "Wrong Email",
    });
  } else if (err.name === "WrongPassword") {
    console.log("Wrong Password");
    res.status(404).json({
      message: "Wrong Password",
    });
  } else {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = errorHandler;
