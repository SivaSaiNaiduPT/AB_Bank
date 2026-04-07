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

    var data = {"OkPercent": 100.0, "KoPercent": 0.0};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9966339155749636, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "AB_fundTransfer_T08_click on Ac preview nd close window"], "isController": true}, {"data": [0.9985443959243085, 500, 1500, "/LoanIQ/accounts.jsp-35"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/Logout.jsp-86"], "isController": false}, {"data": [1.0, 500, 1500, "AB_fundTransfer_T01_LaunchPage"], "isController": true}, {"data": [1.0, 500, 1500, "AB_fundTransfer_T07_Click on bank to bank transfer"], "isController": true}, {"data": [1.0, 500, 1500, "AB_fundTransfer_T11_logout"], "isController": true}, {"data": [1.0, 500, 1500, "/LoanIQ/-2"], "isController": false}, {"data": [0.982532751091703, 500, 1500, "AB_fundTransfer_T05_click AS nd Back"], "isController": true}, {"data": [0.9860703812316716, 500, 1500, "AB_fundTransfer_T10_Enter Amount pay"], "isController": true}, {"data": [1.0, 500, 1500, "/LoanIQ/fund1.jsp-66"], "isController": false}, {"data": [1.0, 500, 1500, "AB_fundTransfer_T09_click submit"], "isController": true}, {"data": [0.9985443959243085, 500, 1500, "AB_fundTransfer_T04_Click on Account"], "isController": true}, {"data": [0.9934306569343065, 500, 1500, "/LoanIQ/AccountSummary.jsp-2"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/fund.jsp-50"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/login.jsp-10"], "isController": false}, {"data": [1.0, 500, 1500, "AB_fundTransfer_T03_Click on login page"], "isController": true}, {"data": [1.0, 500, 1500, "/LoanIQ/fundtransferresult.jsp-78"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/Login?JSESSIONID=X1mPOOL_bL9NxNORTuOR5sPYafPgb4cVpDlkvANhoV0WS0l-6o5u!1083219685!1771929395967-27"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/showdet.jsp-59"], "isController": false}, {"data": [0.9882697947214076, 500, 1500, "/LoanIQ/FundTransfer1.jsp-74"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/FundTransfer.jsp-41"], "isController": false}, {"data": [1.0, 500, 1500, "AB_fundTransfer_T02_personalBanking"], "isController": true}, {"data": [0.9985401459854014, 500, 1500, "/LoanIQ/accounts.jsp-8"], "isController": false}, {"data": [1.0, 500, 1500, "AB_fundTransfer_T06_Click on Fund Transfer"], "isController": true}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 6182, 0, 0.0, 31.29650598511801, 0, 568, 10.0, 56.0, 69.0, 467.1700000000001, 10.270570214349558, 37.791036762000054, 6.768077800566194], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["AB_fundTransfer_T08_click on Ac preview nd close window", 685, 0, 0.0, 32.481751824817515, 0, 488, 26.0, 35.0, 40.0, 354.1399999999993, 1.157141505736719, 0.8083658849767558, 0.6883065149600659], "isController": true}, {"data": ["/LoanIQ/accounts.jsp-35", 687, 0, 0.0, 30.740902474526965, 5, 506, 9.0, 16.0, 206.40000000000123, 469.32000000000005, 1.1574093573261317, 4.173937767345556, 0.7708527165004119], "isController": false}, {"data": ["/LoanIQ/Logout.jsp-86", 5, 0, 0.0, 63.2, 35, 99, 48.0, 99.0, 99.0, 99.0, 2.044153720359771, 4.50352616516762, 1.0460317865903515], "isController": false}, {"data": ["AB_fundTransfer_T01_LaunchPage", 5, 0, 0.0, 28.0, 22, 46, 24.0, 46.0, 46.0, 46.0, 2.08768267223382, 5.686081028183716, 0.9663687369519833], "isController": true}, {"data": ["AB_fundTransfer_T07_Click on bank to bank transfer", 685, 0, 0.0, 10.115328467153269, 3, 391, 8.0, 12.0, 15.699999999999932, 48.0, 1.15712586826671, 5.506323267921937, 0.6780034384375253], "isController": true}, {"data": ["AB_fundTransfer_T11_logout", 5, 0, 0.0, 63.2, 35, 99, 48.0, 99.0, 99.0, 99.0, 2.051702913418137, 4.520157981124333, 1.0498948502256873], "isController": true}, {"data": ["/LoanIQ/-2", 5, 0, 0.0, 28.0, 22, 46, 24.0, 46.0, 46.0, 46.0, 2.150537634408602, 5.857274865591397, 0.9954637096774193], "isController": false}, {"data": ["AB_fundTransfer_T05_click AS nd Back", 687, 0, 0.0, 88.26200873362454, 0, 540, 39.0, 417.0000000000002, 486.0, 525.12, 1.1574425069497092, 11.265373599528264, 1.3659535317159466], "isController": true}, {"data": ["AB_fundTransfer_T10_Enter Amount pay", 682, 0, 0.0, 89.98680351906171, 44, 576, 66.0, 94.0, 329.0, 541.17, 1.158406087576859, 7.2272094058922445, 1.8387437445858952], "isController": true}, {"data": ["/LoanIQ/fund1.jsp-66", 682, 0, 0.0, 13.277126099706736, 4, 432, 9.0, 16.0, 20.0, 80.5899999999989, 1.1584847970103618, 5.654663479913368, 0.8462369415661627], "isController": false}, {"data": ["AB_fundTransfer_T09_click submit", 684, 0, 0.0, 13.238304093567242, 0, 432, 9.0, 16.0, 20.0, 80.04999999999939, 1.1565052575337695, 5.6284953268479985, 0.8423208008629829], "isController": true}, {"data": ["AB_fundTransfer_T04_Click on Account", 687, 0, 0.0, 30.740902474526965, 5, 506, 9.0, 16.0, 206.40000000000123, 469.32000000000005, 1.1574093573261317, 4.173937767345556, 0.7708527165004119], "isController": true}, {"data": ["/LoanIQ/AccountSummary.jsp-2", 685, 0, 0.0, 50.47153284671534, 16, 534, 30.0, 51.0, 90.39999999999986, 506.8399999999999, 1.1570222807020507, 7.121607066471352, 0.6847221700248464], "isController": false}, {"data": ["/LoanIQ/fund.jsp-50", 685, 0, 0.0, 10.115328467153269, 3, 391, 8.0, 12.0, 15.699999999999932, 48.0, 1.1571160950625772, 5.506276760949105, 0.6779977119507288], "isController": false}, {"data": ["/LoanIQ/login.jsp-10", 5, 0, 0.0, 11.4, 10, 12, 12.0, 12.0, 12.0, 12.0, 2.1949078138718177, 5.787354587357331, 1.253926827260755], "isController": false}, {"data": ["AB_fundTransfer_T03_Click on login page", 5, 0, 0.0, 121.6, 42, 407, 50.0, 407.0, 407.0, 407.0, 1.8740629685157422, 5.603887509370314, 1.5607430659670165], "isController": true}, {"data": ["/LoanIQ/fundtransferresult.jsp-78", 682, 0, 0.0, 11.266862170087974, 3, 449, 7.0, 10.0, 13.0, 128.4399999999864, 1.1585556446461818, 3.783215839171412, 0.8576027135173886], "isController": false}, {"data": ["/LoanIQ/Login?JSESSIONID=X1mPOOL_bL9NxNORTuOR5sPYafPgb4cVpDlkvANhoV0WS0l-6o5u!1083219685!1771929395967-27", 5, 0, 0.0, 121.6, 42, 407, 50.0, 407.0, 407.0, 407.0, 1.082485386447283, 3.236885012989825, 0.9015073609006279], "isController": false}, {"data": ["/LoanIQ/showdet.jsp-59", 684, 0, 0.0, 32.52923976608187, 13, 488, 26.0, 35.0, 40.0, 354.64999999999884, 1.1564250910431157, 0.8090464956008508, 0.6888860405627936], "isController": false}, {"data": ["/LoanIQ/FundTransfer1.jsp-74", 682, 0, 0.0, 78.71994134897363, 40, 568, 59.0, 84.0, 113.55000000000007, 530.5099999999999, 1.1584218286079235, 3.4445287446155466, 0.9812650721168545], "isController": false}, {"data": ["/LoanIQ/FundTransfer.jsp-41", 685, 0, 0.0, 16.049635036496344, 4, 461, 9.0, 32.0, 46.69999999999993, 65.0, 1.1571180496901963, 3.7299323555756194, 0.6825188496219518], "isController": false}, {"data": ["AB_fundTransfer_T02_personalBanking", 5, 0, 0.0, 11.4, 10, 12, 12.0, 12.0, 12.0, 12.0, 2.1872265966754156, 5.767101377952756, 1.2495386318897637], "isController": true}, {"data": ["/LoanIQ/accounts.jsp-8", 685, 0, 0.0, 38.048175182481764, 3, 508, 7.0, 22.59999999999991, 416.1999999999996, 485.55999999999995, 1.157073094925601, 4.172739386915953, 0.6847522417235491], "isController": false}, {"data": ["AB_fundTransfer_T06_Click on Fund Transfer", 685, 0, 0.0, 16.049635036496344, 4, 461, 9.0, 32.0, 46.69999999999993, 65.0, 1.15712586826671, 3.7299575585024254, 0.6825234613604422], "isController": true}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": []}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 6182, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
