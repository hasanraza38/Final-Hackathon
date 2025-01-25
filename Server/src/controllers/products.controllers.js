import dotenv from "dotenv";
dotenv.config();
import mongoose from "mongoose";
import Products from "../models/products.models.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

//cloudinary Configuration
cloudinary.config({
  cloud_name: "dgybydntn",
  api_key: "137697474661646",
  api_secret:"OvUu_5L_iyJlxp9Cy0D14ZJGzhk" ,
});

// upload image function
const uploadImageToCloudinary = async (localpath) => {
  try {
    const uploadResult = await cloudinary.uploader.upload(localpath, {
      resource_type: "auto",
    });
    fs.unlinkSync(localpath);
    return uploadResult.url;
  } catch (error) {
    fs.unlinkSync(localpath);
    return null;
  }
};

//Add Product
const addProduct = async (req, res) => {
  const { name, description, price } = req.body;

  if (!name)
    return res.status(400).json({ message: "product name is required" });
  if (!description)
    return res.status(400).json({ message: "product description is required" });
  if (!price)
    return res.status(400).json({ message: "product price is required" });

  try {
    let imageUrl = null;

    if (req.file) {
      const uploadResult = await uploadImageToCloudinary(req.file.path);
      if (!uploadResult) {
        return res
          .status(500)
          .json({ message: "Error occurred while uploading the image" });
      }
      imageUrl = uploadResult;
    }

    const product = await Products.create({
      name,
      description,
      image: imageUrl,
      user: req.user._id,
      price,
    });

    res.status(201).json({
      message: "Product added successfully",
      product,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};
//Add Product

// get all products
const getAllProducts = async (req, res) => {
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;

  const skip = (page - 1) * limit;

  const products = await Products.find({}).skip(skip).limit(limit);
  res.status(200).json({
    products,
  });
};
// get all products


// get single product
const getSingleProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Not valid Id" });
  }

  const product = await Products.findById(id);
  if (!product) {
    res.status(404).json({
      message: "no product found",
    });
  }
  res.status(200).json(product);
};
// get single product

// delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Not valid Id" });
  }

  const product = await Products.findOneAndDelete({ _id: id });

  res.status(200).json({
    message: "product deleted successfully",
    product,
  });
};
// delete product

// edit product

const editProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Not valid Id" });
  }

  const product = Products.findOneAndUpdate(
    {
      _id: id,
    },
    { ...req.body }
  );

  if (!product) {
    return res.status(404).json({ message: "product not found" });
  }
  res.json(product);
};
// edit product



export {
  addProduct,
  getAllProducts,
  getSingleProduct,
  deleteProduct,
  editProduct,
};
