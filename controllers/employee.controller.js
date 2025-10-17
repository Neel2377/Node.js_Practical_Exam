const Task = require('../models/task.model');
const User = require('../models/user.model');

// 🏠 Employee Dashboard
exports.dashboard = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate("assignedBy", "name email");
    res.render("./pages/employee/dashboard", { user: req.user, tasks });
  } catch (err) {
    console.error(err);
    res.redirect("/employee");
  }
};


// 📋 View My Tasks
exports.myTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id })
      .populate('assignedBy', 'name');
    res.render('pages/employee/tasks', { user: req.user, tasks });
  } catch (err) {
    console.log(err);

    res.redirect('/employee');
  }
};

// ✅ Update Task Status
exports.updateTaskStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  await Task.findByIdAndUpdate(id, { status });
  res.redirect("/employee/my-tasks");
};

exports.addComment = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  await Task.findByIdAndUpdate(id, {
    $push: { comments: { user: req.user._id, text: comment } },
  });

  res.redirect("/employee/my-tasks");
};


// GET Profile
exports.profilePage = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).lean();
    if (!user) {
  
      return res.redirect('/employee');
    }
    res.render('./pages/employee/profile', { user });
  } catch (err) {
    console.error(err);

    res.redirect('/employee');
  }
};

// POST Update Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, age, address, mobile, gender, bloodGroup } = req.body;
    await User.findByIdAndUpdate(req.params.id, { name, email, age, address, mobile, gender, bloodGroup });

    res.redirect(`/employee/profile/${req.params.id}`);
  } catch (err) {
    console.error(err);
    res.redirect(`/employee/profile/${req.params.id}`);
  }
};
