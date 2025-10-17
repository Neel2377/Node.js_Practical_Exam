const Task = require("../models/task.model");
const User = require("../models/user.model");

exports.dashboard = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id }).populate(
      "assignedBy",
      "name email"
    );
    res.render("./pages/employee/dashboard", { user: req.user, tasks });
  } catch (err) {
    console.error(err);
    res.redirect("/employee");
  }
};

exports.myTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id }).populate(
      "assignedBy",
      "name"
    );
    res.render("pages/employee/tasks", { user: req.user, tasks });
  } catch (err) {
    console.log(err);

    res.redirect("/employee");
  }
};

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
