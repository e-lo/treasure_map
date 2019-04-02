
// Create map instance
var myMap = L.map("map", {
  center: [44.955686969721086, -93.08216903817745],
  zoom: 14,
  maxZoom: 30,
  minZoom: 10,
  detectRetina: true // detect whether the sceen is high resolution or not.
});

// Add a base map.
L.tileLayer("http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png").addTo(myMap);

// Define Layer Groups
var bikeLayer = new L.LayerGroup();
var walkLayer = new L.LayerGroup();
var driveLayer = new L.LayerGroup();

var networkLayers = {
    "Bike": bikeLayer,
    "Walk": walkLayer,
    "Drive": driveLayer
};

L.control.layers(networkLayers).addTo(myMap);


/*******
 NODES
*******/

var myNodes = L.geoJson.ajax("assets/node.geojson",{
  pointToLayer: function (feature, LatLng) {

    var icons  = {
      "node": new L.divIcon({className: "node-marker"}),
      "walk": new L.divIcon({className: "walk-marker"}),
      "bike": new L.divIcon({className: "bike-marker"}),
      "drive": new L.divIcon({className: "drive-marker"})
    };

    var icon = icons.node;

    if (feature.properties.id.includes("bike")){
      icon = icons.bike;
    } else if (feature.properties.id.includes("walk")){
      icon = icons.walk;
    } else if (feature.properties.id.includes("drive")){
      icon = icons.drive;
    }
    return new L.marker(LatLng, {icon: icon});
  },
  onEachFeature: function (feature, layer) {
    //console.log("osmid: "+feature.properties.osmNodeId),
    if (feature.properties.id.includes("bike")){
      bikeLayer.addLayer(layer);
    } else if (feature.properties.id.includes("walk")){
      walkLayer.addLayer(layer);
    } else if (feature.properties.id.includes("drive")){
      driveLayer.addLayer(layer);
    }

    layer.bindPopup("OSM: "+String(feature.properties.osmNodeId)),
    layer.on({
        mouseover: highlightNode,
        click: zoomToNode,
        mouseout: resetNodeHighlight
    });
  }
});

function zoomToNode(e) {
  myMap.panTo(e.target.getLatLng());
}

function highlightNode(e) {
  var node = e.target;
  //$(".node-info").html('<b>NODE: ' + node.feature.properties.id + '</b>');
  $(".node-info").html(geojsonProperties(node));
}

function resetNodeHighlight(e) {
  $(".node-info").html("");
}
/*******
 Arcs
*******/
var myArcs = L.geoJson.ajax("assets/shape.geojson",{

  onEachFeature: function (feature, layer) {
    //console.log('osmid: '+feature.properties.osmNodeId),
    if (feature.properties.id.includes("bike")){
      bikeLayer.addLayer(layer);
      layer.setStyle({
        className: 'bike-arc'
      });
    } else if (feature.properties.id.includes("walk")){
      walkLayer.addLayer(layer);
      layer.setStyle({
        className: 'walk-arc'
      });
    } else if (feature.properties.id.includes("drive")){
      driveLayer.addLayer(layer);
      layer.setStyle({
        className: 'drive-arc'
      });
    }

    layer.on({
        mouseover: highlightArc,
        click: zoomToArc,
        mouseout: resetArcHighlight
    });
  }
});

function zoomToArc(e) {
  myMap.fitBounds(e.target.getBounds());
}

function highlightArc(e) {
  var arc = e.target;
  arc.bringToFront();
  //$(".arc-info").html('<b>Arc: ' + arc.feature.properties.id + '</b>');
  $(".arc-info").html(geojsonProperties(arc));
}

function resetArcHighlight(e) {
  $(".arc-info").html("");
}

/*****************
 Helper Functions
******************/

geojsonProperties = function(geojsonElement){

  var tableHtml = '<table class="property-table"><tr><th>Property</th><th>Value</th></tr>';
  $.each(geojsonElement.feature.properties, function(key,val){
    tableHtml += '<tr><td>'+key+'</td>';
    tableHtml += '<td>'+val+'</td></td></tr>';
    })
 tableHtml += '</table>';
 return tableHtml;
}
