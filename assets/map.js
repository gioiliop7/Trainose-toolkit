import MAPBOX_API_KEY from "./apikey.js";

function NetworkJSON(callback) {
  var xobj = new XMLHttpRequest();
  xobj.overrideMimeType("application/json");
  xobj.open("GET", "diktyo.json", true);
  xobj.onreadystatechange = function () {
    if (xobj.readyState == 4 && xobj.status == "200") {
      callback(xobj.responseText);
    }
  };
  xobj.send(null);
}

NetworkJSON(function (response) {
  // Parse JSON string into object
  var diktyo_JSON = JSON.parse(response);
  var diktyo_data = diktyo_JSON.data;
  var poleis = diktyo_data.poleis;
  var node_in_use = diktyo_data.nodes_in_use;
  var main_site = window.location.origin;
  var marker_icon = main_site + "/assets/img/pin.png";
  var osemap = L.map("ose-map", {
    doubleClickZoom: true,
  }).setView([40.91351, 22.84058], 6.5);
  var token = MAPBOX_API_KEY;
  L.tileLayer(
    `https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=${token}`,
    {
      attribution: "OSE Railway Map",
      maxZoom: 20,
      id: "mapbox/streets-v11",
      tileSize: 512,
      zoomOffset: -1,
      accessToken: token,
    }
  ).addTo(osemap);

  var cities = [];
  poleis.forEach((element) => {
    let lat = element.LAT;
    let lon = element.LON;
    let label = element.LABEL_EN;
    let city = element.POLH;
    if (!!label && !!lat) {
      cities.push({
        latitude: lat,
        longtitude: lon,
        label_en: label,
        city: city,
      });
    }
  });

  var nodes_now = [];
  node_in_use.forEach((element) => {
    nodes_now.push(element);
  });

  cities.forEach((element) => {
    let the_city = element.city;
    var tf = nodes_now.includes(the_city);
    if (tf == false) {
      cities.splice(element, 1);
    }
  });

  cities.forEach((element) => {
    let lat = element.latitude;
    let lon = element.longtitude;
    let label = element.label_en;
    var popupcontent = "<h5>" + label + "</h5>";
    var customIcon = L.icon({
      iconUrl: marker_icon,
      iconSize: [30, 50], // size of the icon
      iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
      popupAnchor: [-3, -76], // point from which the popup should open relative to the iconAnchor
    });
    var marker = L.marker([lat, lon], {
      id: `marker-${element}`,
      icon: customIcon,
    })
      .addTo(osemap)
      .bindPopup(popupcontent);
  });
});
