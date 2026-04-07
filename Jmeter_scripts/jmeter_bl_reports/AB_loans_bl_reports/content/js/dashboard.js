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

    var data = {"OkPercent": 47.712418300653596, "KoPercent": 52.287581699346404};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.4552721088435374, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "AB_LoanApply_T02_Personal Banking"], "isController": true}, {"data": [1.0, 500, 1500, "/LoanIQ/-2"], "isController": false}, {"data": [1.0, 500, 1500, "AB_LoanApply_T01_LaunchPage"], "isController": true}, {"data": [1.0, 500, 1500, "/LoanIQ/login.jsp-10"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/homeloan.jsp-276-0"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/homeloan.jsp-276-1"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/homeloan1.jsp-285-0"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/homeloan1.jsp-285-1"], "isController": false}, {"data": [0.2, 500, 1500, "AB_LoanApply_T04_click on Loans"], "isController": true}, {"data": [0.2, 500, 1500, "/LoanIQ/hloan.jsp-87"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/homeloan.jsp-276"], "isController": false}, {"data": [0.2, 500, 1500, "AB_LoanApply_T07_Click on Next"], "isController": true}, {"data": [0.0, 500, 1500, "/LoanIQ/hloan.jsp-87-0"], "isController": false}, {"data": [0.0, 500, 1500, "/LoanIQ/hloan.jsp-87-1"], "isController": false}, {"data": [1.0, 500, 1500, "AB_LoanApply_T03_click on login page"], "isController": true}, {"data": [0.2, 500, 1500, "AB_LoanApply_T06_Click on Apply"], "isController": true}, {"data": [1.0, 500, 1500, "/LoanIQ/Login?JSESSIONID=_Iix9gkGuldf_bMfGGPE4cOCiLPPZo-qrH0vGvvsQNJ43ItGxNkG!-1291430766!1772512217350-46"], "isController": false}, {"data": [1.0, 500, 1500, "AB_LoanApply_T09_Logout"], "isController": true}, {"data": [0.0, 500, 1500, "/LoanIQ/loans.jsp-78-1"], "isController": false}, {"data": [0.996, 500, 1500, "/LoanIQ/HomeLoan-295"], "isController": false}, {"data": [0.0, 500, 1500, "/LoanIQ/loans.jsp-78-0"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/homeloan1.jsp-285"], "isController": false}, {"data": [0.0, 500, 1500, "/LoanIQ/homeloan.jsp-95-1"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/Logout.jsp-304"], "isController": false}, {"data": [0.0, 500, 1500, "/LoanIQ/homeloan.jsp-95-0"], "isController": false}, {"data": [1.0, 500, 1500, "/LoanIQ/HomeLoan-295-1"], "isController": false}, {"data": [0.2, 500, 1500, "/LoanIQ/loans.jsp-78"], "isController": false}, {"data": [0.995, 500, 1500, "/LoanIQ/HomeLoan-295-0"], "isController": false}, {"data": [0.2, 500, 1500, "/LoanIQ/homeloan.jsp-269"], "isController": false}, {"data": [0.996, 500, 1500, "AB_LoanApply_T08_fill professional data click next"], "isController": true}, {"data": [0.2, 500, 1500, "/LoanIQ/homeloan.jsp-95"], "isController": false}, {"data": [0.0, 500, 1500, "/LoanIQ/homeloan.jsp-269-0"], "isController": false}, {"data": [0.2, 500, 1500, "AB_LoanApply_T05_click on a Loan type"], "isController": true}, {"data": [0.0, 500, 1500, "/LoanIQ/homeloan.jsp-269-1"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 2295, 1200, 52.287581699346404, 32.17080610021792, 3, 524, 14.0, 98.0, 143.39999999999964, 224.39999999999964, 12.460771644821856, 30.07083225025519, 12.793314458363648], "isController": false}, "titles": ["Label", "#Samples", "FAIL", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions/s", "Received", "Sent"], "items": [{"data": ["AB_LoanApply_T02_Personal Banking", 5, 0, 0.0, 19.6, 18, 22, 18.0, 22.0, 22.0, 22.0, 2.2904260192395784, 6.039209230416858, 1.308495333256986], "isController": true}, {"data": ["/LoanIQ/-2", 5, 0, 0.0, 42.2, 27, 87, 32.0, 87.0, 87.0, 87.0, 2.2143489813994686, 6.031073544065545, 1.0250013839681134], "isController": false}, {"data": ["AB_LoanApply_T01_LaunchPage", 5, 0, 0.0, 42.2, 27, 87, 32.0, 87.0, 87.0, 87.0, 2.0798668885191347, 5.664793703202995, 0.9627508839434277], "isController": true}, {"data": ["/LoanIQ/login.jsp-10", 5, 0, 0.0, 19.6, 18, 22, 18.0, 22.0, 22.0, 22.0, 2.293577981651376, 6.047520068807339, 1.3102960149082568], "isController": false}, {"data": ["/LoanIQ/homeloan.jsp-276-0", 100, 0, 0.0, 13.610000000000003, 3, 122, 7.0, 18.600000000000023, 89.69999999999993, 121.95999999999998, 0.7230657989877078, 0.3375248553868402, 0.8226921208423716], "isController": false}, {"data": ["/LoanIQ/homeloan.jsp-276-1", 100, 0, 0.0, 16.17000000000001, 3, 163, 6.0, 50.30000000000015, 97.84999999999997, 162.95, 0.723531412116257, 1.518426762341637, 0.5009607140531506], "isController": false}, {"data": ["/LoanIQ/homeloan1.jsp-285-0", 100, 0, 0.0, 12.619999999999996, 4, 183, 7.0, 13.0, 30.899999999999977, 182.95999999999998, 0.7234319612240468, 0.3376957787745063, 0.8301734993308255], "isController": false}, {"data": ["/LoanIQ/homeloan1.jsp-285-1", 100, 0, 0.0, 11.169999999999996, 3, 238, 6.0, 11.0, 42.99999999999977, 236.46999999999923, 0.7234738319514984, 1.5183059227185252, 0.5009208465367307], "isController": false}, {"data": ["AB_LoanApply_T04_click on Loans", 125, 100, 80.0, 23.552000000000003, 7, 110, 21.0, 30.400000000000006, 38.799999999999955, 107.91999999999996, 0.7238571742932258, 2.0302779955381443, 0.8579686812335684], "isController": true}, {"data": ["/LoanIQ/hloan.jsp-87", 125, 100, 80.0, 27.439999999999998, 9, 205, 21.0, 29.400000000000006, 96.49999999999994, 202.13999999999993, 0.7237775397353869, 1.998841729755942, 0.7592313301583624], "isController": false}, {"data": ["/LoanIQ/homeloan.jsp-276", 125, 0, 0.0, 37.104000000000006, 8, 212, 15.0, 104.80000000000001, 118.69999999999999, 201.3399999999998, 0.7245872750881098, 4.410121198090567, 1.2331626296286635], "isController": false}, {"data": ["AB_LoanApply_T07_Click on Next", 125, 100, 80.0, 106.94400000000013, 32, 477, 64.0, 232.4, 264.6999999999999, 456.9799999999996, 0.7237691581696167, 11.446053006319953, 3.7005977790419613], "isController": true}, {"data": ["/LoanIQ/hloan.jsp-87-0", 100, 100, 100.0, 17.18, 5, 193, 15.0, 19.0, 23.849999999999966, 191.94999999999948, 0.7231076273392532, 0.3375443807306279, 0.4194589166401527], "isController": false}, {"data": ["/LoanIQ/hloan.jsp-87-1", 100, 100, 100.0, 13.229999999999999, 4, 174, 8.0, 13.0, 53.949999999999534, 173.85999999999993, 0.7231285433298623, 1.517581288687377, 0.4208834099849589], "isController": false}, {"data": ["AB_LoanApply_T03_click on login page", 5, 0, 0.0, 120.2, 85, 150, 129.0, 150.0, 150.0, 150.0, 2.1654395842356, 6.470942507579038, 1.797484029883066], "isController": true}, {"data": ["AB_LoanApply_T06_Click on Apply", 125, 100, 80.0, 39.17599999999999, 11, 212, 23.0, 105.80000000000001, 117.49999999999994, 207.3199999999999, 0.7237775397353869, 4.057790922382097, 0.7613517721693059], "isController": true}, {"data": ["/LoanIQ/Login?JSESSIONID=_Iix9gkGuldf_bMfGGPE4cOCiLPPZo-qrH0vGvvsQNJ43ItGxNkG!-1291430766!1772512217350-46", 5, 0, 0.0, 120.2, 85, 150, 129.0, 150.0, 150.0, 150.0, 1.0204081632653061, 3.049266581632653, 0.8470184948979591], "isController": false}, {"data": ["AB_LoanApply_T09_Logout", 5, 0, 0.0, 29.4, 24, 45, 26.0, 45.0, 45.0, 45.0, 2.046663937781416, 4.509056487924683, 2.5863116557511256], "isController": true}, {"data": ["/LoanIQ/loans.jsp-78-1", 100, 100, 100.0, 11.009999999999998, 4, 97, 7.0, 13.900000000000006, 18.899999999999977, 96.92999999999996, 0.7231965286566624, 1.5177239649249683, 0.48095394142108117], "isController": false}, {"data": ["/LoanIQ/HomeLoan-295", 125, 0, 0.0, 141.56000000000003, 34, 524, 129.0, 221.00000000000003, 312.4, 491.4999999999994, 0.7336197384792356, 1.8447957290859684, 1.1957887109127403], "isController": false}, {"data": ["/LoanIQ/loans.jsp-78-0", 100, 100, 100.0, 13.519999999999998, 5, 29, 14.0, 19.0, 21.94999999999999, 28.95999999999998, 0.7232017588266774, 0.35256085742800525, 0.46767988739748617], "isController": false}, {"data": ["/LoanIQ/homeloan1.jsp-285", 125, 0, 0.0, 25.47199999999999, 6, 256, 13.0, 35.400000000000006, 91.19999999999993, 255.48, 0.7245326764237067, 2.7315617754673234, 1.2406886230256484], "isController": false}, {"data": ["/LoanIQ/homeloan.jsp-95-1", 100, 100, 100.0, 13.37, 4, 201, 7.0, 14.900000000000006, 54.2499999999996, 200.7499999999999, 0.7230919411403159, 1.517504474131386, 0.4208621063668246], "isController": false}, {"data": ["/LoanIQ/Logout.jsp-304", 5, 0, 0.0, 29.4, 24, 45, 26.0, 45.0, 45.0, 45.0, 2.0475020475020473, 4.510902948402948, 2.587370751433251], "isController": false}, {"data": ["/LoanIQ/homeloan.jsp-95-0", 100, 100, 100.0, 16.749999999999996, 6, 104, 15.0, 20.0, 23.94999999999999, 103.91999999999996, 0.7230814840524379, 0.33753217712604033, 0.42156215427666544], "isController": false}, {"data": ["/LoanIQ/HomeLoan-295-1", 100, 0, 0.0, 15.849999999999994, 3, 169, 8.5, 18.80000000000001, 90.74999999999994, 168.40999999999968, 0.7227888083380917, 1.5168683096860927, 0.42350906738560057], "isController": false}, {"data": ["/LoanIQ/loans.jsp-78", 125, 100, 80.0, 23.552000000000003, 7, 110, 21.0, 30.400000000000006, 38.799999999999955, 107.91999999999996, 0.7238362161317035, 2.030219211988465, 0.8579438400814171], "isController": false}, {"data": ["/LoanIQ/HomeLoan-295-0", 100, 0, 0.0, 120.89999999999998, 27, 506, 101.0, 198.50000000000003, 216.69999999999993, 504.00999999999897, 0.7221467980010976, 0.33709586859816865, 0.8279934902979578], "isController": false}, {"data": ["/LoanIQ/homeloan.jsp-269", 125, 100, 80.0, 44.367999999999995, 10, 259, 26.0, 125.20000000000002, 147.7, 256.13999999999993, 0.7239577903649906, 4.313351826835088, 1.2297667371801555], "isController": false}, {"data": ["AB_LoanApply_T08_fill professional data click next", 125, 0, 0.0, 141.56000000000003, 34, 524, 129.0, 221.00000000000003, 312.4, 491.4999999999994, 0.7240164959918447, 1.8206469503701173, 1.1801355757089569], "isController": true}, {"data": ["/LoanIQ/homeloan.jsp-95", 125, 100, 80.0, 39.17599999999999, 11, 212, 23.0, 105.80000000000001, 117.49999999999994, 207.3199999999999, 0.7237817305910691, 4.057814418021586, 0.761356180589332], "isController": false}, {"data": ["/LoanIQ/homeloan.jsp-269-0", 100, 100, 100.0, 19.13, 5, 246, 17.0, 22.900000000000006, 29.0, 244.4199999999992, 0.7229978382364637, 0.3374931315205368, 0.8212026910883287], "isController": false}, {"data": ["AB_LoanApply_T05_click on a Loan type", 125, 100, 80.0, 27.439999999999998, 9, 205, 21.0, 29.400000000000006, 96.49999999999994, 202.13999999999993, 0.7238194504762732, 1.998957473797736, 0.7592752938706969], "isController": true}, {"data": ["/LoanIQ/homeloan.jsp-269-1", 100, 100, 100.0, 9.899999999999999, 4, 110, 7.0, 12.800000000000011, 22.64999999999992, 109.82999999999991, 0.7230396587252811, 1.5173947525396767, 0.5006202324572503], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["click next page1 failed", 300, 25.0, 13.071895424836601], "isController": false}, {"data": ["Click on apply page failed", 300, 25.0, 13.071895424836601], "isController": false}, {"data": ["loans page failed", 300, 25.0, 13.071895424836601], "isController": false}, {"data": ["click on a loan type page failed", 300, 25.0, 13.071895424836601], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 2295, 1200, "click next page1 failed", 300, "Click on apply page failed", 300, "loans page failed", 300, "click on a loan type page failed", 300, "", ""], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/LoanIQ/hloan.jsp-87", 125, 100, "click on a loan type page failed", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/LoanIQ/hloan.jsp-87-0", 100, 100, "click on a loan type page failed", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/LoanIQ/hloan.jsp-87-1", 100, 100, "click on a loan type page failed", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["/LoanIQ/loans.jsp-78-1", 100, 100, "loans page failed", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/LoanIQ/loans.jsp-78-0", 100, 100, "loans page failed", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/LoanIQ/homeloan.jsp-95-1", 100, 100, "Click on apply page failed", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/LoanIQ/homeloan.jsp-95-0", 100, 100, "Click on apply page failed", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/LoanIQ/loans.jsp-78", 125, 100, "loans page failed", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/LoanIQ/homeloan.jsp-269", 125, 100, "click next page1 failed", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/LoanIQ/homeloan.jsp-95", 125, 100, "Click on apply page failed", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": ["/LoanIQ/homeloan.jsp-269-0", 100, 100, "click next page1 failed", 100, "", "", "", "", "", "", "", ""], "isController": false}, {"data": [], "isController": false}, {"data": ["/LoanIQ/homeloan.jsp-269-1", 100, 100, "click next page1 failed", 100, "", "", "", "", "", "", "", ""], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
