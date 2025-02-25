const Role = require('../models/Role');

const createRole = async (req, res) => {
    try {
        const role = new Role(req.body);
        await role.save();
        res.status(201).json({ message: 'Role created successfully', role });
    } catch (error) {
        res.status(400).send(error);
    }
};

const getRoles = async (req, res) => {
    try {
        const roles = await Role.find();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).send(error);
    }
};

const getRoleById = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        res.status(200).json(role);
    } catch (error) {
        res.status(500).send(error);
    }
};

const updateRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.status(200).json({ message: 'Role updated successfully', role });
    } catch (error) {
        res.status(400).send(error);
    }
};

const deleteRole = async (req, res) => {
    try {
        await Role.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).send(error);
    }
};

const deleteRoles = async (req, res) => {
    const { ids } = req.body;

    try {
        await Role.deleteMany({ _id: { $in: ids } });
        res.status(200).json({ message: 'Roles deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createRole, getRoles, getRoleById, updateRole, deleteRole, deleteRoles };