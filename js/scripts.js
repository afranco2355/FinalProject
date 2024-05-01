// Initialize Mapbox map
mapboxgl.accessToken = 'pk.eyJ1IjoiYW1mMTAwOTIiLCJhIjoiY2x1cmRoODA1MDYyYTJ2bjV1djk2c3E4ZiJ9.l38L0twOrC6M5FnzpbZz2A';
const map = new mapboxgl.Map({
    style: "mapbox://styles/mapbox/dark-v11",
    container: 'map', // container ID
    center: [-73.95790, 40.71400], // starting position [lng, lat]
    zoom: 9.8,
});

// Add navigation control to the map and set position
map.addControl(new mapboxgl.NavigationControl(), 'top-right');

function toggleDescription() {
    var descriptionContent = document.getElementById('description-content');
    var button = document.querySelector('.button-3');

    // Toggle the visibility of the description content
    descriptionContent.classList.toggle('hidden');

    // Change the button text based on the current state of the description content
    if (descriptionContent.classList.contains('hidden')) {
        button.textContent = 'Take a Look';
    } else {
        button.textContent = 'Hide Description';
    }
}
// Previous image function
function prevImage() {
    var images = document.querySelectorAll('.gallery-image');
    var currentIndex = Array.from(images).findIndex(img => img.classList.contains('current-image'));
    var newIndex = (currentIndex - 1 + images.length) % images.length;
    images[currentIndex].classList.remove('current-image');
    images[newIndex].classList.add('current-image');
}

// Next image function
function nextImage() {
    var images = document.querySelectorAll('.gallery-image');
    var currentIndex = Array.from(images).findIndex(img => img.classList.contains('current-image'));
    var newIndex = (currentIndex + 1) % images.length;
    images[currentIndex].classList.remove('current-image');
    images[newIndex].classList.add('current-image');
}

// Load subway station data
subwaystations.forEach(function (subwayRecord) {
    var color;

    // Determine marker color based on accessibility
    if (subwayRecord.Accesibility === 'Y') {
        color = '#6391EB'; // Blue for accessible stations
    } else {
        color = '#ED7486'; // Red for non-accessible stations
    }

    // Create circle marker element
    var el = document.createElement('div');
    el.className = 'circle-marker';
    el.style.backgroundColor = color;

    // Add circle marker to the map
    new mapboxgl.Marker(el)
        .setLngLat([parseFloat(subwayRecord['GTFS Longitude'].replace(',', '.')), parseFloat(subwayRecord['GTFS Latitude'].replace(',', '.'))])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${subwayRecord['Stop Name']}</h3><p>Accessibility: ${subwayRecord.Accesibility === 'Y' ? 'Yes' : 'No'}</p>`))
        .addTo(map);
});

// Function to filter stations by accessibility
function filterByAccessibility(accessibility) {
    // Select all circle markers
    var markers = document.querySelectorAll('.circle-marker');
    
    // Iterate over each marker
    markers.forEach(function(marker) {
        // Get the marker's color
        var markerColor = marker.style.backgroundColor;
        
        // Determine if the marker should be visible based on filter criteria
        var isVisible = (accessibility === 'Accessible' && markerColor === 'rgb(99, 145, 235)') || 
                        (accessibility === 'Not Accessible' && markerColor === 'rgb(237, 116, 134)') || 
                        (accessibility === 'All');
        
        // Toggle marker visibility
        marker.style.display = isVisible ? 'block' : 'none';
    });
}

// After the map has been initialized
map.on('load', function() {
    // Display subway lines
    map.addLayer({
        id: 'subway-lines',
        type: 'line',
        source: {
            type: 'geojson',
            data: 'subway_lines.geojson' // Replace 'subway_lines.geojson' with the URL of your GeoJSON data
        },
        paint: {
            'line-color': '#E6922C', // Orange color
            'line-width': 2
        }
    });
});