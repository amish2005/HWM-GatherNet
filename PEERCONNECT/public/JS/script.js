

// Function to capture and send location to the server
function getLocationAndSend() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const lat = position.coords.latitude;
                const long = position.coords.longitude;
                console.log(lat);
                console.log(long);





                fetch('/api/location', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ latitude: lat, longitude: long }),
                })
                .then(response => response.json())
                .then(data => console.log('Location sent:', data))
                .catch(error => console.error('Error sending location:', error));






                // Send location data to server via fetch
                fetch('/auth/save-location', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json' 
                    },
                    body: JSON.stringify({ latitude: lat, longitude: long })
                })
                .then(response => response.json())
                .then(data => {
                    console.log('Location sent and saved:', data);
                })
                .catch((error) => {
                    console.error('Error:', error);
                });
            },
            (error) => {
                console.error('Geolocation error:', error);
            }
        );
    } else {
        console.log('Geolocation is not supported by this browser.');
    }
}

setInterval(getLocationAndSend, 300000);  // 300000ms = 5 minutes


window.onload = function() {
    getLocationAndSend();  
};



// // Example coordinates
// const latitude = 28.744002883914575;
// const longitude = 77.11763274475902;

// const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`;

// fetch(url)
//   .then(response => response.json())
//   .then(data => {
//     const locationName = data.display_name;
//     console.log('Location name:', locationName);
//   })
//   .catch(error => console.error('Error fetching location:', error));





