/* tslint:disable:max-line-length */
import {Inject} from 'angular2/core';
import {Http, Response, Headers, RequestOptionsArgs} from 'angular2/http';
// Moment exportiert den Namespace moment und die gleichnamige Function:
// http://stackoverflow.com/questions/35254524/using-moment-js-in-angular-2-typescript-application#answer-35255412
// TODO : Datum und Imports von moment.js für das Datum

import Kunde from '../../kundenverwaltung/model/kunde';
import {getAuthorization} from '../../iam/iam';
import {BASE_URI, PATH_REGISTRIERUNG, isPresent, log} from '../../shared/shared';
/* tslint:enable:max-line-length */
export default class KundeRegistrierungService {
    private _baseUriKundeRegistrierung: string;
    /**
     * @param _http injizierter Service Http (von AngularJS)
     * @return void
     */
    constructor(@Inject(Http) private _http: Http) {
        this._baseUriKundeRegistrierung = `${BASE_URI}${PATH_REGISTRIERUNG}`;
        console.log(
            `KundeRegistrierungService.constructor(): baseUriKundeRegistrierung=${this._baseUriKundeRegistrierung}`);
    }

    /**
     * Ein neuer Kunde anlegen
     * @param neuerKunde Das JSON-Objekt mit dem neuen Kunde
     * @param successFn Die Callback-Function fuer den Erfolgsfall
     * @param errorFn Die Callback-Function fuer den Fehlerfall
     */
    @log
    save(
        neuerKunde: Kunde, successFn: (location: string) => void,
        errorFn: (status: number, text: string) => void): void {
        // TODO: Datum in kunde.ts - neuerKunde.datum = moment(new Date());

        const uri: string = this._baseUriKundeRegistrierung;
        const body: string = JSON.stringify(neuerKunde.toJSON());
        console.log('body=', body);

        const headers: Headers =
            new Headers({'Content-Type': 'application/json'});
        headers.append('Authorization', getAuthorization());
        // RequestOptionsArgs in
        // node_modules\angular2\ts\src\http\interfaces.ts
        const options: RequestOptionsArgs = {headers: headers};
        console.log('options=', options);

        const nextFn: ((response: Response) => void) = (response: Response) => {
            if (response.status === 201) {
                // TODO Das Response-Objekt enthaelt im Header NICHT
                // "Location"
                successFn(null);
                return;
            }
        };
        // async. Error-Callback statt sync. try/catch
        const errorFnPost: ((errResponse: Response) => void) =
            (errResponse: Response) => {
                if (isPresent(errorFn)) {
                    errorFn(errResponse.status, errResponse.text());
                }
            };
        this._http.post(uri, body, options).subscribe(nextFn, errorFnPost);
    }
}
