import { Component, OnInit, ElementRef, ViewChild } from "@angular/core";
import * as d3 from "d3";

@Component({
  selector: "app-arc-chart",
  templateUrl: "./arc-chart.component.html",
  styleUrls: ["./arc-chart.component.css"]
})
export class ArcChartComponent implements OnInit {
  @ViewChild("arc")
  private container: ElementRef;

  private height: number;
  private width: number;
  private arc: any;
  private svg: any;
  private radius: number;
  private xScale: any;
  private yScale: any;
  private pieData = [5, 2, 3, 4, 5];

  constructor() {}

  createArcChart() {
    const element = this.container.nativeElement;
    this.height = element.offsetHeight;
    this.width = element.offsetWidth;
    this.radius = Math.min(this.width, this.height) / 2;

    this.svg = d3
      .select(element)
      .append("svg")
      .attr("width", this.width)
      .attr("height", this.height);

    // center svg
    let g = this.svg
      .append("g")
      .attr("transform", `translate(${this.width / 2}, ${this.height / 2})`);

    var color = d3.scaleOrdinal([
      "#4daf4a",
      "#377eb8",
      "#ff7f00",
      "#984ea3",
      "#e41a1c"
    ]);

    let pie = d3.pie().sort(null);
    // semi-circular pie charts
    // .startAngle(-0.5 * Math.PI)
    // .endAngle(0.5 * Math.PI);

    // Generate the arcs
    let arc = d3
      .arc()
      .innerRadius(this.radius - 80)
      .outerRadius(this.radius)
      .padAngle(0.02)
      .padRadius(100)
      .cornerRadius(4);

    //Generate groups
    let arcs = g
      .selectAll("arc")
      .data(pie(this.pieData))
      .enter()
      .append("g")
      .attr("class", "arc");

    //Draw arc paths
    arcs
      .append("path")
      .attr("fill", (d, i) => {
        return color(i);
      })
      .attr("d", arc)
      .transition()
      .duration(2500)
      .attrTween("d", function(d) {
        var start = { startAngle: 0, endAngle: 0 };
        // semi-circular pie charts
        //var start = { startAngle: -0.5 * Math.PI, endAngle: -0.5 * Math.PI };
        var interpolate = d3.interpolate(start, d);
        return function(t) {
          return arc(interpolate(t));
        };
      });
  }

  ngOnInit() {
    this.createArcChart();
  }
}
