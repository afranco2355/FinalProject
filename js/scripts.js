mapboxgl.accessToken = 'pk.eyJ1IjoiYW1mMTAwOTIiLCJhIjoiY2x1cmRoODA1MDYyYTJ2bjV1djk2c3E4ZiJ9.l38L0twOrC6M5FnzpbZz2A';
const map = new mapboxgl.Map({
    style: "mapbox://styles/mapbox/dark-v11",
    container: 'map', // container ID
    center: [-73.95790, 40.71400], // starting position [lng, lat]
    zoom: 10,
});

// Add navigation control to the map and set position
map.addControl(new mapboxgl.NavigationControl(), 'top-right');

// Load subway station data
subwaystations.forEach(function(subwayRecord) {
    var color;

    // Determine marker color based on accessibility
    if (subwayRecord.Accesibility === 'Y') {
        color = '#25afef'; // Blue for accessible stations
    } else {
        color = '#d67ea6'; // Red for non-accessible stations
    }

    // Create circle marker element
    var el = document.createElement('div');
    el.className = 'circle-marker';
    el.style.backgroundColor = color;

    // Add circle marker to the map
    new mapboxgl.Marker(el)
    .setLngLat([parseFloat(subwayRecord['GTFS Longitude'].replace(',', '.')), parseFloat(subwayRecord['GTFS Latitude'].replace(',', '.'))])
    .setPopup(new mapboxgl.Popup().setHTML(`<h3>${subwayRecord['Stop Name']}</h3><p>Accessibility: ${subwayRecord['Accesibility']}</p>`))
    .addTo(map);
});

function toggleDescription() {
    var descriptionContainer = document.getElementById('description-container');
    descriptionContainer.classList.toggle('hidden');
}

// JavaScript to handle image gallery navigation
const images = document.querySelectorAll('.gallery-image');
let currentIndex = 0;

function showImage(index) {
    images.forEach(image => {
        image.classList.remove('current-image');
    });
    images[index].classList.add('current-image');
}

function nextImage() {
    currentIndex = (currentIndex + 1) % images.length;
    showImage(currentIndex);
}

function prevImage() {
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    showImage(currentIndex);
}