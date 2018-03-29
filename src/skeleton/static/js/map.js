function initialize(){

    var worldMap = L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
        attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
        // id: 'mapbox.streets',
        // id: 'mapbox.mapbox-streets-v7',
        // id: 'mapbox.mapbox-traffic-v1',
        // id: 'mapbox.terrain-rgb',
        // id: 'mapbox.mapbox-terrain-v2',
        id: 'mapbox.satellite',
        accessToken: 'pk.eyJ1IjoiYnVpdHJvbiIsImEiOiJjamVscGdqMGMxbDM4MndtZWkyNzlya3k3In0.pKbQxM0ARbeBunYG4UBZ-Q',
        maxZoom: 16
    });


    var layers = {
        GREAT_LOC: new L.LayerGroup(),
        GOOD_LOC: new L.LayerGroup(),
        OK_LOC: new L.LayerGroup()
    };

    var map = L.map('map', {
        center: [0,10],
        zoom: 2,
        layers: [
        layers.GREAT_LOC,
        layers.GOOD_LOC,
        layers.OK_LOC
        ]
    });

    worldMap.addTo(map);

    var overlays = {
        "Best Rated Appellation Locations": layers.GREAT_LOC,
        "Greatly Rated Appellation Locations": layers.GOOD_LOC,
        "Moderately Rated Appellation Locations": layers.OK_LOC
    };

    L.control.layers(null, overlays, {collapsed: false}).addTo(map);

    var info = L.control({
        position: "topright"
    });

    info.onAdd = function(){
        var div = L.DomUtil.create("div", "legend");
        return div
    };

    info.addTo(map);

    var icons = {
        GREAT_LOC: L.ExtraMarkers.icon({
            icon: "ion-wineglass",
            iconColor: "white",
            markerColor: "yellow",
            shape: "star",
            iconSize: [38,46],
            iconAnchor: [14,45],
            shadowSize: [35, 16],
            shadowAnchor: [5, 15]
        }),
        GOOD_LOC: L.ExtraMarkers.icon({
            icon: "ion-wineglass",
            iconColor: "white",
            markerColor: "blue-dark",
            shape: "circle",
            iconSize: [38,46],
            iconAnchor: [14,45],
            shadowSize: [35, 16],
            shadowAnchor: [5, 15]
        }),
        OK_LOC: L.ExtraMarkers.icon({
            icon: "ion-wineglass",
            iconColor: "white",
            markerColor: "red",
            shape: "penta",
            iconSize: [38,46],
            iconAnchor: [14,45],
            shadowSize: [35, 16],
            shadowAnchor: [5, 15]
        })
    };


    d3.json('./sb_grape_2016.json', (d) => {

        var rated;

        d.forEach((element) => {

            try {

                if (element.rating < 85){
                    rated = 'OK_LOC';
                } else if (element.rating < 90){
                    rated = 'GOOD_LOC';
                } else {
                    rated = 'GREAT_LOC';
                }

                var newMarker = L.marker([element.lat, element.lon], {
                    icon: icons[rated],
                    riseOnHover: true
                });

                newMarker.addTo(layers[rated]);

                newMarker.on('click', (selected) => {
                    updateLegend(selected.latlng['lat'], selected.latlng['lng'], element.appell_region, element.appell_country, element.title, element.price, element.rating, element.pH, element.Carbon, element.Water_at_WiltingPoint);
                })

                updateLegend("0", "0", "earth", "world", "", "", "", "", "", "");
            }
            catch {
                console.log("nope");
            }
        });
    });
}

function updateLegend(lat, lon, region, country, wine, price, rating, ph, carbon, wwp){
    document.querySelector('.legend').innerHTML =
        "<strong>Geo-Coordinates:</strong> " + lat + ", " + lon + "<br>" +
        "<strong>Region, Country:</strong> " + region + ", " + country + "<br>" +
        "<strong>Wine Produced:</strong> " + wine + "<br>" +
        "<strong>Price:</strong> $" + price + "<br>" +
        "<strong>Wine Enthusiast Rating:</strong> " + rating + "<br></hr>" +
        "<strong>Soil pH Levels:</strong> " + ph + "<br>" +
        "<strong>Soil Carbon Levels:</strong> " + carbon + "<br>" +
        "<strong>Soil Water Wilting Point Content:</strong> " + wwp + "%"
        ;
}