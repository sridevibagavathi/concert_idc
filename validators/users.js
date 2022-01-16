import Joi from 'joi';

const createValidator = (obj) => {
    const registerParams = {
        firstName: Joi.string().pattern(new RegExp('^[a-zA-Z ]+$')).required(),
        lastName: Joi.string().pattern(new RegExp('^[a-zA-Z ]+$')).required(),
        mobileNumber: Joi.string().min(5).pattern(/^[0-9]+$/).required(),
        emailId: Joi.string().email().required(),
        city: Joi.string().required(),
        password: Joi.string().required(),
    }
    const result = schemaValidation(registerParams, obj)
    if (result.hasOwnProperty('error')) {
        return { success: false, error: result.error.details[0].message.split(':')[0].replace(/\"/g, '') }
    } else {
        return { success: true }
    }
}

const updateValidator = (obj) => {
    const registerParams = {
        firstName: Joi.string().pattern(new RegExp('^[a-zA-Z ]+$')).optional(),
        lastName: Joi.string().pattern(new RegExp('^[a-zA-Z ]+$')).optional(),
        mobileNumber: Joi.string().min(5).pattern(/^[0-9]+$/).optional(),
        emailId: Joi.string().email().optional(),
        city: Joi.string().optional(),
    }
    const result = schemaValidation(registerParams, obj)
    if (result.hasOwnProperty('error')) {
        return { success: false, error: result.error.details[0].message.split(':')[0].replace(/\"/g, '') }
    } else {
        return { success: true }
    }
}

const schemaValidation = (apiParams, joiObj) => {
    const schema = Joi.object(apiParams)
    const result = schema.validate(joiObj);
    return result;
}

export  {
    createValidator,
    updateValidator
}