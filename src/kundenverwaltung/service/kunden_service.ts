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
import {Http, Response, Headers, RequestOptionsArgs, URLSearchParams} from 'angular2/http';

// Moment exportiert den Namespace moment und die gleichnamige Function:
// http://stackoverflow.com/questions/35254524/using-moment-js-in-angular-2-typescript-application#answer-35255412
/* import {Moment} from 'moment';
import * as moment_ from 'moment';
const moment: (date: Date) => Moment = (<any>moment_)['default'];*/

import {IChart, ChartDataSet, LinearChartData, CircularChartData} from 'chart.js/Chart';

import Kunde from '../model/kunde';
import KundeBestellungenGesamtbetrag from '../model/kundebestellungengesamtbetrag';
import {IKundeServer, IKundeForm} from '../model/kunde';
import {IKundeBestellungenGesamtbetragServer} from '../model/kundebestellungengesamtbetrag';
import AbstractKundenService from './abstract_kunden_service';
import {ChartService, BASE_URI, PATH_KUNDEN, isBlank, isPresent, isEmpty, log} from '../../shared/shared';
import {getAuthorization} from '../../iam/iam';
/* tslint:enable:max-line-length */

// Methoden der Klasse Http
//  * get(url, options) – HTTP GET request
//  * post(url, body, options) – HTTP POST request
//  * put(url, body, options) – HTTP PUT request
//  * patch(url, body, options) – HTTP PATCH request
//  * delete(url, options) – HTTP DELETE request

// Eine Service-Klasse ist eine "normale" Klasse gemaess ES 2015, die mittels
// DI in eine Komponente injiziert werden kann, falls sie in einer
// Elternkomponente durch @Component(provider: ...) bereitgestellt wird.
// Eine Komponente realisiert gemaess MVC-Pattern den Controller und die View.
// Die Anwendungslogik wird vom Controller an Service-Klassen delegiert.

/**
 * Die Service-Klasse zu B&uuml;cher.
 */
export default class KundenService extends AbstractKundenService {
    private _baseUriKunden: string;
    private _kundenEmitter: EventEmitter<Array<Kunde>> =
        new EventEmitter<Array<Kunde>>();
    private _kundeEmitter: EventEmitter<Kunde> = new EventEmitter<Kunde>();
    private _bestellungenIdsEmitter: EventEmitter<Array<string>> =
        new EventEmitter<Array<string>>();
    private _errorEmitter: EventEmitter<string|number> =
        new EventEmitter<string|number>();
    private _kunde: Kunde = null;

    /**
     * @param _chartService injizierter ChartService
     * @param _http injizierter Service Http (von AngularJS)
     * @return void
     */
    constructor(
        @Inject(ChartService) private _chartService: ChartService,
        @Inject(Http) private _http: Http) {
        super();
        this._baseUriKunden = `${BASE_URI}${PATH_KUNDEN}`;
        console.log(
            `KundenService.constructor(): baseUriKunden=${this._baseUriKunden}`);
    }

    /**
     * Ein Kunde-Objekt puffern.
     * @param kunde Das Kunde-Objekt, das gepuffert wird.
     * @return void
     */
    set kunde(kunde: Kunde) {
        console.log('KundenService.set kunde()', kunde);
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
    observeBestellungenIds(
        observerFn: (bestellungenIds: Array<string>) => void,
        thisArg: any): void {
        this._bestellungenIdsEmitter.forEach(observerFn, thisArg);
    }
    /**
     * Kunden suchen
     * @param suchkriterien Die Suchkriterien
     */
    @log
    find(suchkriterien: IKundeForm): void {
        const searchParams: URLSearchParams =
            this._suchkriterienToSearchParams(suchkriterien);
        console.log(`KundenService.find(): searchParams=${searchParams}`);
        const uri: string = this._baseUriKunden;
        console.log(`KundenService.find(): uri=${uri}`);
        const headers: Headers =
            new Headers({'Content-Type': 'application/json'});
        headers.append('Authorization', getAuthorization());
        // RequestOptionsArgs in
        // node_modules\angular2\ts\src\http\interfaces.ts
        const options:
            RequestOptionsArgs = {search: searchParams, headers: headers};
        console.log('options=', options);

        const nextFn: ((response: Response) => void) = (response: Response) => {
            console.log('KundenService.find(): nextFn()');
            let kunden: Array<Kunde> = this._responseToArrayKunde(response);
            this._kundenEmitter.emit(kunden);
        };
        const errorFn: (err: Response) => void = (err: Response) => {
            const status: number = err.status;
            console.log(`KundenService.find(): errorFn(): ${status}`);
            if (status === 400) {
                const body: string = err.text();
                if (isBlank(body)) {
                    this._errorEmitter.emit(status);
                } else {
                    // z.B. [PARAMETER][findByTitel.titel][Bei einem ...][x]
                    let errorMsg: string = body.split('[')[3];
                    errorMsg = errorMsg.substr(0, errorMsg.length - 2);
                    this._errorEmitter.emit(errorMsg);
                }
            } else {
                this._errorEmitter.emit(status);
            }
        };

        this._http.get(uri, options).subscribe(nextFn, errorFn);
    }

    /**
     * Ein Kunde anhand der ID suchen
     * @param id Die ID des gesuchten Kunden
     */
    @log
    findById(kundeId: string): void {
        // Gibt es ein gepuffertes Kunde mit der gesuchten ID?
        if (isPresent(this._kunde) && this._kunde.id === kundeId) {
            this._kundeEmitter.emit(this._kunde);
            return;
        }
        if (isBlank(kundeId)) {
            return;
        }

        const uri: string = `${this._baseUriKunden}/${kundeId}`;
        const headers: Headers =
            new Headers({'Content-Type': 'application/json'});
        headers.append('Authorization', getAuthorization());
        // RequestOptionsArgs in
        // node_modules\angular2\ts\src\http\interfaces.ts
        const options: RequestOptionsArgs = {headers: headers};
        console.log('options=', options);
        const nextFn: ((response: Response) => void) = (response: Response) => {
            this._kunde = this._responseToKunde(response);
            this._kundeEmitter.emit(this._kunde);
        };
        const errorFn: (err: Response) => void = (err: Response) => {
            const status: number = err.status;
            console.log(`KundenService.findById(): errorFn(): ${status}`);
            this._errorEmitter.emit(status);
        };

        this._http.get(uri, options).subscribe(nextFn, errorFn);
    }
    /**
     * Kunden suchen
     * @param bestellungId Die BestellungId
     */
    @log
    findByBestellungId(bestellungId: string): void {
        if (isBlank(bestellungId)) {
            return;
        }
        const uri: string = `${this._baseUriKunden}/bestellungen/${bestellungId}`;
        console.log(`KundenService.find(): uri=${uri}`);
        const headers: Headers =
            new Headers({'Content-Type': 'application/json'});
        headers.append('Authorization', getAuthorization());
        // RequestOptionsArgs in
        // node_modules\angular2\ts\src\http\interfaces.ts
        const options: RequestOptionsArgs = {headers: headers};
        console.log('options=', options);

        const nextFn: ((response: Response) => void) = (response: Response) => {
            console.log('KundenService.find(): nextFn()');
            let kunde: Kunde = this._responseToKunde(response);
            this._kundeEmitter.emit(kunde);
        };
        const errorFn: (err: Response) => void = (err: Response) => {
            const status: number = err.status;
            console.log(`KundenService.find(): errorFn(): ${status}`);
            if (status === 400) {
                const body: string = err.text();
                if (isBlank(body)) {
                    this._errorEmitter.emit(status);
                } else {
                    // z.B. [PARAMETER][findByTitel.titel][Bei einem ...][x]
                    let errorMsg: string = body.split('[')[3];
                    errorMsg = errorMsg.substr(0, errorMsg.length - 2);
                    this._errorEmitter.emit(errorMsg);
                }
            } else {
                this._errorEmitter.emit(status);
            }
        };

        this._http.get(uri, options).subscribe(nextFn, errorFn);
    }
    /**
     * Kunden suchen
     * @param kundeId Die KundenId
     */
    @log
    findBestellungIdsBykundeId(kundeId: string): void {
        if (isBlank(kundeId)) {
            return;
        }
        const uri: string = `${this._baseUriKunden}/${kundeId}/bestellungenIds`;
        console.log(`KundenService.find(): uri=${uri}`);
        const headers: Headers =
            new Headers({'Content-Type': 'application/json'});
        headers.append('Authorization', getAuthorization());
        // RequestOptionsArgs in
        // node_modules\angular2\ts\src\http\interfaces.ts
        const options: RequestOptionsArgs = {headers: headers};
        console.log('options=', options);

        const nextFn: ((response: Response) => void) = (response: Response) => {
            console.log('KundenService.findBestellungIdsBykundeId(): nextFn()');
            let bestellungenIds: Array<string> = <Array<string>>response.json();
            // let bestellungenIds: Array<string> =
            // this._responseToArraystring(response);
            this._bestellungenIdsEmitter.emit(bestellungenIds);
        };
        const errorFn: (err: Response) => void = (err: Response) => {
            const status: number = err.status;
            console.log(
                `KundenService.findBestellungIdsBykundeId(): errorFn(): ${status}`);
            if (status === 400) {
                const body: string = err.text();
                if (isBlank(body)) {
                    this._errorEmitter.emit(status);
                } else {
                    // z.B. [PARAMETER][findByTitel.titel][Bei einem ...][x]
                    let errorMsg: string = body.split('[')[3];
                    errorMsg = errorMsg.substr(0, errorMsg.length - 2);
                    this._errorEmitter.emit(errorMsg);
                }
            } else {
                this._errorEmitter.emit(status);
            }
        };

        this._http.get(uri, options).subscribe(nextFn, errorFn);
    }

    /**
     * Ein vorhandenes Kunde aktualisieren
     * @param kunde Das JSON-Objekt mit den aktualisierten Kundendaten
     * @param successFn Die Callback-Function fuer den Erfolgsfall
     * @param errorFn Die Callback-Function fuer den Fehlerfall
     */
    @log
    update(
        kunde: Kunde, successFn: () => void,
        errorFn: (status: number, text: string) => void): void {
        const uri: string = `${this._baseUriKunden}`;
        const body: string = JSON.stringify(kunde.toJSON());
        console.log('body=', body);

        const headers: Headers =
            new Headers({'Content-Type': 'application/json'});
        headers.append('Authorization', getAuthorization());
        // RequestOptionsArgs in
        // node_modules\angular2\ts\src\http\interfaces.ts
        const options: RequestOptionsArgs = {headers: headers};
        console.log('options=', options);

        const nextFn: ((response: Response) => void) =
            (response: Response) => { successFn(); };
        const errorFnPut: ((errResponse: Response) => void) =
            (errResponse: Response) => {
                if (isPresent(errorFn)) {
                    errorFn(errResponse.status, errResponse.text());
                }
            };

        this._http.put(uri, body, options).subscribe(nextFn, errorFnPut);
    }
    /**
     * Ein vorhandenes Kunde aktualisieren
     * @param kunde Das JSON-Objekt mit den aktualisierten Kundendaten
     * @param successFn Die Callback-Function fuer den Erfolgsfall
     * @param errorFn Die Callback-Function fuer den Fehlerfall
     */
    @log
    updatePrivateKunde(
        kunde: Kunde, successFn: () => void,
        errorFn: (status: number, text: string) => void): void {
        const uri: string = `${this._baseUriKunden}/privat`;
        const body: string = JSON.stringify(kunde.toJSON());
        console.log('body=', body);

        const headers: Headers =
            new Headers({'Content-Type': 'application/json'});
        headers.append('Authorization', getAuthorization());
        // RequestOptionsArgs in
        // node_modules\angular2\ts\src\http\interfaces.ts
        const options: RequestOptionsArgs = {headers: headers};
        console.log('options=', options);

        const nextFn: ((response: Response) => void) =
            (response: Response) => { successFn(); };
        const errorFnPut: ((errResponse: Response) => void) =
            (errResponse: Response) => {
                if (isPresent(errorFn)) {
                    errorFn(errResponse.status, errResponse.text());
                }
            };

        this._http.put(uri, body, options).subscribe(nextFn, errorFnPut);
    }

    /**
     * Ein Kunde l&ouml;schen
     * @param kunde Das JSON-Objekt mit dem zu loeschenden Kunden
     * @param successFn Die Callback-Function fuer den Erfolgsfall
     * @param errorFn Die Callback-Function fuer den Fehlerfall
     */
    @log
    remove(
        kunde: Kunde, successFn: () => void,
        errorFn: (status: number) => void): void {
        const uri: string = `${this._baseUriKunden}/${kunde.id}`;
        const headers: Headers =
            new Headers({'Authorization': getAuthorization()});
        // RequestOptionsArgs in
        // node_modules\angular2\ts\src\http\interfaces.ts
        const options: RequestOptionsArgs = {headers: headers};
        console.log('options=', options);

        const nextFn: ((response: Response) => void) = (response: Response) => {
            if (isPresent(successFn)) {
                successFn();
            }
        };
        const errorFnDelete: ((errResponse: Response) => void) =
            (errResponse: Response) => {
                if (isPresent(errorFn)) {
                    errorFn(errResponse.status);
                }
            };


        this._http.delete(uri, options).subscribe(nextFn, errorFnDelete);
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
        const uri: string = `${this._baseUriKunden}/bestellungenStats`;
        const headers: Headers =
            new Headers({'Content-Type': 'application/json'});
        headers.append('Authorization', getAuthorization());
        // RequestOptionsArgs in
        // node_modules\angular2\ts\src\http\interfaces.ts
        const options: RequestOptionsArgs = {headers: headers};
        console.log('options=', options);
        const successFn: Function = (response: Response) => {
            this._createBarChart(
                chartElement,
                this._responseToArrayKundeBestellungenGesamtbetrag(response));
        };
        const errorFn: Function =
            (response: Response) => { console.error('response=', response); };
        const nextFn: ((response: Response) => void) = (response: Response) => {
            if (response.status === 200) {
                successFn(response);
                return;
            }
            errorFn(response);
        };

        this._http.get(uri, options).subscribe(nextFn);
    }

    /**
     * Ein Liniendiagramm erzeugen und bei einem Tag <code>canvas</code>
     * einf&uuml;gen.
     * @param chartElement Das HTML-Element zum Tag <code>canvas</code>
     */
    @log
    setLinearChart(chartElement: HTMLCanvasElement): void {
        const uri: string = `${this._baseUriKunden}/bestellungenStats`;
        const headers: Headers =
            new Headers({'Content-Type': 'application/json'});
        headers.append('Authorization', getAuthorization());
        // RequestOptionsArgs in
        // node_modules\angular2\ts\src\http\interfaces.ts
        const options: RequestOptionsArgs = {headers: headers};
        const successFn: Function = (response: Response) => {
            this._createLineChart(
                chartElement,
                this._responseToArrayKundeBestellungenGesamtbetrag(response));
        };
        const errorFn: Function =
            (response: Response) => { console.error('response=', response); };
        const nextFn: ((response: Response) => void) = (response: Response) => {
            if (response.status === 200) {
                successFn(response);
                return;
            }
            errorFn(response);
        };

        this._http.get(uri, options).subscribe(nextFn);
    }

    /**
     * Ein Tortendiagramm erzeugen und bei einem Tag <code>canvas</code>
     * einf&uuml;gen.
     * @param chartElement Das HTML-Element zum Tag <code>canvas</code>
     */
    @log
    setPieChart(chartElement: HTMLCanvasElement): void {
        const uri: string = `${this._baseUriKunden}/bestellungenStats`;
        const headers: Headers =
            new Headers({'Content-Type': 'application/json'});
        headers.append('Authorization', getAuthorization());
        // RequestOptionsArgs in
        // node_modules\angular2\ts\src\http\interfaces.ts
        const options: RequestOptionsArgs = {headers: headers};
        const successFn: Function = (response: Response) => {
            this._createPieChart(
                chartElement,
                this._responseToArrayKundeBestellungenGesamtbetrag(response));
        };
        const errorFn: Function =
            (response: Response) => { console.error('response=', response); };
        const nextFn: ((response: Response) => void) = (response: Response) => {
            if (response.status === 200) {
                successFn(response);
                return;
            }
            errorFn(response);
        };

        this._http.get(uri, options).subscribe(nextFn);
    }

    toString(): String {
        return `KundenService: {kunde: ${JSON.stringify(this._kunde, null, 2)}}`;
    }

    /**
     * Ein Response-Objekt in ein Array von Kunden-Objekten konvertieren.
     * @param response Response-Objekt eines GET-Requests.
     */
    @log
    private _suchkriterienToSearchParams(suchkriterien: IKundeForm):
        URLSearchParams {
        const searchParams: URLSearchParams = new URLSearchParams();

        if (!isEmpty(suchkriterien.nachname)) {
            searchParams.set('nachname', suchkriterien.nachname);
        }
        if (!isEmpty(suchkriterien.seit)) {
            searchParams.set('seit', suchkriterien.seit);
        }
        if (!isEmpty(suchkriterien.geschlecht)) {
            searchParams.set('geschlecht', suchkriterien.geschlecht);
        }
        /* if (suchkriterien.maennlich) {
            searchParams.set('geschlecht', 'MAENNLICH');
        } else if (suchkriterien.weiblich) {
            searchParams.set('geschlecht', 'WEIBLICH');
        }*/
        return searchParams;
    }

    /**
     * Ein Response-Objekt in ein Array von Kunde-Objekten konvertieren.
     * @param response Response-Objekt eines GET-Requests.
     */
    @log
    private _responseToArrayKunde(response: Response): Array<Kunde> {
        const jsonArray: Array<IKundeServer> =
            <Array<IKundeServer>>(response.json());
        return jsonArray.map((jsonObjekt: IKundeServer) => {
            return Kunde.fromServer(jsonObjekt);
        });
    }

    /**
     * Ein Response-Objekt in ein Array von Kunde-Objekten konvertieren.
     * @param response Response-Objekt eines GET-Requests.
     */
    @log
    private _responseToArrayKundeBestellungenGesamtbetrag(response: Response):
        Array<KundeBestellungenGesamtbetrag> {
        const jsonArray: Array<IKundeBestellungenGesamtbetragServer> =
            <Array<IKundeBestellungenGesamtbetragServer>>(response.json());
        return jsonArray.map(
            (jsonObjekt: IKundeBestellungenGesamtbetragServer) => {
                return KundeBestellungenGesamtbetrag.fromServer(jsonObjekt);
            });
    }
    /*private _responseToArraystring(response: Response): Array<string> {
        const jsonArray: Array<string> = <Array<string>>(response.json());
        return jsonArray.map((jsonObjekt: string) => { return jsonObjekt; });
    }*/

    /**
     * Ein Response-Objekt in ein Kunde-Objekt konvertieren.
     * @param response Response-Objekt eines GET-Requests.
     */
    @log
    private _responseToKunde(response: Response): Kunde {
        const jsonObjekt: IKundeServer = <IKundeServer>(response.json());
        return Kunde.fromServer(jsonObjekt);
    }

    /**
     * Ein Balkendiagramm erzeugen und bei einem Tag <code>canvas</code>
     * einf&uuml;gen.
     * @param chartElement Das HTML-Element zum Tag <code>canvas</code>
     * @param buecher Die zu ber&uecksichtigenden B&uuml;cher
     */
    @log
    private _createBarChart(
        chartElement: HTMLCanvasElement,
        kundebestellungengesamtbetraege: Array<KundeBestellungenGesamtbetrag>):
        void {
        const labels: Array<string> = kundebestellungengesamtbetraege.map(
            (kundebestellungengesamtbetrag: KundeBestellungenGesamtbetrag) =>
                kundebestellungengesamtbetrag.kunde.id);
        const datasets: Array<ChartDataSet> = [{
            label: 'KundeBestellungenGesamtbetraege',
            fillColor: 'rgba(190,214,248,0.2)',
            strokeColor: 'rgba(0,0,0,1)',
            data: kundebestellungengesamtbetraege.map(
                (kundebestellungengesamtbetrag:
                     KundeBestellungenGesamtbetrag) =>
                    kundebestellungengesamtbetrag.bestellungenGesamtbetrag)
        }];
        const data: LinearChartData = {labels: labels, datasets: datasets};
        console.log('KundenService._createBarChart(): labels: ', labels);

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
     * @param buecher Die zu ber&uecksichtigenden B&uuml;cher
     */
    @log
    private _createLineChart(
        chartElement: HTMLCanvasElement,
        kundebestellungengesamtbetraege: Array<KundeBestellungenGesamtbetrag>):
        void {
        const labels: Array<string> = kundebestellungengesamtbetraege.map(
            (kundebestellungengesamtbetrag: KundeBestellungenGesamtbetrag) =>
                kundebestellungengesamtbetrag.kunde.id);
        const datasets: Array<ChartDataSet> = [{
            label: 'KundeBestellungenGesamtbetraege',
            fillColor: 'rgba(190,214,248,0.2)',
            strokeColor: 'rgba(0,0,0,1)',
            data: kundebestellungengesamtbetraege.map(
                (kundebestellungengesamtbetrag:
                     KundeBestellungenGesamtbetrag) =>
                    kundebestellungengesamtbetrag.bestellungenGesamtbetrag)
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
     * @param buecher Die zu ber&uecksichtigenden B&uuml;cher
     */
    @log
    private _createPieChart(
        chartElement: HTMLCanvasElement,
        kundebestellungengesamtbetraege: Array<KundeBestellungenGesamtbetrag>):
        void {
        const pieData: Array<CircularChartData> = new Array<CircularChartData>(
            kundebestellungengesamtbetraege.length);
        kundebestellungengesamtbetraege.forEach(
            (kundebestellungengesamtbetrag: KundeBestellungenGesamtbetrag,
             i: number) => {
                const data: CircularChartData = {
                    value:
                        kundebestellungengesamtbetrag.bestellungenGesamtbetrag,
                    color: this._chartService.getColorPie(i),
                    highlight: this._chartService.getHighlightPie(i),
                    label: `${kundebestellungengesamtbetrag.kunde.id}`
                };
                pieData[i] = data;
            });

        const chart: IChart = this._chartService.getChart(chartElement);
        if (isPresent(chart) && pieData.length !== 0) {
            chart.Pie(pieData);
        }
    }
}

export const KUNDEN_SERVICE_PROVIDER: Provider =
    provide(KundenService, {useClass: KundenService});
