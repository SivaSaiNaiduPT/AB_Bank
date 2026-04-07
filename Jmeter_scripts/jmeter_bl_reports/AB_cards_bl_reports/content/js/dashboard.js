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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9945317840054683, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "AB_CardApply_T03_click on login page"], "isController": true}, {"data": [1.0, 500, 1500, "/LoanIQ/CreditCards.jsp-38"], "isController": false}, {"data": [0.9958333333333333, 500, 1500, "AB_CardApply_T06_click on apply"], "isController": true}, {"data": [1.0, 500, 1500, "/LoanIQ/Logout.jsp-98"], "isController": false}, {"data": [0.9829059829059829, 500, 1500, "AB_CardApply_T08_fill prof data click next"], "isController": true}, {"data": [1.0, 500, 1500, "/LoanIQ/-2"], "isController": false}, {"data": [1.0, 500, 1500, "AB_CardApply_T04_creditcards"], "isController": true}, {"data": [0.9957264957264957, 500, 1500, "/LoanIQ/visaapply.jsp-73"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/login.jsp-9"], "isController": false}, {"data": [1.0, 500, 1500, "AB_CardApply_T05_click any card"], "isController": true}, {"data": [0.9957264957264957, 500, 1500, "/LoanIQ/visaapply.jsp-66"], "isController": false}, {"data": [0.9827586206896551, 500, 1500, "/LoanIQ/VisaCard-89"], "isController": false}, {"data": [0.9957627118644068, 500, 1500, "/LoanIQ/visaapply.jsp-53"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/visaapply1.jsp-80"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/visacard.jsp-46"], "isController": false}, {"data": [1.0, 500, 1500, "AB_CardApply_T09_Logout"], "isController": true}, {"data": [1.0, 500, 1500, "AB_CardApply_T01_LaunchPage"], "isController": true}, {"data": [0.9830508474576272, 500, 1500, "AB_CardApply_T07_fill data click next"], "isController": true}, {"data": [1.0, 500, 1500, "AB_CardApply_T02_Personal Banking"], "isController": true}, {"data": [1.0, 500, 1500, "/LoanIQ/Login?JSESSIONID=UFu98ZQDG7q9GFqtHPsj7n76yuYndVlL9qTyd6iMHqQ4VtErPQ0O!756894349!1772713251843-30"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 851, 0, 0.0, 41.52761457109284, 0, 713, 20.0, 55.0, 151.1999999999997, 496.8800000000001, 6.983595525903312, 65.46284143504272, 6.5164832677851905], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["AB_CardApply_T03_click on login page", 5, 0, 0.0, 41.4, 33, 56, 40.0, 56.0, 56.0, 56.0, 2.2094564737074682, 6.605929628811313, 1.829706142288997], "isController": true}, {"data": ["/LoanIQ/CreditCards.jsp-38", 121, 0, 0.0, 12.363636363636356, 5, 177, 8.0, 12.0, 25.29999999999994, 173.04000000000002, 1.0487086150112672, 3.766147390687294, 0.7200984653969492], "isController": false}, {"data": ["AB_CardApply_T06_click on apply", 120, 0, 0.0, 54.749999999999986, 0, 656, 27.0, 130.6000000000002, 275.3499999999996, 615.2599999999984, 1.0447865152887092, 15.805312399330466, 0.6221530247657937], "isController": true}, {"data": ["/LoanIQ/Logout.jsp-98", 5, 0, 0.0, 22.0, 15, 32, 21.0, 32.0, 32.0, 32.0, 2.0559210526315788, 4.527443333675987, 1.0239450555098684], "isController": false}, {"data": ["AB_CardApply_T08_fill prof data click next", 117, 0, 0.0, 88.95726495726494, 0, 691, 48.0, 155.20000000000044, 494.59999999999997, 661.4799999999989, 1.0509863102296002, 2.416168472768675, 1.344242790188998], "isController": true}, {"data": ["/LoanIQ/-2", 5, 0, 0.0, 33.4, 18, 54, 28.0, 54.0, 54.0, 54.0, 2.170138888888889, 5.908542209201389, 1.0045369466145835], "isController": false}, {"data": ["AB_CardApply_T04_creditcards", 121, 0, 0.0, 12.363636363636356, 5, 177, 8.0, 12.0, 25.29999999999994, 173.04000000000002, 1.0487086150112672, 3.766147390687294, 0.7200984653969492], "isController": true}, {"data": ["/LoanIQ/visaapply.jsp-73", 117, 0, 0.0, 39.504273504273506, 14, 572, 20.0, 39.80000000000001, 128.29999999999998, 557.5999999999995, 1.046914287248226, 18.425483484815267, 1.2062565851579767], "isController": false}, {"data": ["/LoanIQ/login.jsp-9", 5, 0, 0.0, 12.4, 8, 15, 13.0, 15.0, 15.0, 15.0, 2.2212350066637048, 5.8546028154153715, 1.2667980897378943], "isController": false}, {"data": ["AB_CardApply_T05_click any card", 121, 0, 0.0, 20.35537190082644, 0, 489, 8.0, 17.0, 45.29999999999994, 459.08000000000015, 1.0488086054312682, 3.706940474694242, 0.6319312244840468], "isController": true}, {"data": ["/LoanIQ/visaapply.jsp-66", 117, 0, 0.0, 64.44444444444443, 17, 713, 31.0, 109.8000000000001, 357.5999999999999, 669.2599999999984, 1.0465209885598261, 17.84525828719398, 1.1973741659138275], "isController": false}, {"data": ["/LoanIQ/VisaCard-89", 116, 0, 0.0, 89.72413793103446, 22, 691, 48.0, 171.29999999999956, 494.9, 663.1199999999997, 1.051858434363127, 2.4390197682511037, 1.356956178988221], "isController": false}, {"data": ["/LoanIQ/visaapply.jsp-53", 118, 0, 0.0, 55.677966101694906, 14, 656, 27.0, 134.70000000000005, 277.79999999999995, 619.1400000000004, 1.0410876719338644, 16.016295324259108, 0.6304580592758264], "isController": false}, {"data": ["/LoanIQ/visaapply1.jsp-80", 117, 0, 0.0, 14.487179487179487, 4, 259, 7.0, 12.200000000000003, 20.69999999999996, 257.55999999999995, 1.0486032067540803, 8.27749558600787, 1.2235016933373366], "isController": false}, {"data": ["/LoanIQ/visacard.jsp-46", 120, 0, 0.0, 20.524999999999995, 4, 489, 8.0, 17.0, 45.64999999999992, 460.4399999999989, 1.0446955583027178, 3.723173224670486, 0.6346984611416782], "isController": false}, {"data": ["AB_CardApply_T09_Logout", 5, 0, 0.0, 22.0, 15, 32, 21.0, 32.0, 32.0, 32.0, 2.061005770816158, 4.538640637881286, 1.0264774835119537], "isController": true}, {"data": ["AB_CardApply_T01_LaunchPage", 5, 0, 0.0, 33.4, 18, 54, 28.0, 54.0, 54.0, 54.0, 2.0981955518254303, 5.712665232899706, 0.9712350503566932], "isController": true}, {"data": ["AB_CardApply_T07_fill data click next", 118, 0, 0.0, 117.43220338983048, 0, 827, 61.0, 307.6000000000003, 496.2, 812.9400000000002, 1.0414735968791098, 43.93462470818881, 3.5762040935207984], "isController": true}, {"data": ["AB_CardApply_T02_Personal Banking", 5, 0, 0.0, 12.4, 8, 15, 13.0, 15.0, 15.0, 15.0, 2.2172949002217295, 5.844217710643016, 1.2645509977827052], "isController": true}, {"data": ["/LoanIQ/Login?JSESSIONID=UFu98ZQDG7q9GFqtHPsj7n76yuYndVlL9qTyd6iMHqQ4VtErPQ0O!756894349!1772713251843-30", 5, 0, 0.0, 41.4, 33, 56, 40.0, 56.0, 56.0, 56.0, 1.2823800974608872, 3.8341161195178253, 1.0619710182097974], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 851, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
