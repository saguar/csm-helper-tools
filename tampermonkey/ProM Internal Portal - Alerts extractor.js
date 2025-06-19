// ==UserScript==
// @name         ProM Internal Portal - Alerts extractor
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  Estrae dati, scarica CSV, copia TSV (prioritizzando sezioni) negli appunti e naviga a helper tool.
// @author       Saverio Guardato
// @match        https://proactive-monitoring.internal.salesforce.com/*
// @grant        GM_addStyle
// @grant        GM_setClipboard
// @run-at       document-start
// ==/UserScript==

(function() {
    'use strict';
    console.log('Tampermonkey script Estrattore Dati PM - Inizio esecuzione (v1.3)');

    const BUTTON_ID = 'extractAlertsButtonPM_v13'; // ID univoco per il pulsante

    // Funzione per convertire un array di oggetti in una stringa (CSV o TSV)
    function formatData(objArray, headers, delimiter) {
        const array = typeof objArray !== 'object' ? JSON.parse(objArray) : objArray;
        let str = '';
        let headerLine = '';

        if (headers && headers.length > 0) {
            headerLine = headers.join(delimiter);
            str += headerLine + '\r\n';
        } else if (array.length === 1 && array[0] && array[0].hasOwnProperty('message') && (!headers || headers.length === 0)) {
            // Caso speciale: solo un messaggio, usa un header generico se non fornito
            str += 'Messaggio\r\n';
        }

        for (let i = 0; i < array.length; i++) {
            if (array.length === 1 && array[i] && array[i].hasOwnProperty('message') && (!headers || headers.length === 0)) {
                let value = String(array[i].message);
                if (delimiter === ',') {
                    value = value.replace(/"/g, '""');
                    if (value.includes(',')) value = `"${value}"`;
                }
                str += value + '\r\n';
                continue;
            }

            let line = '';
            if (!headers || headers.length === 0) continue; // Non può formattare righe senza header

            for (const key of headers) {
                if (line !== '') line += delimiter;
                let value = array[i][key] === null || array[i][key] === undefined ? '' : String(array[i][key]);
                if (delimiter === ',') {
                    value = value.replace(/"/g, '""');
                    if (value.includes(',') || value.includes('\n') || value.includes('\r')) {
                        value = `"${value}"`;
                    }
                }
                line += value;
            }
            str += line + '\r\n';
        }
        return str;
    }

    // Funzione per scaricare la stringa CSV come file
    function downloadCSV(csvStr, filename) {
        const blob = new Blob([csvStr], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute("href", url);
            link.setAttribute("download", filename);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else {
            alert("Il tuo browser non supporta il download automatico. I dati sono nella console.");
            console.log("Dati CSV da copiare manualmente:\n", csvStr);
        }
    }

    // Funzione per aggiungere il pulsante di estrazione alla pagina
    function addExtractionButton() {
        console.log('addExtractionButton: Tentativo di aggiungere il pulsante.');
        if (document.getElementById(BUTTON_ID)) {
            console.log('addExtractionButton: Pulsante di estrazione già presente.');
            return true;
        }
        let container = document.getElementById('app') || document.body;
        if (!container) {
            console.log('addExtractionButton: Nessun container valido (né #app né document.body) trovato.');
            return false;
        }
        const containerName = container === document.body ? 'document.body' : '#app';

        const button = document.createElement('button');
        button.textContent = 'Analyze Alerts';
        button.id = BUTTON_ID;
        button.style.position = 'fixed';
        button.style.bottom = '20px'; // Modificato da top a bottom
        button.style.right = '20px';
        button.style.zIndex = '20000';
        button.style.padding = '10px 15px';
        button.style.backgroundColor = '#0070d2';
        button.style.color = 'white';
        button.style.border = 'none';
        button.style.borderRadius = '4px';
        button.style.cursor = 'pointer';
        button.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';
        button.style.fontSize = '14px';

        button.addEventListener('click', extractProcessAndNavigate);
        container.appendChild(button);
        console.log(`addExtractionButton: Pulsante di estrazione aggiunto a ${containerName}.`);

        try {
            GM_addStyle(`
                #${BUTTON_ID} { display: block !important; opacity: 1 !important; visibility: visible !important; }
                #${BUTTON_ID}:hover { background-color: #005fb2 !important; }
                #${BUTTON_ID}:active { background-color: #004c8c !important; }
            `);
            console.log('addExtractionButton: Stili GM_addStyle applicati.');
        } catch (e) {
            console.error("addExtractionButton: Errore GM_addStyle:", e);
        }
        return true;
    }

    // Funzione per estrarre dati da una specifica sezione
    function extractSectionData(sectionElement) {
        const tableElement = sectionElement.querySelector('table');
        if (!tableElement) return null;

        const headers = [];
        tableElement.querySelectorAll('thead th').forEach((th) => {
            let headerTextContent = '';
            th.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) headerTextContent += node.textContent;
                else if (node.nodeType === Node.ELEMENT_NODE && !node.classList.contains('Tooltip') && !node.querySelector('.Tooltip')) headerTextContent += node.textContent;
            });
            const headerText = headerTextContent.replace('﻿', '').trim();
            if (headerText && !th.classList.contains('context')) headers.push(headerText);
        });

        const rowsData = [];
        const bodyRows = tableElement.querySelectorAll('tbody tr');
        let hasActualDataRows = false;

        if (bodyRows.length === 1 && bodyRows[0].querySelector('.not-found')) {
            return { headers: ["Messaggio"], data: [{ "Messaggio": bodyRows[0].textContent.trim() }], hasActualData: false };
        }

        bodyRows.forEach(row => {
            if (row.getAttribute('data-visible') === 'false') return;
            const rowObject = {};
            const cells = row.querySelectorAll('td');
            let cellIndex = 0;
            headers.forEach(header => {
                if (cells[cellIndex]) {
                    let cellText;
                    if (header.toLowerCase() === 'level') {
                        const levelPill = cells[cellIndex].querySelector('.AlertLevelPill span:last-child');
                        cellText = levelPill ? levelPill.textContent.trim() : cells[cellIndex].textContent.trim();
                    } else {
                        cellText = cells[cellIndex].textContent.trim();
                    }
                    rowObject[header] = cellText;
                } else {
                    rowObject[header] = '';
                }
                cellIndex++;
            });
            if (Object.keys(rowObject).length > 0) {
                rowsData.push(rowObject);
                hasActualDataRows = true;
            }
        });
        return { headers, data: rowsData, hasActualData: hasActualDataRows };
    }


    // Funzione principale per estrarre, processare e navigare
    function extractProcessAndNavigate() {
        console.log('extractProcessAndNavigate: Inizio operazioni...');
        const sections = document.querySelectorAll('.AlertsViewer-section');
        if (sections.length === 0) {
            console.warn('extractProcessAndNavigate: Nessuna sezione "AlertsViewer-section" trovata.');
            alert('Nessuna sezione "AlertsViewer-section" trovata.');
            return;
        }

        let csvFileDownloaded = false;
        let tsvForClipboard = "";
        // let alertMessage = ""; // Non più usato per costruire il messaggio di alert finale

        // Processa tutte le sezioni per i download CSV individuali
        sections.forEach((section) => {
            const titleElement = section.querySelector('.title span[type-style="display-6"]');
            const sectionTitle = titleElement ? titleElement.textContent.trim() : `Sezione_Sconosciuta`;
            const sectionData = extractSectionData(section);

            if (sectionData && sectionData.hasActualData && sectionData.data.length > 0) {
                const csvDataForFile = formatData(sectionData.data, sectionData.headers, ',');
                const filename = `${sectionTitle.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0,10)}.csv`;
                downloadCSV(csvDataForFile, filename);
                console.log(`extractProcessAndNavigate: Dati CSV per "${sectionTitle}" scaricati.`);
                csvFileDownloaded = true;
            } else if (sectionData) {
                 console.log(`extractProcessAndNavigate: Nessun dato CSV effettivo per "${sectionTitle}".`);
            } else {
                 console.log(`extractProcessAndNavigate: Impossibile estrarre dati per CSV da "${sectionTitle}".`);
            }
        });

        // Log per il download CSV
        if (csvFileDownloaded) console.log("Almeno un file CSV è stato scaricato.");
        else console.log("Nessun dato CSV valido trovato per il download.");

        // Prepara TSV per clipboard, priorità a "Cleared Alerts" poi "Active Alerts"
        let clipboardDataSourceTitle = "";
        let dataForClipboard = null;

        const clearedAlertsSection = Array.from(sections).find(s => {
            const titleEl = s.querySelector('.title span[type-style="display-6"]');
            return titleEl && titleEl.textContent.trim().toLowerCase() === 'cleared alerts';
        });

        if (clearedAlertsSection) {
            dataForClipboard = extractSectionData(clearedAlertsSection);
            if (dataForClipboard && (dataForClipboard.hasActualData || dataForClipboard.headers[0] === "Messaggio")) {
                clipboardDataSourceTitle = "Cleared Alerts";
            } else {
                dataForClipboard = null; // Non usare se vuoto e non è un messaggio not-found
            }
        }

        if (!dataForClipboard) {
            const activeAlertsSection = Array.from(sections).find(s => {
                const titleEl = s.querySelector('.title span[type-style="display-6"]');
                return titleEl && titleEl.textContent.trim().toLowerCase() === 'active alerts';
            });
            if (activeAlertsSection) {
                dataForClipboard = extractSectionData(activeAlertsSection);
                 if (dataForClipboard && (dataForClipboard.hasActualData || dataForClipboard.headers[0] === "Messaggio")) {
                    clipboardDataSourceTitle = "Active Alerts";
                } else {
                    dataForClipboard = null;
                }
            }
        }

        if (dataForClipboard && dataForClipboard.data.length > 0) {
            tsvForClipboard = formatData(dataForClipboard.data, dataForClipboard.headers, '\t').trim();
            console.log(`extractProcessAndNavigate: Dati TSV per clipboard preparati da "${clipboardDataSourceTitle}".`);
            console.log('Contenuto TSV per clipboard:\n', tsvForClipboard);
        } else {
            console.log('extractProcessAndNavigate: Nessun dato (o solo sezioni vuote) trovato per il TSV degli appunti.');
        }

        if (tsvForClipboard !== "") {
            try {
                GM_setClipboard(tsvForClipboard);
                console.log(`Dati TSV da "${clipboardDataSourceTitle}" copiati negli appunti.`);
            } catch (e) {
                console.error('extractProcessAndNavigate: Errore copia TSV:', e);
            }
        } else {
            console.log("Nessun dato TSV da copiare.");
        }

        // Naviga
        try {
            const targetURL = "https://csm-helper-tools-6a5977bc5171.herokuapp.com/prom-visualizer.html";
            window.open(targetURL, '_blank');
            console.log(`Apertura di ${targetURL} in corso.`);
        } catch (e) {
            console.error('extractProcessAndNavigate: Errore apertura nuova scheda:', e);
        }
        alert("Operation completed"); // Messaggio di alert semplificato
    }

    // Logica per aggiungere il pulsante
    let attempts = 0;
    const maxAttempts = 30;
    const intervalId = setInterval(() => {
        console.log(`setInterval: Tentativo ${attempts + 1}/${maxAttempts}`);
        attempts++;
        if (document.readyState === 'complete' || document.readyState === 'interactive') {
            if (addExtractionButton() || attempts >= maxAttempts) {
                clearInterval(intervalId);
                console.log('setInterval: Intervallo terminato.');
                if (attempts >= maxAttempts && !document.getElementById(BUTTON_ID)) {
                    console.error('setInterval: Impossibile aggiungere pulsante.');
                }
            }
        } else if (attempts >= maxAttempts) {
            clearInterval(intervalId);
            console.error('setInterval: document.readyState non pronto, maxAttempts.');
        }
    }, 500);

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            console.log('DOMContentLoaded: Evento scattato.');
            if (!document.getElementById(BUTTON_ID) && attempts < maxAttempts) {
                 console.log('DOMContentLoaded: Pulsante non presente, chiamo addExtractionButton.');
                 if(addExtractionButton()) {
                    clearInterval(intervalId);
                    console.log('DOMContentLoaded: Pulsante aggiunto, intervallo fermato.');
                 }
            }
        });
    } else {
         console.log('Stato iniziale doc non "loading", intervallo gestisce.');
    }
})();
