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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9987146529562982, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "/LoanIQ/ddresponse.jsp-93"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/ddrequest.jsp-87"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/ddrequest.jsp-79"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/Login?JSESSIONID=dzOKNcZg_2EKWvrFW_NhTJEFcpcncd0PGcT_nFm37IVqEEfKrZbO!-585965008!1771845305952-47"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/accounts.jsp-61"], "isController": false}, {"data": [1.0, 500, 1500, "AB_DDRequest_T01_LaunchPage"], "isController": true}, {"data": [1.0, 500, 1500, "AB_DDRequest_T08_Logout"], "isController": true}, {"data": [1.0, 500, 1500, "/LoanIQ/Logout.jsp-107"], "isController": false}, {"data": [1.0, 500, 1500, "AB_DDRequest_T05_Click on Service Request"], "isController": true}, {"data": [1.0, 500, 1500, "AB_DDRequest_T06_Click on DD Request"], "isController": true}, {"data": [1.0, 500, 1500, "/LoanIQ/ddresponseresult.jsp-97"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/-22"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/login.jsp-30"], "isController": false}, {"data": [0.9870466321243523, 500, 1500, "AB_DDRequest_T07_fill payee data submit"], "isController": true}, {"data": [1.0, 500, 1500, "AB_DDRequest_T04_Click on Account"], "isController": true}, {"data": [1.0, 500, 1500, "AB_DDRequest_T02_personalBanking"], "isController": true}, {"data": [1.0, 500, 1500, "AB_DDRequest_T03_Click on login page"], "isController": true}, {"data": [1.0, 500, 1500, "/LoanIQ/ServiceRequests.jsp-70"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2331, 0, 0.0, 150.54182754182753, 3, 49466, 23.0, 107.0, 132.0, 199.67999999999984, 3.8289316771410644, 16.608574084838516, 2.616729557369092], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["/LoanIQ/ddresponse.jsp-93", 381, 0, 0.0, 95.36482939632542, 16, 303, 98.0, 144.8, 173.0, 225.50000000000017, 0.7037453660861229, 2.229443327718147, 0.5451201821841596], "isController": false}, {"data": ["/LoanIQ/ddrequest.jsp-87", 386, 0, 0.0, 68.15803108808284, 15, 274, 57.5, 131.0, 139.0, 153.13, 0.6505183080456981, 4.069463829559989, 0.4862380118618474], "isController": false}, {"data": ["/LoanIQ/ddrequest.jsp-79", 386, 0, 0.0, 68.00000000000003, 14, 290, 62.5, 112.0, 138.0, 252.42999999999995, 0.7004542064452675, 4.37335356117905, 0.41589468507687755], "isController": false}, {"data": ["/LoanIQ/Login?JSESSIONID=dzOKNcZg_2EKWvrFW_NhTJEFcpcncd0PGcT_nFm37IVqEEfKrZbO!-585965008!1771845305952-47", 5, 0, 0.0, 80.8, 52, 128, 70.0, 128.0, 128.0, 128.0, 1.452643811737362, 4.342326863015688, 1.2109148024404415], "isController": false}, {"data": ["/LoanIQ/accounts.jsp-61", 386, 0, 0.0, 18.39119170984456, 5, 390, 16.0, 22.30000000000001, 25.649999999999977, 105.38999999999999, 0.7005330221466437, 2.5260583028135657, 0.4665659385781357], "isController": false}, {"data": ["AB_DDRequest_T01_LaunchPage", 5, 0, 0.0, 71.8, 29, 174, 36.0, 174.0, 174.0, 174.0, 2.039983680130559, 5.540229115667074, 0.9442893206854345], "isController": true}, {"data": ["AB_DDRequest_T08_Logout", 5, 0, 0.0, 50.2, 28, 125, 31.0, 125.0, 125.0, 125.0, 2.05761316872428, 4.533179012345679, 1.0489004629629628], "isController": true}, {"data": ["/LoanIQ/Logout.jsp-107", 5, 0, 0.0, 50.2, 28, 125, 31.0, 125.0, 125.0, 125.0, 2.0559210526315788, 4.529451069078948, 1.0480378803453947], "isController": false}, {"data": ["AB_DDRequest_T05_Click on Service Request", 386, 0, 0.0, 16.78497409326424, 4, 128, 16.0, 20.0, 22.0, 100.51999999999998, 0.7005393790244716, 2.517187658801025, 0.4152611358084515], "isController": true}, {"data": ["AB_DDRequest_T06_Click on DD Request", 386, 0, 0.0, 68.00000000000003, 14, 290, 62.5, 112.0, 138.0, 252.42999999999995, 0.700450393232125, 4.373329753014114, 0.4158924209815742], "isController": true}, {"data": ["/LoanIQ/ddresponseresult.jsp-97", 381, 0, 0.0, 11.719160104986875, 3, 167, 7.0, 13.0, 17.0, 126.26000000000005, 0.7039039882350115, 2.2474413188176996, 0.5148672726445543], "isController": false}, {"data": ["/LoanIQ/-22", 5, 0, 0.0, 71.8, 29, 174, 36.0, 174.0, 174.0, 174.0, 2.16169476869866, 5.870774562256809, 1.0006282425421529], "isController": false}, {"data": ["/LoanIQ/login.jsp-30", 5, 0, 0.0, 20.8, 19, 22, 21.0, 22.0, 22.0, 22.0, 2.3573785950023574, 6.215744342291372, 1.346744607496464], "isController": false}, {"data": ["AB_DDRequest_T07_fill payee data submit", 386, 0, 0.0, 802.3886010362695, 46, 49466, 176.5, 247.0, 294.94999999999993, 48343.479999999996, 0.643069674766679, 8.060315062491046, 1.4366163909255538], "isController": true}, {"data": ["AB_DDRequest_T04_Click on Account", 386, 0, 0.0, 18.39119170984456, 5, 390, 16.0, 22.30000000000001, 25.649999999999977, 105.38999999999999, 0.7005330221466437, 2.5260583028135657, 0.4665659385781357], "isController": true}, {"data": ["AB_DDRequest_T02_personalBanking", 5, 0, 0.0, 20.8, 19, 22, 21.0, 22.0, 22.0, 22.0, 2.344116268166901, 6.180775316455696, 1.3391679852320675], "isController": true}, {"data": ["AB_DDRequest_T03_Click on login page", 5, 0, 0.0, 80.8, 52, 128, 70.0, 128.0, 128.0, 128.0, 2.328830926874709, 6.9614760421518405, 1.9412989054494645], "isController": true}, {"data": ["/LoanIQ/ServiceRequests.jsp-70", 386, 0, 0.0, 16.78497409326424, 4, 128, 16.0, 20.0, 22.0, 100.51999999999998, 0.7005419218079063, 2.5171967955651704, 0.4152626431029289], "isController": false}]}, function(index, item){
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
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2331, 0, "", "", "", "", "", "", "", "", "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
