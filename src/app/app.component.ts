import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"]
})
export class AppComponent implements OnInit {
  private chartData: Array<any>;
  private pieChartData: Array<any>;
  private lineChart: Array<any>;
  private lineChart_2: Array<any>;

  getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
  }
  generateData() {
    this.chartData = [];
    for (let i = 0; i < 25 + Math.floor(Math.random() * 10); i++) {
      this.chartData.push([`Index ${i}`, Math.floor(Math.random() * 100)]);
    }
  }

  randomData(samples) {
    this.lineChart = [];
    let data = [];
    let count = this.getRandomArbitrary(1, 2);
    for (let index = 0; index < count; index++) {
      for (let i = 0; i < samples; i++) {
        data.push({
          x: i,
          y: this.getRandomArbitrary(10, 100)
        });
      }
      this.lineChart.push({ data });
      data = [];
    }
    return this.lineChart;
  }

  randomData_2(samples) {
    this.lineChart_2 = [];
    let min = Math.min(...this.lineChart.map(data => data.y));
    let max = Math.max(...this.lineChart.map(data => data.y));
    for (let i = 0; i < samples; i++) {
      this.lineChart_2.push({
        x: i,
        y: this.getRandomArbitrary(min, max)
      });
    }

    return this.lineChart_2;
  }

  generateDataPieChart() {
    this.pieChartData = [];
    for (let i = 0; i < 5 + Math.floor(Math.random() * 10); i++) {
      this.pieChartData.push(Math.floor(Math.random() * 100));
    }
  }

  changedDataPieChart() {
    this.randomData(Math.random() * 50);
    this.randomData_2(Math.random() * 20);
    this.generateData();
    this.generateDataPieChart();
  }

  ngOnInit() {
    this.randomData(50);
    this.randomData_2(20);
    this.generateData();
    this.generateDataPieChart();
    // setInterval(() => {
    //   this.generateData();
    //   this.generateDataPieChart();
    // }, 3000);
  }
}
