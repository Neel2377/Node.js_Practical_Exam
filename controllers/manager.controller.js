const bcrypt = require('bcrypt');
const User = require('../models/user.model');
const Task = require('../models/task.model');



exports.dashboard = async (req, res) => {
  try {
    const managerId = req.user._id;

    const employees = await User.find({ role: 'employee', $or: [{ createdBy: req.user._id }, { createdBy: { $exists: false } }] }).lean();
    const employeeIds = employees.map((e) => e._id);

    const totalTasks = await Task.countDocuments({ assignedBy: managerId });
    const pendingTasks = await Task.countDocuments({
      assignedBy: managerId,
      status: "Pending",
    });
    const completedTasks = await Task.countDocuments({
      assignedBy: managerId,
      status: "Completed",
    });

    res.render("./pages/manager/dashboard", {
      user: req.user,
      employees,
      employeeCount: employees.length,
      totalTasks,
      pendingTasks,
      completedTasks,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);
    res.redirect("/manager");
  }
};


// 👥 Employee List (Team Page)
exports.listEmployees = async (req, res) => {
  try {
    const employees = await User.find({ role: 'employee', $or: [{ createdBy: req.user._id }, { createdBy: { $exists: false } }] }).lean();
    res.render('./pages/manager/employees', { user: req.user, employees });
  } catch (err) {
    console.error('Employee List Error:', err);
    res.redirect('/manager');
  }
};

// ➕ Add Employee
exports.addEmployee = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    await User.create({
      name,
      email,
      password,
      role: 'employee',
      createdBy: req.user._id
    });
    res.redirect('/manager/employees');
  } catch (err) {
    console.error('Add Employee Error:', err);
    res.redirect('/manager/employees');
  }
};

// ✏️ Edit Employee
exports.editEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email } = req.body;
    await User.findByIdAndUpdate(id, { name, email });

    res.redirect('/manager/employees');
  } catch (err) {
    console.error('Edit Employee Error:', err);
    res.redirect('/manager/employees');
  }
};

// ❌ Delete Employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);
    await Task.deleteMany({ assignedTo: id });
    res.redirect('/manager/employees');
  } catch (err) {
    console.error('Delete Employee Error:', err);
    res.redirect('/manager/employees');
  }
};

exports.assignTaskPage = async (req, res) => {
  try {
    // 🔹 Show both — employees created by this manager and manually added (no createdBy)
    const employees = await User.find({
      role: 'employee',
      $or: [
        { createdBy: req.user._id },
        { createdBy: { $exists: false } } // manually added employees
      ]
    }).lean();

    if (!employees || employees.length === 0) {
   
      return res.redirect('/manager/employees');
    }

    res.render('./pages/manager/assignTask', { user: req.user, employees });
  } catch (err) {
    console.error('Assign Task Page Error:', err);
    res.redirect('/manager/dashboard');
  }
};

exports.assignTask = async (req, res) => {
  try {
    const { title, description, priority, deadline, assignedTo } = req.body;
    await Task.create({
      title,
      description,
      priority,
      deadline,
      assignedBy: req.user._id,
      assignedTo,
    });
  
    res.redirect("/manager/tasks");
  } catch (err) {
    console.error(err);

    res.redirect("/manager/assignTask");
  }
};

exports.listTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedBy: req.user._id })
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name')
      .lean();

    res.render('./pages/manager/tasks', { user: req.user, tasks });
  } catch (err) {
    console.error('List Tasks Error:', err);
   
    res.redirect('/manager');
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    await Task.findByIdAndUpdate(id, { status });


    res.redirect('/manager/tasks');
  } catch (err) {
    console.error('Update Task Status Error:', err);
    res.redirect('/manager/tasks');
  }
};


exports.logoutUser = (req, res) => {
  res.clearCookie('token');

  res.redirect('/user/login');
};

