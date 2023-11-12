import { Container, Row, Col, Button, Modal, Form, InputGroup } from 'react-bootstrap';
import MainLayout from "../../layouts/main-layout";
import MovieItem from './components/MovieItem';
import React, { useState, useEffect, useMemo } from 'react';
import { movieService } from '../../services/api/movieService';

import { useDispatch } from 'react-redux';
import { dispatchCart } from '../../store/reducers/cart';

import { BiSearch } from 'react-icons/bi';

export default function HomePage() {
    // const startYear = 1960;
    let [startYear, setStartYear] = useState(1960);
    const endYear = 2018;
    // btn = document.getElementById('play-pause-button');
    // input = document.getElementById('play-range');
    let [inputNew, setInputNew] = useState(1960);
    const nbr = 20;

    // let dataset;
    let [dataset, setDataset] = useState(1960);
    // let chart;
    let [chart, setChart] = useState();

    useEffect(() => {
        initState();
    }, []);

    async function initState() {
        try {
            dataset = await fetch(
                'http://localhost:8090/api/populations'
            ).then(response => response.json())
                .then(response => response.data.population);


            chart = Highcharts.chart('container', {
                chart: {
                    animation: {
                        duration: 500
                    },
                    marginRight: 50
                },
                title: {
                    text: 'World population by country',
                    align: 'left'
                },
                subtitle: {
                    useHTML: true,
                    text: getSubtitle(),
                    floating: true,
                    align: 'right',
                    verticalAlign: 'middle',
                    y: -20,
                    x: -100
                },

                legend: {
                    enabled: false
                },
                xAxis: {
                    type: 'category'
                },
                yAxis: {
                    opposite: true,
                    tickPixelInterval: 150,
                    title: {
                        text: null
                    }
                },
                plotOptions: {
                    series: {
                        animation: false,
                        groupPadding: 0,
                        pointPadding: 0.1,
                        borderWidth: 0,
                        colorByPoint: true,
                        dataSorting: {
                            enabled: true,
                            matchByName: true
                        },
                        type: 'bar',
                        dataLabels: {
                            enabled: true
                        }
                    }
                },
                series: [
                    {
                        type: 'bar',
                        name: startYear,
                        data: getData(startYear)[1]
                    }
                ],
                responsive: {
                    rules: [{
                        condition: {
                            maxWidth: 550
                        },
                        chartOptions: {
                            xAxis: {
                                visible: false
                            },
                            subtitle: {
                                x: 0
                            },
                            plotOptions: {
                                series: {
                                    dataLabels: [{
                                        enabled: true,
                                        y: 8
                                    }, {
                                        enabled: true,
                                        format: '{point.name}',
                                        y: -8,
                                        style: {
                                            fontWeight: 'normal',
                                            opacity: 0.7
                                        }
                                    }]
                                }
                            }
                        }
                    }]
                }
            });


        } catch (error) {
            console.log(error);
        }
    }

    const handlePlayPause = (e) => {
        if (chart.sequenceTimer) {
            pause(e);
        } else {
            play(e);
        }
    };
    const handleInputPlay = (e) => {
        // updateNew(e);
        // setInputNew(e.target.value);
    };





    // (function (H) {
    //     const FLOAT = /^-?\d+\.?\d*$/;

    //     // Add animated textSetter, just like fill/strokeSetters
    //     H.Fx.prototype.textSetter = function () {
    //         let startValue = this.start.replace(/ /g, ''),
    //             endValue = this.end.replace(/ /g, ''),
    //             currentValue = this.end.replace(/ /g, '');

    //         if ((startValue || '').match(FLOAT)) {
    //             startValue = parseInt(startValue, 10);
    //             endValue = parseInt(endValue, 10);

    //             // No support for float
    //             currentValue = Highcharts.numberFormat(
    //                 Math.round(startValue + (endValue - startValue) * this.pos),
    //                 0
    //             );
    //         }

    //         this.elem.endText = this.end;

    //         this.elem.attr(this.prop, currentValue, null, true);
    //     };

    //     // Add textGetter, not supported at all at this moment:
    //     H.SVGElement.prototype.textGetter = function () {
    //         const ct = this.text.element.textContent || '';
    //         return this.endText ? this.endText : ct.substring(0, ct.length / 2);
    //     };

    //     // Temporary change label.attr() with label.animate():
    //     // In core it's simple change attr(...) => animate(...) for text prop
    //     H.wrap(H.Series.prototype, 'drawDataLabels', function (proceed) {
    //         const attr = H.SVGElement.prototype.attr,
    //             chart = this.chart;

    //         if (chart.sequenceTimer) {
    //             this.points.forEach(point =>
    //                 (point.dataLabels || []).forEach(
    //                     label =>
    //                     (label.attr = function (hash) {
    //                         if (hash && hash.text !== undefined) {
    //                             const text = hash.text;

    //                             delete hash.text;

    //                             return this
    //                                 .attr(hash)
    //                                 .animate({ text });
    //                         }
    //                         return attr.apply(this, arguments);

    //                     })
    //                 )
    //             );
    //         }

    //         const ret = proceed.apply(
    //             this,
    //             Array.prototype.slice.call(arguments, 1)
    //         );

    //         this.points.forEach(p =>
    //             (p.dataLabels || []).forEach(d => (d.attr = attr))
    //         );

    //         return ret;
    //     });
    // }(Highcharts));



    function getData(year) {
        const output = Object.entries(dataset)
            .map(country => {
                const [countryName, countryData] = country;
                return [countryName, Number(countryData[year])];
            })
            .sort((a, b) => b[1] - a[1]);
        return [output[0], output.slice(1, nbr)];
    }


    function getSubtitle() {
        // const population = (getData(input.value)[0][1] / 1000000000).toFixed(2);
        const population = (getData(inputNew)[0][1]);
        return `<span style="font-size: 80px">${inputNew}</span>
            <br>
            <span style="font-size: 22px">
                Total: <b>: ${population}</b>
            </span>`;
    }

    function pause(button) {
        button.title = 'play';
        button.className = 'fa fa-play';
        clearTimeout(chart.sequenceTimer);
        chart.sequenceTimer = undefined;
    }

    function updateNew(e,increment) {
        if (increment) {
            inputNew = parseInt(inputNew, 10) + increment;
        }
        if (inputNew >= endYear) {
            // Auto-pause
            // handlePlayPause
            // pause(btn);
            pause(e);
        }

        chart.update(
            {
                subtitle: {
                    text: getSubtitle()
                }
            },
            false,
            false,
            false
        );

        chart.series[0].update({
            name: inputNew,
            data: getData(inputNew)[1]
        });
    }

    function play(button) {
        button.title = 'pause';
        button.className = 'fa fa-pause';
        chart.sequenceTimer = setInterval(function () {
            updateNew(button,1);
        }, 500);
    }


    return (
        <MainLayout>


            <figure className="highcharts-figure">
                <div id="parent-container">
                    <div id="play-controls" style={{ display: "flex" }}>
                        <button id="play-pause-button" onClick={e => handlePlayPause(e)} className="fa fa-play" title="play" />
                        <div style={{ width: "100%" }}>
                            <input
                                id="play-range"
                                type="range"
                                value={inputNew}
                                min={1960}
                                max={2018}
                                onChange={e => handleInputPlay(e)}
                            />
                            <div>
                                <span>1990</span>
                                <span>1991</span>
                                <span>1992</span>
                                <span>1993</span>
                                <span>1994</span>
                                <span>1995</span>
                                <span>1996</span>
                                <span>1997</span>
                            </div>
                        </div>
                    </div>
                    <div id="container" />
                </div>
                <p className="highcharts-description">
                    Bar chart showing the world population by countries from 1960 to 2018.
                </p>
            </figure>



        </MainLayout>
    );
}