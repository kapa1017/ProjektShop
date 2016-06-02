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
import Artikel from '../model/artikel';
import {IArtikelServer, IArtikelForm} from '../model/artikel';
import AbstractArtikelsService from './abstract_artikels_service';
import {ChartService, BASE_URI, PATH_ARTIKELS, isBlank, isPresent, isEmpty, log} from '../../shared/shared';
import {getAuthorization} from '../../iam/iam';

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
export default class ArtikelsService extends AbstractArtikelsService {
    private _baseUriArtikels: string;
    private _artikelsEmitter: EventEmitter<Array<Artikel>> =
        new EventEmitter<Array<Artikel>>();
    private _artikelEmitter: EventEmitter<Artikel> =
        new EventEmitter<Artikel>();
    // private _fileEmitter: EventEmitter<File> = new EventEmitter<File>();
    private _errorEmitter: EventEmitter<string|number> =
        new EventEmitter<string|number>();
    private _artikel: Artikel = null;

    /**
     * @param _chartService injizierter ChartService
     * @param _http injizierter Service Http (von AngularJS)
     * @return void
     */
    constructor(
        @Inject(ChartService) private _chartService: ChartService,
        @Inject(Http) private _http: Http) {
        super();
        this._baseUriArtikels = `${BASE_URI}${PATH_ARTIKELS}`;
        console.log(
            `ArtikelsService.constructor(): baseUriArtikels=${this._baseUriArtikels}`);
    }

    /**
     * Ein Buch-Objekt puffern.
     * @param buch Das Buch-Objekt, das gepuffert wird.
     * @return void
     */
    set artikel(artikel: Artikel) {
        console.log('ArtikelsService.set artikel()', artikel);
        this._artikel = artikel;
    }
    @log
    observeArtikels(
        observerFn: (artikels: Array<Artikel>) => void, thisArg: any): void {
        this._artikelsEmitter.forEach(observerFn, thisArg);
    }
    @log
    observeArtikel(observerFn: (artikel: Artikel) => void, thisArg: any): void {
        this._artikelEmitter.forEach(observerFn, thisArg);
    }
    @log
    observeError(observerFn: (err: string|number) => void, thisArg: any): void {
        this._errorEmitter.forEach(observerFn, thisArg);
    }
    /**
     * Buecher suchen
     * @param suchkriterien Die Suchkriterien
     */
    @log
    find(suchkriterien: IArtikelForm): void {
        const searchParams: URLSearchParams =
            this._suchkriterienToSearchParams(suchkriterien);
        console.log(`ArtikelsService.find(): searchParams=${searchParams}`);
        const uri: string = this._baseUriArtikels;
        console.log(`ArtikelsService.find(): uri=${uri}`);
        const headers: Headers =
            new Headers({'Content-Type': 'application/json'});
        headers.append('Authorization', getAuthorization());
        // RequestOptionsArgs in
        // node_modules\angular2\ts\src\http\interfaces.ts
        const options:
            RequestOptionsArgs = {search: searchParams, headers: headers};
        console.log('options=', options);

        const nextFn: ((response: Response) => void) = (response: Response) => {
            console.log('ArtikelsService.find(): nextFn()');
            let artikels: Array<Artikel> =
                this._responseToArrayArtikel(response);
            this._artikelsEmitter.emit(artikels);
        };
        const errorFn: (err: Response) => void = (err: Response) => {
            const status: number = err.status;
            console.log(`ArtikelsService.find(): errorFn(): ${status}`);
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
     * Ein Buch anhand der ID suchen
     * @param id Die ID des gesuchten Buchs
     */
    @log
    findById(artikelId: string): void {
        // Gibt es ein gepuffertes Buch mit der gesuchten ID?
        if (isPresent(this._artikel) && this._artikel.id === artikelId) {
            this._artikelEmitter.emit(this._artikel);
            return;
        }
        if (isBlank(artikelId)) {
            return;
        }

        const uri: string = `${this._baseUriArtikels}/${artikelId}`;
        const headers: Headers =
            new Headers({'Content-Type': 'application/json'});
        headers.append('Authorization', getAuthorization());
        // RequestOptionsArgs in
        // node_modules\angular2\ts\src\http\interfaces.ts
        const options: RequestOptionsArgs = {headers: headers};
        console.log('options=', options);
        const nextFn: ((response: Response) => void) = (response: Response) => {
            this._artikel = this._responseToArtikel(response);
            this._artikelEmitter.emit(this._artikel);
        };
        const errorFn: (err: Response) => void = (err: Response) => {
            const status: number = err.status;
            console.log(`ArtikelsService.findById(): errorFn(): ${status}`);
            this._errorEmitter.emit(status);
        };

        this._http.get(uri, options).subscribe(nextFn, errorFn);
    }
    @log
    update(
        artikel: Artikel, successFn: () => void,
        errorFn: (status: number, text: string) => void): void {
        const uri: string = `${this._baseUriArtikels}`;
        const body: string = JSON.stringify(artikel.toJSON());
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
     * Ein Buch l&ouml;schen
     * @param buch Das JSON-Objekt mit dem zu loeschenden Buch
     * @param successFn Die Callback-Function fuer den Erfolgsfall
     * @param errorFn Die Callback-Function fuer den Fehlerfall
     */
    @log
    remove(
        artikel: Artikel, successFn: () => void,
        errorFn: (status: number) => void): void {
        const uri: string = `${this._baseUriArtikels}/${artikel.id}`;
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
    toString(): String {
        return `ArtikelsService: {artikel: ${JSON.stringify(this._artikel, null, 2)}}`;
    }
    /**
     * Ein Response-Objekt in ein Array von Buch-Objekten konvertieren.
     * @param response Response-Objekt eines GET-Requests.
     */
    @log
    private _suchkriterienToSearchParams(suchkriterien: IArtikelForm):
        URLSearchParams {
        const searchParams: URLSearchParams = new URLSearchParams();

        if (!isEmpty(suchkriterien.bezeichnung)) {
            searchParams.set('bezeichnung', suchkriterien.bezeichnung);
        }
        if (!isEmpty(suchkriterien.kategorie)) {
            searchParams.set('kategorie', suchkriterien.kategorie);
        }
        /* if (suchkriterien.maennlich) {
            searchParams.set('geschlecht', 'MAENNLICH');
        } else if (suchkriterien.weiblich) {
            searchParams.set('geschlecht', 'WEIBLICH');
        }*/
        return searchParams;
    }

    /**
     * Ein Response-Objekt in ein Array von Buch-Objekten konvertieren.
     * @param response Response-Objekt eines GET-Requests.
     */
    @log
    private _responseToArrayArtikel(response: Response): Array<Artikel> {
        const jsonArray: Array<IArtikelServer> =
            <Array<IArtikelServer>>(response.json());
        return jsonArray.map((jsonObjekt: IArtikelServer) => {
            return Artikel.fromServer(jsonObjekt);
        });
    }
    /**
     * Ein Response-Objekt in ein Buch-Objekt konvertieren.
     * @param response Response-Objekt eines GET-Requests.
     */
    @log
    private _responseToArtikel(response: Response): Artikel {
        const jsonObjekt: IArtikelServer = <IArtikelServer>(response.json());
        return Artikel.fromServer(jsonObjekt);
    }
}
export const ARTIKELS_SERVICE_PROVIDER: Provider =
    provide(ArtikelsService, {useClass: ArtikelsService});
