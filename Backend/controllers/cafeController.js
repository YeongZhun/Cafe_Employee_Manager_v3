const cafeService = require("../services/cafeService");
const { Cafe } = require("../models/index");

const getCafe = async (req, res) => {
    try {
        const { id } = req.params; 
        const cafe = await cafeService.getCafeById(id);

        if (!cafe) {
            return res.status(404).json({ message: "Cafe not found" });
        }

        res.status(200).json(cafe);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getAllCafes = async (req, res) => {
    try {
        const location = req.query.location || "";
        const cafes = await cafeService.getCafes(location);

        // If the location is invalid or no cafes match, return an empty list
        if (!cafes.length) {
            return res.status(200).json([]);
        }

        res.status(200).json(cafes);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const createCafe = async (req, res) => {
    const { name, description, logo, location } = req.body;

    try {
        const newCafe = await cafeService.createNewCafe({
            name,
            description,
            logo,
            location,
        });
        return res.status(201).json(newCafe);
    } catch (error) {
        console.error("Error in cafe controller:", error.message);
        return res.status(400).json({ message: error.message });
    }
};

const updateCafe = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, logo, location } = req.body;

        // Check if the cafe exists first
        const existingCafe = await Cafe.findByPk(id);
        if (!existingCafe) {
            return res.status(404).json({
                message: "Cafe not found with the provided UUID.",
            });
        }

        const updatedCafe = await cafeService.updateCurrentCafe(id, {
            name,
            description,
            logo,
            location,
        });

        res.status(200).json({
            message: "Cafe updated successfully",
            cafe: updatedCafe,
        });
    } catch (error) {
        res.status(error.status || 500).json({ error: error.message });
    }
};


const deleteCafe = async (req, res) => {
  try {
    const cafeId = req.params.id;

    const result = await cafeService.deleteCafeById(cafeId);

    res.status(200).json(result);
  } catch (error) {
    res.status(error.status || 500).json({ error: error.message });
  }
};

module.exports = { getAllCafes, createCafe, updateCafe, deleteCafe, getCafe };
