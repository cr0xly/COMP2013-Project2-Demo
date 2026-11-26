//Backend server for Thrift Happens online shop
//Imports
import express, { type Express } from "express";
import mongoose from "mongoose";
import cors from "cors";
import "dotenv/config";
import ClothesItem from "./models/clothesItem";

//Constants Variable
const server: Express = express();
const port: Number = 3000;
const { MONGO_URI } = process.env;

//Middleware
server.use(express.urlencoded({ extended: true }));
server.use(express.json());
server.use(cors());

//Connect to DB and Start the server
if (!MONGO_URI) {
  throw new Error("Mongo URI is not found in .env file");
}
mongoose
  .connect(MONGO_URI)
  .then(() =>
    server.listen(port, () => {
      console.log(`Connected to DB\nServer is on port ${port}`);
    }),
  )
  .catch((error) => console.log(error));

//Routes
server.get("/", (request, response) => {
  response.send("Server is Live");
});

//GET data api route
server.get("/data", async (request, response) => {
  try {
    const data = await ClothesItem.find();
    response.status(200).send(data);
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

//POST route to add a clothing item to the DB
server.post("/data", async (request, response) => {
  const {
    id,
    name,
    image,
    fit,
    category,
    size,
    color,
    description,
    price,
    quantity,
    itemQuantity,
  } = request.body;
  const newArticle = new ClothesItem({
    id,
    name,
    image,
    fit,
    category,
    size,
    color,
    description,
    price,
    quantity,
    itemQuantity,
  });
  try {
    await newArticle.save();
    response.status(201).send({
      message: `The new item with id ${id} has been added sucessfully`,
    });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

//DELETE route to delete one clothing article by id
server.delete("/data/:id", async (request, response) => {
  //because param will convert ID to string,
  //id needs to be reconverted to number to abide by the model schema
  const id = Number(request.params.id);
  try {
    await ClothesItem.findOneAndDelete({ id });
    response
      .status(201)
      .send({ message: `Item with ID ${id} has been successfully deleted` });
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});
