const dims = { height: 300, width: 300, radius: 150 };
const center = { x: (dims.width / 2 + 5), y: (dims.height / 2 + 5) };
const svg = d3.select('.canvas')
    .append('svg')
    .attr('width', dims.width + 150)
    .attr('height', dims.height + 150);

const graph = svg.append('g')
    .attr('transform', `translate(${center.x}, ${center.y})`);

const pie = d3.pie()
    .sort(null)
    .value(d => d.cost);

const arcPath = d3.arc()
    .outerRadius(dims.radius)
    .innerRadius(dims.radius/2);

const color = d3.scaleOrdinal(d3['schemeSet3']);
const legendGroup = svg.append('g')
    .attr('transform', `translate(${dims.width + 40}, 10)`);

const legend = d3.legendColor()
    .shape('circle')
    .shapePadding('10')
    .scale(color);

const tip = d3.tip()
    .attr('class', 'tip card')
    .html(d => {
        const { name, cost } = d.data;
        return `
            <div class="name">${name}</div>
            <div class="cost">${cost}</div>
            <div class="delete">click slice to delete</div>
        `;
    });

graph.call(tip);

const update = (data) => {
    color.domain(data.map(d => d.name));

    legendGroup.call(legend);
    legendGroup.selectAll('text')
        .attr('fill', 'white')
    const paths = graph.selectAll('path')
        .data(pie(data))
        .attr('class', 'arc')
        .attr('d', arcPath)
        .attr('stroke', '#fff')
        .attr('stroke-width', 3)
        .attr('fill', d => color(d.data.name) );

    paths.exit()
        .transition().duration(750)
        .attrTween('d', arcTweenExit)
        .remove();

    paths.attr('d', arcPath)
        .transition().duration(750)
        .attrTween('d', arcTweenUpdate);

    paths.enter()
        .append('path')
        .attr('class', 'arc')
        .attr('stroke', '#fff')
        .attr('stroke-width', 3)
        .attr('fill', d => color(d.data.name) )
        .each( function(d){ this._current = d} )
        .transition().duration(750)
            .attrTween("d", arcTweenEnter);

    graph.selectAll('path')
        .on('mouseover', (d,i,n) => {
            tip.show(d, n[i]);
            handleMouseOver(d,i,n);
        })
        .on('mouseout', (d,i,n) => {
            tip.hide();
            handleMouseOut(d,i,n);
        })
        .on('click', handleClick);
}

var data = [];



db.collection('expenses').onSnapshot( res => {
    res.docChanges().forEach(change => {
        const doc = { ...change.doc.data(), id: change.doc.id };
        switch (change.type) {
            case 'added':
                data.push(doc);
                break;
            case 'modified':
                const index = data.findIndex(item => item.id === doc.id);
                data[index] = doc;
                break;
            case 'removed':
                data = data.filter(item => item.id !== doc.id);
        }
    });
    update(data);
});

const arcTweenEnter = d => {
    const i = d3.interpolate(d.endAngle, d.startAngle);
    return t => {
        d.startAngle = i(t);
        return arcPath(d)
    };
};

const arcTweenExit = d => {
    const i = d3.interpolate(d.startAngle, d.endAngle);
    return t => {
        d.startAngle = i(t);
        return arcPath(d)
    };
};

function arcTweenUpdate(d) {
    const i = d3.interpolate(this._current, d);
    this._current = i(1);

    return t => arcPath(i(t));
}

const handleMouseOver = (d, i, n) => {
    d3.select(n[i])
        .transition('changeSliceFill').duration(300)
            .attr('fill', '#fff');
};

const handleMouseOut = (d, i, n) => {
    d3.select(n[i])
        .transition('changeSliceFill').duration(300)
            .attr('fill', color(d.data.name));
};

const handleClick = d => {
    const { id } = d.data;
    db.collection('expenses').doc(id).delete();
};