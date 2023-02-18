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
const a = [{
        doping: 'No doping allegations',
        color: '#5A7302'
    },
    {
        doping: 'Riders with doping allegations',
        color: "#F23827"
    }
]

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

    const tooltip = d3.select('body')
        .append('div')
        .attr('id', 'tooltip')
        .style("visibility", "hidden")


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
            if (d['Doping'] === "") {
                return '#5A7302'
            } else {
                return '#F23827'
            }
        })
        .on('mouseover', (e, d) => {
            tooltip
                .style('visibility', 'visible')
                .style('left', e.pageX + 'px')
                .style('top', e.pageY - 80 + 'px')
                .attr('data-xvalue', ['Year'])
                .html(d['Name'] + '</br>' + d['Year'] + ' - ' + d['Time'] + '</br> ' + d['Doping'])
                .attr('data-year', d['Year'])
        })
        .on("mousemove", function (e, d) {
            tooltip.style("left", e.pageX + 10 + "px")

        })
        .on('mouseout', (e, d) => {
            tooltip.style('visibility', 'hidden')
        });

    let legendTable = d3.select('svg').append('g')
        .attr("transform", "translate(0, " + padding + ")")
        .attr("class", "legendTable");

    let legend = legendTable.selectAll('.legend')
        .data(a)
        .enter().append('g')
        .attr('id', 'legend')
        .attr('class', 'legend')
        .attr("transform", function (d, i) {
            return "translate(0, " + i * 20 + ")"
        })

    legend.append('rect')
        .attr('x', width - 10)
        .attr('y', 4)
        .attr('width', 10)
        .attr('height', 10)
        .style('fill', function (d) {
            return d.color
        });

    legend.append('text')
        .attr('x', width - 14)
        .attr('y', 9)
        .attr('dy', '.35em')
        .style('text-anchor', 'end')
        .text(d => d.doping);

    svg.append("text")
        .attr('id', 'title')
        .attr("x", (width / 2 - 30))
        .attr("y", padding)
        .attr("text-anchor", "middle")
        .style('fill', "#222326")
        .style("font-size", "22px")
        .text("Doping in Professional Bicycle Racing");



}
req.send()