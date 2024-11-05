const Role = require('../models/Role');
const User = require('../models/User');

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
        if (!role) {
            return res.status(404).send('Role not found');
        }
        res.status(200).json(role);
    } catch (error) {
        res.status(500).send(error);
    }
};

const updateRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!role) {
            return res.status(404).send('Role not found');
        }
        res.status(200).json({ message: 'Role updated succesfully', role });
    } catch (error) {
        res.status(400).send(error);
    }
};

const deleteRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) {
            return res.status(404).send('Role not found');
        }
        res.status(200).json('Role deleted successfully');
    } catch (error) {
        res.status(500).send(error);
    }
};

const deleteRoles = async (req, res) => {
    const { ids } = req.body;

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ message: 'Invalid or empty ids array' });
    }

    try {
        const roles = await Role.find({ _id: { $in: ids } });

        if (roles.length !== ids.length) {
            return res.status(404).json({ message: 'One or more role not found' });
        }

        await Role.deleteMany({ _id: { $in: ids } });

        res.status(200).json({ message: 'Role deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { createRole, getRoles, getRoleById, updateRole, deleteRole, deleteRoles };