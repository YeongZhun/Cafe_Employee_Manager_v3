const { Employee, EmployeeCafe, Cafe } = require("../models/index");
const Sequelize = require("sequelize");
const { fn, col, literal } = Sequelize;

const getEmployeeById = async (id) => {
    try {
        const employee = await Employee.findOne({
            where: { id },
            include: [
                {
                    model: EmployeeCafe,
                    as: "EmployeeCafes",
                    attributes: ["start_date", "cafe_id"],
                },
            ],
            attributes: {
                include: [
                    [
                        Sequelize.fn(
                            "DATEDIFF",
                            Sequelize.literal("NOW()"),
                            Sequelize.col("EmployeeCafes.start_date")
                        ),
                        "daysWorked",
                    ],
                ],
            },
        });

        if (employee) {
            const cafeId = employee.EmployeeCafes[0]?.cafe_id;

            let cafeName = null;
            if (cafeId) {
                const cafe = await Cafe.findOne({
                    where: { id: cafeId },
                    attributes: [["name", "cafe"]],
                });

                cafeName = cafe?.dataValues?.cafe || null;
            }

            const employeeData = {
                name: employee.name,
                email_address: employee.email_address,
                phone_number: employee.phone_number,
                gender: employee.gender,
                cafe: cafeName,
                start_date: employee.EmployeeCafes[0]?.start_date || null,
            };

            return employeeData;
        }

        return null;
    } catch (error) {
        throw error;
    }
};

const getEmployees = async (cafeId) => {
    const includeCondition = [
        {
            model: EmployeeCafe,
            as: "EmployeeCafes",
            attributes: ["start_date", "cafe_id"],
            include: [
                {
                    model: Cafe,
                    attributes: [["name", "cafe"]],
                },
            ],
            required: false, // This will include employees without a cafe
            where: {}, // Empty by default, will be conditionally added if cafeId is provided
        },
    ];

    // If cafeId is provided, filter employees in EmployeeCafe with cafe_id
    if (cafeId) {
        includeCondition[0].where.cafe_id = cafeId;
    } else {
        // If no cafeId, remove the where condition entirely to include all employees
        delete includeCondition[0].where;
    }

    const employees = await Employee.findAll({
        include: includeCondition,
        attributes: {
            include: [
                [
                    fn(
                        "DATEDIFF",
                        literal("NOW()"),
                        col("EmployeeCafes.start_date")
                    ),
                    "daysWorked",
                ],
            ],
        },
        order: [[literal("daysWorked"), "DESC"]],
    });

    return employees;
};


const createNewEmployee = async ({
    id,
    name,
    email_address,
    phone_number,
    gender,
    cafe,
    start_date,
}) => {
    if (!id || !name || !email_address || !phone_number || !gender) {
        const error = new Error("Missing required fields");
        error.status = 400;
        throw error;
    }

    if (cafe && !start_date) {
        const error = new Error("Indicated cafe but no start date");
        error.status = 400;
        throw error;
    }

    const idFormatRegex = /^UI[A-Z0-9]{7}$/;
    if (!idFormatRegex.test(id)) {
        const error = new Error(
            "Invalid employee ID format. It should be in the format UIXXXXXXX."
        );
        error.status = 400;
        throw error;
    }

    const phoneNumberRegex = /^[89]\d{7}$/;
    if (!phoneNumberRegex.test(phone_number)) {
        const error = new Error(
            "Invalid phone number format. It should start with 8 or 9 and be 8 digits long."
        );
        error.status = 400;
        throw error;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email_address)) {
        const error = new Error("Invalid email address format.");
        error.status = 400;
        throw error;
    }

    const nameRegex = /^[A-Za-z ]+$/;
    if (!nameRegex.test(name)) {
        const error = new Error(
            "Invalid name format. It should not contain symbols or numbers."
        );
        error.status = 400;
        throw error;
    }

    // Check if the provided employee ID already exists
    const existingEmployee = await Employee.findOne({ where: { id } });
    if (existingEmployee) {
        const error = new Error("Employee ID is already taken.");
        error.status = 409; // Conflict apparently put 409
        throw error;
    }

    // Check if the cafe exists if cafe is provided as query params
    let cafe_id = null;
    if (cafe) {
        const cafeData = await Cafe.findOne({ where: { name: cafe } });
        if (!cafeData) {
            const error = new Error("Invalid café name.");
            error.status = 404;
            throw error;
        }
        cafe_id = cafeData.id; // Now we are sure the cafe exists
    }

    const newEmployee = await Employee.create({
        id,
        name,
        email_address,
        phone_number,
        gender,
    });

    // Since cafe exists, create new record in EmployeeCafe join table
    if (cafe_id) {
        await EmployeeCafe.create({
            employee_id: newEmployee.id,
            cafe_id,
            start_date,
        });
    }

    return newEmployee;
};

const updateCurrentEmployee = async ({
    id,
    name,
    email_address,
    phone_number,
    gender,
    cafe,
    start_date,
}) => {
    if (name) {
        const nameRegex = /^[A-Za-z ]+$/;
        if (!nameRegex.test(name)) {
            throw new Error(
                "Invalid name format. It should not contain symbols or numbers."
            );
        }
    }

    if (email_address) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email_address)) {
            throw new Error("Invalid email address format.");
        }
    }

    if (phone_number) {
        const phoneNumberRegex = /^[89]\d{7}$/;
        if (!phoneNumberRegex.test(phone_number)) {
            throw new Error(
                "Invalid phone number format. It should start with 8 or 9 and be 8 digits long."
            );
        }
    }

    await Employee.update(
        {
            name,
            email_address,
            phone_number,
            gender,
        },
        {
            where: { id },
        }
    );

    const existingRelationship = await EmployeeCafe.findOne({
        where: { employee_id: id },
    });

    // If a cafe is provided, check if cafe name is valid
    if (cafe) {
        const cafeData = await Cafe.findOne({ where: { name: cafe } });
        if (!cafeData) {
            throw new Error("Invalid cafe name.");
        }

        // If the employee is switching to a different cafe, delete the old relationship
        if (
            existingRelationship &&
            existingRelationship.cafe_id !== cafeData.id
        ) {
            await EmployeeCafe.destroy({ where: { employee_id: id } });
        }

        // Create new relationship with the new cafe since no existing relationship
        if (
            !existingRelationship ||
            existingRelationship.cafe_id !== cafeData.id
        ) {
            await EmployeeCafe.create({
                employee_id: id,
                cafe_id: cafeData.id,
                start_date,
            });
        } else {
            // Update the start date if the cafe is the same
            await EmployeeCafe.update(
                { start_date },
                { where: { employee_id: id, cafe_id: cafeData.id } }
            );
        }
    } else {
        // If no cafe is provided, remove existing cafe relationships
        if (existingRelationship) {
            await EmployeeCafe.destroy({ where: { employee_id: id } });
        }
    }

    return { id, name, email_address, phone_number, gender };
};

const deleteEmployeeById = async (employeeId) => {
    const existingEmployee = await Employee.findByPk(employeeId);
    if (!existingEmployee) {
        const error = new Error("Employee not found with the provided ID.");
        error.status = 404;
        throw error;
    }

    await EmployeeCafe.destroy({
        where: {
            employee_id: employeeId,
        },
    });

    await Employee.destroy({
        where: {
            id: employeeId,
        },
    });

    return { message: "Employee and associated records deleted successfully." };
};

module.exports = {
    getEmployeeById,
    getEmployees,
    createNewEmployee,
    updateCurrentEmployee,
    deleteEmployeeById,
};
