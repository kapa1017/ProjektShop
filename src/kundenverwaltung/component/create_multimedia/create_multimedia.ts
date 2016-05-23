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

// "core" enthaelt Funktionalitaet, damit die Webanwendung im Browser laeuft
import {Component, OnInit} from 'angular2/core';
// "common" enthaelt Direktiven (z.B. ngFor, ngIf), Form Controls und Pipes
import {CORE_DIRECTIVES, FormBuilder, ControlGroup, Control} from 'angular2/common';
import KundenService from '../../service/kunden_service';
// import File from '../../model/file';
import {isAdmin} from '../../../iam/iam';
import {isPresent, log, toBase64Multimedia} from '../../../shared/shared';
import APP_ROUTES from '../../../app/routes';
import {Router, CanActivate} from 'angular2/router';

/*import FileService from '../../service/file_service';
import File from '../../model/file';
import APP_ROUTES from '../../../app/routes';
import {isAdmin} from '../../../iam/iam';
import {isPresent, log} from '../../../shared/shared';*/

/**
 * Komponente f&uuml;r das Tag <code>such-kriterien</code>
 */
@Component({
    selector: 'create-multimedia',
    directives: [CORE_DIRECTIVES],
    template: `
        <div class="card">
            <div class="card-header bg-primary">
                <h4>Neues Video, Bild oder Audiodatei hochladen</h4>
            </div>
            <div class="card-block">
                <!-- Formulare zur Interaktion mit dem Endbenutzer:
                        * Daten werden modifiziert, z.B. in Suchfelder
                          oder Erfassungs-/Aenderungsformularen
                        * Aenderungen wirken sich auf Teile der Seite aus:
                          Ergebnisse/Fehler anzeigen, Navigationsmoeglichkeiten
                        * Eingaben werden validiert
                -->
                <!-- Template-Syntax:
                     (submit)="find()"   fuer Output = Event Binding
                                         d.h. Ereignis submit an find() anbinden
                                         oder on-submit="find"
                     Definition von Attributnamen gemaess HTML: Attribute names
                     must consist of one or more characters other than the
                     space characters, U+0000 NULL, """, "'", ">", "/", "=",
                     the control characters, and any characters that are not
                     defined by Unicode.
                -->
                <!-- CSS-Klassen von Bootstrap:
                     form-group, row, form-control-label, btn, ...
                     http://v4-alpha.getbootstrap.com/components/forms -->
                       
                  <form [ngFormModel]="form" role="form" method="post" enctype="multipart/form-data">
                    <div class="form-group row">
                        <label for="idInput"
                               class="col-sm-2 form-control-label">KundenId</label>
                        <div class="col-sm-10">
                            <input id="idInput"
                                type="search"
                                placeholder="Bitte geben Sie eine Kundennummer ein."
                                class="form-control"
                                [ngFormControl]="id">
                        </div>
                    </div>
                    
                    <div class="form-group row">
                    <label for="Input"
                               class="col-sm-2 form-control-label">Datei</label>
                    <p> Wählen Sie eine Multimediadatei von Ihrem Rechner aus:
			        <br>
			        <input name="dateien"
                           type="file" accept="image/jpeg, image/pjpeg, image/png, video/mp4, audio/wav"
                           class="form-control"
                           [ngFormControl] = "dateien">
                    </p>
                    </div>
                     
                    <div class="form-group row">
                        <div class="col-sm-offset-2 col-sm-10">
                        <button class="btn btn-secondary" (click)="fileUploadwithBase64byID()">
                            <i class="fa fa-check"></i> &nbsp; Hochladen
                        </button>
                         </div>
                    </div>
                </form>
            </div>
        </div>
    `
})
@CanActivate(isAdmin)
export default class CreateMultimedia implements OnInit {
    // Event Binding: <such-kriterien (waiting)="...">
    // siehe OutputMetadata in
    // node_modules\angular2\ts\src\core\metadata\directives.ts
    form: ControlGroup;
    id: Control = new Control('');
    dateien: Control = new Control('');

    // Empfehlung: Konstruktor nur fuer DI
    constructor(
        private _formBuilder: FormBuilder,
        private _kundenService: KundenService, private _router: Router) {
        console.log('CreateMultimedia.constructor()');
        if (!isPresent(_router)) {
            console.error('Injizierter Router:', _router);
        }
    }
    /**
     * Das Formular als Gruppe von Controls initialisieren.
     */
    ngOnInit(): void {
        console.log('CreateMultimedia.ngOnInit(): dateien=', this.dateien);

        // Definition und Vorbelegung der Eingabedaten
        this.dateien = new Control('');
        this.form = this._formBuilder.group({
            // siehe ngFormControl innerhalb von @Component({template: `...`})
            'nachname': this.id,
            'dateien': this.dateien
        });
    }
    /**
     * Die Methode <code>save</code> realisiert den Event-Handler, wenn das
     * Formular abgeschickt wird, um ein neues Buch anzulegen.
     * @return false, um das durch den Button-Klick ausgel&ouml;ste Ereignis
     *         zu konsumieren.
     */
    @log
    fileUploadwithBase64byID(): boolean {
        const kundeid: string = this.id.value;
        console.log('kundeid=', kundeid);
        const dateien: FileList = this.dateien.value;
        // FileList objekt
        console.log('dateien=', dateien);
        // erste Datei auswählen (wichtig, weil IMMER ein FileList Objekt
        // generiert wird)
        const uploadDatei: File = dateien[0];
        uploadDatei.msDetachStream();
        // const reader: FileReader = new FileReader();
        /*reader.onload = function(theFileData) {
        senddata.fileData = theFileData.target.result;
        // Ergebnis vom FileReader auslesen
        const filedata: any = reader.result;
        // const dataurl: void = reader.readAsDataURL(filedata);
        console.log('dataurl=', dataurl);
        */
        const base64: string = toBase64Multimedia(uploadDatei);
        // console.log('base64=', base64);
        const dataurl: string =
            `data: ${uploadDatei.type};${uploadDatei.name};base64, ${base64}`;

        const successFn: (
            location: string) => void = (location: string = null) => {
            console.log(
                `CreateMultimedia.fileUploadwithBase64byID(): successFn(): location: ${location}`);
            // TODO Das Response-Objekt enthaelt im Header NICHT "Location"
            console.log(
                /* tslint:disable:max-line-length */
                `CreateMultimedia.fileUploadwithBase64byID(): successFn(): navigate: ${APP_ROUTES.homeDef.name}`);
            /* tslint:enable:max-line-length */
            this._router.navigate([APP_ROUTES.homeDef.name]);
        };
        const errorFn: (
            status: number,
            text:
                string) => void = (status: number, text: string = null): void => {
            console.log(
                `CreateMultimedia.fileUploadwithBase64byID(): errorFn(): status: ${status}`);
            if (isPresent(text)) {
                console.log(
                    `CreateMultimedia.fileUploadwithBase64byIDe(): errorFn(): text: ${text}`);
            }
        };
        this._kundenService.fileUploadwithBase64byID(
            kundeid, dataurl, successFn, errorFn);

        // damit das (Submit-) Ereignis konsumiert wird und nicht an
        // uebergeordnete Eltern-Komponenten propagiert wird bis zum Refresh
        // der gesamten Seite
        return false;
    }

    toString(): String { return 'CreateMultimedia'; }
}
