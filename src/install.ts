import { Connector } from "./modules/connector";
import { UserModel, RoleModel, UniversityModel, DepartmentModel } from "./resolved-models";
import universities from "./install/university-list.json";
import slugify from "slugify";
import departments from "./install/university-departments.json";
import { University } from "./models/university";

require("dotenv/config");

const connector = new Connector();
connector.connect(async () => {
  await initRoles();
  await initUniversities();
  await initDepartments();

  await connector.disconnect();
  process.exit(0);
});

async function initRoles() {
  await RoleModel.deleteMany({});
  UserModel.ensureIndexes();

  const userRole = new RoleModel({
    name: "user",
    permissions: ["posts.create", "posts.view","users.view","communitites.view","companies.view","projects.view"],
    icon: "user",
    color: "#5C469C",
    default: true,
    guests: false,
    created_at: new Date(),
    updated_at: new Date(),
    description: "User role",
    type: "default",
    internal: 1,
  });

  const adminRole = new RoleModel({
    name: "admin",
    permissions: ["admin"],
    icon: "user",
    color: "#5C469C",
    default: false,
    guests: false,
    created_at: new Date(),
    updated_at: new Date(),
    description: "Admin role",
    type: "default",
    internal: 1,
  });

  await Promise.all([userRole.save(), adminRole.save()]);
}

async function initUniversities() {
  await UniversityModel.deleteMany({});
  const universitiesList = universities.map((university) => {
    const universityModel = new UniversityModel({
      name: university.name,
      slug: slugify(university.name, {
        lower: true,
      }),
      createdAt: new Date(),
      updatedAt: new Date(),
      description: "",
      type: "default",
      domains: university.domains,
      website: university.web_pages[0],
      city: "",
      address: "",
      tags: [],
      links: university.domains.map((domain) => `https://${domain}`),
    });
    return universityModel;
  });
  await Promise.all(
    universitiesList.map((university) => {
      return university.save();
    })
  );
  
}

async function initDepartments() {
  await DepartmentModel.deleteMany({});
  const departmentsList = departments.map((department) => {
    const departmentModel = new DepartmentModel({
      name: department.name,
      code: department.short_code,
    });
    return departmentModel;
  }
  );
  await Promise.all(
    departmentsList.map((department) => {
      return department.save();
    })
  );
}
