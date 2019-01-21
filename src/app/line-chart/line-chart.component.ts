import { Component, OnInit, ViewChild, ElementRef, Input, OnChanges, SimpleChanges} from '@angular/core';
import * as d3 from "d3";
import {interpolatePath} from "d3-interpolate-path";

@Component({
  selector: 'app-line-chart',
  templateUrl: './line-chart.component.html',
  styleUrls: ['./line-chart.component.css']
})
export class LineChartComponent implements OnInit, OnChanges {

  constructor() { }

  @ViewChild('lineChart')
  private container: ElementRef;

  @Input()
  private data: Array<any>

  private margin: any =  { top: 20, right: 20, bottom: 20, left: 20 }
  private width: number;
  private height: number;
  private xScale: any;
  private yScale: any;
  private xAxis: any;
  private yAxis: any;
  private line: any;
  private svg: any;
  private area: any;

  createLineChart(){
    const element = this.container.nativeElement
    this.width = element.offsetWidth - this.margin.left - this.margin.right;
    this.height = element.offsetHeight - this.margin.top - this.margin.bottom;

    this.svg = d3.select(element)
      .append("svg")
      .attr('width', element.offsetWidth)
      .attr('height', element.offsetHeight)

    const xDomain = d3.extent(this.data, d =>  d.x);
    const yDomain = d3.extent(this.data, d =>  d.y);

    this.xScale = d3.scaleLinear().domain(xDomain).range([0, this.width]);
    this.yScale = d3.scaleLinear().domain(yDomain).range([this.height, 0]);

    this.line = d3.line()
      .curve(d3.curveMonotoneX)
      .x((d,i) => this.xScale(d.x))
      .y((d,i) => this.yScale(d.y))

    this.xAxis = this.svg
      .append("g")
      .attr("class", "axis axis-x")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top + this.height})`)
      .call(d3.axisBottom(this.xScale));

    this.yAxis = this.svg
      .append("g")
      .attr("class", "axis axis-y")
      .attr("transform", `translate(${this.margin.left}, ${this.margin.top})`)
      .call(d3.axisLeft(this.yScale));

    this.area = d3.area()
      .curve(d3.curveMonotoneX)
      .x((d) => this.xScale(d.x))
      .y1((d) => this.yScale(d.y))
      .y0(this.height)

    this.svg
      .append("g")
      .attr('class', 'path')
      .attr("transform", `translate(${this.margin.left+1}, ${this.margin.top})`)
      .append("path")
      .datum(this.data)
      .attr("class", "line")
      .attr("d", this.line)
      .attr("stroke", "black")
      .attr("stroke-width", "2")
      .attr("fill", "none");
    
    this.svg.select('g.path')
      .append("path")
      .datum(this.data)
      .attr("class", "area")
      .attr("d", this.area)
      .attr('fill','lightsteelblue')
  }

  excludeSegment(a, b) {
    return a.y === b.y && a.y === 300 // here 300 is the max X
  }

  updateChart(){
    let that = this;
    const xDomain = d3.extent(this.data, d =>  d.x);
    const yDomain = d3.extent(this.data, d =>  d.y);

    this.xScale = d3.scaleLinear().domain(xDomain).range([0, this.width]);
    this.yScale = d3.scaleLinear().domain(yDomain).range([this.height, 0]);

    this.xAxis.transition().call(d3.axisBottom(this.xScale));
    this.yAxis.transition().call(d3.axisLeft(this.yScale));

    let update = this.svg.select('.path').select('path').datum(this.data)
    let updateArea = this.svg.select('.path').select('.area').datum(this.data)

    // updateArea.exit().remove();
    // update.exit().remove();

    updateArea
    .transition()
    .delay(0)
    .duration(1000)
    .attrTween('d', function(d) {
      var previous = d3.select(this).attr('d');
      var current = that.area(d);
      return interpolatePath(previous, current, that.excludeSegment);
    });

    update
      .transition()
      .delay(0)
      .duration(1000)
      .attrTween('d', function(d) {
        var previous = d3.select(this).attr('d');
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
    if(changes.data.previousValue !== undefined){
      this.updateChart();
    }
  }

  ngOnInit() {
    this.createLineChart();
  }

}
