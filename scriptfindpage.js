const form = document.querySelector('form');
const jobListings = document.querySelector('#job-listings');

// dummy data for default job listings
const defaultJobs = [
  {
    title: 'UI Designer',
    company: 'XYZ Inc.',
    location: 'Los Angeles, CA',
    description: 'We are looking for a skilled UI designer to join our team...',
    latitude: 34.0522,
    longitude: -118.2437
  },
  {
    title: 'Marketing Manager',
    company: 'ABC Corp.',
    location: 'New York, NY',
    description: 'We are seeking an experienced marketing manager to join our team...',
    latitude: 40.7128,
    longitude: -74.0060
  },
  {
    title: 'Sales Representative',
    company: 'Acme Corp',
    location: 'Chicago, IL',
    description: 'We are seeking a talented sales representative to join our team...',
    latitude: 41.8781,
    longitude: -87.6298
  },
];

// display default job listings on page load
defaultJobs.forEach(function(job) {
  const jobListing = document.createElement('div');
  jobListing.classList.add('job-listing');
  
  const title = document.createElement('h2');
  title.textContent = job.title;
  jobListing.appendChild(title);
  
  const company = document.createElement('p');
  company.textContent = job.company;
  jobListing.appendChild(company);
  
  const location = document.createElement('p');
  location.classList.add('location');
  location.textContent = job.location;
  jobListing.appendChild(location);
  
  const description = document.createElement('p');
  description.textContent = job.description;
  jobListing.appendChild(description);
  
  jobListings.appendChild(jobListing);
});

// fetch user location on page load
// Check if geolocation is supported
if ("geolocation" in navigator) {
    // If it is, try to get the user's location
    navigator.geolocation.getCurrentPosition(successCallback, errorCallback);
  } else {
    // If geolocation is not supported, display an error message
    console.log("Geolocation is not supported on this device");
  }
  
  // Callback function for successful geolocation
  function successCallback(position) {
    // Code to execute when location is successfully obtained
  }
  
  // Callback function for failed geolocation
  function errorCallback(error) {
    // Code to execute when location is not obtained
    switch(error.code) {
      case error.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        console.log("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred.");
        break;
    }
  }
  
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
        
        // update distance for each job listing
        defaultJobs.forEach(function(job) {
          const distance = getDistance(latitude, longitude, job.latitude, job.longitude);
          job.distance = distance;
        });
        
        // sort jobs by distance from user's location
        defaultJobs.sort(function(a, b) {
          return a.distance - b.distance;
        });
        
        // display job listings in order of near to far
        jobListings.innerHTML = '';
        defaultJobs.forEach(function(job) {
          const jobListing = document.createElement('div');
          jobListing.classList.add('job-listing');
          
          const title = document.createElement('h2');
          title.textContent = job.title;
          jobListing.appendChild(title);
          
          const company = document.createElement('p');
          company.textContent = job.company;
          jobListing.appendChild(company);
          
          const location = document.createElement('p');
          location.classList.add('location');
          location.textContent = `${job.location} (${job.distance.toFixed(2)} km away)`;
          jobListing.appendChild(location);
          
          const description = document.createElement('p');
          description.textContent = job.description;
          jobListing.appendChild(description);
          
          jobListings.appendChild(jobListing);
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
    
