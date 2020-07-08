import tmpl from './skeleton.js';
console.warn("tmpl", tmpl);


const svg = d3.select('svg');

const skeleton = () => {
    svg.selectAll('circle')
        .data(tmpl)
        .enter()
        .append('circle')
        .attr('cy', 200)
        .attr('cx', d => d.distance)
        .attr('r', d => d.radius)
        .attr('fill', d => d.fill);
};

(async () => {
    skeleton();
    let data = [];
    setTimeout( async () => {
         data = await d3.json('planets.json');
         svg.selectAll('circle')
            .data(data)
            .attr('cy', 200)
            .attr('cx', d => d.distance)
            .attr('r', d => d.radius)
            .attr('fill', d => d.fill);
    }, 3000);
})();