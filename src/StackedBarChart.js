import React, { useEffect, useRef } from "react";
import {
  select,
  scaleBand,
  axisBottom,
  stack,
  max,
  scaleLinear,
  axisLeft,
  stackOrderAscending,
  pointer
} from "d3";
import useResizeObserver from "./useResizeObserver";

/**
 * Component that renders a StackedBarChart
 */

function StackedBarChart({ data, keys, colors }) {
  const svgRef = useRef();
  const wrapperRef = useRef();
  const dimensions = useResizeObserver(wrapperRef);

  var tooltip = select("#tooltip")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "1px")
    .style("border-radius", "5px")
    .style("padding", "10px")

  var mouseover = function(d) {
    var subgroupName = select(this.parentNode).datum().key;
    
    tooltip
        .html("subgroup: " + subgroupName)
        .style("opacity", 1)
  }

  var mousemove = function(d) {
    tooltip
      .style("left", (pointer(this)[0]+90) + "px") // It is important to put the +90: other wise the tooltip is exactly where the point is an it creates a weird effect
      .style("top", (pointer(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    tooltip
      .style("opacity", 0)
  }

  // will be called initially and on every data change
  useEffect(() => {
    const svg = select(svgRef.current);
    const { width, height } =
      dimensions || wrapperRef.current.getBoundingClientRect();

    // stacks / layers
    const stackGenerator = stack()
      .keys(keys)
      .order(stackOrderAscending);
    const layers = stackGenerator(data);
    console.log(layers)

    const extent = [
      0,
      max(layers, layer => max(layer, sequence => sequence[1]))
    ];

    // scales
    const xScale = scaleBand()
      .domain(data.map(d => d.year))
      .range([0, width])
      .padding(0.25);

    const yScale = scaleLinear()
      .domain(extent)
      .range([height, 0]);

    // rendering
    svg
      .selectAll(".layer")
      .data(layers)
      .join("g")
      .attr("class", "layer")
      .attr("fill", layer => colors[layer.key])
      .selectAll("rect")
      .data(layer => layer)
      .join("rect")
      .attr("x", sequence => xScale(sequence.data.year))
      .attr("width", xScale.bandwidth())
      .attr("y", sequence => yScale(sequence[1]))
      .attr("height", sequence => yScale(sequence[0]) - yScale(sequence[1]))
      .on("mouseover", (event, d) => {
        select(".tooltip")
        .text("Murder: " + d.data.Murder + " Outrage Of Modesty: " + d.data["Outrage Of Modesty"] + " Housebreaking: " + d.data["Housebreaking"] + " Cheating Related Offences: " + d.data["Cheating Related Offences"] + " Rape: " + d.data["Rape"] + " Rioting: " + d.data["Rioting"] + " Robbery: " + d.data["Robbery"] + " Serious Hurt: " + d.data["Serious Hurt"] +  " Snatch Theft: " + d.data["Snatch Theft"] + " Theft Of Motor Vehicle " + d.data["Theft Of Motor Vehicle"])
        .style("position", "absolute")
        .style("background", "#fff")
        .style("left", (event.pageX) + "px")
        .style("top", (event.pageY) + "px");

        select(event.currentTarget).classed("selected", true)
    })
    .on("mouseout", (event, d) => {
      select(".tooltip")
      .text("");

      select(event.currentTarget).classed("selected", false)
  })

    // axes
    const xAxis = axisBottom(xScale);
    svg
      .select(".x-axis")
      .attr("transform", `translate(0, ${height})`)
      .call(xAxis);

    const yAxis = axisLeft(yScale);
    svg.select(".y-axis").call(yAxis);
  }, [colors, data, dimensions, keys]);

  return (
    <React.Fragment>
      <div class="tooltip"></div>
      <div ref={wrapperRef} style={{ marginBottom: "2rem" }}>
        <svg ref={svgRef}>
          <g className="x-axis" />
          <g className="y-axis" />
        </svg>
      </div>
    </React.Fragment>
  );
}

export default StackedBarChart;