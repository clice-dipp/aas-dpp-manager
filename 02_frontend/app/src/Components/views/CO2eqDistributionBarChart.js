/* 
*	 Copyright 2025 Software GmbH (previously Software AG)
*    
*    Licensed under the Apache License, Version 2.0 (the "License");
*    you may not use this file except in compliance with the License.
*    You may obtain a copy of the License at
*    
*      http://www.apache.org/licenses/LICENSE-2.0
*    
*    Unless required by applicable law or agreed to in writing, software
*    distributed under the License is distributed on an "AS IS" BASIS,
*    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
*    See the License for the specific language governing permissions and
*    limitations under the License.
*/

import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto'; // Importing Chart.js

function C02eqDistributionBarChart({ aasData, optionsScaleX }) {
  const chartContainer = useRef(null);
  const chartInstance = useRef(null);

  const lifeCycleMapping = {
    "0173-1#07-ABU208#001": "A1 – raw material",
    "0173-1#07-ABU209#001": "A2 - transport to factory",
    "0173-1#07-ABU210#001": "A3 - production",
    "0173-1#07-ABU211#001": "A4 - transport to final destination",
    "0173-1#07-ABU212#001": "B1 – usage phase",
    "0173-1#07-ABV498#001": "B2 – maintenance",
    "0173-1#07-ABV497#001": "B3 - repair",
    "0173-1#07-ABV499#001": "B5 – update/upgrade, refurbishing",
    "0173-1#07-ABV500#001": "B6 – energy consumption",
    "0173-1#07-ABV501#001": "B7 – water consumption",
    "0173-1#07-ABV502#001": "C1 – reassembly",
    "0173-1#07-ABU213#001": "C2 – transport to recycler",
    "0173-1#07-ABV503#001": "C3 – recycling, waste treatment",
    "0173-1#07-ABV504#001": "C4 – landfill",
    "0173-1#07-ABU214#001": "D - reuse",
    "0173-1#07-ABZ789#001": "A1-A3 – combined A1, A2, and A3 processes",
    "": "not defined"
  };

  const colorMapping = {
    "0173-1#07-ABU208#001": 'rgba(204, 197, 255, 0.5)',     // A1 - raw material
    "0173-1#07-ABU209#001": 'rgba(172, 149, 255, 0.5)',     // A2 - transport to factory
    "0173-1#07-ABU210#001": 'rgba(152, 103, 254, 0.5)',     // A3 production
    "0173-1#07-ABU211#001": 'rgba(142, 60, 247, 0.5)',      // A4 - transport to final destination
    "0173-1#07-ABU212#001": 'rgba(199, 242, 224, 0.5)',     // B1 - usage phase
    "0173-1#07-ABV498#001": 'rgba(170, 234, 212, 0.5)',     // B2 - maintenance
    "0173-1#07-ABV497#001": 'rgba(141, 225, 202, 0.5)',     // B3 - repair
    "0173-1#07-ABV499#001": 'rgba(113, 215, 194, 0.5)',     // B5 - update, refurbishing
    "0173-1#07-ABV500#001": 'rgba(86, 204, 188, 0.5)',      // B6 energy consumption
    "0173-1#07-ABV501#001": 'rgba(60, 193, 183, 0.5)',      // B7 - water consumption
    "0173-1#07-ABV502#001": 'rgba(142, 155, 240, 0.5)',     // C1 - reassembly
    "0173-1#07-ABU213#001": 'rgba(94, 116, 230, 0.5)',      // C2 - transport to recycler
    "0173-1#07-ABV503#001": 'rgba(47, 77, 218, 0.5)',       // C3 - recycling, waste treatment
    "0173-1#07-ABV504#001": 'rgba(0, 40, 205, 0.5)',        // C4 - landfill
    "0173-1#07-ABU214#001": 'rgba(242, 100, 48, 0.5)',      // D - reuse
    "0173-1#07-ABZ789#001": 'rgba(0, 0, 0, 0)'               // not defined (black color with 0 opacity)
  };

  useEffect(() => {
    // Initialize chart on mount
    if (chartContainer.current && !chartInstance.current) {
      const ctx = chartContainer.current.getContext('2d');
      const keys = Object.keys(lifeCycleMapping);

      const aasDataset = keys.map(key => {
        return {
          label: lifeCycleMapping[key],
          data: [0, 0, 0, 0], // Initial data
          borderWidth: 1,
          borderRadius: 4,
          backgroundColor: colorMapping[key]
        };
      });

      chartInstance.current = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['Production', 'Usage', 'After life', 'Second life'],
          datasets: aasDataset
        },
        options: {
          indexAxis: 'y',
          scales: {
            x: optionsScaleX,
            y: {
              ticks: {
                font: {
                  size: 10
                },
                display: true
              },
              stacked: true
            }
          },
          plugins: {
            legend: {
              display: false
            },
            tooltip: {
              // Disable the on-canvas tooltip
              enabled: false,

              external: function (context) {
                // Tooltip Element
                let tooltipEl = document.getElementById('chartjs-tooltip');

                // Create element on first render
                if (!tooltipEl) {
                  tooltipEl = document.createElement('div');
                  tooltipEl.id = 'chartjs-tooltip';
                  tooltipEl.innerHTML = '<table></table>';
                  document.body.appendChild(tooltipEl);
                }

                // Hide if no tooltip
                const tooltipModel = context.tooltip;
                if (tooltipModel.opacity === 0) {
                  tooltipEl.style.opacity = 0;
                  return;
                }

                // Set caret Position
                tooltipEl.classList.remove('above', 'below', 'no-transform');
                if (tooltipModel.yAlign) {
                  tooltipEl.classList.add(tooltipModel.yAlign);
                } else {
                  tooltipEl.classList.add('no-transform');
                }

                function getBody(bodyItem) {
                  return bodyItem.lines;
                }

                // Set Text
                if (tooltipModel.body) {
                  const titleLines = tooltipModel.title || [];
                  const bodyLines = tooltipModel.body.map(getBody);

                  let innerHtml = '<thead>';


                  titleLines.forEach(function (title, index) {
                    const color = tooltipModel.labelColors[index]?.backgroundColor || 'rgba(0, 0, 0, 0)';
                    innerHtml += '<tr><th style="color: ' + color + '">' + title + '</th></tr>';
                  });


                  innerHtml += '</thead><tbody>';

                  bodyLines.forEach(function (body, i) {
                    const colors = tooltipModel.labelColors[i];
                    let style;
                    style += '; border-width: 2px';
                    const span = '<span style="' + style + '">' + body + '</span>';
                    innerHtml += '<tr><td>' + span + ' kg CO2' + '</td></tr>';
                  });
                  innerHtml += '</tbody>';

                  let tableRoot = tooltipEl.querySelector('table');
                  tableRoot.innerHTML = innerHtml;
                }

                const position = context.chart.canvas.getBoundingClientRect();


                // Display, position, and set styles for font
                tooltipEl.style.opacity = 1;
                tooltipEl.style.position = 'absolute';
                tooltipEl.style.left = position.left + window.pageXOffset + tooltipModel.caretX + 100 + 'px';
                tooltipEl.style.top = position.top + window.pageYOffset + tooltipModel.caretY + 'px';

                tooltipEl.style.padding = '3px';
                tooltipEl.style.pointerEvents = 'none';
                tooltipEl.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                tooltipEl.style.color = 'white';
                tooltipEl.style.borderRadius = '3px';
                tooltipEl.style.transform = 'translate(-50%, 0)';
                tooltipEl.style.transition = 'all .1s ease';

              }
            }
          }
        }
      });
    }
  }, []);

  useEffect(() => {
    // Update dataset if chart instance exists
    if (chartInstance.current) {
      const keys = Object.keys(lifeCycleMapping);

      const updatedDatasets = keys.map(key => {
        const dataset = chartInstance.current.data.datasets.find(ds => ds.label === lifeCycleMapping[key]);
        if (dataset) {
          switch (true) {
            case key.startsWith('0173-1#07-ABU208') || key.startsWith('0173-1#07-ABU209') || key.startsWith('0173-1#07-ABU210') || key.startsWith('0173-1#07-ABU211'):
              dataset.data = [aasData.sumCO2eqPerLifeCycle(key), 0, 0, 0];
              break;
            case key.startsWith('0173-1#07-ABU212') || key.startsWith('0173-1#07-ABV498') || key.startsWith('0173-1#07-ABV497') || key.startsWith('0173-1#07-ABV499') || key.startsWith('0173-1#07-ABV500') || key.startsWith('0173-1#07-ABV501'):
              dataset.data = [0, aasData.sumCO2eqPerLifeCycle(key), 0, 0];
              break;
            case key.startsWith('0173-1#07-ABV502') || key.startsWith('0173-1#07-ABU213') || key.startsWith('0173-1#07-ABV503') || key.startsWith('0173-1#07-ABV504'):
              dataset.data = [0, 0, aasData.sumCO2eqPerLifeCycle(key), 0];
              break;
            case key.startsWith('0173-1#07-ABU214'):
              dataset.data = [0, 0, 0, aasData.sumCO2eqPerLifeCycle(key)];
              break;
            default:
              dataset.data = [0, 0, 0, 0];
              break;
          }
        }
        return dataset;
      });

      chartInstance.current.update();
    }
  }, [aasData]);

  return (
    <canvas ref={chartContainer}
      style={{ display: 'block', width: '100%', height: '100%' }}
    ></canvas>
  );
}

export default C02eqDistributionBarChart;
