const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const sessionMiddleware = require("./middleware/sessionMiddleware");

const { v4: uuidv4 } = require("uuid");

const Order = require("./model/order");
const Product = require("./model/product");

require("./config/db")();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.static("public"));

// app.use(sessionMiddleware)

app.get("/", async (req, res) => {
  res.sendFile(__dirname + "/public" + "/chatbot.html");
});

app.use(sessionMiddleware);

io.use(function (socket, next) {
  sessionMiddleware(socket.request, socket.request.res, next);
});

io.on("connection", (socket) => {
  const session = socket.request.session;
  let userId = session.userId;
  if (!userId) {
    userId = uuidv4();
    session.userId = userId;
    session.save();
  }
  socket.emit("welcome", "welcome to sky restaurant");

  socket.on("place_order", async ({ product, price, quantity = 1 }) => {
    const orderExist = await Order.findOne({
      owner: userId,
      product,
      status: "pending",
    });
    if (orderExist) {
      socket.emit("bot_response", "This order already exist!");
      return;
    }
    await Order.create({ product, price, quantity, owner: userId });
    socket.emit("bot_response", "order has been placed!");
  });

  socket.on("checkout_order", async ({ orderId }) => {
    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      socket.emit("bot_response", "No order to checkout");
      return;
    }
    order.status = "completed";
    await order.save();
    socket.emit("bot_response", "Order has been checkout!");
  });

  socket.on("cancel_order", async ({ orderId }) => {
    const order = await Order.findOne({ _id: orderId });
    if (!order) {
      socket.emit("bot_response", "No order to cancel!");
      return;
    }
    order.status = "cancelled";
    await order.save();
    socket.emit("bot_response", "Order has been cancelled!");
  });

  socket.on("request", async ({ key, data }) => {
    let order;
    key = parseInt(key);
    switch (key) {
      case 1:
        order = await Product.find({});
        socket.emit("product_list", order);
        return;

      case 99:
        order = await Order.find({ owner: userId, status: "pending" }).populate(
          { path: "product", select: "productName" }
        );
        socket.emit("incomplete_orders", order);
        return;

      case 98:
        order = await Order.find({ owner: userId }).populate({
          path: "product",
          select: "productName",
        });
        socket.emit("order_list", order);
        return;

      case 97:
        order = await Order.findOne(
          { owner: userId, status: "pending" },
          {},
          { sort: { _id: -1 } }
        ).populate({ path: "product", select: "productName" });
        socket.emit("current_order", order);
        return;

      case 0:
        order = await Order.find({ owner: userId, status: "pending" }).populate(
          { path: "product", select: "productName" }
        );
        socket.emit("order_list_c", order);
        return;

      default:
        return null;
    }
  });
});

httpServer.listen(8000, () => {
  console.log("Server connected successfully!");
});
