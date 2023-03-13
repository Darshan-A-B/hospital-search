const form = document.querySelector('form');
const hospitalListings = document.querySelector('#hospital-listings');

// dummy data for default hospital listings
const defaulthospitals = [
  {
    hospitalName: 'Davanagere hospital demo',
    specialization: 'EYE',
    location: 'Davanagere, karnataka',
    description: 'Cheap and best treatment',
    latitude: 14.4558702,
    longitude: 75.9089417
  },
  {
    hospitalName: 'Manipal hospital HAL ROAD',
    specialization: 'General multi-speciality',
    location: 'Bangalore, karnataka',
    description: 'Cheap and best treatment',
    latitude: 12.9593257,
    longitude: 77.6569182
  },
];

// display default hospital listings on page load
defaulthospitals.forEach(function(hospital) {
  const hospitalListing = document.createElement('div');
  hospitalListing.classList.add('hospital-listing');
  
  const hospitalName = document.createElement('h2');
  hospitalName.textContent = hospital.hospitalName;
  hospitalListing.appendChild(hospitalName);
  
  const specialization = document.createElement('p');
  specialization.textContent = hospital.specialization;
  hospitalListing.appendChild(specialization);
  
  const location = document.createElement('p');
  location.classList.add('location');
  location.textContent = hospital.location;
  hospitalListing.appendChild(location);
  
  const description = document.createElement('p');
  description.textContent = hospital.description;
  hospitalListing.appendChild(description);
  
  hospitalListings.appendChild(hospitalListing);
});

if (navigator.permissions) {
    navigator.permissions.query({name:'geolocation'}).then(function(result) {
      if (result.state === 'granted') {
        // Location service is enabled
      } else if (result.state === 'prompt') {
        // Location service permission is not yet granted, prompt the user to enable it
        if (confirm("Please enable location services for this website.")) {
          window.location.href = "settings://location"; // Redirect to location settings in mobile
          
        }
      } else if (result.state === 'denied') {
        // Location service permission is denied, prompt the user to enable it
        if (confirm("Please enable location services for this website.")) {
          window.location.href = "settings://location"; // Redirect to location settings in mobile
          
        }
      }
    });
  } else {
    // Permissions API is not supported by this browser
  }
  

// fetch user location on page load
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(function(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const locationInput = document.querySelector('#location');
    
    // reverse geocode the coordinates to get the user's city and state
    fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`)
      .then(response => response.json())
      .then(data => {
        const city = data.address.city || data.address.town;
        const state = data.address.state;
        locationInput.value = `${city}, ${state}`;
        
        // update distance for each hospital listing
        defaulthospitals.forEach(function(hospital) {
          const distance = getDistance(latitude, longitude, hospital.latitude, hospital.longitude);
          hospital.distance = distance;
        });
        
        // sort hospitals by distance from user's location
        defaulthospitals.sort(function(a, b) {
          return a.distance - b.distance;
        });
        
        // display hospital listings in order of near to far
        hospitalListings.innerHTML = '';
        defaulthospitals.forEach(function(hospital) {
          const hospitalListing = document.createElement('div');
          hospitalListing.classList.add('hospital-listing');
          
          const hospitalName = document.createElement('h2');
          hospitalName.textContent = hospital.hospitalName;
          hospitalListing.appendChild(hospitalName);
          
          const specialization = document.createElement('p');
          specialization.textContent = hospital.specialization;
          hospitalListing.appendChild(specialization);
          
          const location = document.createElement('p');
          location.classList.add('location');
          location.textContent = `${hospital.location} (${hospital.distance.toFixed(2)} km away)`;
          hospitalListing.appendChild(location);
          
          const description = document.createElement('p');
          description.textContent = hospital.description;
          hospitalListing.appendChild(description);
          
          hospitalListings.appendChild(hospitalListing);
        });
      })
      .catch(error => console.log(error));
});
}

// function to calculate distance between two coordinates using Haversine formula
function getDistance(lat1, lon1, lat2, lon2) {
const R = 6371; // radius of the earth in kilometers
const dLat = toRadians(lat2 - lat1);
const dLon = toRadians(lon2 - lon1);
const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2);
const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
const distance = R * c;
return distance;
}

// helper function to convert degrees to radians
function toRadians(degrees) {
return degrees * (Math.PI/180);
}
    
