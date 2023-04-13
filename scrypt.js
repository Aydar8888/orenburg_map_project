let mapOptions = {
  center:[51.7727, 55.0988],
  zoom:9
}


let map = new L.map('map' , mapOptions);

let layer = new L.TileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');
map.addLayer(layer);

// const districts = ['Абдулинский', '', ''];
const districts = [['Абдулинский', 'lightblue', 'Абдуллинский_район.gif'], ['Адамовский', 'lightgreen', ''], ['Акбулакский', 'blue', ''], ['Александровский', 'brown', ''], ['Асекеевский', 'cyan', ''], ['Беляевский', 'darkblue', ''], ['Бугурусланский', 'darkcyan', ''], 
  ['Бузулукский', 'darkgrey', ''], ['Гайский', 'darkgreen', ''], ['Грачевский', 'darkkhaki', ''], ['Домбаровский', 'darkmagenta', ''], ['Илекский', 'darkolivegreen', ''], ['Кваркенский', 'darkorange', ''], ['Красногвардейский', 'green', ''], 
  ['Кувандыкский', 'darkred', ''], ['Курманаевский', 'darksalmon', ''], ['Матвеевский', 'darkviolet', ''], ['Новоорский', 'fuchsia', ''], ['Новосергиевский', 'gold', ''], ['Октябрьский', 'green', ''], ['Оренбургский', 'indigo', ''], ['Первомайский', 'khaki', ''], 
  ['Переволоцкий', 'lightblue', ''], ['Пономаревский', 'yellow', ''], ['Сакмарский', 'lightgreen', ''], ['Саракташский', 'lightgrey', ''], ['Светлинский', 'blue', ''], ['Северный', 'gray', ''], ['Соль-Илецкий', 'lime', ''], 
  ['Сорочинский', 'magenta', ''], ['Ташлинский', 'maroon', ''], ['Тоцкий', 'navy', ''], ['Тюльганский', 'olive', ''], ['Шарлыкский', 'orange', ''], ['Ясненский', 'pink', ''],
  ['городской округ Оренбург', 'yellow', ''], ['городской округ Медногорск', 'violet', ''], ['городской округ Новотроицк', 'red', ''], ['ЗАТО Комаровский', 'silver', ''], ['городской округ Орск', 'yellow', ''],
  ['городской округ Бугуруслан', 'green', ''], ['городской округ Бузулук', 'blue', '']]

   
districts.forEach(district => draw(district))

function draw(district) {

// const url = 'https://nominatim.openstreetmap.org/search?format=json&q=' 
// + district +'%20район,%20%D0%9E%D1%80%D0%B5%D0%BD%D0%B1%D1%83%D1%80%D0%B3&polygon_geojson=1'
  const url = 'http://localhost:8080/district?district=' + district[0]


  fetch(url).then(function(response) {
    response.json().then(value => {
      console.log(value);
      value.forEach(v => drawDistrict(v))
      // let data = value[0]
      // drawDistrict(data)
    })
  }).then(function(data) {
    console.log(data);
  }).catch(function(err) {
    alert(err + '\n' + url);
  });

  function drawDistrict(data) {
    if (data["osm_type"] != "node" && data["type"] != "city" && data["type"] != "LineString"
        && data["osm_id"] != 9673488) { //исключаем Октябрьский район г. Орска
      console.log(data["display_name"])

      // L.marker(L.latLng(data["lat"], data["lon"])).addTo(map) //Для добавления центра района

      geojson = L.geoJson(data["geojson"], {
          style: setStyle,
          onEachFeature: onEachFeature
      }).addTo(map);
      geojson.bindTooltip(data["display_name"])
    
      function setStyle(feature) {
        return {
          weight: 1,
          opacity: 1,
          color: "black",
          // fillColor: selectColor(Math.floor(Math.random() * 999), 20),
          fillColor: district[1],
          // dashArray: '3',
          fillOpacity: 0.3
        };
      }

      function selectColor(colorNum, colors) {
          if (colors < 1) colors = 1; // defaults to one color - avoid divide by zero
          return "hsl(" + (colorNum * (360 / colors) % 360) + ",100%,50%)";
      }
      
      function onEachFeature(feature, layer) {
          //bind click
          layer.on('click', function (e) {
            var popup = L.popup()
            .setLatLng(e.latlng) 
            // .setContent(data["display_name"])
            .setContent("<b></b>" + data["display_name"] + "<br>" +
            "<b></b><a href='' target=\"_blank\">"+"<img src='data/" + district[2] + "' class=\"center\" </img></a>")
            .openOn(map);
          });

      } 
    }
  }
}