var map = new Datamap({
  element: document.getElementById('container'),
  geographyConfig: {
    popupOnHover: false,
    highlightOnHover: false
  },
  fills: {
    defaultFill: '#f73676'
  }
  });


var URL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json';

d3.json(URL, function(error, data){
  if (error){
    throw error;
  }
  var radius_scale = d3.scale.log().range([1,10]);

  radius_scale.domain(d3.extent(data.features, function(d){
    return d.properties.mass;
  }));
  bubble_data = data.features.map(function(entry){
    return {
      name:entry.properties.name,
      radius: radius_scale(entry.properties.mass),
      mass: entry.properties.mass,
      date:entry.properties.year,
      latitude: entry.properties.reclat,
      longitude: entry.properties.reclong
    }
  });
  map.bubbles(bubble_data,{
    popupTemplate: function(geo, data){
      return (['<div class=hoverinfo><h3>' + data.name,
      '</h3><br/>Mass: ' + data.mass,
      '<br />Date: ' + data.date,
      '<br />Latitude: ' + data.latitude,
      '<br />Longitude: ' + data.longitude,
      '</div>'].join(''));
    }
  });
});
