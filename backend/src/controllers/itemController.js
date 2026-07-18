const Item = require("../models/Item");

const getItems = async (req, res) => {
  const items = await Item.findAll();
  res.json(items);
};

const createItem = async (req, res) => {
  const item = await Item.create(req.body.name);
  res.status(201).json(item);
};

module.exports = { getItems, createItem };
