class BarChart {
    constructor(allData) {
        this.allData = allData;
    }

    updateBarChart(selectedDimension) {
        let svgBounds = d3.select("#barChart").node().getBoundingClientRect();
        let xbuffer = 100;
        let ybuffer = 150;

        let widthRange = svgBounds.width - xbuffer;
        let heightRange = svgBounds.height - ybuffer;
        let padding = 2;

        let names = this.allData.map(function (d) {
            return d.short_name;
        });

        let rMinX = 0;
        let rMaxX = widthRange;
        let xScale = d3.scaleBand().domain(names).range([rMinX, rMaxX]);

        let minY = 0;
        let maxY = d3.max(this.allData, function (d) {
            return d[selectedDimension];
        });
        let rMinY = 0;
        let rMaxY = heightRange;

        // X axis label:
        d3.select("#barChart")
            .append("text")
            .attr("id", "barChartTitle")
            .attr("text-anchor", "end")
            .attr("x", width - 200)
            .attr("y", height + 20)
            .text("Player");

        // Y axis label:
        d3.select("#barChart")
            .append("text")
            .attr("text-anchor", "end")
            .attr("transform", "rotate(-90)")
            .attr("y", -margin.left + 100)
            .attr("x", -margin.top - 50)
            .text("Score");

        let yScale = d3
            .scaleLinear()
            .domain([minY, maxY])
            .range([rMaxY, rMinY])
            .nice();

        let colorScale = d3
            .scaleLinear()
            .domain([minY, maxY])
            .range(["White", "SteelBlue"]);

        let xAxis = d3.axisBottom().scale(xScale);
        let xAxis_pos = d3
            .select("#xAxis")
            .attr("transform", "translate(" + xbuffer + "," + heightRange + ")")
            .call(xAxis);

        xAxis_pos
            .selectAll("text")
            .attr("transform", "translate(" + 15 + ", " + 60 + ") rotate(90)");

        let yAxis = d3.axisLeft().scale(yScale);
        let yAxis_pos = d3
            .select("#yAxis")
            .transition()
            .duration(2500)
            .attr("transform", "translate(" + xbuffer + ", 0)")
            .call(yAxis);

        yAxis_pos.selectAll("text").attr("visibility", function (d, i) {
            if (i == yAxis_pos.selectAll("text").size() - 1) {
                return "hidden";
            } else {
                return "visible";
            }
        });
        let barwidth = xScale.bandwidth() - padding;
        let bars = d3
            .select("#bars")
            .attr("transform", "translate(" + xbuffer + ", " + 0 + ")")
            .selectAll("rect")
            .data(this.allData);

        bars = bars.enter().append("rect").merge(bars);

        bars.transition()
            .duration(2500)
            .attr("x", function (d) {
                return xScale(d.short_name) + padding;
            })
            .attr("y", function (d) {
                return yScale(d[selectedDimension]);
            })
            .attr("width", barwidth)
            .attr("height", function (d) {
                return heightRange - yScale(d[selectedDimension]);
            })
            .style("fill", function (d) {
                var self = d3.select(this);
                if (!self.classed("selected")) {
                    return colorScale(d[selectedDimension]);
                } else {
                    return "OrangeRed";
                }
            });

        let this_bar = this;
        function clickevent(d) {
            d3.select("#bars")
                .selectAll(".selected")
                .classed("selected", false)
                .style("fill", colorScale(d[selectedDimension]));

            d3.select(this)
                .classed("selected", true)
                .style("fill", "OrangeRed");
        }
        bars.on("click", clickevent);
    }

    chooseData() {
        var choice = document.getElementById("dataset").value;
        updateBarChart(choice);
    }
}
