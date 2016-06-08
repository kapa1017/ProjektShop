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
// https://github.com/urish/angular2-moment/blob/master/TimeAgoPipe.ts
// https://github.com/felixge/node-dateformat
// Moment exportiert den Namespace moment und die gleichnamige Function:
// http://stackoverflow.com/questions/35254524/using-moment-js-in-angular-2-typescript-application#answer-35255412
/* tslint:enable:max-line-length */

export interface IAdresseShared {
    plz: string;
    ort: string;
    strasse: string;
    hausnr: string;
}

/**
 * Model als Plain-Old-JavaScript-Object (POJO) fuer die Daten *UND*
 * Functions fuer Abfragen und Aenderungen.
 */
export default class Adresse {
    // wird i.a. nicht direkt aufgerufen, sondern Adresse.fromServer oder
    // Adresse.fromForm
    constructor(
        public plz: string, public ort: string, public strasse: string,
        public hausnr: string) {
        this.plz = plz || null;
        this.ort = ort || null;
        this.strasse = strasse || null;
        this.hausnr = hausnr || null;
    }

    /**
     * Ein Adresse-Objekt mit JSON-Daten erzeugen, die von einem RESTful Web
     * Service kommen.
     * @param adresse JSON-Objekt mit Daten vom RESTful Web Server
     * @return Das initialisierte unde-Objekt
     */
    static fromServer(adresseServer: IAdresseShared): Adresse {
        const adresse: Adresse = new Adresse(
            adresseServer.plz, adresseServer.ort, adresseServer.strasse,
            adresseServer.hausnr);
        console.log('Adresse.fromServer(): adresse=', adresse);
        return adresse;
    }
    /**
     * Ein Kunde-Objekt mit JSON-Daten erzeugen, die von einem Formular kommen.
     * @param JSON-Objekt mit Daten vom Formular
     * @return Das initialisierte Kunde-Objekt
     */
    static fromForm(adresseForm: IAdresseShared): Adresse {
        // preis und rabatt muss von string in number konvertiert werden
        const adresse: Adresse = new Adresse(
            adresseForm.plz, adresseForm.ort, adresseForm.strasse,
            adresseForm.hausnr);
        console.log('Adresse.fromForm(): adresse=', adresse);
        return adresse;
    }
}
