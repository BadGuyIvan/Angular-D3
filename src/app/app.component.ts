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

  generateData() {
    this.chartData = [];
    for (let i = 0; i < 25 + Math.floor(Math.random() * 10); i++) {
      this.chartData.push([`Index ${i}`, Math.floor(Math.random() * 100)]);
    }
  }

  randomData(samples) {
    this.lineChart = []
  
    for (let i = 0; i < samples; i++) {
      this.lineChart.push({
        x: i,
        y: Math.random()*100
      });
    }
  
    return this.lineChart;
  }

  generateDataPieChart() {
    this.pieChartData = [];
    for (let i = 0; i < 5 + Math.floor(Math.random() * 10) ; i++) {
      this.pieChartData.push( Math.floor(Math.random() * 100));
    }
  }

  changedDataPieChart() {
    this.randomData(Math.random()*50)
    this.generateData();
    this.generateDataPieChart();
  }

  ngOnInit() {
    this.randomData(50)
    this.generateData();
    this.generateDataPieChart()
    // setInterval(() => {
    //   this.generateData();
    //   this.generateDataPieChart();
    // }, 3000);
  }
}
