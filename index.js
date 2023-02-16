let url = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json'
let req = new XMLHttpRequest();
let data = [];

const padding = 50;
const width = 800;
const height = 600;
const xAxisLength = width;
const yAxisLength = height;

var svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height)

let tooltip = d3.select('#tooltip')
/*  {
    "Time": "39:50",
    "Place": 35,
    "Seconds": 2390,
    "Name": "Nairo Quintana",
    "Year": 2013,
    "Nationality": "COL",
    "Doping": "",
    "URL": ""
  }*/


req.open('GET', url, true)
req.onload = () => {
    data = JSON.parse(req.responseText)

    console.log(data);

    xScale = d3.scaleLinear()
        .domain([d3.min(data, (d) => {
            return d['Year']
        }) - 1, d3.max(data, (d) => {
            return d['Year']
        }) + 1])
        .range([padding, width - padding])

    yScale = d3.scaleTime()
        .domain([d3.min(data, (d) => {
            return new Date(d['Seconds'] * 1000)
        }), d3.max(data, (d) => {
            return new Date(d['Seconds'] * 1000)
        })])
        .range([padding, height - padding])

    xAxis = d3.axisBottom(xScale)
        .tickFormat(d3.format('d'))


    yAxis = d3.axisLeft(yScale)
        .tickFormat(d3.timeFormat('%M:%S'))


    svg.append('g')
        .call(xAxis)
        .attr('class', 'x-axis')
        .attr('id', 'x-axis')
        .attr('transform', 'translate(0, ' + (height - padding) + ')')

    svg.append('g')
        .attr('class', 'y-axis')
        .call(yAxis)
        .attr('id', 'y-axis')
        .attr('transform', 'translate(' + padding + ', 0)')

    svg.selectAll('circle')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('r', '5')
        .attr('data-xvalue', (d) => {
            return d['Year']
        })
        .attr('data-yvalue', (d) => {
            return new Date(d['Seconds'] * 1000)
        })
        .attr('cx', (d) => {
            return xScale(d['Year'])
        })
        .attr('cy', (d) => {
            return yScale(new Date(d['Seconds'] * 1000))
        })
        .attr('fill', (d) => {
            if (d['URL'] === "") {
                return 'lightgreen'
            } else {
                return 'orange'
            }
        })
        .on('mouseover', (d) => {
            tooltip.transition()
                .style('visibility', 'visible')

            if (d['Doping'] != "") {
                tooltip.text(d['Year'] + ' - ' + d['Name'] + ' - ' + d['Time'] + ' - ' + d['Doping'])
            } else {
                tooltip.text(d['Year'] + ' - ' + d['Name'] + ' - ' + d['Time'] + ' - ' + 'No Allegations')
            }

            tooltip.attr('data-year', d['Year'])
        })
        .on('mouseout', (d) => {
            tooltip.transition()
                .style('visibility', 'hidden')
        })


}
req.send()