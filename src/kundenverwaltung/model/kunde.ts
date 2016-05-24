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

import {RadioButtonState} from 'angular2/common';

import {isPresent} from '../../shared/shared';

/* tslint:disable:max-line-length */
// https://github.com/urish/angular2-moment/blob/master/TimeAgoPipe.ts
// https://github.com/felixge/node-dateformat
// Moment exportiert den Namespace moment und die gleichnamige Function:
// http://stackoverflow.com/questions/35254524/using-moment-js-in-angular-2-typescript-application#answer-35255412
/* tslint:enable:max-line-length */
import {Moment} from 'moment';
import * as moment_ from 'moment';
const moment: (date: string) => Moment = (<any>moment_)['default'];
// import {IIdentityShared} from './identity';
// import Identity from './identity';

const MIN_KATEGORIE: number = 0;
const MAX_KATEGORIE: number = 5;

export interface IAdresse {
    plz: string;
    ort: string;
    strasse: string;
    hausnr: string;
}

export interface IIdentity {
    loginname: string;
    enabled: boolean;
    nachname: string;
    vorname?: string;
    email: string;
    adresse: IAdresse;
}

/**
 * Gemeinsame Datenfelder unabh&auml;ngig, ob die Buchdaten von einem Server
 * (z.B. RESTful Web Service) oder von einem Formular kommen.
 */
export interface IKundeShared {
    id?: string;
    identity: IIdentity;
    newsletter?: boolean;
    agbAkzeptiert: boolean;
    seit: string;
    bemerkungen?: string;
    bestellungenUri: string;
    geschlecht?: 'MAENNLICH'|'WEIBLICH';
    familienstand?: 'VERHEIRATET'|'LEDIG'|'GESCHIEDEN'|'VERWITWET';
}

/**
 * Daten vom und zum REST-Server:
 * <ul>
 *  <li> Arrays f&uuml;r mehrere Werte, die in einem Formular als Checkbox
 *       dargestellt werden.
 *  <li> Daten mit Zahlen als Datentyp, die in einem Formular nur als
 *       String handhabbar sind.
 * </ul>
 */
export interface IKundeServer extends IKundeShared {
    typ: 'P'|'F';
    kategorie: number;
    rabatt: number;
    umsatz: number;
    // familienstand?: 'VERHEIRATET'|'LEDIG'|'GESCHIEDEN'|'VERWITWET';
    hobbys?: Array<string>;
}

/**
 * Daten aus einem Formular:
 * <ul>
 *  <li> je 1 Control fuer jede Checkbox und
 *  <li> au&szlig;erdem Strings f&uuml;r Eingabefelder f&uuml;r Zahlen.
 * </ul>
 */
export interface IKundeForm extends IKundeShared {
    kategorie: string;
    p: RadioButtonState;
    f: RadioButtonState;
    nachname: string;
    rabatt: string;
    umsatz: string;
    /* verheiratet?: RadioButtonState;
    ledig?: RadioButtonState;
    geschieden?: RadioButtonState;
    verwitwet?: RadioButtonState;*/
    /*maennlich: RadioButtonState;
    weiblich: RadioButtonState;*/
    sport?: boolean;
    lesen?: boolean;
    reisen?: boolean;
}

/**
 * Model als Plain-Old-JavaScript-Object (POJO) fuer die Daten *UND*
 * Functions fuer Abfragen und Aenderungen.
 */
export default class Kunde {
    // identity: Identity = new Identity(null, null,null, null, null, null);
    public kategorieArray: Array<boolean> = [];
    // wird i.a. nicht direkt aufgerufen, sondern Buch.fromServer oder
    // Buch.fromForm
    constructor(
        public id: string, public identity: IIdentity, public kategorie: number,
        public rabatt: number, public umsatz: number, public seit: Moment,
        public newsletter: boolean, public agbAkzeptiert: boolean,
        public bemerkungen: string, public bestellungenUri: string,
        public geschlecht: 'MAENNLICH'|'WEIBLICH', public typ: 'P'|'F',
        public familienstand: 'VERHEIRATET'|'LEDIG'|'GESCHIEDEN'|'VERWITWET',
        public hobbys: Array<string>) {
        this.id = id || null;
        this.typ = typ || null;
        this.identity = identity || null;
        this.kategorie = kategorie || null;
        this.rabatt = rabatt || null;
        this.umsatz = umsatz || null;
        this.seit = isPresent(seit) ? seit : moment(new Date().toISOString());
        this.newsletter = newsletter || null;
        this.bemerkungen = bemerkungen || null;
        this.bestellungenUri = bestellungenUri || null;
        // this.familienstand = familienstand || null;
        this.geschlecht = geschlecht || null;
        this.familienstand = familienstand || null;
        this.hobbys = isPresent(hobbys) && hobbys.length !== 0 ? hobbys : [];
        for (let i: number = MIN_KATEGORIE; i < kategorie; i++) {
            this.kategorieArray.push(true);
        }
        for (let i: number = this.kategorie; i < MAX_KATEGORIE; i++) {
            this.kategorieArray.push(false);
        }
    }

    /**
     * Ein Buch-Objekt mit JSON-Daten erzeugen, die von einem RESTful Web
     * Service kommen.
     * @param buch JSON-Objekt mit Daten vom RESTful Web Server
     * @return Das initialisierte Buch-Objekt
     */
    static fromServer(kundeServer: IKundeServer): Kunde {
        const kunde: Kunde = new Kunde(
            kundeServer.id, kundeServer.identity, kundeServer.kategorie,
            kundeServer.rabatt, kundeServer.umsatz, moment(kundeServer.seit),
            kundeServer.newsletter, kundeServer.agbAkzeptiert,
            kundeServer.bemerkungen, kundeServer.bestellungenUri,
            kundeServer.geschlecht, kundeServer.typ, kundeServer.familienstand,
            kundeServer.hobbys);
        // kundeServer.familienstand
        console.log('Kunde.fromServer(): kunde=', kunde);
        return kunde;
    }
    /**
     * Ein Buch-Objekt mit JSON-Daten erzeugen, die von einem Formular kommen.
     * @param JSON-Objekt mit Daten vom Formular
     * @return Das initialisierte Buch-Objekt
     */
    static fromForm(kundeForm: IKundeForm): Kunde {
        const typ: 'P'|'F' = kundeForm.p.checked ? 'P' : 'F';
        /*const geschlecht: 'MAENNLICH'|'WEIBLICH' =
            kundeForm.maennlich.checked ? 'MAENNLICH' : 'WEIBLICH';*/
        const hobbys: Array<string> = [];
        if (kundeForm.sport) {
            hobbys.push('SPORT');
        }
        if (kundeForm.lesen) {
            hobbys.push('LESEN');
        }
        if (kundeForm.reisen) {
            hobbys.push('REISEN');
        }
        // preis und rabatt muss von string in number konvertiert werden
        const kunde: Kunde = new Kunde(
            kundeForm.id, kundeForm.identity, parseInt(kundeForm.kategorie, 10),
            parseInt(kundeForm.rabatt, 10) / 100, parseFloat(kundeForm.umsatz),
            null, kundeForm.newsletter, kundeForm.agbAkzeptiert,
            kundeForm.bemerkungen, kundeForm.bestellungenUri,
            kundeForm.geschlecht, typ, null, hobbys);
        // familienstand
        console.log('Kunde.fromForm(): kunde=', kunde);
        return kunde;
        // kundeForm.loginname, kundeForm.kategorie,kundeForm.newsletter,
        // kundeForm.agbAkzeptiert
    }
    // http://momentjs.com
    get datumFormatted(): string { return this.seit.format('Do MMM YYYY'); }

    get datumFromNow(): string { return this.seit.fromNow(); }

    /**
     * Abfrage, ob im Buchtitel der angegebene Teilstring enthalten ist. Dabei
     * wird nicht auf Gross-/Kleinschreibung geachtet.
     * @param titel Zu &uuml;berpr&uuml;fender Teilstring
     * @return true, falls der Teilstring im Buchtitel enthalten ist. Sonst
     *         false.
     */
    containsLoginname(nachname: string): boolean {
        return this.identity.nachname.toLowerCase().includes(
            nachname.toLowerCase());
    }
    /**
     * Die Bewertung ("rating") des Buches um 1 erh&ouml;hen
     */
    rateUp(): void {
        if (this.kategorie < MAX_KATEGORIE) {
            this.kategorie++;
        }
    }

    /**
     * Die Bewertung ("rating") des Buches um 1 erniedrigen
     */
    rateDown(): void {
        if (this.kategorie > MIN_KATEGORIE) {
            this.kategorie--;
        }
    }
    /**
     * Abfrage, ob es zum Buch das angegebene Schlagwort gibt.
     * @param schlagwort das zu &uuml;berpr&uuml;fende Schlagwort
     * @return true, falls es das Schlagwort gibt. Sonst false.
     */
    isKunde_seit(seit: string): boolean {
        return this.seit === moment(seit);
        // this.seit.find((s: string) => s === seit) !== undefined;
    }
    isPrivat(): boolean {
        if (this.typ === 'P') {
            return true;
        }
    }
    /**
     * Abfrage, ob es zum Buch auch Schlagw&ouml;rter gibt.
     * @return true, falls es mindestens ein Schlagwort gibt. Sonst false.
     */
    hasGeschlecht(geschlecht: string): boolean {
        return this.geschlecht === geschlecht;
    }
    /**
     * Aktualisierung der Stammdaten des Buch-Objekts.
     * @param titel Der neue Buchtitel
     * @param rating Die neue Bewertung
     * @param art Die neue Buchart (DRUCKAUSGABE oder KINDLE)
     * @param verlag Der neue Verlag
     * @param preis Der neue Preis
     * @param rabatt Der neue Rabatt
     */
    updateStammdaten(
        nachname: string, kategorie: number, newsletter: boolean,
        rabatt: number, umsatz: number, agbAkzeptiert: boolean,
        bemerkungen: string): void {
        this.identity.nachname = nachname;
        this.kategorie = kategorie;
        this.rabatt = rabatt;
        this.umsatz = umsatz;
        this.newsletter = newsletter;
        this.agbAkzeptiert = agbAkzeptiert;
        this.bemerkungen = bemerkungen;
    }
    /**
     * Aktualisierung der Stammdaten des Buch-Objekts.
     * @param titel Der neue Buchtitel
     * @param rating Die neue Bewertung
     * @param art Die neue Buchart (DRUCKAUSGABE oder KINDLE)
     * @param verlag Der neue Verlag
     * @param preis Der neue Preis
     * @param rabatt Der neue Rabatt
     */
    updateStammdatenPrivat(
        nachname: string, kategorie: number, newsletter: boolean,
        rabatt: number, umsatz: number, agbAkzeptiert: boolean,
        bemerkungen: string, geschlecht: 'MAENNLICH'|'WEIBLICH'): void {
        this.identity.nachname = nachname;
        this.kategorie = kategorie;
        this.rabatt = rabatt;
        this.umsatz = umsatz;
        this.newsletter = newsletter;
        this.agbAkzeptiert = agbAkzeptiert;
        this.bemerkungen = bemerkungen;
        this.geschlecht = geschlecht;
    }
    // Überprüft ob Hobbys
    hasHobbys(): boolean { return this.hobbys.length !== 0; }
    /**
     * Konvertierung des Buchobjektes in ein JSON-Objekt f&uuml;r den RESTful
     * Web Service.
     * @return Das JSON-Objekt f&uuml;r den RESTful Web Service
     */
    toJSON(): IKundeServer {
        return {
            id: this.id,
            typ: this.typ,
            identity: this.identity,
            kategorie: this.kategorie,
            rabatt: this.rabatt,
            umsatz: this.umsatz,
            seit: this.seit.format('YYYY-MM-DD'),
            newsletter: this.newsletter,
            agbAkzeptiert: this.agbAkzeptiert,
            bemerkungen: this.bemerkungen,
            bestellungenUri: this.bestellungenUri,
            geschlecht: this.geschlecht,
            familienstand: this.familienstand,
            hobbys: this.hobbys
        };
    }
    toString(): string { return JSON.stringify(this, null, 2); }
}
