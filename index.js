const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', 600)
    .attr('height', 600);

(async () => {
    const margin = { top: 20, right: 20, bottom: 100, left: 100 };
    const grapWidth = 600 - margin.left - margin.right;
    const grapHeight = 600 - margin.top - margin.bottom;

    const graph = svg.append('g')
        .attr('width', grapWidth)
        .attr('height', grapHeight)
        .attr('transform', `translate(${margin.left},${margin.top})`)

    const xAxisGroup = graph.append('g')
        .attr('transform', `translate(0, ${grapHeight})`);
    const yAxisGroup = graph.append('g');


    const data = await d3.json('menu.json');
    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d.orders)])
        .range([grapHeight, 0]);
    //const min = d3.min(data, d => d.orders);
    //const max = d3.max(data, d => d.orders);
    //const extent = d3.extent(data, d => d.orders);

    const x = d3.scaleBand()
        .domain(data.map( item => item.name))
        .range([0, 500])
        .paddingInner(0.2)
        .paddingOuter(0.2);

    graph.selectAll('rect')
        .data(data)
        .enter()
        .append('rect')
        .attr('width', x.bandwidth)
        .attr('height', d => grapHeight - y(d.orders))
        .attr('fill', 'orange')
        .attr('x', d => x(d.name))
        .attr('y', d => y(d.orders));

    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y)
        .ticks(3)
        .tickFormat( d =>  d + ' orders');

    xAxisGroup.call(xAxis);
    yAxisGroup.call(yAxis);

    xAxisGroup.selectAll('text')
        .attr('transform', 'rotate(-40)')
        .attr('text-anchor', 'end')
        .attr('fill', 'orange');

})();