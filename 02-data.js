const data = [
    {width: 100, height: 100, x:100, y:250, fill:'green'},
    {width: 100, height: 60, x:10, y: 100,fill:'pink'},
    {width: 50, height: 30, fill:'purple'},
];

const svg = d3.select('svg');

const rect = svg.selectAll('rect')
    .data(data)
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('width',  d => d.width)
    .attr('height', d => d.height)
    .attr('fill',   d => d.fill);

rect.enter()
    .append('rect')
    .attr('x', d => d.x)
    .attr('y', d => d.y)
    .attr('width',  d => d.width)
    .attr('height', d => d.height)
    .attr('fill',   d => d.fill);
