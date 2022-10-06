function main() {
	var svg = d3.select('svg'),
        width = svg.attr('width') - 300, //300 is padding
        height = svg.attr('height') - 300;

    var xScale = d3.scaleBand().range([0, width]) .padding(0.15); //padding in  between each bar
    var yScale = d3.scaleLinear().range([height, 0]);

    var g = svg.append('g') .attr('transform', 'translate(' + 100 + ',' + 100 + ')');

    d3.csv('gapminder_internet.csv').then(function(data) {
        xScale.domain(data.map(function(d) {return d.country;}));
        yScale.domain([0, d3.max(data, function(d) {return d.internetuserate;})]);

        g.append('g') //x axis
         .attr('transform', 'translate(0,' + height + ')')
         .call(d3.axisBottom(xScale))
         .selectAll('text')
         .attr('y', 0)
         .attr('x', 10)
         .attr('dy', '0.5em') //where ticks are on the bar
         .attr('transform', 'rotate(90)') //x axis labels vertical
         .style('text-anchor', 'start')
         .style('font-weight', 600)
         .style('letter-spacing', '0.1em');

        g.append('g') //y axis
         .call(d3.axisLeft(yScale).tickFormat(function(d){return d;}).ticks(20))
	     .append('text')
	     .attr('transform', 'rotate(-90)')
	     .attr('y', -35)
         .style("font-size", "25px")
         .attr('fill', 'black')
	     .attr('text-anchor', 'end')
	     .text('Internet Users per 100 people')//y axis label

        g.selectAll('.bar')
         .data(data)
         .enter().append('rect')
         .attr('class', 'bar')
	     .on('mouseover', onMouseOver) // Event listeners
	     .on('mouseout', onMouseOut)
         .attr('x', function(d) {return xScale(d.country);})
         .attr('y', function(d) {return yScale(d.internetuserate);})
         .attr('width', xScale.bandwidth())
	     .transition()
	     .ease(d3.easeLinear)
	     .duration(500)
	     .delay(function(d,i){ return i * 50})
         .attr('height', function(d) {return height - yScale(d.internetuserate);});

	})
       
	// mouse over event 
	function onMouseOver(d, i) {
        d3.select(this).attr('class','highlight')
		d3.select(this)
			.transition() 
			.attr('width', xScale.bandwidth() + 3)
			.attr('y', function(d){return yScale(d.internetuserate) - 10;}) //increase width and height of selected bar
			.attr('height', function(d){return height - yScale(d.internetuserate) + 10;})
            .attr('fill', '#B4CDE6')
		// update label to corresponding internet user rate
		d3.select('#tooltip')
            d3.select('#country').text(i.country)
            d3.select('#usage').text(i.internetuserate + '%') 
            d3.select('#gdp').text(i.incomeperperson) 
            d3.select('#rate').text(i.urbanrate + '%')
		
		d3.select('#tooltip').classed('hidden', false);
	}

	// end of mouse over
	function onMouseOut(d, i){
		d3.select(this).attr('class','bar')
		d3.select(this)
			.transition()
			.attr('width', xScale.bandwidth())
			.attr('y', function(d){return yScale(d.internetuserate);}) //return bars to original size
			.attr('height', function(d) {return height - yScale(d.internetuserate)})
		
        d3.selectAll('#tooltip')
            d3.select('#country').text('...')//reset user rate back to ...
            d3.select('#usage').text('...') 
            d3.select('#gdp').text('...')
            d3.select('#rate').text('...')

		d3.select('#tooltip').classed('hidden', true);
	}
}