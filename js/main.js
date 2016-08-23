var map = new Datamap({
  element: document.getElementById('container'),
  geographyConfig: {
    popupOnHover: false,
    highlightOnHover: false
  },
  fills: {
    defaultFill: '#f73676',
    '#1f77b4': '#e436fa',
    '#ff7f0e':'#ff7f0e',
    '#2ca02c': '#2ca02c',
    '#d62728': '#d62728',
    '#9467bd': '#9467bd',
    '#8c564b': '#8c564b',
    '#e377c2': '#e377c2',
    '#7f7f7f': '#7f7f7f',
    '#bcbd22':'#bcbd22',
    '#17becf':'#17becf'
  },
  setProjection: function(element){
    var projection = d3.geo.equirectangular()
    .scale(300)
    .center([-50,30]);

    var path = d3.geo.path()
    .projection(projection);

    return {path: path, projection: projection};
  },


  responsive: true,
  bubblesConfig:{

  }
  });

  window.addEventListener('resive', function(){
    map.resize();
  });



var colorScale = d3.scale.category10();
var URL = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json';

d3.json(URL, function(error, data){
  if (error){
    throw error;
  }

  map.svg.call(d3.behavior.zoom()
  .scaleExtent([1/2,4])
  .on('zoom', zoomed));

  function zoomed(){
    map.svg.selectAll('g').attr('transform', 'translate(' + d3.event.translate + ')scale(' + d3.event.scale + ')');
  }

  data = data.features;
  data.forEach(function(d){
    d.properties.mass = +d.properties.mass
    d.properties.year = new Date(d.properties.year)
  });
  var radius_scale = d3.scale.sqrt().range([1,75]);
  colorScale.domain(d3.extent(data,function(d){
    return d.properties.year;
  }));


  radius_scale.domain(d3.extent(data, function(d){
    return d.properties.mass;
  }));

  bubble_data = data.map(function(entry){
    return {
      name:entry.properties.name,
      radius: radius_scale(entry.properties.mass),
      mass: entry.properties.mass,
      year:entry.properties.year.getFullYear(),
      latitude: entry.properties.reclat,
      longitude: entry.properties.reclong,
      fillKey: colorScale(entry.properties.year),
    }
  });


  map.bubbles(bubble_data,{
    popupTemplate: function(geo, data){
      return (['<div class="hoverinfo tip"><h3>' + data.name,
      '</h3><br/>Mass: ' + data.mass,
      '<br />Year: ' + data.year,
      '<br />Latitude: ' + data.latitude,
      '<br />Longitude: ' + data.longitude,
      '</div>'].join(''));
    }
  });
});
