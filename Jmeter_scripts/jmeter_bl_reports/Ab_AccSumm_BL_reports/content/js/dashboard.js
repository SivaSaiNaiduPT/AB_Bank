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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [1.0, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "AB_Acsummary_T06_click on logout"], "isController": true}, {"data": [1.0, 500, 1500, "AB_Acsummary_T03_Click on login page"], "isController": true}, {"data": [1.0, 500, 1500, "/LoanIQ/login.jsp-11"], "isController": false}, {"data": [1.0, 500, 1500, "AB_Acsummary_T05_click on account summary"], "isController": true}, {"data": [1.0, 500, 1500, "/LoanIQ/AccountSummary.jsp-50"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/Logout.jsp-57"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/-2"], "isController": false}, {"data": [1.0, 500, 1500, "AB_Acsummary_T01_LaunchPage"], "isController": true}, {"data": [1.0, 500, 1500, "AB_Acsummary_T02_personalBanking"], "isController": true}, {"data": [1.0, 500, 1500, "AB_Acsummary_T04_Click on Account"], "isController": true}, {"data": [1.0, 500, 1500, "/LoanIQ/Login?JSESSIONID=aT56PwfVm8Aa-GFQa9BIUP8xaV-UAitZ7-Kysh6-fOWvz1X7UL6u!-602553151!1771577477077-30"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/accounts.jsp-43"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 5629, 0, 0.0, 20.688754663350494, 0, 305, 17.0, 39.0, 49.0, 137.39999999999964, 9.350405145463666, 45.51261318149238, 5.874250396798371], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["AB_Acsummary_T06_click on logout", 5, 0, 0.0, 12.2, 9, 15, 12.0, 15.0, 15.0, 15.0, 2.0729684908789388, 4.567008706467662, 1.052679311774461], "isController": true}, {"data": ["AB_Acsummary_T03_Click on login page", 5, 0, 0.0, 37.8, 24, 72, 29.0, 72.0, 72.0, 72.0, 1.3000520020800832, 3.8861906038741547, 1.081429975949038], "isController": true}, {"data": ["/LoanIQ/login.jsp-11", 5, 0, 0.0, 8.4, 6, 9, 9.0, 9.0, 9.0, 9.0, 1.3065064018813692, 3.4448899268356414, 0.7463928174810557], "isController": false}, {"data": ["AB_Acsummary_T05_click on account summary", 2803, 0, 0.0, 29.513378523011067, 0, 305, 24.0, 48.0, 51.79999999999973, 150.8800000000001, 4.716941442949914, 29.012532833374845, 2.7894794315353537], "isController": true}, {"data": ["/LoanIQ/AccountSummary.jsp-50", 2801, 0, 0.0, 29.534451981435208, 14, 305, 24.0, 48.0, 51.90000000000009, 150.94000000000005, 4.7175928655039705, 29.037258243892477, 2.791856715327545], "isController": false}, {"data": ["/LoanIQ/Logout.jsp-57", 5, 0, 0.0, 12.2, 9, 15, 12.0, 15.0, 15.0, 15.0, 2.06953642384106, 4.559447433774834, 1.050936465231788], "isController": false}, {"data": ["/LoanIQ/-2", 5, 0, 0.0, 22.0, 13, 51, 16.0, 51.0, 51.0, 51.0, 1.2903225806451613, 3.5143649193548385, 0.5972782258064516], "isController": false}, {"data": ["AB_Acsummary_T01_LaunchPage", 5, 0, 0.0, 22.0, 13, 51, 16.0, 51.0, 51.0, 51.0, 1.255335174491589, 3.4190720719307053, 0.5810828835048958], "isController": true}, {"data": ["AB_Acsummary_T02_personalBanking", 5, 0, 0.0, 8.4, 6, 9, 9.0, 9.0, 9.0, 9.0, 1.3068478829064296, 3.4457903162571877, 0.746587901855724], "isController": true}, {"data": ["AB_Acsummary_T04_Click on Account", 2806, 0, 0.0, 11.87776193870277, 0, 245, 6.0, 24.0, 33.0, 128.0, 4.717948717948718, 16.99145189680538, 3.138868090584279], "isController": true}, {"data": ["/LoanIQ/Login?JSESSIONID=aT56PwfVm8Aa-GFQa9BIUP8xaV-UAitZ7-Kysh6-fOWvz1X7UL6u!-602553151!1771577477077-30", 5, 0, 0.0, 37.8, 24, 72, 29.0, 72.0, 72.0, 72.0, 1.4277555682467162, 4.267929486721873, 1.1876583916333525], "isController": false}, {"data": ["/LoanIQ/accounts.jsp-43", 2803, 0, 0.0, 11.890474491616114, 2, 245, 6.0, 24.0, 33.0, 128.0, 4.716862066702454, 17.005719831561073, 3.1415038373936266], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 5629, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
