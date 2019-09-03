export const displayMap = locations => {
  mapboxgl.accessToken =
    "pk.eyJ1IjoidGhlbXVkYXNzYXIiLCJhIjoiY2p6czI1azZmMHl0ajNqcGZhMmVvMXhjeCJ9.o4TNQp13B4U7nA0NE-LlBg";

  var map = new mapboxgl.Map({
    container: "map",
    style: "mapbox://styles/themudassar/cjzs2mirg1v7a1cl5b3tw3g1o",
    scrollZoom: false
    // center: [74.29352279999999, 31.5273998],
    // zoom: 18
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    // create the marker
    const el = document.createElement("div");
    el.className = "marker";

    // add the marke to the map

    new mapboxgl.Marker({
      element: el,
      anchor: "bottom"
    })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({
      offset: 30
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 200,
      left: 100,
      right: 100
    }
  });
};
