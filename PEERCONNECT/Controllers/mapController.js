const User = require('../models/User');
const Event = require('../models/Event');
const mongoose = require('mongoose');
const Sport = require('../models/Sport');

// imp functions
function extractCoordinatesFromLink(googleMapsLink) {
    const regex = /@(-?\d+\.\d+),(-?\d+\.\d+)/;
    const match = googleMapsLink.match(regex);

    if (match) {
        const latitude = parseFloat(match[1]);
        const longitude = parseFloat(match[2]);
        return { latitude, longitude };
    } else {
        throw new Error('Invalid Google Maps link');
    }
}






//export routes

exports.getEvents = async (req, res) => { 
    if(req.session.user){
    // Get user ID from session
    const userId = req.session.user._id;   // Make sure user is logged in
    if (!userId) {
        return res.redirect('/login');  // Redirect to login if no user is logged in
    }

    // Find the user in MongoDB by their ID
    const user = await User.findById(userId);

    if (!user || !user.location.coordinates) {
        return res.status(404).send('User or location not found.');
    }

    // Extract latitude and longitude from the user's location
    const [longitude, latitude] = user.location.coordinates;

    // Nominatim Reverse Geocoding API
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    // Fetch the location name from Nominatim
    const response = await fetch(url);
    const locationData = await response.json();
    
    // Get the display_name (human-readable address)
    const locationName = locationData.display_name;
    const shortAddress = locationName.split(',').slice(0, 2).join(', ').trim();
    // console.log(locationName);
    
    
        res.render('addEvent', {User: req.session.user, shortAddress});
    } else {
        res.redirect('/auth/login');
    }
    
};






exports.getSports = async (req, res) => { 
    if(req.session.user){
    // Get user ID from session
    const userId = req.session.user._id;   // Make sure user is logged in
    if (!userId) {
        return res.redirect('/login');  // Redirect to login if no user is logged in
    }

    // Find the user in MongoDB by their ID
    const user = await User.findById(userId);

    if (!user || !user.location.coordinates) {
        return res.status(404).send('User or location not found.');
    }

    // Extract latitude and longitude from the user's location
    const [longitude, latitude] = user.location.coordinates;

    // Nominatim Reverse Geocoding API
    const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

    // Fetch the location name from Nominatim
    const response = await fetch(url);
    const locationData = await response.json();
    
    // Get the display_name (human-readable address)
    const locationName = locationData.display_name;
    const shortAddress = locationName.split(',').slice(0, 2).join(', ').trim();
    // console.log(locationName);
    
    
        res.render('addSport', {User: req.session.user, shortAddress});
    } else {
        res.redirect('/auth/login');
    }
    
};







exports.createEvent = async (req, res) => {
    if(req.session.user){
        try {
            const { eventName, eventStartDate, eventEndDate, location, eventDetails, locationName } = req.body;
    
            // console.log(req.body);
            // Extract latitude and longitude from the Google Maps link
            const { latitude, longitude } = extractCoordinatesFromLink(location);
            console.log(latitude);
            console.log(longitude);
    
            // Retrieve the file paths
            const thumbnailPath = req.files['eventThumbnail'][0].path; // Path for the thumbnail
        const additionalImagePaths = req.files['additionalImages'] ? req.files['additionalImages'].map(file => file.path) : [];
        const userId = req.session.user._id;
        // console.log(thumbnailPath);
        // console.log(additionalImagePaths);
        // console.log(req.files);
    
            // Create new event with the extracted coordinates
            const newEvent = new Event({
                eventName,
                eventStartDate,
                eventEndDate,
                location,
                locationName,
                coordinates: {
                    type: "Point",
                    coordinates: [longitude, latitude] // Note: longitude comes first in GeoJSON format
                },
                eventDetails,
                eventThumbnail: thumbnailPath,
          additionalImages: additionalImagePaths,
                userId: userId,
            });
            await newEvent.save();
            // res.status(201).json({ message: 'Event created successfully', event: newEvent });
            res.redirect('/');
        } catch (error) {
            console.error('Error creating event:', error);
        res.status(500).send('Failed to create event');
        }
    }
    
    
};










exports.createSport = async (req, res) => {
    if(req.session.user){
        try {
            const { sportName, sportStartDate, sportEndDate, location, sportDetails, locationName, teamSize } = req.body;
    
            // console.log(req.body);
            // Extract latitude and longitude from the Google Maps link
            const { latitude, longitude } = extractCoordinatesFromLink(location);
            console.log(latitude);
            console.log(longitude);
    
            // Retrieve the file paths
            const thumbnailPath = req.files['sportThumbnail'][0].path; // Path for the thumbnail
        const additionalImagePaths = req.files['additionalImages'] ? req.files['additionalImages'].map(file => file.path) : [];
        const userId = req.session.user._id;
        // console.log(thumbnailPath);
        // console.log(additionalImagePaths);
        // console.log(req.files);
    
            // Create new event with the extracted coordinates
            const newSport = new Sport({
                sportName,
                sportStartDate,
                sportEndDate,
                location,
                locationName,
                teamSize,
                coordinates: {
                    type: "Point",
                    coordinates: [longitude, latitude] // Note: longitude comes first in GeoJSON format
                },
                sportDetails,
                sportThumbnail: thumbnailPath,
          additionalImages: additionalImagePaths,
                userId: userId,
            });
            await newSport.save();
            // res.status(201).json({ message: 'Sport created successfully', sport: newSport });
            res.redirect('/');
        } catch (error) {
            console.error('Error creating sport:', error);
        res.status(500).send('Failed to create event');
        }
    }
    
    
};



