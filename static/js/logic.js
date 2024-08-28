// Create the map object with a center and zoom level
var map = L.map('map').setView([37.09, -95.71], 3); 

// Add a tile layer (the background map image) to the map
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// Function to determine the size of the marker based on magnitude
function markerSize(magnitude) {
    return magnitude * 5; 
}

// Function to determine the color of the marker based on depth
function markerColor(depth) {
    if (depth > 90) return "red";
    if (depth > 70) return "darkorange";
    if (depth > 50) return "orange";
    if (depth > 30) return "gold";
    if (depth > 10) return "yellow";
    return "lime";
}

// Fetch the earthquake data from the USGS
d3.json('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson').then(function(data) {
    // Loop through the earthquake data and create one marker for each earthquake
    data.features.forEach(function(feature) {
        var coordinates = feature.geometry.coordinates;
        var properties = feature.properties;

        // Create a circle marker and bind a popup with additional info
        L.circleMarker([coordinates[1], coordinates[0]], {
            radius: markerSize(properties.mag),
            fillColor: markerColor(coordinates[2]),  
            color: "#000",
            weight: 1,
            opacity: 1,
            fillOpacity: 0.8
        }).bindPopup(
            `<h3>${properties.place}</h3><hr><p>${new Date(properties.time)}</p><p>Magnitude: ${properties.mag}</p><p>Depth: ${coordinates[2]} km</p>`
        ).addTo(map);
    });
});

// Add a legend to the map
var legend = L.control({position: 'bottomright'});

legend.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'info legend'),
        depths = [-10, 10, 30, 50, 70, 90],
        labels = [];

    div.innerHTML += "<h4>Depth (km)</h4>"

    // Loop through the depth intervals to generate a label with a colored square for each interval
    for (var i = 0; i < depths.length; i++) {
        div.innerHTML +=
            '<i style="background:' + markerColor(depths[i] + 1) + '"></i> ' +
            depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);