// Initialize Mapbox map
mapboxgl.accessToken = 'pk.eyJ1IjoiYW1mMTAwOTIiLCJhIjoiY2x1cmRoODA1MDYyYTJ2bjV1djk2c3E4ZiJ9.l38L0twOrC6M5FnzpbZz2A';
const map = new mapboxgl.Map({
    style: "mapbox://styles/amf10092/clw2adz260b2f01nued06aqol",
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
    images.forEach(img => img.classList.remove('current-image')); // Remove current-image class from all images
    images[newIndex].classList.add('current-image'); // Add current-image class to the new image

    // Show only the caption related to the current image
    var captions = document.querySelectorAll('.image-caption');
    captions.forEach(caption => caption.style.display = 'none'); // Hide all captions
    captions[newIndex].style.display = 'block'; // Show the caption related to the current image
}

// Next image function
function nextImage() {
    var images = document.querySelectorAll('.gallery-image');
    var currentIndex = Array.from(images).findIndex(img => img.classList.contains('current-image'));
    var newIndex = (currentIndex + 1) % images.length;
    images.forEach(img => img.classList.remove('current-image')); // Remove current-image class from all images
    images[newIndex].classList.add('current-image'); // Add current-image class to the new image

    // Show only the caption related to the current image
    var captions = document.querySelectorAll('.image-caption');
    captions.forEach(caption => caption.style.display = 'none'); // Hide all captions
    captions[newIndex].style.display = 'block'; // Show the caption related to the current image
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

// Load subway station data
subwaystations.forEach(function (subwayRecord) {
    // Create circle marker element
    var el = document.createElement('div');
    el.className = 'circle-marker';
    el.style.backgroundColor = 'white'; // Set initial color to white
    el.setAttribute('data-accessibility', subwayRecord.Accesibility); // Add accessibility data attribute

    // Add circle marker to the map
    new mapboxgl.Marker(el)
        .setLngLat([parseFloat(subwayRecord['GTFS Longitude'].replace(',', '.')), parseFloat(subwayRecord['GTFS Latitude'].replace(',', '.'))])
        .setPopup(new mapboxgl.Popup().setHTML(`<h3>${subwayRecord['Stop Name']}</h3><p>Lines: ${subwayRecord.Lines}</p><p>Accessibility: ${subwayRecord.Accesibility === 'Y' ? 'Yes' : 'No'}</p>`)) // Include the 'Lines' information in the popup
        .addTo(map);
});

function filterByAccessibility(accessibility, button) {
    // Remove 'active' class from all buttons
    var buttons = document.querySelectorAll('.accessibility-button');
    buttons.forEach(btn => btn.classList.remove('active'));

    // Add 'active' class to the clicked button
    button.classList.add('active');

    // Select all circle markers
    var markers = document.querySelectorAll('.circle-marker');

    // Iterate over each marker
    markers.forEach(function (marker) {
        // Get the marker's accessibility status
        var markerAccessibility = marker.getAttribute('data-accessibility');

        // Determine the color based on accessibility status
        var backgroundColor = 'rgba(255, 255, 255, 1)'; // Default background color is white
        if (accessibility === 'Accessible' && markerAccessibility === 'Y') {
            // Keep the color blue for accessible stations
            backgroundColor = '#6391EB';
        } else if (accessibility === 'Not Accessible' && markerAccessibility === 'N') {
            backgroundColor = '#ED7486'; // Red for non-accessible stations
        } else if (accessibility === 'Under Construction' && markerAccessibility === 'C') {
            backgroundColor = 'green'; // Green for stations under construction
        }

        // Set the marker's background color
        marker.style.backgroundColor = backgroundColor;
    });
}


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

    // Remove active class from all borough buttons
    var boroughButtons = document.querySelectorAll('.borough-button');
    boroughButtons.forEach(function (button) {
        button.classList.remove('active');
    });

    // Add active class to the clicked borough button
    var clickedButton = document.querySelector(`[data-borough="${borough.toLowerCase()}"]`);
    if (clickedButton) {
        clickedButton.classList.add('active');
    }

    // Define the bounding boxes for each borough
    var bboxManhattan = [[-74.02524, 40.69997], [-73.90990, 40.88001]];
    var bboxBronx = [[-73.93480, 40.78851], [-73.79405, 40.91919]];
    var bboxQueens = [[-73.962582, 40.541722], [-73.700272, 40.800548]];
    var bboxBrooklyn = [[-74.041878, 40.548224], [-73.833365, 40.739606]];
    var bboxStatenIsland = [[-74.26717, 40.49575], [-74.03944, 40.66776]];
    var bboxCityWide = [[-74.3, 40.45], [-73.6, 40.95]]; // City-wide bounding box

    // Check if the selected borough is Staten Island
    if (borough.toLowerCase() === 'si') {
        // Move the map to the bounding box for Staten Island
        map.fitBounds(bboxStatenIsland, { padding: 50 });
    } else {
        // Move the map to the bounding box based on the selected borough
        switch (borough.toLowerCase()) {
            case 'all':
                // Move the map to the city-wide bounding box
                map.fitBounds(bboxCityWide, { padding: 50 });
                break;
            case 'manhattan':
                map.fitBounds(bboxManhattan, { padding: 50 });
                break;
            case 'bx':
                map.fitBounds(bboxBronx, { padding: 50 });
                break;
            case 'q':
                map.fitBounds(bboxQueens, { padding: 50 });
                break;
            case 'bk':
                map.fitBounds(bboxBrooklyn, { padding: 50 });
                break;
            default:
                break;
        }
    }

    // Toggle the visibility of the borough boundaries layer
    if (borough.toLowerCase() === 'all') {
        map.setLayoutProperty('borough-boundaries-fill', 'visibility', 'none');
    } else {
        map.setLayoutProperty('borough-boundaries-fill', 'visibility', 'visible');
    }
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

// Load GeoJSON data
map.on('load', function () {
    map.addSource('boroughs', {
        type: 'geojson',
        data: 'data/borough_boundaries.geojson'
    });

    // Add borough layer
    map.addLayer({
        id: 'boroughs-layer',
        type: 'fill',
        source: 'boroughs',
        paint: {
            'fill-opacity': 0.1,
            'fill-color': 'blue'
        }
    });

    // Add borough border line layer
map.addLayer({
    id: 'boroughs-border-layer',
    type: 'line',
    source: 'boroughs',
    paint: {
        'line-opacity': 0.7,
        'line-color': 'black', // Color of the border lines
        'line-width': 1 // Width of the border lines
    }
});

    // Assuming markers is an array of marker objects with latlng properties
    markers.forEach(function (marker) {
        // Check if marker is within any borough boundary
        var borough = null;
        map.queryRenderedFeatures([marker.latlng], { layers: ['boroughs-layer'] })
            .forEach(function (feature) {
                // Assuming each feature has a property 'borough' representing its name or ID
                borough = feature.properties.borough;
            });

        // Assign borough data to marker
        marker.borough = borough;
    });
});

// End of code
