const User = require("../models/User");
const Event = require("../models/Event");
const Sport = require("../models/Sport");

// Function to calculate distance between two coordinates using Haversine formula
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; 
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

exports.getHomePage = async (req, res) => {
  if (req.session.user) {
    try {
      const userLatitude = req.query.latitude; 
      const userLongitude = req.query.longitude; 

      console.log(userLatitude);

      
      const userId = req.session.user._id; 
      if (!userId) {
        return res.redirect("/login"); 
      }

      
      const user = await User.findById(userId);

      if (!user || !user.location.coordinates) {
        return res.status(404).send("User or location not found.");
      }

     

      let [longitude, latitude] = user.location.coordinates;

      

      if (longitude === 0 && latitude === 0) {
        longitude = 77.06012;
        latitude = 28.72019;
        console.log(longitude);
        console.log(latitude);

        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        // Find events within 3 km, sorted by likes
        const events = await Event.find({
          coordinates: {
            $geoWithin: {
              $centerSphere: [[longitude, latitude], 3 / 6378.1], // 3 km radius
            },
          },
        })
          .sort({ likes: -1 })
          .limit(3);
        // console.log(events);
        

        const sports = await Sport.find({
          coordinates: {
            $geoWithin: {
              $centerSphere: [[longitude, latitude], 3 / 6378.1], // 3 km radius
            },
          },
        })
          .sort({ likes: -1 })
          .limit(3);
        // console.log(sports);

        
        const response = await fetch(url);
       
        const locationData = await response.json();
        // console.log(response);
        // console.log(locationData);

        // Get the display_name (human-readable address)
        const locationName = locationData.display_name;
        const shortAddress = locationName
          .split(",")
          .slice(0, 2)
          .join(", ")
          .trim();

        // console.log(locationName);
        // console.log(shortAddress);

        
        res.render("home", {
          locationName,
          shortAddress,
          user: req.session.user,
          featuredEvents: events,
          featuredSports: sports,
        });
      } else {
        // Find events within 3 km, sorted by likes
        const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;
        const events = await Event.find({
          coordinates: {
            $geoWithin: {
              $centerSphere: [[longitude, latitude], 3 / 6378.1], // 3 km radius
            },
          },
        })
          .sort({ likes: -1 })
          .limit(3);
        // console.log(events);

        const sports = await Sport.find({
          coordinates: {
            $geoWithin: {
              $centerSphere: [[longitude, latitude], 3 / 6378.1], // 3 km radius
            },
          },
        })
          .sort({ likes: -1 })
          .limit(3);
        // console.log(sports);

       
        const response = await fetch(url);
        // console.log(response);
        const locationData = await response.json();
        // console.log(response);
        // console.log(locationData);

        
        const locationName = locationData.display_name;
        const shortAddress = locationName
          .split(",")
          .slice(0, 2)
          .join(", ")
          .trim();

        // console.log(locationName);
        // console.log(shortAddress);

        
        res.render("home", {
          locationName,
          shortAddress,
          user: req.session.user,
          featuredEvents: events,
          featuredSports: sports,
        });
      }
    } catch (error) {
      console.error("Error fetching location:", error);
      res.status(500).send("Server Error");
    }
  } else {
    res.render("home", { user: req.session.user });
  }
};
