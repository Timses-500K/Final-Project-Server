const { Order, Item, User, Category } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");



class OrderController {
  //ItemApi
  static findAllItem = async (req, res, next) => {
    try {
      const data = await Item.findAll({
        include: [
          {
            model: Category,
            as: "itemCategory",
            through: { attributes: [] },
            attributes: ["categoryName"],
          },
        ],
      });
      res.status(200).json(data);
    } catch (err) {
      next(err);
    }
  };

  static findOne = async (req, res, next) => {
    const { id } = req.params;

    try {
      const data = await Item.findOne({
        where: {
          id,
        },
      });

      if (data) {
        res.status(200).json(data);
      } else {
        throw { name: "ErrorNotFound" };
      }
    } catch (err) {
      next(err);
    }
  };

  //UserApi
  //membuat user baru
  static createUser = async (req, res, next) => {
    try {
      const {
        email,
        username,
        password,
        firstName,
        lastName,
        birth,
        visibility,
      } = req.body;

      const existingUser = await User.findOne({
        where: { email },
      });

      if (existingUser) {
        throw {
          name: "ErrorBadRequest",
          message: "Email is already registered",
        };
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        email,
        username,
        password: hashedPassword,
        firstName,
        lastName,
        birth,
        visibility,
      });

      res.status(201).json({
        id: newUser.id,
        username: newUser.username,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        birth: newUser.birth,
        visibility: newUser.visibility,
      });
    } catch (err) {
      next(err);
    }
  };
  // melakukan login
  static login = async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // Cari user berdasarkan email
      const user = await User.findOne({ where: { email } });

      // Jika user tidak ditemukan, lemparkan error
      if (!user) {
        throw { name: "ErrorNotFound" };
      }

      // Verifikasi password
      const isValidPassword = await bcrypt.compare(password, user.password);

      // Jika password tidak valid, lemparkan error
      if (!isValidPassword) {
        throw { name: "ErrorInvalidCredentials" };
      }

      // Buat token JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });

      // Kirim token sebagai response
      res.status(200).json({ token });
    } catch (err) {
      next(err);
    }
  };
  //menampilkan profil user yang sedang login
  static getUserProfile = async (req, res, next) => {
    try {
      const userId = req.user.id; // pastikan bahwa objek user telah terdefinisi dan memiliki properti id
      const user = await User.findByPk(userId);

      if (!user) {
        throw { name: "ErrorNotFound" };
      }

      res.status(200).json({
        id: user.id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        birth: user.birth,
        visibility: user.visibility,
      });
    } catch (err) {
      next(err);
    }
  };

  static updateProfile = async (req, res, next) => {
    try {
      const { id } = req.params; // mengambil user id dari token yang di-decode pada middleware sebelumnya
      const {
        email,
        username,
        password,
        firstName,
        lastName,
        birth,
        visibility,
      } = req.body;

      // cek apakah user dengan id tersebut ada di database
      const user = await User.findOne({ where: { id } });
      if (!user) {
        throw { name: "ErrorNotFound" };
      }

      // update data user
      user.username = username || user.username; // jika username kosong, maka gunakan nilai lama
      user.email = email || user.email;
      user.password = password || user.password
      // if (password) {
      //   user.password = await bcrypt.hash(password, 10); // menggunakan async await
      // }
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.birth = birth || user.birth;
      user.visibility = visibility || user.visibility;

      await user.save();

      res.status(200).json({
        message: "Profile updated successfully",
        data: {
          id: user.id,
          username: user.username,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          birth: user.birth,
          visibility: user.visibility,
        },
      });
    } catch (err) {
      next(err);
    }
  };

  //OrderApi
  //membuat order baru
  static createOrder = async (req, res, next) => {
    try {
      const { userId, items } = req.body;

      // Create a new order
      const order = await Order.create({ userId });

      // Add items to the order
      await Promise.all(
        items.map(async (item) => {
          const { itemId, quantity } = item;
          const itemData = await Item.findByPk(itemId);
          if (!itemData) {
            throw { name: "ErrorNotFound" };
          }
          await OrderItem.create({
            orderId: order.id,
            itemId,
            quantity,
            price: itemData.price,
          });
        })
      );

      res.status(201).json({
        message: "Order created successfully",
        orderId: order.id,
      });
    } catch (err) {
      next(err);
    }
  };
  //menampilkan detail order dengan ID tertentu
  static getOrderById = async (req, res, next) => {
    try {
      const { id } = req.params;

      const order = await Order.findOne({
        where: { id },
        include: [
          {
            model: Item,
            as: "items",
            attributes: ["id", "itemName", "price", "imageUrl"],
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "username", "email"],
          },
        ],
      });

      if (!order) {
        throw { name: "ErrorNotFound" };
      }

      res.status(200).json(order);
    } catch (err) {
      next(err);
    }
  };
  //menampilkan semua order yang dimiliki oleh user yang sedang login
  static getAllOrder = async (req, res, next) => {
    try {
      const orders = await Order.findAll({
        include: [
          {
            model: Item,
            as: "items",
            through: { attributes: [] },
            attributes: ["id", "itemName", "price", "imageUrl"],
          },
          {
            model: User,
            as: "user",
            attributes: ["id", "firstName", "lastName", "email"],
          },
        ],
      });

      res.status(200).json(orders);
    } catch (err) {
      next(err);
    }
  };
  // memperbarui order dengan ID tertentu
  static updateOrder = async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const data = await Order.update(
        {
          status,
        },
        {
          where: {
            id,
          },
        }
      );

      if (data[0] === 1) {
        res.status(200).json({
          message: "Order updated successfully",
        });
      } else {
        throw { name: "ErrorNotFound" };
      }
    } catch (err) {
      next(err);
    }
  };
  //menghapus order dengan ID tertentu
  static deleteOrder = async (req, res, next) => {
    try {
      const { id } = req.params;

      const data = await Order.destroy({
        where: {
          id,
        },
      });

      if (data === 1) {
        res.status(200).json({
          message: "Order deleted successfully",
        });
      } else {
        throw { name: "ErrorNotFound" };
      }
    } catch (err) {
      next(err);
    }
  };
}

module.exports = OrderController;
