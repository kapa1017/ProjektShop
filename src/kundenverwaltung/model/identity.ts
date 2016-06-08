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
import Adresse from './adresse';
export interface IIdentityShared {
    loginname: string;
    enabled: boolean;
    nachname: string;
    vorname?: string;
    email: string;
    adresse: Adresse;
}

/**
 * Model als Plain-Old-JavaScript-Object (POJO) fuer die Daten *UND*
 * Functions fuer Abfragen und Aenderungen.
 */
export default class Identity {
    // wird i.a. nicht direkt aufgerufen, sondern Identity.fromServer oder
    // Identity.fromForm
    constructor(
        public loginname: string, public enabled: boolean,
        public nachname: string, public vorname: string, public email: string,
        public adresse: Adresse) {
        this.loginname = loginname || null;
        this.enabled = enabled || null;
        this.nachname = nachname || null;
        this.vorname = vorname || null;
        this.email = email || null;
        this.adresse = adresse || null;
    }

    /**
     * Ein Identity-Objekt mit JSON-Daten erzeugen, die von einem RESTful Web
     * Service kommen.
     * @param identity JSON-Objekt mit Daten vom RESTful Web Server
     * @return Das initialisierte unde-Objekt
     */
    static fromServer(identityServer: IIdentityShared): Identity {
        const identity: Identity = new Identity(
            identityServer.loginname, identityServer.enabled,
            identityServer.nachname, identityServer.vorname,
            identityServer.email, identityServer.adresse);
        // kundeServer.familienstand
        console.log('Identity.fromServer(): identity=', identity);
        return identity;
    }
    /**
     * Ein Identity-Objekt mit JSON-Daten erzeugen, die von einem Formular kommen.
     * @param identity JSON-Objekt mit Daten vom Formular
     * @return Das initialisierte Kunde-Objekt
     */
    static fromForm(identityForm: IIdentityShared): Identity {
        // preis und rabatt muss von string in number konvertiert werden
        const identity: Identity = new Identity(
            identityForm.loginname, identityForm.enabled, identityForm.nachname,
            identityForm.vorname, identityForm.email, identityForm.adresse);
        console.log('Identity.fromForm(): identity=', identity);
        return identity;
    }
    toString(): string { return JSON.stringify(this, null, 2); }
}
