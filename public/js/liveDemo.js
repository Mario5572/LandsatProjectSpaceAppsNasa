
let map 
let lightMap
let marker
mapboxgl.accessToken =
  "pk.eyJ1IjoibWFyaW81NTcyIiwiYSI6ImNsbjdxYm5qbzBsYXYycG8ycXliamU3b3kifQ.4j-2bFW0uRXWsk36ji7w_Q";

fetch("/mapstyles/lightMap.json")
  .then((response) => response.json()) // Parsear el JSON automáticamente
  .then((data) => {
    map = new mapboxgl.Map({
      container: "map",
      style: data,
      center: [-74.5, 40], // Coordenadas iniciales [longitud, latitud]
      zoom: 4, // Nivel de zoom inicial
    });
    lightMap = data;
    map.addControl(new mapboxgl.NavigationControl());
    // Uso la api de mapbox para crear un marker
    marker = new mapboxgl.Marker({
        draggable: false, // Hacer que el marcador sea draggable
    }).setLngLat([-74.5, 40]).addTo(map)
    map.on("click", (e) => {
        console.log(marker)
        marker.setLngLat(e.lngLat);
        map.flyTo({
          center: e.lngLat,
          essential: true 
      });
      });
})

document.getElementById('buttonLocator').onclick = async (e) => {
    const coords = await fetch('/demo')
    const cJson = await coords.json()
    
    marker.setLngLat([cJson.longitude, cJson.latitude])
    map.flyTo({
        center:[cJson.longitude, cJson.latitude],
        essential:true
    })
}