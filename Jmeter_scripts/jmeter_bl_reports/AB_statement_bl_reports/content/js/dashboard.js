/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 47.349150556531924, "KoPercent": 52.650849443468076};
    var dataset = [
        {
            "label" : "FAIL",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "PASS",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.5346297062474141, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.04889228418640183, 500, 1500, "AB_Statemnet_T07_select date submit"], "isController": true}, {"data": [1.0, 500, 1500, "/LoanIQ/Logout.jsp-66"], "isController": false}, {"data": [0.0, 500, 1500, "/LoanIQ/stmt.jsp-45-0"], "isController": false}, {"data": [0.8009153318077803, 500, 1500, "AB_Statemnet_T05_click on Statements"], "isController": true}, {"data": [0.0, 500, 1500, "/LoanIQ/stmt.jsp-45-1"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/-2"], "isController": false}, {"data": [0.8010670731707317, 500, 1500, "AB_Statemnet_T04_Click on Account"], "isController": true}, {"data": [0.047436878347360364, 500, 1500, "/LoanIQ/Test-62"], "isController": false}, {"data": [1.0, 500, 1500, "AB_Statemnet_T02_personalBanking"], "isController": true}, {"data": [1.0, 500, 1500, "/LoanIQ/login.jsp-9"], "isController": false}, {"data": [0.8, 500, 1500, "AB_Statemnet_T03_Click on login page"], "isController": true}, {"data": [0.8, 500, 1500, "/LoanIQ/Login?JSESSIONID=VjuZHL-xL_KLn4EsvxnI2hlsZ2nJUo8bKVoLkRQ-kTuY5Lypdbur!-82356057!1772095324081-26"], "isController": false}, {"data": [0.8009153318077803, 500, 1500, "/LoanIQ/accounts.jsp-34"], "isController": false}, {"data": [0.0, 500, 1500, "/LoanIQ/accounts.jsp-34-1"], "isController": false}, {"data": [0.0, 500, 1500, "/LoanIQ/accounts.jsp-34-0"], "isController": false}, {"data": [0.8007633587786259, 500, 1500, "/LoanIQ/stmt.jsp-45"], "isController": false}, {"data": [0.80061115355233, 500, 1500, "/LoanIQ/Statements.jsp-53"], "isController": false}, {"data": [0.8007633587786259, 500, 1500, "AB_Statemnet_T06_click on detailed statement"], "isController": true}, {"data": [1.0, 500, 1500, "AB_Statemnet_T08_Logout"], "isController": true}, {"data": [1.0, 500, 1500, "AB_Statemnet_T01_LaunchPage"], "isController": true}, {"data": [0.0, 500, 1500, "/LoanIQ/Statements.jsp-53-1"], "isController": false}, {"data": [0.0, 500, 1500, "/LoanIQ/Statements.jsp-53-0"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 6828, 3595, 52.650849443468076, 14.27885178676042, 0, 242, 9.0, 20.0, 32.0, 121.0, 11.338840010760938, 35.302300241270025, 8.080107685663542], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["AB_Statemnet_T07_select date submit", 1309, 1245, 95.11077158135981, 18.128342245989284, 0, 129, 15.0, 31.0, 39.0, 75.70000000000027, 2.1973299671155893, 2.5483592390045375, 1.711883868425426], "isController": true}, {"data": ["/LoanIQ/Logout.jsp-66", 5, 0, 0.0, 19.4, 16, 21, 20.0, 21.0, 21.0, 21.0, 2.0798668885191347, 4.582206738768719, 1.0480579242928454], "isController": false}, {"data": ["/LoanIQ/stmt.jsp-45-0", 261, 261, 100.0, 10.704980842911873, 4, 224, 7.0, 10.0, 16.59999999999991, 119.31999999999994, 0.44122121919058727, 0.20596068630185618, 0.2568045377320215], "isController": false}, {"data": ["AB_Statemnet_T05_click on Statements", 1311, 261, 19.908466819221967, 12.5949656750572, 0, 242, 8.0, 15.0, 19.399999999999864, 124.87999999999988, 2.1976364093537843, 7.005213244384377, 1.5340470072709749], "isController": true}, {"data": ["/LoanIQ/stmt.jsp-45-1", 261, 261, 100.0, 7.6513409961685825, 3, 119, 6.0, 9.800000000000011, 12.0, 57.25999999999965, 0.4412242027535095, 0.925967589567668, 0.25809892329038303], "isController": false}, {"data": ["/LoanIQ/-2", 5, 0, 0.0, 45.8, 15, 151, 22.0, 151.0, 151.0, 151.0, 2.1654395842356, 5.897862305110437, 1.0023616825465569], "isController": false}, {"data": ["AB_Statemnet_T04_Click on Account", 1312, 261, 19.89329268292683, 17.35823170731706, 0, 227, 13.0, 20.0, 34.0, 127.73999999999978, 2.1980083899588543, 7.463601703016733, 1.7535846295007238], "isController": true}, {"data": ["/LoanIQ/Test-62", 1307, 1245, 95.25631216526396, 18.156082631981615, 5, 129, 15.0, 31.0, 39.0, 75.76000000000022, 2.1994110222970127, 2.5546759965292387, 1.7161272086663861], "isController": false}, {"data": ["AB_Statemnet_T02_personalBanking", 5, 0, 0.0, 10.4, 9, 11, 11.0, 11.0, 11.0, 11.0, 2.320185614849188, 6.117676914153133, 1.3254966647331787], "isController": true}, {"data": ["/LoanIQ/login.jsp-9", 5, 0, 0.0, 10.4, 9, 11, 11.0, 11.0, 11.0, 11.0, 2.3223409196470044, 6.123359846725499, 1.3267279667905247], "isController": false}, {"data": ["AB_Statemnet_T03_Click on login page", 5, 1, 20.0, 41.8, 29, 57, 38.0, 57.0, 57.0, 57.0, 2.3052097740894424, 6.194350795297372, 1.9135042070078376], "isController": true}, {"data": ["/LoanIQ/Login?JSESSIONID=VjuZHL-xL_KLn4EsvxnI2hlsZ2nJUo8bKVoLkRQ-kTuY5Lypdbur!-82356057!1772095324081-26", 5, 1, 20.0, 41.8, 29, 57, 38.0, 57.0, 57.0, 57.0, 1.0127607859023697, 2.721399002430626, 0.8406705742353655], "isController": false}, {"data": ["/LoanIQ/accounts.jsp-34", 1311, 261, 19.908466819221967, 17.3714721586575, 4, 227, 13.0, 20.0, 34.0, 127.75999999999976, 2.1975958870928536, 7.467892991559119, 1.7545928743037174], "isController": false}, {"data": ["/LoanIQ/accounts.jsp-34-1", 261, 261, 100.0, 10.29501915708812, 4, 220, 7.0, 12.0, 14.0, 112.38, 0.441227932263905, 0.9259754164405586, 0.29343381042160094], "isController": false}, {"data": ["/LoanIQ/accounts.jsp-34-0", 261, 261, 100.0, 11.111111111111114, 3, 114, 7.0, 12.0, 20.699999999999932, 105.55999999999995, 0.44122718635678204, 0.2059634717563885, 0.29386420028840365], "isController": false}, {"data": ["/LoanIQ/stmt.jsp-45", 1310, 261, 19.923664122137403, 12.604580152671748, 4, 242, 8.0, 15.0, 19.450000000000045, 124.8900000000001, 2.197227132903728, 7.009255124801662, 1.5349321244460807], "isController": false}, {"data": ["/LoanIQ/Statements.jsp-53", 1309, 261, 19.938884644766997, 14.548510313216186, 4, 234, 8.0, 17.0, 31.5, 127.0, 2.1972857058927207, 15.184862895205082, 1.5377488653721874], "isController": false}, {"data": ["AB_Statemnet_T06_click on detailed statement", 1310, 261, 19.923664122137403, 14.537404580152662, 0, 234, 8.0, 17.0, 31.450000000000045, 127.0, 2.1972713579807914, 15.173172317861301, 1.5365649776960184], "isController": true}, {"data": ["AB_Statemnet_T08_Logout", 5, 0, 0.0, 19.4, 16, 21, 20.0, 21.0, 21.0, 21.0, 2.079002079002079, 4.580301455301456, 1.0476221413721414], "isController": true}, {"data": ["AB_Statemnet_T01_LaunchPage", 5, 0, 0.0, 45.8, 15, 151, 22.0, 151.0, 151.0, 151.0, 2.0946795140343526, 5.705137856095518, 0.9696075094260578], "isController": true}, {"data": ["/LoanIQ/Statements.jsp-53-1", 261, 261, 100.0, 6.6934865900383125, 3, 25, 6.0, 9.0, 11.0, 16.75999999999999, 0.44114440633963387, 0.9258001261951886, 0.25632902516804895], "isController": false}, {"data": ["/LoanIQ/Statements.jsp-53-0", 261, 261, 100.0, 10.4367816091954, 4, 113, 7.0, 12.0, 15.0, 112.38, 0.44114440633963387, 0.20592483030307127, 0.2576214404209971], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Login page is failed", 1, 0.027816411682892908, 0.014645577035735208], "isController": false}, {"data": ["detailed statement page failed", 783, 21.780250347705145, 11.467486818980667], "isController": false}, {"data": ["Response was null", 985, 27.399165507649514, 14.425893380199179], "isController": false}, {"data": ["submit page failed", 260, 7.232267037552155, 3.807850029291154], "isController": false}, {"data": ["Account page failed", 783, 21.780250347705145, 11.467486818980667], "isController": false}, {"data": ["statements page failed", 783, 21.780250347705145, 11.467486818980667], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 6828, 3595, "Response was null", 985, "detailed statement page failed", 783, "Account page failed", 783, "statements page failed", 783, "submit page failed", 260], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/LoanIQ/stmt.jsp-45-0", 261, 261, "statements page failed", 261, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/LoanIQ/stmt.jsp-45-1", 261, 261, "statements page failed", 261, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/LoanIQ/Test-62", 1307, 1245, "Response was null", 985, "submit page failed", 260, "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/LoanIQ/Login?JSESSIONID=VjuZHL-xL_KLn4EsvxnI2hlsZ2nJUo8bKVoLkRQ-kTuY5Lypdbur!-82356057!1772095324081-26", 5, 1, "Login page is failed", 1, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/LoanIQ/accounts.jsp-34", 1311, 261, "Account page failed", 261, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/LoanIQ/accounts.jsp-34-1", 261, 261, "Account page failed", 261, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/LoanIQ/accounts.jsp-34-0", 261, 261, "Account page failed", 261, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/LoanIQ/stmt.jsp-45", 1310, 261, "statements page failed", 261, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/LoanIQ/Statements.jsp-53", 1309, 261, "detailed statement page failed", 261, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/LoanIQ/Statements.jsp-53-1", 261, 261, "detailed statement page failed", 261, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/LoanIQ/Statements.jsp-53-0", 261, 261, "detailed statement page failed", 261, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
