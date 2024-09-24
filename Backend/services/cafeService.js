const { Cafe, Employee, EmployeeCafe } = require("../models/index");
const { v4: uuidv4 } = require("uuid");
const Sequelize = require("sequelize");
const sequelize = require("../config/dbConnection");

const getCafeById = async (id) => {
    try {
        const cafe = await Cafe.findOne({
            where: { id },
            attributes: ["name", "logo", "description", "location"],
        });

        return cafe;
    } catch (error) {
        console.error("Error fetching cafe by ID:", error);
        throw error;
    }
};

const getCafes = async (location) => {
    const whereCondition = location ? { location } : {};
    console.log("Where condition:", whereCondition);

    const cafes = await Cafe.findAll({
        where: whereCondition,
        include: [
            {
                model: EmployeeCafe,
                as: "EmployeeCafes",
                attributes: [],
            },
        ],
        attributes: {
            include: [
                [
                    Sequelize.fn(
                        "COUNT",
                        Sequelize.col("EmployeeCafes.cafe_id")
                    ),
                    "employeeCount",
                ],
            ],
        },
        group: ["Cafe.id"],
        order: [
            [
                Sequelize.fn("COUNT", Sequelize.col("EmployeeCafes.cafe_id")),
                "DESC",
            ],
        ],
    });

    return cafes;
};

const createNewCafe = async ({ name, description, logo, location }) => {
    try {
        if (!name || !description || !location) {
            const error = new Error(
                "Missing required fields: name, description, or location."
            );
            error.status = 400;
            throw error;
        }

        const maxLength = 255;
        if (
            name.length > maxLength ||
            description.length > maxLength ||
            logo.length > maxLength ||
            location.length > maxLength
        ) {
            const error = new Error(
                `Fields cannot exceed ${maxLength} characters.`
            );
            error.status = 400;
            throw error;
        }

        const newCafe = await Cafe.create({
            id: uuidv4(),
            name,
            description,
            logo,
            location,
        });

        return newCafe;
    } catch (error) {
        console.error("Error creating cafe in service:", error);
        throw error;
    }
};

const updateCurrentCafe = async (id, { name, description, logo, location }) => {
    if (!name || !description || !location) {
        const error = new Error(
            "Missing required fields: name, description, or location."
        );
        error.status = 400;
        throw error;
    }

    await Cafe.update({ name, description, logo, location }, { where: { id } });

    const updatedCafe = await Cafe.findOne({ where: { id } });

    return updatedCafe;
};

// const deleteCafeById = async (cafeId) => {
//   const existingCafe = await Cafe.findByPk(cafeId);
//   if (!existingCafe) {
//     const error = new Error("Cafe not found with the provided UUID.");
//     error.status = 404;
//     throw error;
//   }

//   const employeesToDelete = await EmployeeCafe.findAll({
//     where: { cafe_id: cafeId },
//     attributes: ['employee_id'],
//   });

//   if (employeesToDelete.length > 0) {
//     const employeeIds = employeesToDelete.map((record) => record.employee_id);

//     await Employee.destroy({
//       where: {
//         id: employeeIds,
//       },
//     });

//     await EmployeeCafe.destroy({
//       where: {
//         cafe_id: cafeId,
//       },
//     });
//   }

//   await Cafe.destroy({
//     where: {
//       id: cafeId,
//     },
//   });

//   return { message: "Cafe and associated employees deleted successfully." };
// };

const deleteCafeById = async (cafeId) => {
    // Disable foreign key checks
    await sequelize.query("SET FOREIGN_KEY_CHECKS = 0;");

    try {
        const existingCafe = await Cafe.findByPk(cafeId);
        if (!existingCafe) {
            const error = new Error("Cafe not found with the provided UUID.");
            error.status = 404;
            throw error;
        }

        const employeesToDelete = await EmployeeCafe.findAll({
            where: { cafe_id: cafeId },
            attributes: ["employee_id"],
        });

        if (employeesToDelete.length > 0) {
            const employeeIds = employeesToDelete.map(
                (record) => record.employee_id
            );

            // Delete employees and records from EmployeeCafe
            await Employee.destroy({
                where: {
                    id: employeeIds,
                },
            });

            await EmployeeCafe.destroy({
                where: {
                    cafe_id: cafeId,
                },
            });
        }

        // Delete the cafe
        await Cafe.destroy({
            where: {
                id: cafeId,
            },
        });

        return {
            message: "Cafe and associated employees deleted successfully.",
        };
    } catch (error) {
        console.error("Error during deletion:", error);
        throw error;
    } finally {
        // Re-enable foreign key checks
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 1;");
    }
};

module.exports = {
    getCafeById,
    getCafes,
    createNewCafe,
    updateCurrentCafe,
    deleteCafeById,
};
