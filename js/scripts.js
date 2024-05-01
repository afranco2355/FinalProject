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
        // Check the accessibility status of the marker
        var isAccessible = marker.dataset.accessibility === 'Y'; // 'Y' for accessible, 'N' for non-accessible
        
        // Determine if the marker should be visible based on filter criteria
        var isVisible = (accessibility === 'Accessible' && isAccessible) || (accessibility === 'Not Accessible' && !isAccessible);
        
        // Toggle marker visibility
        marker.style.display = isVisible ? 'block' : 'none';
    });
}