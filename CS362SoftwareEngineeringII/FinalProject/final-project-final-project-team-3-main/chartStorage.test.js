/**
 * @jest-environment jsdom
 */
require('@testing-library/jest-dom/extend-expect');
require('mock-local-storage');

const domTesting = require('@testing-library/dom');
const fs = require('fs');

beforeEach(() => {
    global.localStorage = window.localStorage;
});


const { saveChart, loadAllSavedCharts, loadSavedChart, updateCurrentChartData, loadCurrentChartData } = require('./src/lib/chartStorage');

test('saveChart should add a new chart to the saved charts', () => {

    const chart = { id: 1, name: 'Chart 1' };
    saveChart(chart);

    const savedCharts = loadAllSavedCharts();
    expect(savedCharts).toEqual([chart]);
});


test('loadAllSavedCharts should return the array of saved charts', () => {

    const savedCharts = [{ id: 1, name: 'Chart 1' }, { id: 2, name: 'Chart 2' }];
    localStorage.setItem('savedCharts', JSON.stringify(savedCharts));

    const charts = loadAllSavedCharts();

    expect(charts).toEqual(savedCharts);
});


test('loadSavedChart should return the specified chart from the array of saved charts', () => {
    const savedCharts = [{ id: 1, name: 'Chart 1' }, { id: 2, name: 'Chart 2' }];
    localStorage.setItem('savedCharts', JSON.stringify(savedCharts));

    const chart = loadSavedChart(1);

    expect(chart).toEqual(savedCharts[1]);
});

test('updateCurrentChartData should store the data for the chart currently being built in localStorage', () => {
    const currentChartData = { data: [1, 2, 3] };

    updateCurrentChartData(currentChartData);

    const storedData = localStorage.getItem('currentChartData');
    expect(JSON.parse(storedData)).toEqual(currentChartData);
});

test('loadCurrentChartData should load and return the data for the chart currently being built', () => {
    const currentChartData = { data: [1, 2, 3] };
    localStorage.setItem('currentChartData', JSON.stringify(currentChartData));

    const loadedData = loadCurrentChartData();

    expect(loadedData).toEqual(currentChartData);
});
