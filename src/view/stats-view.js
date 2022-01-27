import SmartView from './smart-view.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {EVENT_TYPES} from '../utils/const.js';
import {getDurationString, getDurationInMinutes} from '../utils/common.js';

const getFilteredPoints = (points, type) => points.filter((point) => point.type === type);

const createStatsTemplate = () => (
  `<section class="statistics">
    <h2 class="visually-hidden">Trip statistics</h2>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="money" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="type" width="900"></canvas>
    </div>

    <div class="statistics__item">
      <canvas class="statistics__chart" id="time" width="900"></canvas>
    </div>
  </section>`
);

const customChartOption = {
  money: {
    setData: (points, type) => getFilteredPoints(points, type).reduce((total, point) => total + point.basePrice, 0),
    formatter: (val) => `€ ${val}`
  },
  type: {
    setData: (points, type) => getFilteredPoints(points, type).length,
    formatter: (val) => `${val}x`
  },
  time: {
    setData: (points, type) => getFilteredPoints(points, type).reduce((duration, point) => duration + getDurationInMinutes(point.dateFrom, point.dateTo), 0),
    formatter: (val) => getDurationString(val)
  },
};

export default class StatsView extends SmartView {
  #eventTypes = [...EVENT_TYPES];
  #chartTypes = ['money', 'type', 'time'];
  #barHeight = 55;
  #labels = null;
  #chart = new Map();

  constructor(points) {
    super();
    this._data = [...points];
    this.#labels = this.#eventTypes.map((type) => type.toUpperCase());

    this.#setCharts(this._data);
  }

  get template() {
    return createStatsTemplate(this._data);
  }

  removeElement = () => {
    super.removeElement();

    this.#chart.forEach((chart) => chart.destroy());
    this.#chart.clear();
  }

  restore = () => {
    this.#setCharts();
  }

  #setCharts = () => {
    this.#chartTypes.forEach((chartType) => {
      const sortedData = [];
      const sortedLabels = [];
      const canvas = this.element.querySelector(`#${chartType}`);

      canvas.height = this.#barHeight * this.#eventTypes.length;

      const chartData = this.#getDataForChart(this._data, customChartOption[chartType].setData);
      const dataItems = this.#setDataItems(this.#labels, chartData);

      dataItems.sort((dataItemA, dataItemB) => dataItemB.data - dataItemA.data);

      this.#parseDataItems(dataItems, sortedLabels, sortedData);
      this.#chart.set(chartType, new Chart(canvas, {
        plugins: [ChartDataLabels],
        type: 'horizontalBar',
        data: {
          labels: sortedLabels,
          datasets: [{
            data: sortedData,
            backgroundColor: '#ffffff',
            hoverBackgroundColor: '#ffffff',
            anchor: 'start',
            barThickness: 44,
            minBarLength: 70,
          }],
        },
        options: {
          responsive: false,
          plugins: {
            datalabels: {
              font: {
                size: 13,
              },
              color: '#000000',
              anchor: 'end',
              align: 'start',
              formatter: customChartOption[chartType].formatter
            },
          },
          title: {
            display: true,
            text: chartType.toUpperCase(),
            fontColor: '#000000',
            fontSize: 23,
            position: 'left',
          },
          scales: {
            yAxes: [{
              ticks: {
                fontColor: '#000000',
                padding: 5,
                fontSize: 13,
              },
              gridLines: {
                display: false,
                drawBorder: false,
              },
            }],
            xAxes: [{
              ticks: {
                display: false,
                beginAtZero: true,
              },
              gridLines: {
                display: false,
                drawBorder: false,
              },
            }],
          },
          legend: {
            display: false,
          },
          tooltips: {
            enabled: false,
          },
        },
      }));
    });
  };

  #getDataForChart = (points, setDataItem) => this.#eventTypes.map((type) => setDataItem(points, type));

  #setDataItems = (labels, data) => labels.map((label, index) => ({label, data: data[index]}));

  #parseDataItems = (dataItems, sortedLabels, sortedData) => {
    dataItems.forEach((dataItem) => {
      sortedLabels.push(dataItem.label);
      sortedData.push(dataItem.data);
    });
  };
}
