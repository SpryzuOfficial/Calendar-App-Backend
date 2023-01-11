const { Router } = require('express');
const { check } = require('express-validator');
const router = Router(); 

const { fieldValidator } = require('../middlewares/field-validator');
const { createUser, loginUser, renewToken } = require('../controllers/auth');
const { validateJWT } = require('../middlewares/validate-JWT');

router.post('/new', 
    [
        check('name', 'Name is required').not().isEmpty(),
        check('email', 'Email is required').isEmail(),
        check('password', 'Password must be 6 characters').isLength({min: 6}),
        fieldValidator
    ], createUser);

router.post('/', 
    [
        check('email', 'Email is required').isEmail(),
        check('password', 'Password must be 6 characters').isLength({min: 6}),
        fieldValidator
    ], loginUser);

router.get('/renew', validateJWT, renewToken);

module.exports = router;