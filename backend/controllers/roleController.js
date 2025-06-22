const Role = require('../models/Role');

const createRole = async (req, res) => {
    try {
        const role = new Role({ ...req.body, createdBy: req.user.userId, createdBy: req.user.userId });
        await role.save();
        res.status(201).json({ success: true, message: 'Role created successfully', role });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error creating role', error: error.message });
    }
};

const getRoles = async (req, res) => {
    try {
        const roles = await Role.find()
            .populate('createdBy', 'firstName lastName email')
            .populate('updatedBy', 'firstName lastName email');
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting roles', error: error.message });
    }
};

const getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        res.status(200).json(role);
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error getting role', error: error.message });
    }
};

const updateRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: Date.now(), updatedBy: req.user.userId }, { new: true, runValidators: true });
        res.status(200).json({ success: true, message: 'Role updated successfully', role });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error updating role', error: error.message });
    }
};

const deleteRole = async (req, res) => {
    try {
        await Role.findByIdAndDelete(req.params.id);
        res.status(200).json({ success: true, message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting role', error: error.message });
    }
};

const deleteRoles = async (req, res) => {
    const { ids } = req.body;

    try {
        await Role.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ success: true, message: 'Roles deleted successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error deleting roles', error: error.message });
    }
};

module.exports = { createRole, getRoles, getRoleById, updateRole, deleteRole, deleteRoles };