const express = require('express');
const router = express.Router();
const adminCtl = require('../controllers/admin.controller');
const { verifyToken, checkRole } = require('../middlewares/auth.middleware');

router.use(verifyToken, checkRole(['admin']));
router.get('/', adminCtl.dashboard);
router.get('/managers', adminCtl.listManagers);
router.get('/employees', adminCtl.listEmployees);
router.post('/add-user', adminCtl.addUser);
router.post('/edit-user/:id', adminCtl.editUser);
router.get('/delete-user/:id', adminCtl.deleteUser);


module.exports = router;
