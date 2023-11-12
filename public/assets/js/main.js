var flags = [];
flags['China'] = './assets/image/flags/Flag_of_China.webp';
flags['India'] = './assets/image/flags/Flag_of_India.webp';
flags['Latin America and the Caribbean (UN)'] = './assets/image/flags/Flag_of_question_mark.png';
flags['United States'] = './assets/image/flags/Flag_of_United_States.webp';
flags['Russia'] = './assets/image/flags/Flag_of_Russia.webp';

flags['Japan'] = './assets/image/flags/Flag_of_Japan.webp';
flags['Germany'] = './assets/image/flags/Flag_of_Germany.webp';
flags['Indonesia'] = './assets/image/flags/Flag_of_Indonesia.webp';
flags['Brazil'] = './assets/image/flags/Flag_of_Brazil.webp';
flags['United Kingdom'] = './assets/image/flags/Flag_of_United_Kingdom.webp';

flags['Italy'] = './assets/image/flags/Flag_of_Italy.webp';
flags['France'] = './assets/image/flags/Flag_of_France.webp';
flags['Bangladesh'] = './assets/image/flags/Flag_of_Bangladesh.webp';
flags['Pakistan'] = './assets/image/flags/Flag_of_Pakistan.webp';
flags['Nigeria'] = './assets/image/flags/Flag_of_Nigeria.webp';

flags['Mexico'] = './assets/image/flags/Flag_of_Mexico.webp';
flags['Ukraine'] = './assets/image/flags/Flag_of_Ukraine.webp';
flags['Vietnam'] = './assets/image/flags/Flag_of_Vietnam.webp';
flags['Poland'] = './assets/image/flags/Flag_of_Poland.webp';
flags['Egypt'] = './assets/image/flags/Flag_of_Egypt.webp';

flags['Turkey'] = './assets/image/flags/Flag_of_Turkey.webp';
flags['Thailand'] = './assets/image/flags/Flag_of_Thailand.webp';
flags['Philippines'] = './assets/image/flags/Flag_of_Philippines.webp';
flags['Democratic Republic of Congo'] = './assets/image/flags/Flag_of_Democratic_Republic_of_the_Congo.webp';
flags['Spain'] = './assets/image/flags/Flag_of_Spain.webp';
flags['Ethiopia'] = './assets/image/flags/Flag_of_Ethiopia.webp';
flags['Iran'] = './assets/image/flags/Flag_of_Iran.webp';

$(() => {
    $("#example_id").ionRangeSlider({
        min: 1950,
        max: 2021,
        from: 1950,
        grid: true,
        grid_num: 30,
        prettify_enabled: false,
        onChange: function (data) {
            update();
        },
    });

    example_id = $("#example_id").data("ionRangeSlider");
});

const startYear = 1950,
    endYear = 2021,
    btn = document.getElementById('play-pause-button'),
    input = document.getElementById('example_id'),
    nbr = 13;

let dataset, chart;


(function (H) {
    Highcharts.setOptions({
        lang: {
            thousandsSep: ','
        }
    });

    const FLOAT = /^-?\d+\.?\d*$/;

    H.Fx.prototype.textSetter = function () {
        let startValue = this.start.replace(/ /g, ''),
            endValue = this.end.replace(/ /g, ''),
            currentValue = this.end.replace(/ /g, '');

        if ((startValue || '').match(FLOAT)) {
            startValue = parseInt(startValue, 10);
            endValue = parseInt(endValue, 10);

            currentValue = Highcharts.numberFormat(
                Math.round(startValue + (endValue - startValue) * this.pos),
                0
            );
        }

        this.elem.endText = this.end;

        this.elem.attr(this.prop, currentValue, null, true);
    };

    H.SVGElement.prototype.textGetter = function () {
        const ct = this.text.element.textContent || '';
        return this.endText ? this.endText : ct.substring(0, ct.length / 2);
    };

    H.wrap(H.Series.prototype, 'drawDataLabels', function (proceed) {
        const attr = H.SVGElement.prototype.attr,
            chart = this.chart;

        if (chart.sequenceTimer) {
            this.points.forEach(point =>
                (point.dataLabels || []).forEach(
                    label =>
                    (label.attr = function (hash) {
                        if (hash && hash.text !== undefined) {
                            const text = hash.text;

                            delete hash.text;

                            return this
                                .attr(hash)
                                .animate({ text });
                        }
                        return attr.apply(this, arguments);

                    })
                )
            );
        }

        const ret = proceed.apply(
            this,
            Array.prototype.slice.call(arguments, 1)
        );

        this.points.forEach(p =>
            (p.dataLabels || []).forEach(d => (d.attr = attr))
        );

        return ret;
    });
}(Highcharts));


function getData(year) {
    const output = Object.entries(dataset)
        .map(country => {
            const [countryName, countryData] = country;

            let continent = "";
            if (countryData.continent) {
                continent = countryData.continent;
            }

            return [countryName, Number(countryData[year]), { continent: continent, flag: countryData.flag }];
        })
        .sort((a, b) => b[1] - a[1]);

    outputTmp = [];
    for (let item of output) {
        let itemTmp = {};
        itemTmp.name = item[0];
        itemTmp.y = item[1];
        itemTmp.color = mapContinentColor(item);
        itemTmp.flag = item[2].flag;
        outputTmp.push(itemTmp);
    }
    let result = [output[0], outputTmp.slice(1, nbr)];
    return result;
}

function getSubtitle() {
    const population = (getData(input.value)[0][1]);
    return `<span style="font-size: 70px;float: right;">${input.value}</span>
        <br>
        <span style="font-size: 22px;float: right;">
            <b>Total: ${Highcharts.numberFormat(population, 0)}</b>
        </span>`;
}

function mapContinentColor(item) {
    let colorChart = "#003489";
    if (item.length >= 3) {
        if (item[2].continent == "Asia") {
            colorChart = "#5e2ed9";
        }
        else if (item[2].continent == "Europe") {
            colorChart = "#9426fb";
        }
        else if (item[2].continent == "Africa") {
            colorChart = "#d74518";
        }
        else if (item[2].continent == "Oceania") {
            colorChart = "#e27914";
        }
        else if (item[2].continent == "Americas") {
            colorChart = "#f4ba13";
        }

    }
    return colorChart;
}

(async () => {
    dataset = await fetch(
        // 'http://localhost:8090/api/populations/all-list'
        'https://rail-tickets-production.up.railway.app/api/populations/all-list'
        // './assets/data/population-mockup-query.json'
    ).then(response => response.json())
        .then(response => {

            // let populationTmpObj = response;
            let populationTmpObj = response.data;

            const countryUnique = Object.assign({}, ...populationTmpObj.map(s => ({ [s.country]: {} })));

            var yearListMap = populationTmpObj.reduce(function (map, obj) {
                map[obj.year + "::" + obj.country] = {
                    country: obj.country,
                    year: obj.year,
                    population: obj.population,
                    continent: obj.continent,
                };
                return map;
            }, {});

            let countryMap = {};
            for (var key of Object.keys(countryUnique)) {
                let countryMapYear = {};
                for (var [keyYear, value] of Object.entries(yearListMap)) {
                    if (key == value.country) {
                        countryMapYear[value.year] = value.population + "";
                        countryMapYear.continent = value.continent;
                    }
                }
                countryMap[key] = countryMapYear;
            }

            countryMap = Object.fromEntries(
                Object.entries(countryMap).filter(([key]) => key !== 'Latin America and the Caribbean (UN)')
            );

            return countryMap;
        });

    chart = Highcharts.chart('container', {
        chart: {
            animation: {
                duration: 300
            },
            marginRight: 50
        },
        title: {
            text: 'Population growth per country, 1950 to 2021',
            align: 'left'
        },
        subtitle: {
            useHTML: true,
            text: getSubtitle(),
            floating: true,
            align: 'right',
            verticalAlign: 'middle',
            y: 130,
            x: -100
        },

        legend: {
            enabled: false
        },
        xAxis: {
            type: 'category',
            labels: {
                useHTML: true,
                animate: true,
                formatter: ctx => {
                    let flag = flags[ctx.value];

                    let ctxValue = "";
                    if (ctx.value.toString().length >= 13) {
                        ctxValue = ctx.value.toString().substring(0, 13) + "..";
                    }
                    else {
                        ctxValue = ctx.value;
                    }

                    return ctxValue + `<br><img src="${flag}" style="width: 24px; border-radius: 4px;" />`;
                },
                style: {
                    textAlign: 'right'
                },
            },

        },
        yAxis: {
            opposite: true,
            tickPixelInterval: 200,
            title: {
                text: null
            },
            labels: {
                formatter: function () {
                    return Highcharts.numberFormat(this.value, 0);
                },
                useHTML: true,
            }
        },
        plotOptions: {
            series: {
                animation: false,
                groupPadding: 0,
                pointPadding: 0.1,
                borderWidth: 0,
                dataSorting: {
                    enabled: true,
                    matchByName: true
                },
                type: 'bar',
                dataLabels: {
                    enabled: true,
                },
            }
        },
        series: [
            {
                type: 'bar',
                name: startYear,
                data: getData(startYear)[1],
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
        },
    });

    document.getElementById("loader-main").style.display = "none";
})();

function pause(button) {
    button.title = 'play';
    button.className = 'fa fa-play';
    clearTimeout(chart.sequenceTimer);
    chart.sequenceTimer = undefined;
}

function update(increment) {

    if (increment) {

        input.value = parseInt(input.value, 10) + increment;
    }
    if (input.value >= endYear) {
        pause(btn);
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
        name: input.value,
        data: getData(input.value)[1]
    });

    example_id.update({
        from: Number(input.value),
    });

}

function play(button) {
    if (input.value == endYear) {
        input.value = startYear;
    }

    button.title = 'pause';
    button.className = 'fa fa-pause';
    chart.sequenceTimer = setInterval(function () {
        update(1);
    }, 300);
}

btn.addEventListener('click', function () {
    if (chart.sequenceTimer) {
        pause(this);
    } else {
        play(this);
    }
});

input.addEventListener('click', function () {
    update();
});