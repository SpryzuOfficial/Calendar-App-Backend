const { Router } = require('express');
const { check } = require('express-validator');

const { isDate } = require('../helpers/isDate');
const { validateJWT } = require('../middlewares/validate-JWT');
const { fieldValidator } = require('../middlewares/field-validator');
const { getEvents, deleteEvent, updateEvent, createEvent } = require('../controllers/events');

const router = Router();

router.use(validateJWT);

router.get('/', getEvents);

router.post('/', 
    [
        check('title', 'Title is required').not().isEmpty(),
        check('start', 'Start date is required').custom(isDate),
        check('end', 'End date is required').custom(isDate),
        fieldValidator
    ], createEvent);

router.put('/:id',
    [
        check('title', 'Title is required').not().isEmpty(),
        check('start', 'Start date is required').custom(isDate),
        check('end', 'End date is required').custom(isDate),
        fieldValidator
    ], updateEvent);

router.delete('/:id', deleteEvent);

module.exports = router;