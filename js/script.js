const COUNTRY_CODES_CACHE_KEY = 'countryCodes';

const SERIES_ALIGNMENT_MINIMUM = 100;

const DYNAMIC_DATA_EXPIRE_SECS = 15*60;
const STATIC_DATA_EXPIRE_SECS = 5*60*60;

const MAX_SERIES = 7;



let chosenCountries = [];
let allCountries = [];
let charts = {};

const countryForCode = function (code) {
    for(let c in allCountries)
        if(allCountries[c].code===code)
            return allCountries[c];
    return null;
};

const loadCountries = function(countryDataFromServer,covidDataFromServer){
    const transformCountryName = function(name) {
        if(name==='United States')
            return 'US';
        if(name==='Czech Republic')
            return 'Czechia';
        return name;
    };

    let visitedCountries = {};
    for(let e in countryDataFromServer){
        const popElem = countryDataFromServer[e];
        const name = transformCountryName(popElem["Country Name"]);
        if(covidDataFromServer[name] && !visitedCountries[name])
            visitedCountries[name]={code: popElem["Country Code"], alpha2Code:undefined, name: name, pop: undefined, popYear: undefined};

        if(visitedCountries[name] &&
            (visitedCountries[name].popYear===undefined || visitedCountries[name].pop===undefined || visitedCountries[name].popYear<popElem["Year"])){
            visitedCountries[name].pop=popElem["Value"];
            visitedCountries[name].popYear=popElem["Year"];
        }
    }

    allCountries=[];
    let allCodes = Object.keys(visitedCountries);
    allCodes.sort(localeCompareStrings);
    for(let c in allCodes)
        allCountries.push(visitedCountries[allCodes[c]]);

    cache4js.ajaxCache({
        url: 'https://raw.githubusercontent.com/lukes/ISO-3166-Countries-with-Regional-Codes/master/all/all.json',
        dataType: 'json',
        success: function (cData) {
            let parsedData = (typeof cData) === 'string' ? JSON.parse(cData) : cData;
            for(let c in parsedData){
                let country = parsedData[c];
                const forCode = countryForCode(country["alpha-3"]);
                if(forCode)
                    forCode.alpha2Code=country["alpha-2"];
            }
        }
    },STATIC_DATA_EXPIRE_SECS);
};

const loadChosenCountries = function() {
    chosenCountries=[];
    let countryCodesTmp = [];

    let urlCountries = getURLParamValue('countries');
    if(urlCountries){
        try {
            countryCodesTmp = JSON.parse(atob(urlCountries)).slice(0, MAX_SERIES);
        }catch (e) {
            console.log(e);
        }
    }

    if(!countryCodesTmp || countryCodesTmp.length===0)
        countryCodesTmp = cache4js.loadCache(COUNTRY_CODES_CACHE_KEY,['PRT','ESP','ITA']).slice(0,MAX_SERIES);

    for(let cIndex in countryCodesTmp){
        for(let ac in allCountries){
            if(allCountries[ac].code===countryCodesTmp[cIndex]){
                chosenCountries.push(countryCodesTmp[cIndex]);
                break;
            }
        }
    }
};

const retrieveTestingDataFromOWID = function(from, to) {
    const dataSourceCountryName2CountryName = function (dataSourceCountryName) {
        if (dataSourceCountryName === 'United States')
            return 'US';
        if (dataSourceCountryName === 'Czech Republic')
            return 'Czechia';
        return dataSourceCountryName;
    };

    const shouldDiscardCountryLabel = function (dataSourceCountryName) {
        switch (dataSourceCountryName) {
            case 'United States - specimens tested (CDC)':
                return false;
            case 'Italy - people tested':
                return true;
            default:
                return false;
        }
    };

    const getValueIndexForCountryName = function(cName){
        switch (cName) {
            case 'Japan': return 6;
            default: return 5;
        }
    };

    let existent = [];
    for (let cName in to.countryData)
        if(to.countryData[cName].test.data)
            existent.push(cName);

    let testLines = from.split('\n');
    let lastDate = undefined, lastCountry = undefined;
    for (let l = 1; l < testLines.length; l++) {
        let line = testLines[l];
        let values = line.split(',');
        let nameFromServer = values[0];
        if (shouldDiscardCountryLabel(nameFromServer))
            continue;
        let cName = dataSourceCountryName2CountryName(nameFromServer.split(' - ')[0]);

        if(existent.indexOf(cName)>=0)
            continue;

        let countryData = to.countryData[cName];
        if (countryData) {
            if (lastCountry !== cName) {
                lastCountry = cName;
                lastDate = undefined;
            }
            try {
                let date = new Date(values[1]);

                if (date < countryData.first100ConfDate)
                    continue;

                if (!countryData.test.data) {
                    countryData.test.data = [];
                    countryData.test.firstDate=date;
                } else {
                    let dateDelta = (lastDate ? daysBetween(lastDate, date) : 0);
                    if (dateDelta > 1)
                        for (let i = 1; i < dateDelta; i++)
                            countryData.test.data.push(null);
                }

                try {
                    let valueIndex = getValueIndexForCountryName(cName);
                    const lastVal = lastNonNullNonUndefinedValue(countryData.test.data);
                    countryData.test.data.push(
                        values[valueIndex] && values[valueIndex].trim() !== '' && (lastVal===null || Number(values[valueIndex])>=lastVal)
                            ? Number(values[valueIndex])
                            : null
                    );
                } catch (e) {
                    console.log(e);
                    countryData.test.data.push(null);
                }
                lastDate = date;
            } catch (e) {
                console.log(e);
            }
        }
    }


    for (let cName in to.countryData) {
        let country = to.countryData[cName];
        for(let d = 0 ; d < daysBetween(country.test.firstDate,country.first100ConfDate) ; d++)
            country.test.data.unshift(null);
    }
};

const retrieveTestingDateFromWikiData = function(from, to){
    const shouldDiscardCountry = function (dataSourceCountryName) {
        switch (dataSourceCountryName) {
            case 'Italy':
                return true;
            default:
                return false;
        }
    };

    const dataSourceCountryName2CountryName = function (dataSourceCountryName) {
        if (dataSourceCountryName === 'United States')
            return 'US';
        return dataSourceCountryName;
    };

    let lastDate = undefined;
    for(let e in from.results.bindings){
        let entry = from.results.bindings[e];
        let cName = dataSourceCountryName2CountryName(entry.countryLabel.value);

        if(shouldDiscardCountry(cName))
            continue;

        let country = to.countryData[cName];
        if(country){
            let date = new Date(entry.date.value);

            if (date < country.first100ConfDate)
                continue;

            if (!country.test.data) {
                country.test.data = [];
                country.test.firstDate=date;
            } else {
                let dateDelta = (lastDate ? daysBetween(lastDate, date) : 0);
                if (dateDelta > 1)
                    for (let i = 1; i < dateDelta; i++)
                        country.test.data.push(null);
            }

            try {
                const lastVal = lastNonNullNonUndefinedValue(country.test.data);
                country.test.data.push(
                    entry.testNo.value!==null&&entry.testNo.value!==undefined&&entry.testNo.value.trim()!==''&& (lastVal===null||Number(entry.testNo.value)>=lastVal)
                        ? Number(entry.testNo.value)
                        : null
                );
            } catch (e) {
                console.log(e);
                country.test.data.push(null);
            }
            lastDate = date;
        }
    }

    for (let cName in to.countryData) {
        let country = to.countryData[cName];
        for(let d = 0 ; d < daysBetween(country.test.firstDate,country.first100ConfDate) ; d++)
            country.test.data.unshift(null);
    }
};

const retrieveDataFromPomber = function(from, to) {
    for (let cName in to.countryData) {
        let countryData = to.countryData[cName];
        let covidDataElem = from[cName];
        let started = false;
        let isInitial = true;
        for (let i = 0; i < covidDataElem.length; i++) {
            const entry = covidDataElem[i];

            if(!started && (entry.confirmed===null || entry.confirmed===undefined || entry.confirmed===0))
                continue;
            started=true;

            if(isInitial && entry.confirmed!==null && entry.confirmed!==undefined && entry.confirmed>=SERIES_ALIGNMENT_MINIMUM)
                isInitial = false;

            if(isInitial){
                if(!countryData.initial){
                    countryData.firstConfDate=new Date(entry.date);
                    countryData.initial = {conf:{},dead:{},reco:{}};
                    countryData.initial.conf.data = [];
                    countryData.initial.dead.data = [];
                    countryData.initial.reco.data = [];
                }
            } else {
                if (!countryData.conf.data) {
                    countryData.first100ConfDate=new Date(entry.date);
                    countryData.conf.data = [];
                    countryData.dead.data = [];
                    countryData.reco.data = [];
                }
            }

            const obj2Add2 = isInitial ? countryData.initial : countryData;

            const lastConf = lastNonNullNonUndefinedValue(obj2Add2.conf.data);
            const lastReco = lastNonNullNonUndefinedValue(obj2Add2.reco.data);
            const lastDead = lastNonNullNonUndefinedValue(obj2Add2.dead.data);

            const conf = entry.confirmed===null || entry.confirmed===undefined || entry.confirmed<0 || (lastConf!==null&&entry.confirmed<lastConf) ? null : entry.confirmed;
            let dead = entry.deaths===null || entry.deaths===undefined || entry.deaths<0 || (lastDead!==null&&entry.deaths<lastDead) ? null : entry.deaths;
            let reco = entry.recovered===null || entry.recovered===undefined || entry.recovered<0 || (lastReco!==null&&entry.recovered<lastReco) ? null : entry.recovered;
            if(conf!==null && (reco===null?0:reco)+(dead===null?0:dead)>conf){
                reco=null;
                dead=null;
            }

            obj2Add2.conf.data.push(conf);
            obj2Add2.dead.data.push(dead);
            obj2Add2.reco.data.push(reco);
        }
    }
};

const generateModelData = function(to) {
    let modelName = '10%-5Mppl';
    to.countryData[modelName] = {
        first100ConfDate: new Date('2020-02-15'),
        color: '#FF00FF',
        pop: 5000000,
        popYear: new Date().getFullYear(),
        conf: {data: [100]},
        dead: {data: [5]},
        reco: {data: [35]},
        test: {data: [500]}
    };
    for (let i = 1; i < daysBetween(to.countryData[modelName].first100ConfDate, new Date().plusDays(-5)); i++) {
        to.countryData[modelName].conf.data.push(to.countryData[modelName].conf.data[i - 1] * 1.1);
        to.countryData[modelName].dead.data.push(to.countryData[modelName].conf.data[i] * 0.05);
        to.countryData[modelName].reco.data.push(to.countryData[modelName].conf.data[i] * 0.35);
        to.countryData[modelName].test.data.push(to.countryData[modelName].test.data[i - 1] * 1.10);
    }
};

const generateCountryDetails = function(data) {
    const countryDetailsTBody = $('#country_details_table tbody').empty();
    for (let cName in data.countryData) {
        const countryData = data.countryData[cName];
        countryDetailsTBody.append(
            '<tr>' +
            '<td class="color"><div style="background-color: '+countryData.color+'" class="legend-elem"></div></td>' +
            '<td>' + cName+ '</td>' +
            '<td>'+(countryData.first100ConfDate?formatDate(countryData.first100ConfDate,'/',true):'--')+'<br/>'+(countryData.lastValueDate?formatDate(countryData.lastValueDate,'/',true):'--')+'</td>' +
            '<td>'+countryData.pop.toLocaleString('en-US')+' (yr: '+countryData.popYear+')</td>' +
            '</tr>'
        );
    }
};

const retrieveData = function(covidDataFromPomber,testingDataFromWikiData,testingDataFromOWID){
    const COLORS = ['#003f5c','#bc5090','#007e7b','#ff6361','#ffa600','#008004','#58508d','#9c3600'];

    const data = {countryData: {}};
    for(let c in allCountries){
        const country = allCountries[c];
        const name = country.name;
        if(chosenCountries.indexOf(country.code)>=0)
            data.countryData[name]={
                popYear: country.popYear,
                pop: country.pop,
                conf: {},
                dead: {},
                reco: {},
                test: {}
            };
    }
    let count = 0;
    for(let cName in data.countryData)
        data.countryData[cName].color=COLORS[count++];

    retrieveDataFromPomber(covidDataFromPomber, data);

    retrieveTestingDateFromWikiData(testingDataFromWikiData, data);
    retrieveTestingDataFromOWID(testingDataFromOWID, data);

    generateModelData(data);

    return data;
};

const generateWeightedData = function(data) {
    for (let cName in data.countryData) {
        let country = data.countryData[cName];
        if(country.first100ConfDate) {
            let megas = country.pop / 1000000.0;

            country.lastValueDate = country.first100ConfDate.plusDays(lastNonNullNonUndefinedValueIndex(country.conf.data));

            country.confPerMega = {data: []};
            for (let i = 0; i < (country.conf.data ? country.conf.data.length : 0); i++) {
                let value = country.conf.data[i];
                country.confPerMega.data.push(value === null ? null : (value / megas));
            }

            country.confDiff = {data: [null]};
            for (let i = 1; i < (country.conf.data ? country.conf.data.length : 0); i++)
                country.confDiff.data.push(country.conf.data[i] === null || country.conf.data[i - 1] === null
                    ? null
                    : ((country.conf.data[i] - country.conf.data[i - 1]) / country.conf.data[i - 1] * 100));
            //smooth conf diff data with moving average
            const smoothedConfDiffData = [null, null];
            for (let i = 1; i < country.confDiff.data.length - 1; i++) {
                const mean = country.confDiff.data[i] === null || country.confDiff.data[i - 1] === null || country.confDiff.data[i + 1] === null
                    ? null
                    : (country.confDiff.data[i] + country.confDiff.data[i - 1] + country.confDiff.data[i + 1]) / 3.0;
                smoothedConfDiffData.push(mean);
            }
            country.confDiff.data = smoothedConfDiffData;

            country.deadPerMega = {data: []};
            for (let i = 0; i < (country.dead.data ? country.dead.data.length : 0); i++)
                country.deadPerMega.data.push(country.dead.data[i] === null ? null : (country.dead.data[i] / megas));

            country.deadPerConf = {data: []};
            for (let i = 0; i < (country.dead.data ? country.dead.data.length : 0); i++)
                country.deadPerConf.data.push(country.dead.data[i] === null || country.conf.data[i] === null ? null : (country.dead.data[i] / country.conf.data[i] * 100));

            country.recoPerConf = {data: []};
            for (let i = 0; i < (country.reco.data ? country.reco.data.length : 0); i++)
                country.recoPerConf.data.push(country.reco.data[i] === null || country.conf.data[i] === null ? null : (country.reco.data[i] / country.conf.data[i] * 100));

            country.activePerMega = {data: []};
            for (let i = 0; i < (country.conf.data ? country.conf.data.length : 0); i++) {
                const conf = country.conf.data[i];
                const reco = country.reco.data && country.reco.data.length > i ? country.reco.data[i] : null;
                const dead = country.dead.data && country.dead.data.length > i ? country.dead.data[i] : null;
                const active = conf === null || reco === null || dead === null ? null : conf - (reco + dead);
                country.activePerMega.data.push(active !== null ? (active / megas) : null);
            }

            country.activeDiff = {data: [null]};
            for (let i = 1; i < (country.activePerMega.data ? country.activePerMega.data.length : 0); i++)
                country.activeDiff.data.push(country.activePerMega.data[i] === null || country.activePerMega.data[i - 1] === null
                    ? null
                    : ((country.activePerMega.data[i] - country.activePerMega.data[i - 1]) / country.activePerMega.data[i - 1] * 100));
            //smooth conf diff data with moving average
            const smoothedActiveDiffData = [null, null];
            for (let i = 1; i < country.activeDiff.data.length - 1; i++) {
                const mean = country.activeDiff.data[i] === null || country.activeDiff.data[i - 1] === null || country.activeDiff.data[i + 1] === null
                    ? null
                    : (country.activeDiff.data[i] + country.activeDiff.data[i - 1] + country.activeDiff.data[i + 1]) / 3.0;
                smoothedActiveDiffData.push(mean);
            }
            country.activeDiff.data = smoothedActiveDiffData;

            let testDataProblem = false;
            country.confPerTest = {data: []};
            for (let i = 0; i < (country.test.data ? country.test.data.length : 0); i++) {
                if (!country.conf.data || country.conf.data.length < i + 1)
                    break;
                const tests = country.test.data[i];
                const confs = country.conf.data[i];
                if (confs === null || tests === null)
                    country.confPerTest.data.push(null);
                else if (confs / tests > 0.99) {//confirmed cases cannot be more than 99% of tests
                    testDataProblem = true;
                    break;
                } else country.confPerTest.data.push(confs / tests * 100);
            }
            if (testDataProblem) {
                country.confPerTest = {data: []};
                country.testPerMega = {data: []};
                console.log('Problem on testing data for country "' + cName + '"');
            } else {
                country.testPerMega = {data: []};
                for (let i = 0; i < (country.test.data ? country.test.data.length : 0); i++) {
                    const absValue = country.test.data[i];
                    country.testPerMega.data.push(absValue === null || absValue === undefined ? null : absValue / megas);
                }
            }
        }
    }
};

const drawChart = function(elemId,data,countryColors,showModelSeries,min,max,accurateData) {
    $($('#'+elemId).parents('div.chart-outer')[0]).css('display','block');
    jsloader.showLoader(true,$($('#'+elemId).parents('div.chart-inner')[0]));

    const smallscreen = getHeight()<850;

    if(charts[elemId])
        charts[elemId].dispose();
    const chart = am4core.create(elemId, am4charts.XYChart);
    charts[elemId]=chart;

    const numberFormat = accurateData?"#,###.##":"#,###.";
    chart.numberFormatter.numberFormat = numberFormat;

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "day";
    categoryAxis.fontSize=smallscreen?10:12;
    categoryAxis.title.text='days from the 100th confirmed case';

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.fontSize=smallscreen?10:12;
    if(min!==undefined&&min!==null)
        valueAxis.min=min;
    if(max!==undefined&&max!==null)
        valueAxis.max=max;

    if(!smallscreen)
        chart.scrollbarX = new am4core.Scrollbar();

    if(!smallscreen&&accurateData) {
        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.menu.align = "left";
        chart.exporting.menu.verticalAlign = "bottom";
    }

    for(let cName in countryColors){
        const isRealData = cName.indexOf('-')<0;
        if(!isRealData&&!showModelSeries)
            continue;

        const series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = cName;
        series.dataFields.categoryX = "day";
        series.name = cName;
        series.strokeWidth = 1;
        series.minBulletDistance = 10;
        series.legendSettings.valueText = "{valueY}";
        series.visible = true;
        series.stroke = am4core.color(countryColors[cName]);

        series.tooltipText = '{name}: [bold]{valueY.formatNumber('+numberFormat+')}[/]';
        series.tooltip.getFillFromObject=false;
        series.tooltip.background.fill= am4core.color(countryColors[cName]);
        series.tooltip.background.color= am4core.color("#ffffff");
        series.tooltip.fontSize= smallscreen?8:12;

        if(!isRealData) {
            series.strokeDasharray = 3;
            series.strokeWidth = 1;
        }

        if(accurateData&&isRealData) {
            const circleBullet = new am4core.Circle();
            circleBullet.fill = am4core.color(countryColors[cName]);
            circleBullet.stroke = am4core.color("#fff");
            circleBullet.strokeWidth = 1;
            circleBullet.radius = 3.5;
            series.bullets.push(circleBullet);
        }
        if(!accurateData&&isRealData){
            series.strokeWidth = 1.5;
            const focusFilter = new am4core.FocusFilter();
            focusFilter.stroke=am4core.color("rgba(255,255,255,0.1)");
            series.filters.push(focusFilter);
        }

        if(!isRealData)
            series.hidden=true;
    }

    chart.responsive.enabled = true;
    chart.cursor = new am4charts.XYCursor();

    chart.data = data;

    chart.legend = new am4charts.Legend();
    chart.legend.fontSize=smallscreen?8:12;
    chart.legend.maxHeight=smallscreen?140:70;
    chart.legend.labels.template.truncate = true;
    chart.legend.labels.template.wrap = true;
    chart.legend.valueLabels.template.disabled = true;

    jsloader.hideLoader($($('#'+elemId).parents('div.chart-inner')[0]));

};

const createCharts = function(data,chartsCodes) {
    let  confMaxDelta=0;
    data.countryColors={};
    for (let cName in data.countryData) {
        let country = data.countryData[cName];
        data.countryColors[cName]=data.countryData[cName].color;
        confMaxDelta=Math.max(confMaxDelta,country.conf.data?country.conf.data.length-1:0);
    }

    const generateChartData = function (fromDataName,data,confMaxDelta) {
        let res = [];
        for (let count = 0; count <= confMaxDelta; count++) {
            const elem = {
                day: count
            };
            for (let cName in data.countryData) {
                let country = data.countryData[cName];
                elem[cName] = country[fromDataName] && count < country[fromDataName].data.length
                    ? country[fromDataName].data[count]
                    : null;
            }
            res.push(elem);
        }
        return res;
    };

    const charts2Show = chartsCodes.length===0
        ? ['conf','conf-diff','active','active-diff','dead','dead-per-conf','reco-per-conf','test','test-positive']
        : chartsCodes;

    if(charts2Show.indexOf('active')>=0) {
        drawChart('active_chart', generateChartData('activePerMega', data, confMaxDelta), data.countryColors,true,null,null,true);
        $('#active_chart').data('currentdata',data);
    } else $('#active_chart').data('currentdata',undefined);

    if(charts2Show.indexOf('active-diff')>=0) {
        drawChart('active_diff_chart', generateChartData('activeDiff', data, confMaxDelta), data.countryColors,false,null,null,false);
        $('#active_diff_chart').data('currentdata',data);
    } else $('#active_diff_chart').data('currentdata',undefined);

    if(charts2Show.indexOf('conf')>=0)
        drawChart('conf_chart', generateChartData('confPerMega', data, confMaxDelta), data.countryColors,true,null,null,true);

    if(charts2Show.indexOf('conf-diff')>=0)
        drawChart('conf_diff_chart', generateChartData('confDiff', data, confMaxDelta), data.countryColors,false,null,null,false);

    if(charts2Show.indexOf('dead')>=0)
        drawChart('dead_chart', generateChartData('deadPerMega',data, confMaxDelta), data.countryColors,true,null,null,true);

    if(charts2Show.indexOf('dead-per-conf')>=0)
        drawChart('dead_per_conf_chart', generateChartData('deadPerConf',data, confMaxDelta), data.countryColors,false,null,null,true);

    if(charts2Show.indexOf('reco-per-conf')>=0)
        drawChart('reco_per_conf_chart', generateChartData('recoPerConf',data, confMaxDelta), data.countryColors,false,null,null,true);

    if(charts2Show.indexOf('test')>=0)
        drawChart('test_chart', generateChartData('testPerMega',data, confMaxDelta), data.countryColors,true,null,null,true);

    if(charts2Show.indexOf('test-positive')>=0)
        drawChart('conf_per_test_chart', generateChartData('confPerTest',data, confMaxDelta), data.countryColors,false,null,null,true);
};

const addSimulation2Active = function(data){
    const chart = charts['active_chart'];
    if(chart){
        jsloader.showLoader(true,'div.chart-outer.active div.chart-inner');
        const addSeries2Chart = function(){
            let simulMaxDelta = 0;
            for (let cName in data.countryData) {
                let country = data.countryData[cName];
                simulMaxDelta = Math.max(simulMaxDelta,country.activePerMega&&country.activePerMega.data?country.activePerMega.data.length-1:0);
            }
            simulMaxDelta+=5;

            const generateChartData = function (fromDataName,data,simulMaxDelta) {
                let res = [];
                for (let count = 0; count <= simulMaxDelta; count++) {
                    const elem = {
                        day: count
                    };
                    for (let cName in data.countryData) {
                        let country = data.countryData[cName];
                        elem[cName] = country[fromDataName] && count < country[fromDataName].data.length && count<country.activePerMega.data.length+5
                            ? country[fromDataName].data[count]
                            : null;
                    }
                    res.push(elem);
                }
                return res;
            };

            const data4Chart = generateChartData('simulPerMega',data,simulMaxDelta);

            for(let cName in data.countryColors){
                const isRealData = cName.indexOf('-')<0;
                if(isRealData) {
                    const series = chart.series.push(new am4charts.LineSeries());
                    series.dataFields.valueY = cName+'_simul';
                    series.dataFields.categoryX = "day";
                    series.name = cName+'_simul';
                    series.strokeWidth = 1.5;
                    series.visible = true;
                    series.stroke = am4core.color(data.countryColors[cName]);
                    series.strokeDasharray = 4;
                    const focusFilter = new am4core.FocusFilter();
                    focusFilter.stroke=am4core.color("rgba(255,255,255,0.25)");
                    series.filters.push(focusFilter);
                }
            }

            let i = 0;
            for( ; i < chart.data.length ; i++){
                const line = data4Chart[i];
                for(let cName in data.countryColors)
                    chart.data[i][cName+'_simul']=line[cName];
            }
            for( ; i < data4Chart.length ; i++) {
                const newLine = {};
                chart.data.push(newLine);
                for(let cName in data.countryColors){
                    newLine.day=data4Chart[i].day;
                    newLine[cName+'_simul']=data4Chart[i][cName];
                    newLine[cName]=null;
                }
            }

            chart.invalidateData();
            jsloader.hideLoader('div.chart-outer.active div.chart-inner');
        };

        if(data.countryData[Object.keys(data.countryData)[0]].simulPerMega)
            addSeries2Chart();
        else {
            const retrieveSimulDataFromRemi = function(simulDataFromRemi, addSeries2Chart) {
                const _10DaysFromNow = new Date().plusDays(10);
                for (let cName in data.countryData) {
                    const isRealData = cName.indexOf('-') < 0;
                    if (isRealData) {
                        const countryData = data.countryData[cName];
                        countryData.simul = {};
                        const simulDataElem = simulDataFromRemi[cName];
                        const first100ConfDate = countryData.first100ConfDate;
                        for (let i = 1; i < simulDataElem.length; i+=2) {
                            const entry = simulDataElem[i];
                            const date = new Date(entry.date);
                            if (date >= first100ConfDate && date<= _10DaysFromNow) {
                                if (!countryData.simul.data)
                                    countryData.simul.data = [];
                                countryData.simul.data.push(entry["cases_sim"]);
                            }
                        }

                        const megas = countryData.pop / 1000000.0;
                        countryData.simulPerMega = {data: []};
                        for (let i = 0; i < (countryData.simul.data ? countryData.simul.data.length : 0); i++)
                            countryData.simulPerMega.data.push(countryData.simul.data[i] / megas);
                    }
                }
                addSeries2Chart();
            };

            cache4js.ajaxCache({
                url:'https://raw.githubusercontent.com/RemiTheWarrior/epidemic-simulator/master/data/'+formatDate(new Date().plusDays(-1),'-')+'.json',
                dataType: 'json',
                success: function (simulDataFromRemi) {
                    retrieveSimulDataFromRemi((typeof simulDataFromRemi) === 'string' ? JSON.parse(simulDataFromRemi) : simulDataFromRemi, addSeries2Chart);
                },
                error: function () {
                    cache4js.ajaxCache({
                        url:'https://raw.githubusercontent.com/RemiTheWarrior/epidemic-simulator/master/data/'+formatDate(new Date().plusDays(-2),'-')+'.json',
                        dataType: 'json',
                        success: function (simulDataFromRemi) {
                            retrieveSimulDataFromRemi((typeof simulDataFromRemi) === 'string' ? JSON.parse(simulDataFromRemi) : simulDataFromRemi, addSeries2Chart);
                        },
                        error: function () {
                            alert('Could not retrieve data for simulation.')
                        }
                    },DYNAMIC_DATA_EXPIRE_SECS);
                }
            },DYNAMIC_DATA_EXPIRE_SECS);
        }
    }
};
const removeSimulationFromActive = function(){
    const chart = charts['active_chart'];
    if(chart){
        let _2rem = [];
        for(let i = 0 ; i < chart.series.length ; i++)
            if(chart.series.values[i].name.indexOf('_simul')>0)
                _2rem.push(i);

        for(let i = _2rem.length-1 ; i >= 0 ; i--)
            chart.series.removeIndex(_2rem[i]);
    }
};

const addContext2ActiveDiff = function (data) {
    const chart = charts['active_diff_chart'];
    if(chart){
        jsloader.showLoader(true,'div.chart-outer.active-diff div.chart-inner');
        const addSeries2Chart = function(){
            let contextMaxDelta = 0;
            for (let cName in data.countryData) {
                let country = data.countryData[cName];
                contextMaxDelta = Math.max(contextMaxDelta,country.activeDiffContext&&country.activeDiffContext.data?country.activeDiffContext.data.length-1:0);
            }

            const generateChartData = function (fromDataName,data,maxDelta) {
                let res = [];
                for (let count = 0; count <= maxDelta; count++) {
                    const elem = {
                        day: count
                    };
                    for (let cName in data.countryData) {
                        let country = data.countryData[cName];
                        elem[cName] = country[fromDataName] && count < country[fromDataName].data.length && count<country[fromDataName].data.length
                            ? country[fromDataName].data[count]
                            : null;
                    }
                    res.push(elem);
                }
                return res;
            };

            const data4Chart = generateChartData('activeDiffContext',data,contextMaxDelta);

            for(let cName in data.countryColors){
                const isRealData = cName.indexOf('-')<0;
                if(isRealData) {
                    const series = chart.series.push(new am4charts.LineSeries());
                    series.dataFields.valueY = cName+'_mobility';
                    series.dataFields.categoryX = "day";
                    series.name = cName+'_mobility';
                    series.strokeWidth = 1.5;
                    series.visible = true;
                    series.stroke = am4core.color(data.countryColors[cName]);
                    series.strokeDasharray = 4;
                    const focusFilter = new am4core.FocusFilter();
                    focusFilter.stroke=am4core.color("rgba(255,255,255,0.25)");
                    series.filters.push(focusFilter);
                }
            }

            for(let i = 0 ; i < chart.data.length ; i++){
                const line = data4Chart[i];
                for(let cName in data.countryColors)
                    chart.data[i][cName+'_mobility']=line?line[cName]:null;
            }

            chart.invalidateData();
            jsloader.hideLoader('div.chart-outer.active-diff div.chart-inner');
        };

        if(data.countryData[Object.keys(data.countryData)[0]].activeDiffContext)
            addSeries2Chart();
        else {
            const retrieveMobilityDataFromCityXDev = function(mobilityDataFromCityXDev, addSeries2Chart) {
                for (let cName in data.countryData) {
                    const isRealData = cName.indexOf('-') < 0;
                    if (isRealData) {
                        const countryData = data.countryData[cName];
                        countryData.activeDiffContext = {};
                        const kinds = ['retail_and_recreation_percent_change_from_baseline','grocery_and_pharmacy_percent_change_from_baseline','parks_percent_change_from_baseline','transit_stations_percent_change_from_baseline','workplaces_percent_change_from_baseline'];
                        let lastDate = undefined;
                        for(let e in mobilityDataFromCityXDev[cName].country){
                            const elem = mobilityDataFromCityXDev[cName].country[e];
                            const date = new Date(elem.date);
                            if (date >= countryData.first100ConfDate){
                                if (!countryData.activeDiffContext.data) {
                                    countryData.activeDiffContext.data = [];
                                    countryData.activeDiffContext.firstDate=date;
                                } else {
                                    let dateDelta = (lastDate ? daysBetween(lastDate, date) : 0);
                                    if (dateDelta > 1)
                                        for (let i = 1; i < dateDelta; i++)
                                            countryData.activeDiffContext.data.push(null);
                                }

                                let sum = 0, count=0;
                                for (let k of kinds) {
                                    if(elem[k]!==null&&elem[k]!==undefined){
                                        sum+=elem[k];
                                        count++;
                                    }
                                }

                                const mean = sum/count;
                                countryData.activeDiffContext.data.push(mean);

                                lastDate = date;
                            }
                        }
                    }
                }
                addSeries2Chart();
            };


            const reqs = [];
            const mobilityDataFromCityXDev = {};
            for (let country3LetterCode of chosenCountries) {
                const country = countryForCode(country3LetterCode);
                const country2LetterCode = country.alpha2Code;
                reqs.push(cache4js.ajaxCache({
                    context: {cName: country.name},
                    url: 'https://cityxdev.github.io/covid19GoogleMobilityJSON/data/google_mobility_data_'+country2LetterCode+'.json',
                    success: function(data){
                        mobilityDataFromCityXDev[this.cName]=(typeof data) === 'string' ? JSON.parse(data) : data;
                    }
                },DYNAMIC_DATA_EXPIRE_SECS));
            }
            Promise.all(reqs).then(function () {
                retrieveMobilityDataFromCityXDev(mobilityDataFromCityXDev,addSeries2Chart);
            }).catch(function (e) {
                console.log(e);
                alert('Error getting mobility data.');
            });
        }
    }














};
const removeContextFromActiveDiff = function () {
    const chart = charts['active_diff_chart'];
    if(chart){
        let _2rem = [];
        for(let i = 0 ; i < chart.series.length ; i++)
            if(chart.series.values[i].name.indexOf('_mobility')>0)
                _2rem.push(i);

        for(let i = _2rem.length-1 ; i >= 0 ; i--)
            chart.series.removeIndex(_2rem[i]);
    }
};

const makeSPARQLQuery = function( endpointUrl, sparqlQuery, successCallback ) {
    var settings = {
        url: endpointUrl,
        headers: { Accept: 'application/sparql-results+json' },
        data: { query: sparqlQuery },
        success: successCallback
    };
    return cache4js.ajaxCache(settings, DYNAMIC_DATA_EXPIRE_SECS);
};

const reload = function(){
    chosenCountries = [];
    allCountries = [];
    $('input.add-simulation-chk').prop('checked',false);
    $('input.add-context-chk').prop('checked',false);
    jsloader.showLoader(true);
    cache4js.ajaxCache({
        url:'https://pkgstore.datahub.io/core/population/population_json/data/43d34c2353cbd16a0aa8cadfb193af05/population_json.json',
        dataType: 'json',
        success: function (countryDataFromServer) {
            cache4js.ajaxCache({
                url:'https://pomber.github.io/covid19/timeseries.json',
                success: function (covidDataFromPomber) {
                    const testDataEndpoint = 'https://query.wikidata.org/sparql',
                        testDataSparqlQuery = "SELECT ?date ?testNo ?countryLabel WHERE {\n" +
                            "  ?item wdt:P361 wd:Q83741704.\n" +
                            "  ?item p:P8011 ?test. \n" +
                            "  ?test pq:P585 ?date;\n" +
                            "    ps:P8011 ?testNo\n" +
                            "  OPTIONAL { ?item wdt:P17 ?country. }\n" +
                            "  SERVICE wikibase:label { bd:serviceParam wikibase:language \"[EN],en\". }\n" +
                            "}\n" +
                            "ORDER BY (?countryLabel) (?itemLabel) (?date)";
                    makeSPARQLQuery(
                        testDataEndpoint,
                        testDataSparqlQuery,
                        function( testingDataFromWikiData ) {
                            cache4js.ajaxCache({
                                url: 'https://raw.githubusercontent.com/owid/covid-19-data/master/public/data/testing/covid-testing-all-observations.csv',
                                success: function (testingDataFromOWID) {

                                    let chartsCodes=[];
                                    const chartCodesParam = getURLParamValue("chartCodes");
                                    if(chartCodesParam)
                                        chartsCodes = JSON.parse(atob(chartCodesParam));

                                    loadCountries(countryDataFromServer, covidDataFromPomber);

                                    loadChosenCountries();

                                    let data = retrieveData(covidDataFromPomber, testingDataFromWikiData, testingDataFromOWID);
                                    generateWeightedData(data);
                                    generateCountryDetails(data);

                                    am4core.ready(function () {
                                        am4core.options.queue = true;
                                        am4core.options.onlyShowOnViewport = true;
                                        am4core.useTheme(am4themes_material);

                                        createCharts(data,chartsCodes);
                                        jsloader.hideLoader();
                                    });
                                }
                            },DYNAMIC_DATA_EXPIRE_SECS);
                        }
                    );
                }
            },DYNAMIC_DATA_EXPIRE_SECS);
        }
    },STATIC_DATA_EXPIRE_SECS);
};

const onModalOpen = function() {
    const countryUl = $('#active_countries');
    countryUl.empty();
    let codes = countryUl.data('codes')?countryUl.data('codes').slice():chosenCountries.slice();
    for(let c in codes){
        let country = undefined;
        for(let ac in allCountries)
            if(allCountries[ac].code===codes[c]){
                country=allCountries[ac];
                break;
            }

        if(country)
            countryUl.append($('<li><button data-code="'+country.code+'" class="menu-button remove-button">&times;</button>'+country.name+'</li>'))
    }

    countryUl.data('codes',codes);

    const menuAddCountry = $('#menu_add_country');
    menuAddCountry.empty();
    menuAddCountry.append($('<input type="text" placeholder="search by country name"/>'));

    const searchInput = $('input',menuAddCountry);
    searchInput.keyup(function () {
        const search = $(this).val().toLowerCase();
        $('ul',menuAddCountry).remove();
        if(search.length>1){
            const resultsUl = $('<ul id="search_result"></ul>');
            menuAddCountry.append(resultsUl);

            let codes = $('#active_countries').data('codes').slice();
            let usedCodes = {};
            for(let c in allCountries) {
                let country = allCountries[c];
                if (!usedCodes[country.code] && codes.indexOf(country.code) < 0 && (country.name.toLowerCase().indexOf(search) === 0 || search === country.code.toLowerCase())) {
                    resultsUl.append($('<li><button data-code="' + country.code + '" class="menu-button add-button">&plus;</button>' + country.name + '</li>'));
                    usedCodes[country.code]={};
                }
            }

            $('button',resultsUl).click(function () {
                let codes = $('#active_countries').data('codes').slice();
                if(codes.length>=MAX_SERIES)
                    alert('You can only add up to '+MAX_SERIES+' countries.');
                else {
                    codes.push($(this).data('code'));
                    $('#active_countries').data('codes',codes);
                    onModalOpen();
                }
            });

        }
    });

    $('button.remove-button',countryUl).click(function () {
        let codes = $('#active_countries').data('codes').slice();
        codes.splice(codes.indexOf($(this).data('code')),1);
        $('#active_countries').data('codes',codes);
        onModalOpen();
    });

    $('#choose_countries_modal button.apply-button').click(function () {
        $('#choose_countries_modal button.apply-button').trigger('close');
        jsloader.showLoader(true);

        let apply = function(){
            let codes = $('#active_countries').data('codes').slice();
            chosenCountries=codes;
            cache4js.storeCache(COUNTRY_CODES_CACHE_KEY,chosenCountries);
            reload();
        };
        setTimeout(function (){
            if(isIE)
                apply();
            else Promise.resolve().then(apply)
        },50);
    });

    searchInput.focus();
};

$(function () {
    cache4js.setLocalNamespace('covid19_country_comparison');
    if(getURLParamValue('embed')==='true'){
        $('.title').hide();
        $('.intro').hide();
        $('.menu').hide();
        $('.day-0').hide();
        $('.embed-container').hide();
    }

    $('#choose_countries_button').click(function () {
        $('#choose_countries_modal').trigger('open');
        onModalOpen();
    });

    $('#share_button').click(function () {
        prompt('Copy and share this URL', 'https://cityxdev.github.io/covid19ByCountry/?countries=' + btoa(JSON.stringify(chosenCountries)));
    });

    $('button.embed-button').click(function () {
        prompt(
            'Embed this code into your website',
            '<iframe src="https://cityxdev.github.io/covid19ByCountry/?embed=true'
            + '&countries=' + btoa(JSON.stringify(chosenCountries))
            +'&chartCodes='+btoa(JSON.stringify([$($(this).parents('div.chart-outer')[0]).data('code')]))
            +'"></iframe>'
        );
    });

    $('#add_simulation_active').change(function () {
        if($(this).is(':checked')){
            addSimulation2Active($('#active_chart').data('currentdata'));
        } else {
            removeSimulationFromActive();
        }
    });

    $('#add_context_active_diff').change(function () {
        if($(this).is(':checked')){
            addContext2ActiveDiff($('#active_diff_chart').data('currentdata'));
        } else {
            removeContextFromActiveDiff();
        }
    });

    reload();
});