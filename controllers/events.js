const { request, response } = require('express');
const Event = require('../models/Event');

const getEvents = async(req = request, res = response) =>
{
    const events = await Event.find().populate('user', 'name');

    res.json({
        ok: true,
        events
    });
}
const createEvent = async(req = request, res = response) =>
{
    const event = new Event(req.body);

    try 
    {
        event.user = req.uid;

        const savedEvent = await event.save();

        res.status(201).json({
            ok: true,
            event: savedEvent
        });
    } 
    catch (error) 
    {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Internal server error'
        });
    }
}

const updateEvent = async(req = request, res = response) =>
{
    const eventId = req.params.id;
    const uid = req.uid;

    try 
    {
        const event = await Event.findById(eventId);

        if(!event)
        {
            return res.status(404).json({
                ok: false,
                msg: 'Event does not exists'
            });
        }

        if(event.user.toString() !== uid)
        {
            return res.status(401).json({
                ok: false,
                msg: 'Unauthorized'
            });
        }

        const newEvent = {
            ...req.body,
            user: uid
        }

        const updateEvent = await Event.findByIdAndUpdate(eventId, newEvent, {new: true});

        res.json({
            ok: true,
            event: updateEvent
        });
    } 
    catch (error)
    {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Internal server error'
        });
    }
}

const deleteEvent = async(req = request, res = response) =>
{
    const eventId = req.params.id;
    const uid = req.uid;

    try 
    {
        const event = await Event.findById(eventId);

        if(!event)
        {
            return res.status(404).json({
                ok: false,
                msg: 'Event does not exists'
            });
        }

        if(event.user.toString() !== uid)
        {
            return res.status(401).json({
                ok: false,
                msg: 'Unauthorized'
            });
        }

        await Event.findByIdAndDelete(eventId);

        res.json({
            ok: true
        });
    } 
    catch (error)
    {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Internal server error'
        });
    }
}

module.exports = {
    getEvents,
    createEvent,
    updateEvent,
    deleteEvent
}