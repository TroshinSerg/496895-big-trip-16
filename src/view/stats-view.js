import SmartView from './smart-view.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {EVENT_TYPES} from '../utils/const.js';
import {getDurationString, getDurationInMinutes} from '../utils/common.js';

const getfilteredPoints = (points, type) => points.filter((point) => point.type === type);
const CustomChartOptions = {
  MONEY: {
    setData: (points, type) => getfilteredPoints(points, type).reduce((total, point) => total + point.basePrice, 0),
    formatter: (val) => `€ ${val}`
  },
  TYPE: {
    setData: (points, type) => getfilteredPoints(points, type).length,
    formatter: (val) => `${val}x`
  },
  TIME: {
    setData: (points, type) => getfilteredPoints(points, type).reduce((duration, point) => duration + getDurationInMinutes(point.dateFrom, point.dateTo), 0),
    formatter: (val) => getDurationString(val)
  }
}; //В данном случае можно ли так именовать перечисление?

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
      const chartTypeUpper = chartType.toUpperCase();
      const canvas = this.element.querySelector(`#${chartType}`);

      // Рассчитаем высоту канваса в зависимости от того, сколько данных в него будет передаваться
      canvas.height = this.#barHeight * this.#eventTypes.length;

      const chartData = this.#getDataForChart(this._data, CustomChartOptions[chartTypeUpper].setData);
      const dataObjects = this.#setArrayOfObjects(this.#labels, chartData);

      dataObjects.sort((dataObjectA, dataObjectB) => dataObjectB.data - dataObjectA.data);

      this.#parseArrayOfObjects(dataObjects, sortedLabels, sortedData);
      this.#chart.set(chartTypeUpper, new Chart(canvas, {
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
              formatter: CustomChartOptions[chartTypeUpper].formatter
            },
          },
          title: {
            display: true,
            text: chartTypeUpper,
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

  #setArrayOfObjects = (labels, data) => labels.map((label, index) => ({label, data: data[index]}));

  #parseArrayOfObjects = (arrayOfObjects, sortedLabels, sortedData) => {
    arrayOfObjects.forEach((objectsItem) => {
      sortedLabels.push(objectsItem.label);
      sortedData.push(objectsItem.data);
    });
  };
}
