import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  ViewEncapsulation
} from "@angular/core";
import * as d3 from "d3";
import { interpolatePath } from "d3-interpolate-path";

@Component({
  selector: "app-line-chart",
  templateUrl: "./line-chart.component.html",
  styleUrls: ["./line-chart.component.css"],
  encapsulation: ViewEncapsulation.None
})
export class LineChartComponent implements OnInit, OnChanges {
  constructor() { }

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

  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }

  line_length(pointA, pointB) {
    const lengthX = pointB.x - pointA.x;
    const lengthY = pointB.y - pointA.y;
    return {
      length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
      angle: Math.atan2(lengthY, lengthX)
    }
  }

  createLineChart() {
    let that = this;
    const element = this.container.nativeElement;
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;
    var bisectDate = d3.bisector(function (d) {
      return d.x;
    }).left;
    this.svg = d3
      .select(element)
      .append("svg")
      .attr("width", element.offsetWidth)
      .attr("height", element.offsetHeight);

    //----------------------------------------------------------------------------------------
    //bottom Axis
    const xDomain = d3.extent(this.data[0].data, d => d.x);
    const yDomain = d3.extent(this.data[0].data, d => d.y);

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
      .x((d, index) => this.xScale(index))
      .y((d) => this.yScale(d.y))

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
      .append("path")
      .attr("class", "line")
      .attr("d", d => this.line(d.data))
      .attr("stroke", d => d.color)
      .attr("stroke-width", "2")
      .attr("fill", "none")

    //----------------------------------------------------------------------------------------
    // mouse-over-effects
    let mouseG = this.svg
      .append("g")
      .attr("class", "mouse-over-effects")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`);

    let mousePerLine = mouseG
      .append("g")
      .attr("class", "mouse-per-line")
      .style("display", "none");

    var mousePerLine_visibule = mousePerLine;

    mousePerLine
      .selectAll('circle')
      .data(that.svg.select(".lines").selectAll('path')._groups[0])
      .enter()
      .append("circle")
      .attr("r", 7)
      .style("stroke-width", "1px")
    //------------------------------------------------------------------------------
    var tooltip = d3.select('#line_chart')
      .append("xhtml:div")
      .attr("class", "tooltip")
      .style("opacity", 0)
      .style("top", '0')
      .style('position', 'absolute')

    var table = tooltip.append('table')
    var thead = table.append('thead')
    var tbody = table.append('tbody')

    var rows = tbody.selectAll('tr')
      .data(this.data)
      .enter()
      .append('tr')
      .append("td")
      .append("div")
      .attr("class", "container")

    rows
      .append("svg")
      .style("height", "20px")
      .style("width", "20px")
      .append("circle")
      .attr("r", 7)
      .attr('cx', "10")
      .attr('cy', '10')
      .attr("fill", d => d.color)
      .style("stroke-width", "1px")

    rows.append("div")
      .attr("class", "value")

    d3.select("#line_chart")
      .append("svg")
      .attr("class", "mouse_over")
      .append("rect") // append a rect to catch mouse movements on canvas
      .attr("width", this.width) // can't catch mouse events on a g element
      .attr("height", this.height)
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
      .attr("fill", "transparent")
      .on("mouseover", function () {
        mousePerLine_visibule.style("display", null)
        d3.select('.tooltip')
          .style("opacity", "1")
      })

      .on("mouseout", function () {
        mousePerLine_visibule.style("display", "none")
        // on mouse out hide line, circles and text
        d3.selectAll(".tooltip")
          .style("opacity", "0")
          .style("transform", "translate(0px,0px)")
      })
      .on("mousemove", function () {
        // mouse moving over canvas
        var canvas_mouse = d3.mouse(this);
        let x0 = that.xScale.invert(d3.mouse(this)[0]);
        that.svg.select(".lines")
          .selectAll('path')
          .each((data, index) => {
            let i = bisectDate(that.data[index].data, x0, 1);
            let d0 = that.data[index].data[i - 1];
            let d1 = that.data[index].data[i];
            let d = x0 - d0.x > d1.x - x0 ? d1 : d0;

            var cord = document.getElementsByClassName('tooltip')[0].getBoundingClientRect();

            var x = canvas_mouse[0] + 20 <= that.width / 2 ? canvas_mouse[0] + cord.width / 2 : canvas_mouse[0] - cord.width

            d3.select('.tooltip')
              .style("transform", function () {
                return `translate(${x}px, ${(canvas_mouse[1] + 20) - cord.height / 2}px)`;
              })

            d3.select(`tr:nth-child(${index + 1}) .value`)
              .text(Math.round(d.y))

            d3.select(".mouse-per-line")
              .select(`circle:nth-child(${index + 1})`)
              .style("fill", () => that.data[index].color)
              .attr("transform", function () {
                return `translate(${that.xScale(d.x)}, ${that.yScale(d.y)})`;
              });
          })
      })
  }

  excludeSegment(a, b) {
    return a.y === b.y && a.y === 300; // here 300 is the max X
  }

  // tweenDash() {
  //   const l = this.getTotalLength();
  //   const interpolate = d3.interpolateString(`0,${l}`, `${l},${l}`);
  //   return function(t) { return interpolate(t); };
  // }

  updateChart() {
    let that = this;
    const xDomain = d3.extent(this.data[0].data, d => d.x);
    const yDomain = d3.extent(this.data[0].data, d => d.y);

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
      .select(".lines")
      .selectAll("path")
      .data(this.data)

    update.exit()
      .transition()
      .duration(2000)
      .attrTween('stroke-dasharray', function () {
        const l = this.getTotalLength();
        const interpolate = d3.interpolateString(`${l}`, `0`);
        return function (t) { return `${interpolate(t)},${l}`; };
      })
      .remove();

    //--------------------------------------------------
    //update tooltip

    var update_tooltip = d3.select('tbody').selectAll('tr')
      .data(this.data)

    update_tooltip.exit().remove()

    var rows = update_tooltip
      .enter()
      .append('tr')
      .append("td")
      .append("div")
      .attr("class", "container")

    rows
      .append("svg")
      .style("height", "20px")
      .style("width", "20px")
      .append("circle")
      .attr("r", 7)
      .attr('cx', "10")
      .attr('cy', '10')
      .attr("fill", d => d.color)
      .style("stroke-width", "1px")

    rows.append("div")
      .attr("class", "value")

    //--------------------------------------------------
    //update dot

    let update_dot = d3.select('.mouse-per-line').selectAll('circle')
      .data(this.data)

    update_dot.exit().remove()

    update_dot
      .enter()
      .append("circle")
      .attr("r", 7)
      .style("stroke-width", "1px")

    //need remove stroke-dasharray because when update line can be diffirent length
    update.attr('stroke-dasharray', null)

    //update exist line
    update
      .transition()
      .delay(0)
      .duration(1000)
      .attrTween("d", function (d) {
        var previous = d3.select(this).attr("d");
        var current = that.line(d.data);
        return interpolatePath(previous, current);
      })

    //add new line 
    update.enter()
      .append("path")
      .attr("class", "line")
      .attr("d", d => this.line(d.data))
      .attr("stroke", d => d.color)
      .attr("stroke-width", "2")
      .attr("fill", "none")
      .transition()
      .duration(2000)
      .attrTween("stroke-dasharray", function () {
        const l = this.getTotalLength();
        const interpolate = d3.interpolateString(`0,${l}`, `${l},${l}`);
        return function (t) { return interpolate(t); };
      })
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
