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

// import {RadioButtonState} from 'angular2/common';

// import {isBlank, isPresent} from '../../shared/shared';

/* tslint:disable:max-line-length */
// https://github.com/urish/angular2-moment/blob/master/TimeAgoPipe.ts
// https://github.com/felixge/node-dateformat
// Moment exportiert den Namespace moment und die gleichnamige Function:
// http://stackoverflow.com/questions/35254524/using-moment-js-in-angular-2-typescript-application#answer-35255412
/* tslint:enable:max-line-length */
// import {Moment} from 'moment';
// import * as moment_ from 'moment';
// const moment: (date: string) => Moment = (<any>moment_)['default'];

const MIN_RATING: number = 0;
const MAX_RATING: number = 5;

/**
 * Gemeinsame Datenfelder unabh&auml;ngig, ob die Buchdaten von einem Server
 * (z.B. RESTful Web Service) oder von einem Formular kommen.
 */

export interface IArtikelShared {
    id?: string;
    bezeichnung?: string;
    kategorie?: 'BAD'|'BUERO'|'DIELE'|'ESSZIMMER'|'KINDERZIMMER'|'KUECHE';
    ausgesondert: boolean;
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
export interface IArtikelServer extends IArtikelShared {
    preis: number;
    rating: number;
}

/**
 * Daten aus einem Formular:
 * <ul>
 *  <li> je 1 Control fuer jede Checkbox und
 *  <li> au&szlig;erdem Strings f&uuml;r Eingabefelder f&uuml;r Zahlen.
 * </ul>
 */
export interface IArtikelForm extends IArtikelShared {
    preis: string;
    rating: string;
}

/**
 * Model als Plain-Old-JavaScript-Object (POJO) fuer die Daten *UND*
 * Functions fuer Abfragen und Aenderungen.
 */
export default class Artikel {
    public ratingArray: Array<boolean> = [];

    // wird i.a. nicht direkt aufgerufen, sondern Buch.fromServer oder
    // Buch.fromForm
    constructor(
        public id: string, public bezeichnung: string,
        public kategorie:
            'BAD'|'BUERO'|'DIELE'|'ESSZIMMER'|'KINDERZIMMER'|'KUECHE',
        public ausgesondert: boolean, public preis: number,
        public rating: number) {
        this.id = id || null;
        this.bezeichnung = bezeichnung || null;
        this.kategorie = kategorie || null;
        this.ausgesondert = ausgesondert || null;
        this.rating = rating || null;
        this.preis = preis || null;
        for (let i: number = MIN_RATING; i < rating; i++) {
            this.ratingArray.push(true);
        }
        for (let i: number = this.rating; i < MAX_RATING; i++) {
            this.ratingArray.push(false);
        }
    }
    /**
     * Ein Buch-Objekt mit JSON-Daten erzeugen, die von einem RESTful Web
     * Service kommen.
     * @param buch JSON-Objekt mit Daten vom RESTful Web Server
     * @return Das initialisierte Buch-Objekt
     */
    static fromServer(artikelServer: IArtikelServer): Artikel {
        const artikel: Artikel = new Artikel(
            artikelServer.id, artikelServer.bezeichnung,
            artikelServer.kategorie, artikelServer.ausgesondert,
            artikelServer.preis, artikelServer.rating);
        console.log('Artikel.fromServer(): artikel=', artikel);
        return artikel;
    }

    /**
     * Ein Buch-Objekt mit JSON-Daten erzeugen, die von einem Formular kommen.
     * @param buch JSON-Objekt mit Daten vom Formular
     * @return Das initialisierte Buch-Objekt
     */
    static fromForm(artikelForm: IArtikelForm): Artikel {
        // preis und rabatt muss von string in number konvertiert werden
        const artikel: Artikel = new Artikel(
            artikelForm.id, artikelForm.bezeichnung, artikelForm.kategorie,
            artikelForm.ausgesondert, parseInt(artikelForm.preis, 10),
            parseInt(artikelForm.rating, 10));
        console.log('Artikel.fromForm(): artikel=', artikel);
        return artikel;
    }
    /**
     * Abfrage, ob im Buchbezeichnung der angegebene Teilstring enthalten ist. Dabei
     * wird nicht auf Gross-/Kleinschreibung geachtet.
     * @param bezeichnung Zu &uuml;berpr&uuml;fender Teilstring
     * @return true, falls der Teilstring im Buchbezeichnung enthalten ist. Sonst
     *         false.
     */
    containsTitel(bezeichnung: string): boolean {
        return this.bezeichnung.toLowerCase() === bezeichnung;
    }

    /**
     * Die Bewertung ("rating") des Buches um 1 erh&ouml;hen
     */
    rateUp(): void {
        if (this.rating < MAX_RATING) {
            this.rating++;
        }
    }

    /**
     * Die Bewertung ("rating") des Buches um 1 erniedrigen
     */
    rateDown(): void {
        if (this.rating > MIN_RATING) {
            this.rating--;
        }
    }

    /**
     * Abfrage, ob das Buch dem angegebenen Verlag zugeordnet ist.
     * @param verlag der Name des Verlags
     * @return true, falls das Buch dem Verlag zugeordnet ist. Sonst false.
     */

    /**
     * Aktualisierung der Stammdaten des Buch-Objekts.
     * @param bezeichnung Der neue Buchbezeichnung
     * @param rating Die neue Bewertung
     * @param art Die neue Buchart (DRUCKAUSGABE oder KINDLE)
     * @param verlag Der neue Verlag
     * @param preis Der neue Preis
     * @param rabatt Der neue Rabatt
     */
    updateStammdaten(
        bezeichnung: string,
        kategorie: 'BAD'|'BUERO'|'DIELE'|'ESSZIMMER'|'KINDERZIMMER'|'KUECHE',
        ausgesondert: boolean, preis: number, rating: number): void {
        this.bezeichnung = bezeichnung;
        this.kategorie = kategorie;
        this.ausgesondert = ausgesondert;
        this.preis = preis;
        this.rating = rating;
    }

    /**
     * Abfrage, ob es zum Buch auch Schlagw&ouml;rter gibt.
     * @return true, falls es mindestens ein Schlagwort gibt. Sonst false.
     */
    hasKategorie(): boolean { return this.kategorie.length !== 0; }


    /**
     * Abfrage, ob es zum Buch das angegebene Schlagwort gibt.
     * @param schlagwort das zu &uuml;berpr&uuml;fende Schlagwort
     * @return true, falls es das Schlagwort gibt. Sonst false.
     */
    /**
     * Aktualisierung der Schlagw&ouml;rter des Buch-Objekts.
     * @param schnulze ist das Schlagwort SCHNULZE gesetzt
     * @param scienceFiction ist das Schlagwort SCIENCE_FICTION gesetzt
     */
    /**
     * Konvertierung des Buchobjektes in ein JSON-Objekt f&uuml;r den RESTful
     * Web Service.
     * @return Das JSON-Objekt f&uuml;r den RESTful Web Service
     */
    toJSON(): IArtikelServer {
        return {
            id: this.id,
            bezeichnung: this.bezeichnung,
            kategorie: this.kategorie,
            ausgesondert: this.ausgesondert,
            preis: this.preis,
            rating: this.rating
        };
    }

    toString(): string { return JSON.stringify(this, null, 2); }
}
