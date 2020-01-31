// ==UserScript==
// @name         Good view for TFS case: steps
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Added additional button to header: html Good view for TFS case - steps
// @author       Anton Ternov
// @include      *:8080/tfs/*
// @grant        none
// @downloadURL https://github.com/tetrissstar/tfsExtensions/raw/master/tfsGoodView_StepsInHtml.js
// @updateURL https://github.com/tetrissstar/tfsExtensions/raw/master/tfsGoodView_StepsInHtml.js
// ==/UserScript==

(function() {
    'use strict';

    function OpenGoodView(){
        var decodeEntities = function myDecodeEntities(encodedString) {
            var textArea = document.createElement('textarea');
            textArea.innerHTML = encodedString;
            return textArea.value;
        };
        var goodView = function myWindow1(title, ids, actions, descriptions) {
            var table = '<table border="1" bordercolor="#CCCCCC"><tr><th>Num</th><th>Step Desription</th><th></th><th>Expected Result</th></tr>\n';
            var mystring = "";
            var jsCompleted = "<script>function stepCompleted(idx){document.getElementById(\"row_\"+idx).className = document.getElementById(\"cb_\"+idx).checked ? \"checked\" : \"unchecked\";}</script>";
            var cssStyles = "<style type=\"text/css\">.checked{background-color:#ccffcc} .unchecked{background-color:#ffffff}</style>";
            for (var i = 0; i < actions.length; i++) {
                table += '<tr id="row_' + i + '"><td>' + idxes[i] + '</td><td>' + actions[i] + '</td><td>' + '<input id="cb_' + i + '" type="checkbox" style="float:right" onclick="stepCompleted(' + i + ');"></td><td>' + expectedResults[i] + '</td></tr>\n';
            }
            table += '</table>\n';
            var myWindow1 = window.open('', 'myWindow1', 'scrollbars=1,height=' + Math.min(1200, screen.availHeight) + ',width=' + Math.min(1600, screen.availWidth));
            myWindow1.document.write('<!DOCTYPE html>\n<title>' + title + '</title>\n<head><meta charset="utf-8"><title>' + title + '</title>' + cssStyles + '</head>' + jsCompleted + '\n<body id="body"></body>\n<p>' + title + '</p>\n' + table + '\n</html>');
        };
        var title = document.evaluate("//div[@class='workitem-info-bar']", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
        var nodesArray = Array.prototype.slice.call(document.querySelectorAll(".work-items-right-pane > .work-item-form div.grid-row>div:nth-of-type(1)"));
        var idxes = nodesArray.map(function (e) {
            return e.innerHTML;
        });
        nodesArray = Array.prototype.slice.call(document.querySelectorAll(".work-items-right-pane > .work-item-form div.grid-row>div:nth-of-type(2)>div"));
        var actions = nodesArray.map(function (e) {
            return e.innerText;
        });
        nodesArray = Array.prototype.slice.call(document.querySelectorAll(".work-items-right-pane > .work-item-form div.grid-row>div:nth-of-type(3)>div"));
        var expectedResults = nodesArray.map(function (e) {
            return e.textContent;
        });

        goodView(title.innerText, idxes, actions, expectedResults);
    };

    function addGoodReportView() {
        var action = document.querySelector('div.hub-bar table.header-table tr.header-row');
        if (action){
            var button = document.createElement("input");
            button.setAttribute("type", "button");
            button.setAttribute("style", "display: block; margin: auto;");
            button.setAttribute("value", "Good View");
            button.onclick = OpenGoodView;

            var td = document.createElement("td");
            td.setAttribute("class", "right-section header-td");
            td.setAttribute("style", "display: table-cell;");
            td.setAttribute("align", "center");

            td.appendChild(button);
            action.appendChild(td);
        }
    }

    addGoodReportView();
})();
