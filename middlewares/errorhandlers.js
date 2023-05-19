const errorMessages = {
  ErrorNotFound: {
    statusCode: 404,
    message: "Error Not Found",
  },
  CategoryNotFound: {
    statusCode: 404,
    message: "Category Not Found",
  },
  ItemNotFound: {
    statusCode: 404,
    message: "Item Not Found",
  },
  SizeNotFound: {
    statusCode: 404,
    message: "Size Not Found",
  },
  CartNotFound: {
    statusCode: 404,
    message: "Cart Not Found"
  },
  UserNotFound: {
    statusCode: 404,
    message: "User Not Found",
  },
  AddressNotFound: {
    statusCode: 404,
    message: "Address Not Found"
  },
  WrongEmail: {
    statusCode: 404,
    message: "Wrong Email",
  },
  WrongPassword: {
    statusCode: 404,
    message: "Wrong Password",
  },
};

const errorHandler = (err, req, res, next) => {
  console.log(err);
  const error = errorMessages[err.name];
  if (error) {
    console.log(error.message);
    res.status(error.statusCode).json({
      message: error.message,
    });
  } else {
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

module.exports = errorHandler;
