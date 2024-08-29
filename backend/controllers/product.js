import Joi from "joi";
import { apiResponseCode } from "../helper.js";
import Product from "../models/Product.js";
import upload from "../utils/imageUpload.js";
import User from "../models/User.js";
const createProduct = async (req, res) => {
  upload(req, res, async (err) => {
    if (err) {
      return res.status(400).json({
        responseCode: apiResponseCode.BAD_REQUEST,
        responseMessage: err.message,
        data: null,
      });
    }

    const productSchema = Joi.object({
      name: Joi.string().max(80).required(),
      image: Joi.string().allow(""),
      price: Joi.number().positive().required(),
      description: Joi.string().min(4).max(100).required(),
    });
    try {
      const { error } = productSchema.validate(req.body);
      if (error) {
        return res.status(400).json({
          responseCode: apiResponseCode.BAD_REQUEST,
          responseMessage: error.details[0].message,
          data: null,
        });
      }

      let { name, image, price, description } = req.body;
      const user = await User.findById(req.user.id).select("username").lean();

      if (!user) {
        return res.status(400).json({
          responseCode: apiResponseCode.BAD_REQUEST,
          responseMessage: "Cant create product without user",
          data: null,
        });
      }

      image = req.file ? `/images/${req.file.filename}` : null;
      console.log(image);
      let product = new Product({
        name,
        image: image,
        price,
        description,
        createdBy: req.user.id,
      });

      await product.save();
      const responseData = {
        responseCode: apiResponseCode.SUCCESSFUL,
        responseMessage: "Product created successfully",
        data: {
          name,
          image: imageUrl,
          price,
          description,
          createdBy: user.username,
        },
      };
      res.status(201).json(responseData);
    } catch (error) {
      console.error(error);
      res.status(500).json({
        responseCode: apiResponseCode.INTERNAL_SERVER_ERR,
        responseMessage: "Error creating product",
        data: null,
      });
    }
  });
};

const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("createdBy", "username")
      .lean();
    res.status(200).json({
      responseCode: apiResponseCode.SUCCESSFUL,
      responseMessage: "this are all the products",
      data: products,
    });

    if (!products) {
      return res.status(404).json({
        responseCode: apiResponseCode.NOT_FOUND,
        responseMessage: "No products found",
        data: null,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(400).json({
      responseCode: apiResponseCode.BAD_REQUEST,
      responseMessage: "Error fetching products",
      data: null,
    });
  }
};

const getSingleProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("createdBy", "username")
      .lean();
    if (!product) {
      return res.status(404).json({
        responseCode: apiResponseCode.NOT_FOUND,
        responseMessage: "Product not found",
        data: null,
      });
    }
    res.status(200).json({
      responseCode: apiResponseCode.SUCCESSFUL,
      responseMessage: "Product found",
      data: product,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      responseCode: apiResponseCode.BAD_REQUEST,
      responseMessage: "Product does not exist",
      data: null,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;

    const product = await Product.findOne({ _id: id, createdBy: userId });
    console.log(product);
    if (product.createdBy.toString() !== userId) {
      return res.status(401).json({
        responseCode: apiResponseCode.UNAUTHORIZED,
        responseMessage: "You are not authorized to delete this product",
        data: null,
      });
    }
    if (!product) {
      return res.status(404).json({
        responseCode: apiResponseCode.NOT_FOUND,
        responseMessage: "Product not found",
        data: null,
      });
    }
    if (req.body.name !== undefined) product.name = req.body.name;
    if (req.body.image !== undefined) product.image = req.body.image;
    if (req.body.price !== undefined) product.price = req.body.price;
    if (req.body.description !== undefined)
      product.description = req.body.description;

    const updatedProduct = await product.save();
    console.log(updatedProduct);
    res.status(200).json({
      responseCode: apiResponseCode.SUCCESSFUL,
      responseMessage: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      responseCode: apiResponseCode.BAD_REQUEST,
      responseMessage: "Error updating product",
      data: null,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const id = req.params.id;
    const userId = req.user.id;
    const product = await Product.findById({ _id: id });

    console.log(product.createdBy.toString());
    if (product.createdBy.toString() !== userId) {
      return res.status(401).json({
        responseCode: apiResponseCode.UNAUTHORIZED,
        responseMessage: "You are not authorized to delete this product",
        data: null,
      });
    }

    const deletedProduct = await Product.findByIdAndDelete({
      _id: id,
      createdBy: userId,
    });
    if (!deletedProduct) {
      return res.status(404).json({
        responseCode: apiResponseCode.NOT_FOUND,
        responseMessage: "Product not found",
        data: null,
      });
    }
    res.status(200).json({
      responseCode: apiResponseCode.SUCCESSFUL,
      responseMessage: "Product deleted successfully",
      data: deletedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(400).json({
      responseCode: apiResponseCode.BAD_REQUEST,
      responseMessage: "Error deleting product",
      data: null,
    });
  }
};

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
};
