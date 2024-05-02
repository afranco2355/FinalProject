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
subwaystations.forEach(function(subwayRecord) {
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
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${subwayRecord['Stop Name']}</h3><p>Lines: ${subwayRecord.Lines}</p><p>Accessibility: ${subwayRecord.Accesibility === 'Y' ? 'Yes' : 'No'}</p>`)) // Include the 'Lines' information in the popup
        .addTo(map);
});

document.addEventListener('DOMContentLoaded', function() {
    // Apply smaller marker style to all markers on page load
    var markers = document.querySelectorAll('.circle-marker');
    markers.forEach(function(marker) {
        marker.classList.add('smaller-marker');
    });
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

                // Toggle class for smaller markers when all stations are displaying
                if (accessibility === 'All') {
                    marker.classList.add('smaller-marker');
                } else {
                    marker.classList.remove('smaller-marker');
                }
    });
}

// Remove or comment out this code block
/*

map.on('load', function() {
    // Load NTA GeoJSON data
    map.addSource('nta', {
        type: 'geojson',
        data: 'nta.geojson' // Replace with the URL to your NTA GeoJSON data
    });

    // Add a new fill layer to represent NTA boundaries
    map.addLayer({
        id: 'nta-fill',
        type: 'fill',
        source: 'nta',
        paint: {
            'fill-color': '#F2F0F0', // Fill color for NTAs
            'fill-opacity': 0.1 // Opacity of the fill color
        }
    });

    // Add a new line layer to represent NTA boundaries
    map.addLayer({
        id: 'nta-line',
        type: 'line',
        source: 'nta',
        paint: {
            'line-color': '#fff', // Border color for NTAs
            'line-width': 0.5 // Width of the border
        }
    });
});

*/

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
            'line-color': '#FCFC05',
            'line-width': 2
        }
    });
});

function filterByBorough(borough) {
    var markers = document.querySelectorAll('.circle-marker');
    markers.forEach(function(marker) {
        var stationName = marker.getAttribute('data-station');
        var stationData = subwaystations.find(function(station) {
            return station['Stop Name'] === stationName;
        });

        if (borough.toLowerCase() === 'all') {
            marker.style.display = 'block';
        } else {
            if (stationData && stationData.Borough.toLowerCase() === borough.toLowerCase()) {
                marker.style.display = 'block';
            } else {
                marker.style.display = 'none';
            }
        }
    });
}


function checkElevatorEscalatorStatus() {
    window.open("https://new.mta.info/elevator-escalator-status", "_blank");
}

map.on('load', function() {
    // Get the map style object
    var style = map.getStyle();

    // Loop through all layers
    style.layers.forEach(function(layer) {
        // Check if the layer type is 'symbol' and it has a 'text-field' property
        if (layer.type === 'symbol' && layer.layout['text-field']) {
            // Set the text-opacity property to 0
            map.setPaintProperty(layer.id, 'text-opacity', 0);
        }
    });
});