mapboxgl.accessToken =
  "pk.eyJ1IjoibWFyaW81NTcyIiwiYSI6ImNsbjdxYm5qbzBsYXYycG8ycXliamU3b3kifQ.4j-2bFW0uRXWsk36ji7w_Q";

// Añadir controles de navegación (zoom y rotación)

let lightMap
let darkMap
let markerLat
let markerLng
let map
let marker



fetch("/mapstyles/lightMap.json")
  .then((response) => response.json()) // Parsear el JSON automáticamente
  .then((data) => {
    map = new mapboxgl.Map({
      container: "map",
      style: data,
      center: [-74.5, 40], // Coordenadas iniciales [longitud, latitud]
      zoom: 9, // Nivel de zoom inicial
    });
    lightMap = data;
    map.addControl(new mapboxgl.NavigationControl());
    // Uso la api de mapbox para crear un marker
    marker = new mapboxgl.Marker({
        draggable: false, // Hacer que el marcador sea draggable
    }).setLngLat([30.5, 50.5])
    .addTo(map);
    if(navigator.geolocation){
      navigator.geolocation.getCurrentPosition((position)=>{
        marker.setLngLat([position.coords.longitude, position.coords.latitude]).addTo(map)
        markerLat = position.coords.latitude
        markerLng = position.coords.longitude
        map.flyTo({
          center: [position.coords.longitude, position.coords.latitude],
          essential: true 
      });
      })
    }
    map.on("click", (e) => {
      console.log(marker)
      marker.setLngLat(e.lngLat);
      markerLat = e.lngLat.lat
      markerLng = e.lngLat.lng
      map.flyTo({
        center: e.lngLat,
        essential: true 
    });
    });
  })
  .catch((error) => console.error("Error:", error));
  // Función para actualizar las coordenadas en el DOM

fetch('/mapstyles/darkMap.json')
  .then(response => response.json())  // Parsear el JSON automáticamente
  .then(data => {
    darkMap = data;
  })
  .catch(error => console.error('Error:', error));

checkbox = document.querySelector('#toggle')
body = document.querySelector('body')
checkbox.addEventListener("change", () => {
  if (checkbox.checked) {
    body.classList.add("dark-mode");
    map.setStyle(darkMap)
    console.log("funcionooo")
  } else {
    body.classList.remove("dark-mode")
    map.setStyle(lightMap)
    console.log('NO JSON')
  }
});
  
