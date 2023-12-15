mapboxgl.accessToken = Token;
const map = new mapboxgl.Map({
  container: "map", // container ID
  style: "mapbox://styles/mapbox/satellite-streets-v12", // style URL
  center: point.geometry.coordinates, // starting position [lng, lat]
  zoom: 5, // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());
const popup = new mapboxgl.Popup({
  closeButton: false,
  closeOnClick: false,
});

new mapboxgl.Marker()
  .setLngLat(point.geometry.coordinates)
  .setPopup(popup.setHTML(`<h3>${point.title}</h3><p>${point.location}</p>`))
  .addTo(map);

// Event handler for hovering over the marker
map.on("hover", "marker", function () {
  map.getCanvas().style.cursor = "pointer";
  popup.addTo(map);
});

map.on("load", function () {
    // Starting zoom level
    const startZoom = map.getZoom();
  
    // Target zoom level (adjust as needed)
    const targetZoom = 10;
  
    // Duration of the animation in milliseconds
    const animationDuration = 2000;
  
    // Perform the zoom animation
    map.easeTo({
      zoom: targetZoom,
      duration: animationDuration,
      easing: function (t) {
        return t;
      },
    });
  });

// Event handler for leaving the marker
map.on("mouseleave", "marker", function () {
  map.getCanvas().style.cursor = "";
  popup.remove();
});
