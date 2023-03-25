const form = document.querySelector('form');
const hospitalListings = document.querySelector('#hospital-listings');
// dummy data for default hospital listings
const defaulthospitals = [
   {
    "hospitalid": 1,
    "hospitalimage": "images/hospitalimages/aastha.jpg",
    "hospitalName": "Demo",
    "Speciality": "General",
    "location": "Biet, davanagere, Karnataka - 577004",
    "latitude": 14.4558702,
    "longitude": 75.9089417,
    "city": "Davanagere",
   },
   
  ];
  const cityInput = document.querySelector('#city');
  const specialtyInput = document.querySelector('#specialty');
  
  function filterHospitals() {
    const selectedCity = cityInput.value;
    const selectedSpecialty = specialtyInput.value;
       
    // filter hospitals based on selected city and specialty
    const filteredHospitals = defaulthospitals.filter(function(hospital) {
      return hospital.city === selectedCity && 
             (selectedSpecialty === '' || hospital.Speciality === selectedSpecialty);
    });
    
    // display filtered hospital listings
    hospitalListings.innerHTML = '';
    filteredHospitals.forEach(function(hospital) {
      const hospitalListing = document.createElement('div');
      hospitalListing.classList.add('hospital-listing');
    
      const hospitalName = document.createElement('h2');
      hospitalName.textContent = hospital.hospitalName;
      hospitalListing.appendChild(hospitalName);
    
      const Speciality = document.createElement('p');
      Speciality.textContent = "Speciality: " + hospital.Speciality;
      hospitalListing.appendChild(Speciality);
    
      const location = document.createElement('p');
      location.classList.add('location');
      location.textContent = "Address: " + hospital.location;
      hospitalListing.appendChild(location);
    
      hospitalListings.appendChild(hospitalListing);
    });
  }
  
  cityInput.addEventListener('change', filterHospitals);
  specialtyInput.addEventListener('change', filterHospitals);
  
  
const successCallback = (position) => {
   console.log(position);
 };
 const errorCallback = (error) => {
   console.log(error);
 };
 const options = {
   enableHighAccuracy: true,
   timeout: 10000,
 };
 navigator.geolocation.getCurrentPosition(
   successCallback,
   errorCallback,
   options
 );
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
               hospitalName.textContent = `${hospital.hospitalName}(${'\xa0'}${hospital.distance.toFixed(2)} km away)`;
               hospitalListing.appendChild(hospitalName);

               const Speciality = document.createElement('p');
               Speciality.textContent = "Speciality: " + hospital.Speciality;
               hospitalListing.appendChild(Speciality);
            
               const location = document.createElement('p');
               location.classList.add('location');
               location.textContent = "Address: " + hospital.location;
               hospitalListing.appendChild(location);

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
   const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
   const distance = R * c;
   return distance;
}

// helper function to convert degrees to radians
function toRadians(degrees) {
   return degrees * (Math.PI / 180);
}
