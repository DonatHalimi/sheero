const validate = (schema) => async (req, res, next) => {
    try {
        const dataToValidate = {
            ...req.body,
            ...req.params,
            ...req.query,
            ...(req.file && { image: req.file }) || {},
        };

        if (req.fileValidationError) {
            return res.status(400).json({
                errors: [
                    { field: 'image', message: req.fileValidationError },
                ],
            });
        }

        await schema.validate(dataToValidate, {
            abortEarly: false,
            context: { user: req.user },
        });

        next();
    } catch (error) {
        if (error.name === 'ValidationError') {
            return res.status(400).json({
                errors: error.inner.map((err) => ({
                    field: err.path,
                    message: err.message,
                })),
            });
        }
        next(error);
    }
};

module.exports = validate;