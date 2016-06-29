
// Add the map, basemap, and attirbution
var map = L.map('map', {
    center: [41.616061,-72.694416],
    zoom: 9,
});

var basemap0 = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
  attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  subdomains: 'abcd',
  minZoom: 7,
  maxZoom: 15,
  ext: 'png'
}).addTo(map);

map.options.maxZoom = 13;
map.options.minZoom = 7;

//default zoom
var defaultViewFunc = function(){
    map.setView([41.616061,-72.694416],9);
};

L.easyButton('<img src="css/images/conn.png" class=conn >', function(btn, map){
  defaultViewFunc();
}).addTo(map);


function tractStyle(feature) {
    return {
        weight: 1.04,
        color: '#7a7a7a',
        fillColor: '#000000',
        dashArray: '',
        lineCap: 'square',
        lineJoin: 'bevel',
        opacity: 1.0,
        fillOpacity: 0.0
    };
}

function getColor(d) {
    return d == "Licensed"   ? '#703D93' :
           d == "Unlicensed" ? '#8C94C5' :
                               '#FFEDA0';
}


function getColor_border(d) {
    return d == "Licensed"   ? '#5D2483' :
           d == "Unlicensed" ? '#3E488A' :
                               '#FFEDA0';
}

function getStyle(feature) {
  return {
    radius: '3.0',
    fillColor: getColor(feature.properties.type),
    color: getColor_border(feature.properties.type),
    weight: 1.5,
    opacity: 1.0,
    dashArray: '',
    fillOpacity: '0.75',
  };
}


var tracts = new L.geoJson(towns_Clean, {
    onEachFeature: eachTract,
    style: tractStyle
}).addTo(map);

// var licensed = [];
// var unlicensed = [];
//
// for (i = 0; i < providers_Clean.features.length; i++) {
//   if (providers_Clean.features[i].properties.setting == "phase3"){
//     licensed.push(providers_Clean.features[i]);
//   }
// }
//
// for (i = 0; i < providers_Clean.features.length; i++) {
//   if (providers_Clean.features[i].properties.setting == "UI"){
//     unlicensed.push(providers_Clean.features[i]);
//   }
// }

var points = new L.geoJson(providers_Clean, {
    onEachFeature: eachPoint,
    pointToLayer: function (feature, latlng) {
        return L.circleMarker(latlng, getStyle(feature));
    }
});

// var points_licensed = new L.geoJson(licensed, {
//     onEachFeature: eachPoint,
//     pointToLayer: function (feature, latlng) {
//         return L.circleMarker(latlng, getStyle(feature));
//     }
// });
//
// var points_unlicensed = new L.geoJson(unlicensed, {
//     onEachFeature: eachPoint,
//     pointToLayer: function (feature, latlng) {
//         return L.circleMarker(latlng, getStyle(feature));
//     }
// });

var cluster_group = new L.MarkerClusterGroup({
  // iconCreateFunction: function(cluster) {
  //      var clusterSize = "small";
  //      if (cluster.getChildCount() >= 10) {
  //          clusterSize = "medium";
  //      }
  //      if (cluster.getChildCount() >= 20) {
  //          clusterSize = "large";
  //      }
  //      return new L.DivIcon({
  //          html: '<div><span>' + cluster.getChildCount() + '</span></div>',
  //          className: 'marker-cluster marker-cluster-' + clusterSize,
  //          iconSize: new L.Point(40, 40)
  //      });
  //  },
//   iconCreateFunction: function (cluster) {
//     var childCount = cluster.getChildCount();
//     // var c = ' marker-cluster-LI';
//     return new L.DivIcon({ html: '<div><span><b>' + childCount + '</b></span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
// },
  iconSize: 10,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  spiderfyOnMaxZoom: true,
  removeOutsideVisibleBounds: false,
  disableClusteringAtZoom:12,
  animate: true,
  maxClusterRadius: 40
});

cluster_group.addLayer(points);
cluster_group.addTo(map);

var cluster_group2 = new L.MarkerClusterGroup({
  iconCreateFunction: function (cluster) {
    var childCount = cluster.getChildCount();
    var c = ' marker-cluster-UI';
    return new L.DivIcon({ html: '<div><span><b>' + childCount + '</b></span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
},
  iconSize: 10,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  spiderfyOnMaxZoom: true,
  removeOutsideVisibleBounds: false,
  disableClusteringAtZoom:12,
  animate: true,
  maxClusterRadius: 40
});

var cluster_group3 = new L.MarkerClusterGroup({
  iconCreateFunction: function (cluster) {
    var childCount = cluster.getChildCount();
    var c = ' marker-cluster-LI';
    return new L.DivIcon({ html: '<div><span><b>' + childCount + '</b></span></div>', className: 'marker-cluster' + c, iconSize: new L.Point(40, 40) });
},
  iconSize: 10,
  showCoverageOnHover: false,
  zoomToBoundsOnClick: true,
  spiderfyOnMaxZoom: true,
  removeOutsideVisibleBounds: false,
  disableClusteringAtZoom:12,
  animate: true,
  maxClusterRadius: 40
});


// cluster_group2.addLayer(points_unlicensed);
// cluster_group2.addTo(map);
// .addTo(map);

var legend = L.control({position: 'bottomright'});

legend.onAdd = function (map) {

    var div = L.DomUtil.create('div', 'info legend title'),
        grades = ["Licensed", "Unlicensed"];

    div.innerHTML += '<b>Legend</b><br>';  // don't forget the break tag

    // loop through our density intervals and generate a label with a colored square for each interval
    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i class="circle" style="background:' + getColor(grades[i]) + '"></i> ' +
           (grades[i] ? grades[i] + '<br>' : '+');
    }

    return div;
};

legend.addTo(map);


L.control.scale({options: {position: 'bottomleft', maxWidth: 100, metric: true, imperial: false, updateWhenIdle: false}}).addTo(map);


function eachPoint(feature, layer) {
  layer.bindPopup("<h3>Provider</h3> " + feature.properties.provider + "<br>" + "<h3>Address</h3> " + feature.properties.Match_addr +
"<br>" + "<h3>Phone</h3> " + feature.properties.phone + "<br>" + "<h3>School District</h3> " + feature.properties.schooldist +
"<br>" + "<h3>Capacity</h3> " + "Total:" + "  " + feature.properties.totcap + "<strong>"+ " | " +  "</strong>"+ "IT:" + "  " + feature.properties.itcap +
"<strong>"+ " | " +  "</strong>"+ "PS:" + "  " + feature.properties.pscap + "<strong>"+ " | " +  "</strong>"+ "SA:" + "  " + feature.properties.sacap +
 "<h3>Advertised Weekly Rates</h3> " + "IT:" + "  " + feature.properties.itfullweek + "<strong>"+ " | " +  "</strong>"+ "PS:" + "  " + feature.properties.psfullweek +
   "<strong>"+ " | " +  "</strong>"+ "SA:" + "  " + feature.properties.safullweek);
  layer.on({
    mouseover: function(e){
      layer.setStyle({
        radius: '6.0',
        fillOpacity: 1
      });
    },
    mouseout: function(e) {
      layer.setStyle(getStyle(feature));
    },
  });
}





function eachTract(feature, layer) {
  layer.on({
    mouseover: function(e){
      layer.setStyle({
        fillColor: '#A5A5A5',
        fillOpacity: 0.5
      });
        info.update(layer.feature.properties);
    },
    mouseout: function(e) {
      layer.setStyle(tractStyle(feature));
        info.update();
    },
    click: function (e){
      var bounds = this.getBounds();
      map.fitBounds(bounds);
    },
  });
}

$('#sel, #age, #fac').change(function() {
    var sel = $('#sel').val();
    var age = $('#age').val();
    var fac = $('#fac').val();

    if (map.hasLayer(cluster_group)){
        map.removeLayer(cluster_group);
        cluster_group.removeLayer(points);
    }
    if (map.hasLayer(cluster_group2)){
        map.removeLayer(cluster_group2);
        cluster_group2.removeLayer(points);
    }
    if (map.hasLayer(cluster_group3)){
        map.removeLayer(cluster_group3);
        cluster_group3.removeLayer(points);
    }

points = L.geoJson(providers_Clean, {
      filter: function(feature, layer) {
        return (sel === 'All' || feature.properties.setting == sel) &&
            (age === 'All' || feature.properties[age] >= 1) &&
            (fac === 'All' || feature.properties.facility == fac);
      },
      onEachFeature: eachPoint,
      pointToLayer: function (feature, latlng) {
          return L.circleMarker(latlng, getStyle(feature));
      }
  });

  if (sel === 'All'){
    cluster_group.addLayer(points);
    cluster_group.addTo(map);
  }
  if (sel === 'UI'){
    cluster_group2.addLayer(points);
    cluster_group2.addTo(map);
  }
  if (sel === 'phase3'){
    cluster_group3.addLayer(points);
    cluster_group3.addTo(map);
  }
  // points.addTo(map);
  // cluster_group.addLayer(points);
  // cluster_group.addTo(map);
  return false;
});

var info = L.control();

info.onAdd = function (map1) {
    this._div = L.DomUtil.create('div', 'info box'); // create a div with a class "info"
    this.update();
    return this._div;
};

// method that we will use to update the control based on feature properties passed
info.update = function (props) {
    this._div.innerHTML = '<h4>Town Information</h4>' +  (props ?
        '</b><br />' + '<b>' + props.NAME + '</b><br />' + '</b><br />' +
        '<strong>'+props.Avg_totINT+ ' | ' + '</strong>' + 'Avg. Total Capacity / Provider ' + '</b><br />' +
        '<strong>'+props.IT_AvgRate+ ' | ' + '</strong>' + 'Avg. IT Rate ' + '</b><br />' +
        '<strong>'+props.PS_AvgRate+ ' | ' + '</strong>' + 'Avg. PS Rate ' + '</b><br />' +
        '<strong>'+props.SA_AvgRate+ ' | ' + '</strong>' + 'Avg. SA Rate ' + '</b><br />'

        : 'Hover over a town');
};

info.addTo(map);


// $(window).load(function() {
// tracts.addTo(map);
// points.addTo(map);
// // info.addTo(map);
// });


// layer.clearLayers();
// stackLayers();
