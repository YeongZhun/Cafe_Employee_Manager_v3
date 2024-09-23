const sequelize = require("../config/dbConnection");
const Employee = require("../models/Employee");
const Cafe = require("../models/Cafe");
const EmployeeCafe = require("../models/EmployeeCafe");
require("dotenv").config();

async function seedDatabase() {
    try {
        // Disable foreign key checks
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

        // Sync all models (create tables if they don't exist)
        await sequelize.sync({ force: true });

        // Insert Cafes
        const cafes = await Cafe.bulkCreate([
            {
                name: "Man Or Bear Cafe",
                description:
                    "Choose between man or bear in this cafe in the woods",
                location: "Central",
                logo: "https://res.cloudinary.com/dv0cc527o/image/upload/v1694281014/Bear.jpg",
            },
            {
                name: "Kopitiam Central",
                description: "Popular coffeehouse in Orchard Road",
                location: "Central",
                logo: "https://res.cloudinary.com/dv0cc527o/image/upload/v1726456313/cafe_employee_app/kopitiam.jpg",
            },
            {
                name: "Hawker Hub",
                description: "A vibrant spot for local delicacies",
                location: "West",
                logo: "https://res.cloudinary.com/dv0cc527o/image/upload/v1726456313/cafe_employee_app/hawkerhub.jpg",
            },
            {
                name: "The Coffee Bean & Tea Leaf",
                description: "A favorite for coffee and tea lovers",
                location: "East",
                logo: "https://res.cloudinary.com/dv0cc527o/image/upload/v1726456386/cafe_employee_app/coffeebeannobg.jpg",
            },
            {
                name: "Cafe 13",
                description: "Modern cafe with a variety of drinks",
                location: "North",
                logo: "https://res.cloudinary.com/dv0cc527o/image/upload/v1726456313/cafe_employee_app/cafe13.jpg",
            },
            {
                name: "Urban Grind",
                description: "Trendy cafe in the heart of the south city",
                location: "South",
                logo: "https://res.cloudinary.com/dv0cc527o/image/upload/v1726456313/cafe_employee_app/urbangrind.webp",
            },
            {
                name: "The Java House",
                description:
                    "A modern café offering a variety of java-based drinks",
                location: "East",
                logo: "https://res.cloudinary.com/dv0cc527o/image/upload/v1726457704/cafe_employee_app/thejavahouse.png",
            },
            {
                name: "Cafe Bliss",
                description: "Relaxing café with a serene atmosphere",
                location: "West",
                logo: "https://res.cloudinary.com/dv0cc527o/image/upload/v1726457706/cafe_employee_app/cafebliss.png",
            },
        ]);

        // Insert Employees
        const employees = await Employee.bulkCreate([
            {
                id: "UI8765433",
                name: "Goh Wei Ming",
                email_address: "gohweiming@beanthere.com",
                phone_number: "91234571",
                gender: "Male",
            },
            {
                id: "UI7654322",
                name: "Tan Mei Yi",
                email_address: "tanmeiyi@thejavahouse.com",
                phone_number: "82345681",
                gender: "Female",
            },
            {
                id: "UI6543211",
                name: "Lee Siew Hong",
                email_address: "leesiewhong@cafebliss.com",
                phone_number: "81129877",
                gender: "Male",
            },
            {
                id: "UI5432108",
                name: "Chong Kai Wei",
                email_address: "chongkaiwei@espressos.com",
                phone_number: "81234568",
                gender: "Others",
            },
            {
                id: "UI4321097",
                name: "Ng Li Ping",
                email_address: "ngliping@mokamagic.com",
                phone_number: "91239877",
                gender: "Female",
            },
            {
                id: "UI3210986",
                name: "Zhang Zheng",
                email_address: "zhangzheng@beanthere.com",
                phone_number: "82346780",
                gender: "Male",
            },
            {
                id: "UI2109875",
                name: "Lim Su Hua",
                email_address: "limsuhua@thejavahouse.com",
                phone_number: "91120001",
                gender: "Female",
            },
            {
                id: "UI1098764",
                name: "Ong Rui Qi",
                email_address: "ongruiqi@cafebliss.com",
                phone_number: "81239877",
                gender: "Others",
            },
            {
                id: "UI0987653",
                name: "Tan Li Xian",
                email_address: "tanlixian@espressos.com",
                phone_number: "91234570",
                gender: "Female",
            },
            {
                id: "UI9876400",
                name: "Ng Xiao Ming",
                email_address: "ngxiaoming@mokamagic.com",
                phone_number: "82345682",
                gender: "Male",
            },
            {
                id: "UI9876543",
                name: "Lee Wei Ling",
                email_address: "leeweiling@kopitiam.com",
                phone_number: "91234567",
                gender: "Female",
            },
            {
                id: "UI8765432",
                name: "Tan Cheng Huat",
                email_address: "tanchenghuat@hawkerhub.com",
                phone_number: "82345678",
                gender: "Male",
            },
            {
                id: "UI7654321",
                name: "Ng Xiu Ying",
                email_address: "ngxiu.ying@gmail.com",
                phone_number: "91119876",
                gender: "Others",
            },
            {
                id: "UI6543210",
                name: "Koh Seng Hock",
                email_address: "kohsenghock@gmail.com",
                phone_number: "81234567",
                gender: "Male",
            },
            {
                id: "UI5432109",
                name: "Chong Mei Ling",
                email_address: "chongmeiling@urban.com",
                phone_number: "91239876",
                gender: "Female",
            },
            {
                id: "UI4321098",
                name: "Ng Wei Jie",
                email_address: "ngweijie@cafe13.com",
                phone_number: "82346789",
                gender: "Male",
            },
            {
                id: "UI3210987",
                name: "Zhang Li Hua",
                email_address: "zhanglihua@coffeebean.com",
                phone_number: "81129876",
                gender: "Female",
            },
            {
                id: "UI2109876",
                name: "Tan Xian Yu",
                email_address: "tanxianyu@urban.com",
                phone_number: "81239876",
                gender: "Others",
            },
            {
                id: "UI1098765",
                name: "Lim Li Hong",
                email_address: "limlihong@cafe13.com",
                phone_number: "91234568",
                gender: "Female",
            },
            {
                id: "UI0987654",
                name: "Ong Wei Lun",
                email_address: "ongweilun@coffeebean.com",
                phone_number: "82345679",
                gender: "Male",
            },
            {
                id: "UI9876500",
                name: "Tan Lian Hock",
                email_address: "tanlianhock@kopitiam.com",
                phone_number: "91234569",
                gender: "Male",
            },
            {
                id: "UI8765400",
                name: "Ng Su Lin",
                email_address: "ngsulin@hawkerhub.com",
                phone_number: "82345680",
                gender: "Female",
            },
            {
                id: "UI7654300",
                name: "Lim Chee Hwa",
                email_address: "limcheehwa@urban.com",
                phone_number: "91120000",
                gender: "Others",
            },
            {
                id: "UI6543100",
                name: "Zhou Mei Ling",
                email_address: "zhoumeiling@cafe13.com",
                phone_number: "81230000",
                gender: "Female",
            },
            {
                id: "UI5432000",
                name: "Chua Hock Heng",
                email_address: "chuahockheng@coffeebean.com",
                phone_number: "91230001",
                gender: "Male",
            },
            {
                id: "UI4320000",
                name: "Tan Shi Hui",
                email_address: "tanshihui@urban.com",
                phone_number: "82340001",
                gender: "Others",
            },
            {
                id: "UI3210000",
                name: "Lim Zi Wei",
                email_address: "limziweib@cafe13.com",
                phone_number: "81120001",
                gender: "Female",
            },
            {
                id: "UI2100000",
                name: "Goh Xiao Rong",
                email_address: "gohxiaorong@kopitiam.com",
                phone_number: "91230002",
                gender: "Female",
            },
        ]);

        // Insert Employee-Cafe Relationships
        await EmployeeCafe.bulkCreate([
            {
                employee_id: "UI9876543",
                cafe_id: cafes[0].id,
                start_date: "2022-05-01",
            },
            {
                employee_id: "UI8765432",
                cafe_id: cafes[1].id,
                start_date: "2023-01-15",
            },
            {
                employee_id: "UI7654321",
                cafe_id: cafes[0].id,
                start_date: "2022-01-15",
            },
            {
                employee_id: "UI6543210",
                cafe_id: cafes[0].id,
                start_date: "2021-01-15",
            },
            {
                employee_id: "UI5432109",
                cafe_id: cafes[5].id,
                start_date: "2023-03-01",
            },
            {
                employee_id: "UI5432109",
                cafe_id: cafes[1].id,
                start_date: "2023-05-01",
            },
            {
                employee_id: "UI4321098",
                cafe_id: cafes[3].id,
                start_date: "2022-07-01",
            },
            {
                employee_id: "UI3210987",
                cafe_id: cafes[2].id,
                start_date: "2022-06-15",
            },
            {
                employee_id: "UI2109876",
                cafe_id: cafes[5].id,
                start_date: "2023-02-15",
            },
            {
                employee_id: "UI1098765",
                cafe_id: cafes[3].id,
                start_date: "2023-04-01",
            },
            {
                employee_id: "UI0987654",
                cafe_id: cafes[7].id,
                start_date: "2023-06-01",
            },
            {
                employee_id: "UI9876500",
                cafe_id: cafes[0].id,
                start_date: "2023-07-01",
            },
            {
                employee_id: "UI8765400",
                cafe_id: cafes[1].id,
                start_date: "2023-08-01",
            },
            {
                employee_id: "UI7654300",
                cafe_id: cafes[7].id,
                start_date: "2023-09-01",
            },
            {
                employee_id: "UI6543100",
                cafe_id: cafes[6].id,
                start_date: "2023-10-01",
            },
            {
                employee_id: "UI5432000",
                cafe_id: cafes[2].id,
                start_date: "2023-11-01",
            },
            {
                employee_id: "UI4320000",
                cafe_id: cafes[4].id,
                start_date: "2023-12-01",
            },
            {
                employee_id: "UI3210000",
                cafe_id: cafes[1].id,
                start_date: "2024-01-01",
            },
            {
                employee_id: "UI2100000",
                cafe_id: cafes[0].id,
                start_date: "2024-02-01",
            },
            {
                employee_id: "UI8765433",
                cafe_id: cafes[0].id,
                start_date: "2023-07-01",
            },
            {
                employee_id: "UI7654322",
                cafe_id: cafes[1].id,
                start_date: "2023-08-01",
            },
            {
                employee_id: "UI6543211",
                cafe_id: cafes[6].id,
                start_date: "2023-09-01",
            },
            {
                employee_id: "UI5432108",
                cafe_id: cafes[3].id,
                start_date: "2023-10-01",
            },
            {
                employee_id: "UI4321097",
                cafe_id: cafes[4].id,
                start_date: "2023-11-01",
            },
            {
                employee_id: "UI3210986",
                cafe_id: cafes[0].id,
                start_date: "2023-12-01",
            },
            {
                employee_id: "UI2109875",
                cafe_id: cafes[1].id,
                start_date: "2024-01-01",
            },
            {
                employee_id: "UI1098764",
                cafe_id: cafes[2].id,
                start_date: "2024-02-01",
            },
            {
                employee_id: "UI0987653",
                cafe_id: cafes[3].id,
                start_date: "2024-03-01",
            },
            {
                employee_id: "UI9876400",
                cafe_id: cafes[4].id,
                start_date: "2024-04-01",
            },
        ]);

        // Re-enable foreign key checks
        await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

        console.log("Database seeded successfully!");
    } catch (error) {
        console.error("Error seeding database:", error);
    } finally {
        await sequelize.close();
    }
}

seedDatabase();
