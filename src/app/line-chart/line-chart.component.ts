import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges
} from "@angular/core";
import * as d3 from "d3";
import { interpolatePath } from "d3-interpolate-path";

@Component({
  selector: "app-line-chart",
  templateUrl: "./line-chart.component.html",
  styleUrls: ["./line-chart.component.css"]
})
export class LineChartComponent implements OnInit, OnChanges {
  constructor() {}

  @ViewChild("lineChart")
  private container: ElementRef;

  @Input()
  private data: Array<any>;
  @Input()
  private data2: Array<any>;

  private margin: any = { top: 20, right: 20, bottom: 20, left: 20 };
  private width: number;
  private height: number;
  private xScale: any;
  private x1Scale: any;
  private yScale: any;
  private xAxis: any;
  private x1Axis: any;
  private yAxis: any;
  private line: any;
  private line2: any;
  private svg: any;
  private area: any;

  createLineChart() {
    const element = this.container.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    var bisectDate = d3.bisector(function(d) {
      return d.x;
    }).left;
    let that = this;

    this.svg = d3
      .select(element)
      .append("svg")
      .attr("width", element.offsetWidth)
      .attr("height", element.offsetHeight);

    //----------------------------------------------------------------------------------------
    //bottom Axis
    const xDomain = d3.extent(this.data[0].data, d => d.x);
    const yDomain = d3.extent(this.data[0].data, d => d.y);
    console.log(xDomain);
    this.xScale = d3
      .scaleLinear()
      .domain(xDomain)
      .range([0, this.width]);

    this.yScale = d3
      .scaleLinear()
      .domain(yDomain)
      .range([this.height, 0]);

    this.line = d3
      .line()
      .curve(d3.curveMonotoneX)
      .x((d, i) => this.xScale(d.x))
      .y((d, i) => this.yScale(d.y));

    this.xAxis = this.svg
      .append("g")
      .attr("class", "axis axis-x")
      .attr(
        "transform",
        `translate(${this.margin.left}, ${this.margin.top + this.height})`
      )
      .call(d3.axisBottom(this.xScale));

    this.yAxis = this.svg
      .append("g")
      .attr("class", "axis axis-y")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(this.yScale));

    this.svg
      .append("g")
      .attr("class", "lines")
      .attr(
        "transform",
        `translate(${this.margin.left + 1}, ${this.margin.top})`
      )
      .selectAll(".line-group")
      .data(this.data)
      .enter()
      .append("g")
      .attr("class", "line-group")
      .append("path")
      .attr("class", "line")
      .attr("d", d => this.line(d.data))
      .attr("stroke", "black")
      .attr("stroke-width", "2")
      .attr("fill", "none");
    //----------------------------------------------------------------------------------------
    //top Axis
    const x1Domain = d3.extent(this.data2, d => d.x);

    this.x1Scale = d3
      .scaleLinear()
      .domain(x1Domain)
      .range([0, this.width]);

    this.x1Axis = this.svg
      .append("g")
      .attr("class", "axis axis-x1")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisTop(this.x1Scale));

    this.line2 = d3
      .line()
      .curve(d3.curveMonotoneX)
      .x((d, i) => this.x1Scale(d.x))
      .y((d, i) => this.yScale(d.y));

    this.svg
      .append("g")
      .attr("class", "path2")
      .attr(
        "transform",
        `translate(${this.margin.left + 1}, ${this.margin.top})`
      )
      .append("path")
      .datum(this.data2)
      .attr("class", "line")
      .attr("d", this.line2)
      .attr("stroke", "yellow")
      .attr("stroke-width", "2")
      .attr("fill", "none");
    //----------------------------------------------------------------------------------------

    // this.area = d3.area()
    //   .curve(d3.curveMonotoneX)
    //   .x((d) => this.xScale(d.x))
    //   .y1((d) => this.yScale(d.y))
    //   .y0(this.height)

    // this.svg.select('g.path')
    //   .append("path")
    //   .datum(this.data)
    //   .attr("class", "area")
    //   .attr("d", this.area)
    //   .attr('fill','lightsteelblue')
    //----------------------------------------------------------------------------------------
    //mouse-over-effects
    let mouseG = this.svg
      .append("g")
      .attr("class", "mouse-over-effects")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    let mousePerLine = mouseG
      .selectAll("g")
      .data(d3.selectAll(".path")._groups)
      .enter()
      .append("g")
      .attr("class", "mouse-per-line");

    mousePerLine
      .append("circle")
      .attr("r", 7)
      .style("fill", "black")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    //----------------------------------------------------------------------
    let mousePerLine_2 = mouseG
      .selectAll("g")
      .data([1, 2])
      .enter()
      .append("g")
      .attr("class", "mouse-per-line_2");

    mousePerLine_2
      .append("circle")
      .attr("r", 7)
      .style("fill", "yellow")
      .style("stroke-width", "1px")
      .style("opacity", "0");

    mouseG
      .append("svg:rect") // append a rect to catch mouse movements on canvas
      .attr("width", this.width) // can't catch mouse events on a g element
      .attr("height", this.height)
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .on("mouseout", function() {
        // on mouse out hide line, circles and text
        d3.selectAll(".mouse-per-line circle, .mouse-per-line_2 circle").style(
          "opacity",
          "0"
        );
      })
      .on("mouseover", function() {
        // on mouse in show line, circles and text
        d3.selectAll(".mouse-per-line circle, .mouse-per-line_2 circle").style(
          "opacity",
          "1"
        );
      })
      .on("mousemove", function() {
        // mouse moving over canvas
        let x0 = that.xScale.invert(d3.mouse(this)[0]);
        let i = bisectDate(that.data, x0, 1);
        let d0 = that.data[i - 1];
        let d1 = that.data[i];
        let d = x0 - d0.x > d1.x - x0 ? d1 : d0;
        //---------------------------------
        let x1_0 = that.x1Scale.invert(d3.mouse(this)[0]);
        let i1 = bisectDate(that.data2, x1_0, 1);
        let d1_0 = that.data2[i1 - 1];
        let d1_1 = that.data2[i1];
        let d_1 = x1_0 - d1_0.x > d1_1.x - x1_0 ? d1_1 : d1_0;

        d3.selectAll(".mouse-per-line")
          .selectAll("circle")
          .attr("transform", function() {
            return `translate(${that.xScale(d.x)}, ${that.yScale(d.y)})`;
          });
        d3.selectAll(".mouse-per-line_2")
          .selectAll("circle")
          .attr("transform", function() {
            return `translate(${that.x1Scale(d_1.x)}, ${that.yScale(d_1.y)})`;
          });
      });
  }

  excludeSegment(a, b) {
    return a.y === b.y && a.y === 300; // here 300 is the max X
  }

  updateChart() {
    let that = this;
    const xDomain = d3.extent(this.data, d => d.x);
    const yDomain = d3.extent(this.data, d => d.y);

    //update top xAxis
    const x1Domain = d3.extent(this.data2, d => d.x);

    this.x1Scale = d3
      .scaleLinear()
      .domain(x1Domain)
      .range([0, this.width]);

    this.x1Axis.transition().call(d3.axisTop(this.x1Scale));

    this.xScale = d3
      .scaleLinear()
      .domain(xDomain)
      .range([0, this.width]);

    this.yScale = d3
      .scaleLinear()
      .domain(yDomain)
      .range([this.height, 0]);

    this.xAxis.transition().call(d3.axisBottom(this.xScale));
    this.yAxis.transition().call(d3.axisLeft(this.yScale));

    let update = this.svg
      .select(".path")
      .select("path")
      .datum(this.data);

    let update2 = this.svg
      .select(".path2")
      .select("path")
      .datum(this.data2);
    // let updateArea = this.svg.select('.path').select('.area').datum(this.data)

    // updateArea.exit().remove();
    // update.exit().remove();

    // updateArea
    // .transition()
    // .delay(0)
    // .duration(1000)
    // .attrTween('d', function(d) {
    //   var previous = d3.select(this).attr('d');
    //   var current = that.area(d);
    //   return interpolatePath(previous, current, that.excludeSegment);
    // });
    update2
      .transition()
      .delay(0)
      .duration(1000)
      .attrTween("d", function(d) {
        var previous = d3
          .select(".path2")
          .select("path")
          .attr("d");
        var current = that.line2(d);
        return interpolatePath(previous, current);
      });

    update
      .transition()
      .delay(0)
      .duration(1000)
      .attrTween("d", function(d) {
        var previous = d3.select(this).attr("d");
        var current = that.line(d);
        return interpolatePath(previous, current);
      });

    // this.svg
    // .select('.path')
    // .select('path')
    // .datum(this.data)
    // .exit()
    // .transition()
    // .duration(1000)
    // .attrTween('d', function (d) {
    //   var previous = d3.select(this).attr('d');
    //   var current = this.line(d);
    //   return d3.interpolatePath(previous, current);
    // })
    // .remove();

    // this.svg
    //   .select('.path')
    //   .select('path')
    //   .datum(this.data)
    //   .transition()
    //   .duration(1000)
    //   .attr('d', this.line)

    // this.svg
    //   .select('.path')
    //   .select('.area')
    //   .datum(this.data)
    //   .transition()
    //   .duration(1000)
    //   .attr("d", this.area);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.data.previousValue !== undefined) {
      this.updateChart();
    }
    console.log(changes);
  }

  ngOnInit() {
    this.createLineChart();
  }
}
