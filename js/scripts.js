// Initialize Mapbox map
mapboxgl.accessToken = 'pk.eyJ1IjoiYW1mMTAwOTIiLCJhIjoiY2x1cmRoODA1MDYyYTJ2bjV1djk2c3E4ZiJ9.l38L0twOrC6M5FnzpbZz2A';
const map = new mapboxgl.Map({
    style: "mapbox://styles/mapbox/light-v11",
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
    } else if (subwayRecord.Accesibility === 'C') {
        color = 'green'; // Custom color for stations with condition 'C'
    } else {
        color = '#ED7486'; // Red for non-accessible stations
    }

    // Create circle marker element
    var el = document.createElement('div');
    el.className = 'circle-marker';
    el.style.backgroundColor = color;
    el.setAttribute('borough-station', subwayRecord['data-borough'])

    // Add circle marker to the map
    new mapboxgl.Marker(el)
        .setLngLat([parseFloat(subwayRecord['GTFS Longitude'].replace(',', '.')), parseFloat(subwayRecord['GTFS Latitude'].replace(',', '.'))])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${subwayRecord['Stop Name']}</h3><p>Lines: ${subwayRecord.Lines}</p><p>Accessibility: ${subwayRecord.Accesibility === 'Y' ? 'Yes' : 'No'}</p>`)) // Include the 'Lines' information in the popup
        .addTo(map);
});

document.addEventListener('DOMContentLoaded', function () {
    // Apply smaller marker style to all markers on page load
    var markers = document.querySelectorAll('.circle-marker');
    markers.forEach(function (marker) {
        marker.classList.add('smaller-marker');
    });
});

map.on('load', function () {
    // Add the borough boundaries GeoJSON as a source
    map.addSource('borough-boundaries', {
        type: 'geojson',
        data: 'Borough_Boundaries.geojson'
    });

    // Add a fill layer to represent borough boundaries
    map.addLayer({
        id: 'borough-boundaries-fill',
        type: 'fill',
        source: 'borough-boundaries',
        paint: {
            'fill-color': 'rgba(40, 40, 40, 0.4)',
            'fill-outline-color': 'rgba(0, 0, 0, 1)'
        }
    });
});


function filterByAccessibility(accessibility) {
    // Select all circle markers
    var markers = document.querySelectorAll('.circle-marker');

    // Iterate over each marker
    markers.forEach(function (marker) {
        // Get the marker's color
        var markerColor = marker.style.backgroundColor;

        // Determine if the marker should be visible based on filter criteria
        var isVisible = (accessibility === 'Accessible' && markerColor === 'rgb(99, 145, 235)') ||
            (accessibility === 'Not Accessible' && markerColor === 'rgb(237, 116, 134)') ||
            (accessibility === 'All') ||
            (accessibility === 'Under Construction' && markerColor === 'green'); // Green color for stations under construction

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

function filterByBorough(borough) {
    console.log('Clicked borough:', borough); // Log the clicked borough
    var markers = document.querySelectorAll('.circle-marker');
    markers.forEach(function (marker) {
        console.log('Marker:', marker); // Log each marker
        var stationBorough = marker.getAttribute('data-borough');
        console.log('Borough:', stationBorough); // Log the station's borough
        if (borough !== null && typeof borough !== 'undefined') {
            if (borough.toLowerCase() === 'all') {
                marker.style.display = 'block'; // Show all markers if "All" is selected
            } else {
                // Check if the station's borough matches the selected borough
                if (stationBorough !== null && typeof stationBorough !== 'undefined') {
                    if (stationBorough.toLowerCase() === borough.toLowerCase()) {
                        marker.style.display = 'block'; // Show the marker if it belongs to the selected borough
                    } else {
                        marker.style.display = 'none'; // Hide the marker if it does not belong to the selected borough
                    }
                }
            }
        }
    });
}

function checkElevatorEscalatorStatus() {
    window.open("https://new.mta.info/elevator-escalator-status", "_blank");
}

map.on('load', function () {
    // Get the map style object
    var style = map.getStyle();

    // Loop through all layers
    style.layers.forEach(function (layer) {
        // Check if the layer type is 'symbol' and it has a 'text-field' property
        if (layer.type === 'symbol' && layer.layout['text-field']) {
            // Set the text-opacity property to 0
            map.setPaintProperty(layer.id, 'text-opacity', 0);
        }
    });
});

// wait for the initial mapbox style to load before loading our own data
map.on('style.load', () => {
    // fitbounds to NYC
    map.fitBounds([
        [-74.270056, 40.494061],
        [-73.663062, 40.957187]
    ])

    // add geojson sources for subway routes and stops
    map.addSource('nyc-subway-routes', {
        type: 'geojson',
        data: 'data/nyc-subway-routes.geojson'
    });

    // add layers by iterating over the styles in the array defined in subway-layer-styles.js
    subwayLayerStyles.forEach((style) => {
        map.addLayer(style)
    })
})