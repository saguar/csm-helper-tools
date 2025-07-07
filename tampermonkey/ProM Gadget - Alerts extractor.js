// ==UserScript==
// @name         ProM Gadget UI - Alerts extractor
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Extracts alert data from the Gadget UI, downloads a CSV, copies TSV to the clipboard and opens the helper tool.
// @author       Saverio Guardato
// @match        https://gadget.prom.sfdc.sh/alerts
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';
    const BUTTON_ID = 'extractGadgetAlertsButton_v10';
    const NOTIF_ID = 'gadgetAlertNotif';
    const EXCLUDED_COLUMNS = ['Organization ID', 'Instance', 'Customer Name'];

    function sanitizeFilename(name) {
        return name.replace(/[\\/:*?"<>|]+/g, '_');
    }

    function formatData(objArray, headers, delimiter) {
        const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        let str = '';
        const headerLine = headers.join(delimiter);
        str += headerLine + '\r\n';
        for (const obj of array) {
            let line = '';
            headers.forEach((key, idx) => {
                if (idx > 0) line += delimiter;
                let value = obj[key] === null || obj[key] === undefined ? '' : String(obj[key]);
                if (delimiter === ',') {
                    value = value.replace(/"/g, '""');
                    if (value.includes(',') || value.includes('\n') || value.includes('\r')) {
                        value = `"${value}"`;
                    }
                }
                line += value;
            });
            str += line + '\r\n';
        }
        return str;
    }

    function downloadCSV(csvStr, filename) {
        const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', sanitizeFilename(filename));
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else {
            console.log('Your browser does not support automatic downloads.');
            console.log('CSV data:\n', csvStr);
        }
    }

    function showNotification(message) {
        let div = document.getElementById(NOTIF_ID);
        if (div) div.remove();
        div = document.createElement('div');
        div.id = NOTIF_ID;
        div.textContent = message;
        div.style.position = 'fixed';
        div.style.bottom = '20px';
        div.style.left = '20px';
        div.style.padding = '10px 15px';
        div.style.background = '#0070d2';
        div.style.color = '#fff';
        div.style.borderRadius = '4px';
        div.style.zIndex = '20000';
        document.body.appendChild(div);
        setTimeout(() => div.remove(), 4000);
    }

    function extractTableData() {
        const table = document.querySelector('.slds-table_header-fixed_container table');
        if (!table) {
            console.warn('Alert table not found.');
            showNotification('Alert table not found');
            return;
        }
        const allHeaders = [];
        table.querySelectorAll('thead th').forEach(th => {
            const label = th.getAttribute('aria-label') || th.textContent;
            const text = label.replace(/\s+/g, ' ').trim();
            allHeaders.push(text);
        });

        const headers = [];
        const includedIdx = [];
        allHeaders.forEach((h, idx) => {
            if (h && !EXCLUDED_COLUMNS.includes(h)) {
                headers.push(h);
                includedIdx.push(idx);
            }
        });

        const rowsData = [];
        table.querySelectorAll('tbody tr').forEach(tr => {
            const cells = tr.querySelectorAll('td');
            const obj = {};
            includedIdx.forEach((origIdx, i) => {
                obj[headers[i]] = cells[origIdx] ? cells[origIdx].textContent.trim() : '';
            });
            rowsData.push(obj);
        });
        if (rowsData.length === 0) {
            showNotification('No data found');
            return;
        }
        const csvStr = formatData(rowsData, headers, ',');
        const tsvStr = formatData(rowsData, headers, '\t').trim();
        const filename = `Alerts_${new Date().toISOString().slice(0,10)}.csv`;
        downloadCSV(csvStr, filename);
        try {
            GM_setClipboard(tsvStr);
        } catch (e) {
            console.error('Clipboard copy failed', e);
        }
        const newWin = window.open('https://csm-helper-tools-6a5977bc5171.herokuapp.com/prom-visualizer.html', '_blank');
        if (!newWin) {
            showNotification('Popup blocked. Please allow popups.');
        }
        showNotification('Operation completed');
    }

    function addButton() {
        if (document.getElementById(BUTTON_ID)) return;
        const btn = document.createElement('button');
        btn.id = BUTTON_ID;
        btn.textContent = 'Analyze Alerts';
        btn.style.position = 'fixed';
        btn.style.top = '5%';
        btn.style.right = '30%';
        btn.style.zIndex = '20000';
        btn.style.padding = '10px 15px';
        btn.style.backgroundColor = '#0070d2';
        btn.style.color = 'white';
        btn.style.border = 'none';
        btn.style.borderRadius = '4px';
        btn.style.cursor = 'pointer';
        btn.addEventListener('click', extractTableData);
        document.body.appendChild(btn);
        try {
            GM_addStyle(`#${BUTTON_ID}:hover { background-color: #005fb2 !important; }`);
        } catch (e) {
            console.error('GM_addStyle error', e);
        }
    }

    const observer = new MutationObserver((mutations, obs) => {
        if (document.querySelector('.slds-table_header-fixed_container table')) {
            addButton();
            obs.disconnect();
        }
    });
    observer.observe(document, { childList: true, subtree: true });
})();
