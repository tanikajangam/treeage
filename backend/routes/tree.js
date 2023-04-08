const router = require("express").Router();
const Tree = require("../models/Tree");

// create a tree
router.post("/", async (req, res) => {
    const newTree = new Tree(req.body);
    try {
        const savedTree = await newTree.save();
        res.status(200).json(savedTree);
    } catch (err) {
        res.status(500).json(err)
    }
})


// get all trees
router.get("/", async (req, res) => {
    try {
        const trees = await Tree.find();
        res.status(200).json(trees)
    } catch (err) {
        res.status(500).json(err);
    }
})
// get all trees
module.exports = router;
