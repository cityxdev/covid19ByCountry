navigator.sayswho= (function(){
    var ua= navigator.userAgent, tem,
        M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if(/trident/i.test(M[1])){
        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
        return 'IE '+(tem[1] || '');
    }
    if(M[1]=== 'Chrome'){
        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
        if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
    }
    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
    if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
    return M.join(' ');
})();
var isOpera = navigator.sayswho.indexOf('Opera')===0;
var isFirefox = navigator.sayswho.indexOf('Firefox')===0;
var isSafari = navigator.sayswho.indexOf('Safari')===0;
var isChrome = navigator.sayswho.indexOf('Chrome')===0;
var isIE = navigator.sayswho.indexOf('IE')===0;
var isEdge = navigator.sayswho.indexOf('Edge')===0;


const localeCompareStrings = function( a, b ) {
    if(!a&&!b)
        return 0;
    if(!a)
        return-1;
    if (!b)
        return 1;
    return a.toLowerCase().localeCompare(b.toLowerCase());
};


const getWidth=function() {
    return isMobile() ? screen.width : window.innerWidth;
};

const getHeight=function() {
    return isMobile() ? screen.height : window.innerHeight;
};

const isMobile=function() {
    var isMobile = false;
    // device detection
    if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|ipad|iris|kindle|Android|Silk|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(navigator.userAgent)
        || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(navigator.userAgent.substr(0, 4))) {
        isMobile = true;
    }
    return isMobile;
};


Number.prototype.pad = function(size) {
    let s = String(this);
    while (s.length < (size || 2)) {s = "0" + s;}
    return s;
};


const lastNonNullNonUndefinedValue = function (arr) {
    if(!arr)
        return null;
    for(let i = arr.length-1 ; i>=0 ; i--)
        if(arr[i]!==null && arr[i]!==undefined)
            return arr[i];
    return null;
};


const daysBetween = function (firstDate, secondDate) {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    return Math.round(Math.abs((firstDate - secondDate) / oneDay));
};
Date.prototype.plusDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
};
const formatDate = function (date) {
    return date.getFullYear() + "/" + (date.getMonth() + 1).pad(2) + "/" + date.getDate().pad(2);
};


const showLoader = function (immediatly) {
    let loader = $('div.loader-container');
    if(!immediatly) {
        if (!loader.data('timeoutId'))
            loader.data('timeoutId', []);
        let timeoutId = setTimeout(function () {
            loader.show();
        }, 300);
        loader.data('timeoutId').push(timeoutId);
    } else loader.show();
};

const hideLoader = function () {
    let loader = $('div.loader-container');
    loader.hide();
    let timeoutId = loader.data('timeoutId');
    if(timeoutId)
        for (let t in timeoutId)
            clearTimeout(timeoutId[t]);
    loader.data('timeoutId', []);
};



const getURLParamValue = function (parameterName) {
    var result = null,
        tmp = [];
    location.search
        .substr(1)
        .split("&")
        .forEach(function (item) {
            tmp = item.split("=");
            if (tmp[0] === parameterName) result = decodeURIComponent(tmp[1]);
        });
    return result;
};



const COUNTRY_CODES_CACHE_KEY = 'countryCodes';

const SERIES_ALIGNMENT_MINIMUM = 100;

const DYNAMIC_DATA_EXPIRE_SECS = 15*60;
const STATIC_DATA_EXPIRE_SECS = 5*60*60;

const MAX_SERIES = 7;



let chosenCountries = [];
let allCountries = [];
let charts = {};


const loadCountries = function(countryDataFromServer,covidDataFromServer){
    const transformCountryName = function(name) {
        if(name==='United States')
            return 'US';
        return name;
    };

    let visitedCountries = {};
    for(let e in countryDataFromServer){
        const popElem = countryDataFromServer[e];
        const name = transformCountryName(popElem["Country Name"]);
        if(covidDataFromServer[name] && !visitedCountries[name])
            visitedCountries[name]={code: popElem["Country Code"],name: name, pop: undefined, popYear: undefined};

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
};

const countryForCode = function (code) {
    for(let c in allCountries)
        if(allCountries[c].code===code)
            return allCountries[c];
    return null;
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
        return dataSourceCountryName;
    };

    const shouldDiscardCountry = function (dataSourceCountryName) {
        switch (dataSourceCountryName) {
            case 'United States - inconsistent units (COVID Tracking Project)':
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
        if (shouldDiscardCountry(nameFromServer))
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
        for (let i = 0; i < covidDataElem.length; i++) {
            let entry = covidDataElem[i];

            const conf = entry.confirmed;
            if (conf >= SERIES_ALIGNMENT_MINIMUM) {

                if (!countryData.conf.data) {
                    countryData.first100ConfDate=new Date(entry.date);
                    countryData.conf.data = [];
                    countryData.dead.data = [];
                    countryData.reco.data = [];
                }

                const lastConf = lastNonNullNonUndefinedValue(countryData.conf.data);
                const lastReco = lastNonNullNonUndefinedValue(countryData.reco.data);
                const lastDead = lastNonNullNonUndefinedValue(countryData.dead.data);

                const dead = !entry.deaths?null:entry.deaths;
                const reco = !entry.recovered?null:entry.recovered;
                countryData.conf.data.push(conf!==null&&lastConf!==null && lastConf>conf ? null : conf);
                countryData.dead.data.push(dead!==null&&lastDead!==null && lastDead>dead ? null : dead);
                countryData.reco.data.push(reco!==null&&lastReco!==null && lastReco>reco ? null : reco);
            }
        }
    }
};

const generateModelData = function(to) {
    let modelName = '10%Growth_5Mppl';
    to.countryData[modelName] = {
        first100ConfDate: new Date('2020-02-15'),
        color: '#FF00FF',
        pop: 5000000,
        conf: {data: [100]},
        dead: {data: [5]},
        reco: {data: [15]},
        test: {data: [500]}
    };
    for (let i = 1; i < daysBetween(to.countryData[modelName].first100ConfDate, new Date()); i++) {
        to.countryData[modelName].conf.data.push(to.countryData[modelName].conf.data[i - 1] * 1.1);
        to.countryData[modelName].dead.data.push(to.countryData[modelName].conf.data[i] * 0.05);
        to.countryData[modelName].reco.data.push(to.countryData[modelName].conf.data[i] * 0.15);
        to.countryData[modelName].test.data.push(to.countryData[modelName].test.data[i - 1] * 1.10);
    }
};

const generateCountryDetails = function(data) {
    let countryDetailsTBody = $('#country_details_table tbody').empty();
    let countries = [];
    for (let c in chosenCountries) {
        let country = countryForCode(chosenCountries[c]);
        country.first100ConfDate=data.countryData[country.name].first100ConfDate;
        countries.push(country);
    }

    countries.sort(function (a,b) {
        return localeCompareStrings(a.name,b.name);
    });

    for (let c in countries) {
        let country = countries[c];
        countryDetailsTBody.append(
            '<tr>' +
            '<td>' + country.name+ '</td>' +
            '<td>'+(country.first100ConfDate?formatDate(country.first100ConfDate):'--')+'</td>' +
            '<td>'+country.pop.toLocaleString('en-US')+' (year: '+country.popYear+')</td>' +
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

    generateCountryDetails(data);

    return data;
};

const generateWeightedData = function(data) {
    for (let cName in data.countryData) {
        let country = data.countryData[cName];
        let megas = country.pop / 1000000.0;

        country.confPerMega = {data: []};
        for (let i = 0; i < (country.conf.data?country.conf.data.length:0) ; i++)
            country.confPerMega.data.push(country.conf.data[i]===null ? null : (country.conf.data[i] / megas));

        country.deadPerMega = {data: []};
        for (let i = 0; i < (country.dead.data?country.dead.data.length:0) ; i++)
            country.deadPerMega.data.push(country.dead.data[i]===null ? null : (country.dead.data[i] / megas));

        country.deadPerConf = {data: []};
        for (let i = 0; i < (country.dead.data?country.dead.data.length:0) ; i++)
            country.deadPerConf.data.push(country.dead.data[i]===null || country.conf.data[i]===null ? null : (country.dead.data[i] / country.conf.data[i] * 100));

        country.recoPerConf = {data: []};
        for (let i = 0; i < (country.reco.data?country.reco.data.length:0) ; i++)
            country.recoPerConf.data.push(country.reco.data[i]===null || country.conf.data[i]===null ? null : (country.reco.data[i] / country.conf.data[i] * 100));


        country.activePerMega = {data:[]};
        for (let i = 0; i < (country.conf.data?country.conf.data.length:0) ; i++) {
            const conf = country.conf.data[i];
            const reco = country.reco.data && country.reco.data.length>i ? country.reco.data[i] : null;
            const dead = country.dead.data && country.dead.data.length>i ? country.dead.data[i] : null;
            const active = conf===null || reco===null || dead===null ? null : conf-(reco+dead);
            country.activePerMega.data.push(active!==null ? (active / megas) : null);
        }

        let testDataProblem = false;
        country.confPerTest = {data: []};
        for (let i = 0; i < (country.test.data?country.test.data.length:0) ; i++) {
            if(!country.conf.data||country.conf.data.length<i+1)
                break;
            const tests = country.test.data[i];
            const confs = country.conf.data[i];
            if(confs===null||tests===null)
                country.confPerTest.data.push(null);
            else if(confs/tests>0.99) {//confirmed cases cannot be more than 99% of tests
                testDataProblem=true;
                break;
            } else country.confPerTest.data.push(confs/tests*100);
        }
        if(testDataProblem) {
            country.confPerTest = {data: []};
            country.testPerMega = {data: []};
            console.log('Problem on testing data for country "'+cName+'"');
        } else {
            country.testPerMega = {data: []};
            for (let i = 0; i < (country.test.data?country.test.data.length:0) ; i++) {
                const absValue = country.test.data[i];
                country.testPerMega.data.push(absValue===null||absValue===undefined ? null : absValue/megas);
            }
        }

    }
};

const drawChart = function(elemId,data,countryColors) {
    const mobile = getHeight()<850;

    if(charts[elemId])
        charts[elemId].dispose();
    const chart = am4core.create(elemId, am4charts.XYChart);
    charts[elemId]=chart;

    chart.numberFormatter.numberFormat = "#,###.##";

    let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
    categoryAxis.dataFields.category = "day";
    categoryAxis.fontSize=mobile?10:12;
    categoryAxis.title.text='days from the 100th confirmed case';

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.fontSize=mobile?10:12;

    if(!mobile) {
        chart.scrollbarX = new am4core.Scrollbar();
        chart.exporting.menu = new am4core.ExportMenu();
        chart.exporting.menu.align = "left";
        chart.exporting.menu.verticalAlign = "bottom";
    }

    for(let cName in countryColors){
        const series = chart.series.push(new am4charts.LineSeries());
        series.dataFields.valueY = cName;
        series.dataFields.categoryX = "day";
        series.name = cName;
        series.strokeWidth = 1;
        series.minBulletDistance = 10;
        series.legendSettings.valueText = "{valueY}";
        series.visible = true;
        series.stroke = am4core.color(countryColors[cName]);
        const isRealData = cName.indexOf('_')<0;
        if(!isRealData) {
            series.strokeDasharray = 3;
            series.strokeWidth = 1;
        }

        if(isRealData) {
            const circleBullet = new am4core.Circle();
            circleBullet.fill = am4core.color(countryColors[cName]);
            circleBullet.stroke = am4core.color("#fff");
            circleBullet.strokeWidth = 1;
            circleBullet.radius = 3.5;
            series.bullets.push(circleBullet);
        }
    }

    chart.responsive.enabled = true;
    chart.cursor = new am4charts.XYCursor();

    chart.data = data;

    chart.legend = new am4charts.Legend();
    chart.legend.fontSize=mobile?8:12;
    if(!mobile)
        chart.legend.maxHeight=70;

    $($('#'+elemId).parents('div.chart-outer')[0]).css('display','block');
};

const createCharts = function(data,chartsCodes) {
    let  confMaxDelta=0;
    data.countryColors={};
    for (let cName in data.countryData) {
        let country = data.countryData[cName];
        data.countryColors[cName]=data.countryData[cName].color;
        confMaxDelta =Math.max(confMaxDelta,country.conf.data?country.conf.data.length-1:0);
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

    let charts2Show = chartsCodes.length===0
        ? ['conf','active','dead','dead-per-conf','reco-per-conf','test','test-positive']
        : chartsCodes;

    if(charts2Show.indexOf('conf')>=0)
        drawChart('conf_chart', generateChartData('confPerMega', data, confMaxDelta), data.countryColors);

    if(charts2Show.indexOf('active')>=0) {
        drawChart('active_chart', generateChartData('activePerMega', data, confMaxDelta), data.countryColors);
        $('#active_chart').data('currentdata',data);
    } else $('#active_chart').data('currentdata',undefined);

    if(charts2Show.indexOf('dead')>=0)
        drawChart('dead_chart', generateChartData('deadPerMega',data, confMaxDelta), data.countryColors);

    if(charts2Show.indexOf('dead-per-conf')>=0)
        drawChart('dead_per_conf_chart', generateChartData('deadPerConf',data, confMaxDelta), data.countryColors);

    if(charts2Show.indexOf('reco-per-conf')>=0)
        drawChart('reco_per_conf_chart', generateChartData('recoPerConf',data, confMaxDelta), data.countryColors);

    if(charts2Show.indexOf('test')>=0)
        drawChart('test_chart', generateChartData('testPerMega',data, confMaxDelta), data.countryColors);

    if(charts2Show.indexOf('test-positive')>=0)
        drawChart('conf_per_test_chart', generateChartData('confPerTest',data, confMaxDelta), data.countryColors);
};

const addSimulation2Active = function(data){
    const chart = charts['active_chart'];
    if(chart){
        const formatDate = function (date) {
            return date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
        };

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
                const isRealData = cName.indexOf('_')<0;
                if(isRealData) {
                    const series = chart.series.push(new am4charts.LineSeries());
                    series.dataFields.valueY = cName+'_simul';
                    series.dataFields.categoryX = "day";
                    series.name = cName+'_simul';
                    series.strokeWidth = 1;
                    series.minBulletDistance = 10;
                    series.visible = true;
                    series.stroke = am4core.color(data.countryColors[cName]);
                    series.strokeDasharray = 4;
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
        };

        if(data.countryData[Object.keys(data.countryData)[0]].simulPerMega)
            addSeries2Chart();
        else {
            const retrieveSimulDataFromRemi = function(simulDataFromRemi, addSeries2Chart) {
                const _10DaysFromNow = new Date().plusDays(10);
                for (let cName in data.countryData) {
                    const isRealData = cName.indexOf('_') < 0;
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
                url:'https://raw.githubusercontent.com/RemiTheWarrior/epidemic-simulator/master/data/'+formatDate(new Date().plusDays(-1))+'.json',
                dataType: 'json',
                success: function (simulDataFromRemi) {
                    retrieveSimulDataFromRemi(typeof simulDataFromRemi === 'string' ? JSON.parse(simulDataFromRemi) : simulDataFromRemi, addSeries2Chart);
                },
                error: function () {
                    cache4js.ajaxCache({
                        url:'https://raw.githubusercontent.com/RemiTheWarrior/epidemic-simulator/master/data/'+formatDate(new Date().plusDays(-2))+'.json',
                        dataType: 'json',
                        success: function (simulDataFromRemi) {
                            retrieveSimulDataFromRemi(typeof simulDataFromRemi === 'string' ? JSON.parse(simulDataFromRemi) : simulDataFromRemi, addSeries2Chart);
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
    showLoader(true);
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

                                    am4core.ready(function () {
                                        am4core.options.queue = true;
                                        am4core.options.onlyShowOnViewport = true;
                                        am4core.useTheme(am4themes_material);

                                        createCharts(data,chartsCodes);
                                        hideLoader();
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
        showLoader(true);

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

    reload();
});