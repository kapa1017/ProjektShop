/*
 * Copyright (C) 2015 - 2016 Juergen Zimmermann, Hochschule Karlsruhe
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* tslint:disable:max-line-length */
import {Inject, EventEmitter, provide, Provider} from 'angular2/core';

import {VERSION as _VERSION} from 'lodash';
import {IChart, ChartDataSet, LinearChartData, CircularChartData} from 'chart.js/Chart';

import Kunde from '../../model/kunde';
import {IKundeServer, IKundeForm} from '../../model/kunde';
import AbstractKundenService from '../abstract_kunden_service';
import KundenService from '../kunden_service';
import KUNDEN from './kunden';
import {ChartService, isBlank, isPresent, isEmpty, log} from '../../../shared/shared';
/* tslint:enable:max-line-length */

// Services
// - wiederverwendbarer Code: in ggf. verschiedenen Controller
// - Zugriff auf Daten, z.B. durch Aufruf von RESTful Web Services
// - View (HTML-Template) <- Controller <- Service

/**
 * Mocking f&uuml;r die Service-Klasse zu B&uuml;cher. Die Buchobjekte
 * werden durch Mockobjekte bereitgestellt.
 */
export default class KundenServiceMockObjects extends AbstractKundenService {
    private _kundenEmitter: EventEmitter<Array<Kunde>> =
        new EventEmitter<Array<Kunde>>();
    private _kundeEmitter: EventEmitter<Kunde> = new EventEmitter<Kunde>();
    private _errorEmitter: EventEmitter<string|number> =
        new EventEmitter<string|number>();

    private _alleKunden: Array<Kunde> =
        KUNDEN.map((k: IKundeServer) => Kunde.fromServer(k));
    private _kunde: Kunde = null;

    /**
     * @param _chartService injizierter ChartService
     * @return void
     */
    constructor(@Inject(ChartService) private _chartService: ChartService) {
        super();
        console.log(
            `KundenServiceMockObjects.constructor(): alleKunden=`,
            this._alleKunden);
        console.log(`lodash=${_VERSION}`);
    }

    /**
     * Ein Buch-Objekt puffern.
     * @param buch Das Buch-Objekt, das gepuffert wird.
     * @return void
     */
    set kunde(kunde: Kunde) {
        console.log('KundenServiceMockObjects.set kunde()', kunde);
        this._kunde = kunde;
    }

    @log
    observeKunden(observerFn: (kunden: Array<Kunde>) => void, thisArg: any):
        void {
        this._kundenEmitter.forEach(observerFn, thisArg);
    }

    @log
    observeKunde(observerFn: (kunde: Kunde) => void, thisArg: any): void {
        this._kundeEmitter.forEach(observerFn, thisArg);
    }

    @log
    observeError(observerFn: (err: string|number) => void, thisArg: any): void {
        this._errorEmitter.forEach(observerFn, thisArg);
    }

    /**
     * {method} find
     * Buecher suchen
     * @param {Object} suchkriterien Die Suchkriterien
     */
    @log
    find(suchkriterien: IKundeForm): void {
        let kunden: Array<Kunde> = this._alleKunden;

        const {loginname, seit, geschlecht}: any = suchkriterien;

        if (!isEmpty(loginname)) {
            kunden = kunden.filter(
                (kunde: Kunde) => kunde.containsLoginname(loginname));
        }
        if (!isEmpty(seit)) {
            kunden = kunden.filter((kunde: Kunde) => kunde.isKunde_seit(seit));
        }
        if (geschlecht) {
            kunden = kunden.filter(
                (kunde: Kunde) => kunde.hasGeschlecht(geschlecht));
        }
        if (kunden.length === 0) {
            console.log('KundenServiceMockObjects.find(): status=404');
            this._errorEmitter.emit(404);
            return;
        }

        this._kundenEmitter.emit(kunden);
        console.log('KundenServiceMockObjects.find(): kunden=', kunden);
    }

    /**
     * {method} findById
     * Ein Buch anhand der ID suchen
     * @param {string} id Die ID des gesuchten Buchs
     * @param {Function} errorFn Eine Function fuer status !== OK
     */
    @log
    findById(id: string): void {
        // Gibt es ein gepuffertes Buch mit der gesuchten ID?
        if (isPresent(this._kunde) && this._kunde.id === id) {
            this._kundeEmitter.emit(this._kunde);
            return;
        }
        if (isBlank(id)) {
            return;
        }

        if (isBlank(this._alleKunden)) {
            this._kunde = null;
            return;
        }

        this._kunde = this._alleKunden.find((kunde: Kunde) => kunde.id === id);
        if (this._kunde === undefined) {
            console.log('KundenServiceMockObjects.findById(): response=404');
            this._errorEmitter.emit(404);
        }
        this._kundeEmitter.emit(this._kunde);
        console.log('KundenrServiceMockObjects.find(): kunde=', this._kunde);
    }

    /**
     * Ein vorhandenes Buch aktualisieren
     * @param buch Das JSON-Objekt mit den aktualisierten Buchdaten
     * @param successFn Die Callback-Function fuer den Erfolgsfall
     * @param errorFn Die Callback-Function fuer den Fehlerfall
     */
    @log
    update(
        kunde: Kunde, successFn: () => void,
        errorFn: (status: number, text: string) => void): void {
        for (let i: number = 0; i < this._alleKunden.length; i++) {
            if (this._alleKunden[i].id === kunde.id) {
                this._alleKunden[i] = kunde;
                console.log('alleKunden=', this._alleKunden);
                successFn();
                return;
            }
        }

        this._alleKunden.push(kunde);
        console.log('alleKunden=', this._alleKunden);
        successFn();
    }

    /**
     * Ein Buch l&ouml;schen
     * @param buch Das JSON-Objekt mit dem zu loeschenden Buch
     * @param successFn Die Callback-Function fuer den Erfolgsfall
     * @param errorFn Die Callback-Function fuer den Fehlerfall
     */
    @log
    remove(
        kunde: Kunde, successFn: () => void,
        errorFn: (status: number) => void): void {
        console.log('kunde=', kunde);
    }

    // http://www.sitepoint.com/15-best-javascript-charting-libraries
    // http://thenextweb.com/dd/2015/06/12/20-best-javascript-chart-libraries
    // http://mikemcdearmon.com/portfolio/techposts/charting-libraries-using-d3

    // D3 (= Data Driven Documents) ist das fuehrende Produkt fuer
    // Datenvisualisierung:
    //  initiale Version durch die Dissertation von Mike Bostock
    //  gesponsort von der New York Times, seinem heutigen Arbeitgeber
    //  basiert auf SVG = scalable vector graphics: Punkte, Linien, Kurven, ...
    //  ca 250.000 Downloads/Monat bei https://www.npmjs.com
    //  https://github.com/mbostock/d3 mit ueber 100 Contributors

    // Chart.js ist deutlich einfacher zu benutzen als D3
    //  basiert auf <canvas>
    //  ca 25.000 Downloads/Monat bei https://www.npmjs.com
    //  https://github.com/nnnick/Chart.js mit ueber 60 Contributors

    /**
     * Ein Balkendiagramm erzeugen und bei einem Tag <code>canvas</code>
     * einf&uuml;gen.
     * @param chartElement Das HTML-Element zum Tag <code>canvas</code>
     */
    @log
    setBarChart(chartElement: HTMLCanvasElement): void {
        const kunden: Array<Kunde> = this._alleKunden;
        const labels: Array<string> = kunden.map((kunde: Kunde) => kunde.id);
        const datasets: Array<ChartDataSet> = [{
            label: 'Bewertungen',
            fillColor: 'rgba(220,220,220,0.2)',
            strokeColor: 'rgba(220,220,220,1)',
            data: kunden.map((kunde: Kunde) => kunde.bestellungenUri.length)
        }];
        const data: LinearChartData = {labels: labels, datasets: datasets};
        console.log('KundenServiceMockObjects.setBarChart(): labels: ', labels);

        const chart: IChart = this._chartService.getChart(chartElement);
        if (isPresent(chart) && isPresent(datasets[0].data)
            && datasets[0].data.length !== 0) {
            chart.Bar(data);
        }
    }

    /**
     * Ein Liniendiagramm erzeugen und bei einem Tag <code>canvas</code>
     * einf&uuml;gen.
     * @param chartElement Das HTML-Element zum Tag <code>canvas</code>
     */
    @log
    setLinearChart(chartElement: HTMLCanvasElement): void {
        const kunden: Array<Kunde> = this._alleKunden;
        const labels: Array<string> = kunden.map((kunde: Kunde) => kunde.id);
        const datasets: Array<ChartDataSet> = [{
            label: 'Bewertungen',
            fillColor: 'rgba(220,220,220,0.2)',
            strokeColor: 'rgba(220,220,220,1)',
            data: kunden.map((kunde: Kunde) => kunde.bestellungenUri.length)
        }];
        const data: LinearChartData = {labels: labels, datasets: datasets};

        // TODO Chart.js 2.0: Das Datenmodell aendert sich
        //      http://nnnick.github.io/Chart.js/docs-v2
        //      https://github.com/nnnick/Chart.js/blob/v2.0-alpha/README.md
        //      chart.d.ts gibt es noch nicht fuer 2.0:
        //      https://github.com/nnnick/Chart.js/issues/1572
        const chart: IChart = this._chartService.getChart(chartElement);
        if (isPresent(chart) && isPresent(datasets[0].data)
            && datasets[0].data.length !== 0) {
            chart.Line(data);
        }
    }

    /**
     * Ein Tortendiagramm erzeugen und bei einem Tag <code>canvas</code>
     * einf&uuml;gen.
     * @param chartElement Das HTML-Element zum Tag <code>canvas</code>
     */
    @log
    setPieChart(chartElement: HTMLCanvasElement): void {
        const kunden: Array<Kunde> = this._alleKunden;
        const pieData: Array<CircularChartData> =
            new Array<CircularChartData>(kunden.length);

        kunden.forEach((kunde: Kunde, i: number) => {
            const data: CircularChartData = {
                value: kunde.bestellungenUri.length,
                color: this._chartService.getColorPie(i),
                highlight: this._chartService.getHighlightPie(i),
                label: `${kunde.id}`
            };
            pieData[i] = data;
        });

        const chart: IChart = this._chartService.getChart(chartElement);
        if (isPresent(chart) && pieData.length !== 0) {
            chart.Pie(pieData);
        }
    }

    toString(): String {
        /* tslint:disable:max-line-length */
        return `KundenServiceMockObjects: {kunde: ${JSON.stringify(this.kunde, null, 2)}}`;
        /* tslint:enable:max-line-length */
    }
}

export const MOCK_OBJECTS_PROVIDER: Provider =
    provide(KundenService, {useClass: KundenServiceMockObjects});
