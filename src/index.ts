import './styles.css';
import Highcharts from 'highcharts/highstock';
import Exporting from 'highcharts/modules/exporting';
import ExportData from 'highcharts/modules/export-data';
import axios from 'axios';
import {
  csvToJson,
} from './helper';

Exporting(Highcharts);
ExportData(Highcharts);

const CONTAINTER_ID = 'myChart';
const CHART_FOOTER_ID = 'chart_footer';
const CHART_TITLE = '10-Year Treasury Constant Maturity Minus 2-Year Treasury Constant Maturity';
const SUBTITLE = '(T10Y2Y)';
const Y_AXIS_TITLE = 'Percent';
const PLOT_BAND_COLOR = '#e6e6e6';
const PLOT_BAND_COLOR_2 = '#F5F5DC';
const SERIES_COLOR = '#4572a7';

init();

// Gotchas:
// 1. specify target container in `chart.renderTo`
// 2. specify type for each series
// 3. align range selector with demo
async function init() {
  const loadDomContent = new Promise((resolve, reject) => {
    document.addEventListener('DOMContentLoaded', function () {
      resolve(true);
    });
  });
  try {
    await loadDomContent;
    const res = await axios.get('/static/T10Y2Y.csv');
    const cycleDatesRes = await axios.get('/static/cycle_dates.csv');
    const array = (
      csvToJson(res.data)
      .map(row => {
        const date = (new Date(row[0])).getTime();
        let value: number | null = parseFloat(row[1]);
        if (Number.isNaN(value) === true) {
          value = null;
        }
        return [date, value];
      })
    );
    const cycleDatesArrRaw = csvToJson(cycleDatesRes.data);
    const cycleDatesArr = (
      cycleDatesArrRaw
      .map(row => {
        const start = row[0] !== '' ? (new Date(row[0])).getTime() : null;
        const end = row[1] !== '' ? (new Date(row[1])).getTime() : (new Date()).getTime();
        return [start, end];
      })
      // map to plot bands array
      .map((arr, index) => {
        return {
          // light yellow for the ongoing recession, grey for previous recessions
          color: (
            index === cycleDatesArrRaw.length - 1 
            ? PLOT_BAND_COLOR_2 
            : PLOT_BAND_COLOR
          ),
          from: arr[0],
          to: arr[1],
        };
      })
    );
    const options: Highcharts.Options = {
      chart: {
        renderTo: CONTAINTER_ID,
        height: 600,
      },
      exporting: {
        enabled: true,
      },
      rangeSelector: {
        buttonPosition: {
          align: 'right',
        },
        buttons: [
          {
            type: 'year',
            count: 1,
            text: '1Y',
            title: 'View 1 year',
            events: {
              click: function() {
                xAxisFormatter(chart, '{value: %Y-%m}');
              }
            }
          },
          {
            type: 'year',
            count: 5,
            text: '5Y',
            title: 'View 5 years',
            events: {
              click: function() {
                xAxisFormatter(chart, '{value: %Y-%m}');
              }
            }
          },
          {
            type: 'year',
            count: 10,
            text: '10Y',
            title: 'View 10 years',
            events: {
              click: function() {
                xAxisFormatter(chart, '{value: %Y}');
              }
            }
          },
          {
            type: 'all',
            text: 'Max',
            title: 'View all',
            events: {
              click: function() {
                xAxisFormatter(chart, '{value: %Y}');
              }
            }
          }
        ],
        dropdown: 'never'
      },
      tooltip: {
        // show date and value on tooltip, omit series description
        formatter: function () {
          const date = new Date(this.x);
          const dateStr = date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            weekday: 'long',
          });
          return `${dateStr}: ${this.y.toFixed(2)}`;
        }
      },
      title: {
        text: CHART_TITLE,
      },
      subtitle: {
        text: SUBTITLE,
      },
      xAxis: {
        type: 'datetime',
        plotBands: cycleDatesArr,
      },
      yAxis: {
        // force the axis to show on the left
        opposite: false,
        title: {
          text: Y_AXIS_TITLE,
        },
        // add thick horizontal line at value 0
        plotLines: [
          {
            color: 'black',
            width: 2,
            value: 0,
            // raise the line to above grid lines
            zIndex: 10,
          }
        ]
      },
      series: [
        {
          type: 'line',
          name: CHART_TITLE,
          data: array,
          // point interploation
          connectNulls: true,
          color: SERIES_COLOR,
        },
      ],
      legend: {
        enabled: true,
      }
    };
    const chart = Highcharts.stockChart(options);
    const chartFooter = document.getElementById(CHART_FOOTER_ID);
    chartFooter.style.display = 'block';
  } catch (err) {
    throw err;
  }
}

function xAxisFormatter(chart: Highcharts.Chart, format: string) {
  chart.xAxis[0].update({
    labels: {
      format
    }
  })
}
