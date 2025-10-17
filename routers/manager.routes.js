const express = require('express');
const router = express.Router();
const managerCtl = require('../controllers/manager.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

router.use(verifyToken, checkRole(['manager', 'admin']));

router.get('/', managerCtl.dashboard);

router.get('/employees', managerCtl.listEmployees);
router.post('/add-employee', managerCtl.addEmployee);
router.post('/edit-employee/:id', managerCtl.editEmployee);
router.get('/delete-employee/:id', managerCtl.deleteEmployee);

router.get('/tasks', managerCtl.listTasks);
router.get('/assign-task', managerCtl.assignTaskPage);
router.post('/assign-task', managerCtl.assignTask);

module.exports = router;
