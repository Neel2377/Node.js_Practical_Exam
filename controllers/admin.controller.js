const User = require("../models/user.model");
const bcrypt = require("bcrypt");

exports.dashboard = async (req, res) => {
  try {
    const managerCount = await User.countDocuments({ role: "manager" });
    const employeeCount = await User.countDocuments({ role: "employee" });

    res.render("./pages/admin/dashboard", {
      user: req.user,
      managerCount,
      employeeCount,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.redirect("/admin");
  }
};

exports.listManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: "manager" });
    res.render("./pages/admin/managers", {
      user: req.user,
      managers,
    });
  } catch (err) {
    console.error("Manager List Error:", err);
    res.redirect("/admin");
  }
};

exports.listEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: "employee" });
    res.render("./pages/admin/employees", {
      user: req.user,
      employees,
    });
  } catch (err) {
    console.error("Employee List Error:", err);
    res.redirect("/admin");
  }
};

exports.addUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    await User.create({ name, email, password, role });

    if (role === "manager") return res.redirect("/admin/managers");
    return res.redirect("/admin/employees");
  } catch (err) {
    console.error("Add User Error:", err);
    res.redirect("/admin");
  }
};

exports.editUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;
    await User.findByIdAndUpdate(id, { name, email, role });

    if (role === "manager") return res.redirect("/admin/managers");
    return res.redirect("/admin/employees");
  } catch (err) {
    console.error("Edit User Error:", err);
    res.redirect("/admin");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      req.flash("error_msg", "User not found");
      return res.redirect("/admin");
    }

    await User.findByIdAndDelete(id);

    if (user.role === "manager") return res.redirect("/admin/managers");
    return res.redirect("/admin/employees");
  } catch (err) {
    console.error("Delete User Error:", err);
    res.redirect("/admin");
  }
};
