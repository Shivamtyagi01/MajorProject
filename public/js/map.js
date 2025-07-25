var map = L.map('map').setView([coordinates[1], coordinates[0]], 10);


const marker = L.marker([coordinates[1], coordinates[0]]).addTo(map)
        .bindPopup(`<h4>${loc}</h4><p>Exact location will be provided after booking</p>`);

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
