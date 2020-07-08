const BarChart = function () {
    this.setup();
};

BarChart.prototype.setup = function() {
    this.margin = { top: 20, right: 20, bottom: 100, left: 100 };
    this.grapWidth = 600 - this.margin.left - this.margin.right;
    this.grapHeight = 600 - this.margin.top - this.margin.bottom;
    this.graph = svg.append('g')
        .attr('width', this.grapWidth)
        .attr('height', this.grapHeight)
        .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    this.xAxisGroup = this.graph.append('g')
        .attr('transform', `translate(0, ${this.grapHeight})`);
    this.yAxisGroup = this.graph.append('g');

    this.y = d3.scaleLinear()
        .range([this.grapHeight, 0]);

    this.x = d3.scaleBand()
        .range([0, 500])
        .paddingInner(0.2)
        .paddingOuter(0.2);
    this.axisSetup();
};

BarChart.prototype.widthTween =  function(d) {
    let i = d3.interpolate(0, this.x.bandwidth());
    return t => i(t);
};

BarChart.prototype.drawBars = function() {
    this.rects
        .attr('width', this.x.bandwidth)
        .attr('fill', 'orange')
        .attr('x', d => this.x(d.name))

    this.rects
    .enter()
    .append('rect')
    .attr('height', 0)
    .attr('fill', 'orange')
    .attr('x', d => this.x(d.name))
    .attr('y', this.grapHeight)
    .merge(this.rects)
    .transition().duration(1500)
        .attrTween('width', this.widthTween.bind(this) )
        .attr('y', d => this.y(d.orders))
        .attr('height', d => this.grapHeight - this.y(d.orders));
};

BarChart.prototype.axisSetup = function() {
    this.xAxis = d3.axisBottom(this.x);
    this.yAxis = d3.axisLeft(this.y)
    .ticks(3)
    .tickFormat( d =>  d + ' orders');

    this.xAxisGroup.selectAll('text')
    .attr('transform', 'rotate(-40)')
    .attr('text-anchor', 'end')
    .attr('fill', 'orange');
};

BarChart.prototype.feedCurrentData = function(data) {
    this.y.domain([0, d3.max(data, d => d.orders)]);
    this.x.domain(data.map(item => item.name))
    this.rects = this.graph.selectAll('rect')
        .data(data);
};

BarChart.prototype.update = function(data) {
    console.log(" update data", data);
    this.feedCurrentData(data);

    this.rects.exit().remove();
    this.drawBars();

    this.xAxisGroup.call(this.xAxis);
    this.yAxisGroup.call(this.yAxis);
};

const getCollectionData = async (collection) => {
    const response = await db.collection(collection).get();
    return response.docs.map( doc => doc.data());
};


(async () => {
    let data = [];
    const barChart = new BarChart();

    db.collection('dishes').onSnapshot( res => {
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
        barChart.update(data);
    });
})();