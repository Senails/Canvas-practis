import './styles.scss';
import { getChartData } from './data.js';
import { Chart } from './chart.js';
let data = getChartData();

let chart = Chart(document.querySelector('#chart'), data);
chart.init();



















//