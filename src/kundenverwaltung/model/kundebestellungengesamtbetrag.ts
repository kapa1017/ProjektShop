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

import {IKundeServer} from './kunde';

export interface IKundeBestellungenGesamtbetragShared { kunde: IKundeServer; }

export interface IKundeBestellungenGesamtbetragServer extends
    IKundeBestellungenGesamtbetragShared {
    bestellungenGesamtbetrag: number;
}

export interface IKundeBestellungenGesamtbetragForm extends
    IKundeBestellungenGesamtbetragShared {
    bestellungenGesamtbetrag: string;
}

/**
 * Model als Plain-Old-JavaScript-Object (POJO) fuer die Daten *UND*
 * Functions fuer Abfragen und Aenderungen.
 */
export default class KundeBestellungenGesamtbetrag {
    // wird i.a. nicht direkt aufgerufen, sondern Buch.fromServer oder
    // Buch.fromForm
    constructor(
        public kunde: IKundeServer, public bestellungenGesamtbetrag: number) {
        this.kunde = kunde || null;
        this.bestellungenGesamtbetrag = bestellungenGesamtbetrag || null;
    }

    /**
     * Ein Buch-Objekt mit JSON-Daten erzeugen, die von einem RESTful Web
     * Service kommen.
     * @param buch JSON-Objekt mit Daten vom RESTful Web Server
     * @return Das initialisierte Buch-Objekt
     */
    static fromServer(kundebestellungengesamtbetragServer:
                          IKundeBestellungenGesamtbetragServer):
        KundeBestellungenGesamtbetrag {
        const kundebestellungengesamtbetrag: KundeBestellungenGesamtbetrag =
            new KundeBestellungenGesamtbetrag(
                kundebestellungengesamtbetragServer.kunde,
                kundebestellungengesamtbetragServer.bestellungenGesamtbetrag);
        console.log(
            'KundeBestellungenGesamtbetrag.fromServer(): kundebestellungengesamtbetrag=',
            kundebestellungengesamtbetrag);
        return kundebestellungengesamtbetrag;
    }
    /**
     * Ein Buch-Objekt mit JSON-Daten erzeugen, die von einem Formular kommen.
     * @param JSON-Objekt mit Daten vom Formular
     * @return Das initialisierte Buch-Objekt
     */
    static fromForm(kundebestellungengesamtbetragForm:
                        IKundeBestellungenGesamtbetragForm):
        KundeBestellungenGesamtbetrag {
        const kundebestellungengesamtbetrag: KundeBestellungenGesamtbetrag =
            new KundeBestellungenGesamtbetrag(
                kundebestellungengesamtbetragForm.kunde,
                parseFloat(kundebestellungengesamtbetragForm
                               .bestellungenGesamtbetrag));
        console.log(
            'KundeBestellungenGesamtbetrag.fromForm(): kundebestellungengesamtbetrag=',
            kundebestellungengesamtbetrag);
        return kundebestellungengesamtbetrag;
    }
    /**
     * Konvertierung des Buchobjektes in ein JSON-Objekt f&uuml;r den RESTful
     * Web Service.
     * @return Das JSON-Objekt f&uuml;r den RESTful Web Service
     */
    toJSON(): IKundeBestellungenGesamtbetragServer {
        return {
            kunde: this.kunde,
            bestellungenGesamtbetrag: this.bestellungenGesamtbetrag
        };
    }
    toString(): string { return JSON.stringify(this, null, 2); }
}
