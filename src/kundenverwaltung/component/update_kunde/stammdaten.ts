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
import {Component, Input, OnInit} from 'angular2/core';
import {CORE_DIRECTIVES, FORM_DIRECTIVES, FormBuilder, ControlGroup, Control} from 'angular2/common';
import {Router} from 'angular2/router';

import KundenService from '../../service/kunden_service';
import Kunde from '../../model/kunde';
import KundeValidator from '../validator/kunde_validator';
import APP_ROUTES from '../../../app/routes';
import {isBlank, log} from '../../../shared/shared';
/* tslint:enable:max-line-length */

/**
 * Komponente f&uuml;r das Tag <code>stammdaten</code>
 */
@Component({
    selector: 'stammdaten',
    // FormBuilder ist nur fuer die Komponente und ihre Kind-Komponenten
    // verfuegbar
    /* tslint:disable:max-line-length */
    // http://blog.thoughtram.io/angular/2015/08/20/host-and-visibility-in-angular-2-dependency-injection.html
    /* tslint:enable:max-line-length */
    providers: [FormBuilder],
    directives: [FORM_DIRECTIVES, CORE_DIRECTIVES],
    template: `
        <form [ngFormModel]="form" role="form">
            <div class="form-group row"
                 [class.text-danger]="!nachname.valid && nachname.touched">
                <label for="nachnameInput" class="col-sm-2 form-control-label">
                    Nachname *
                </label>
                <div class="col-sm-10">
                    <input id="nachnameInput"
                        placeholder="Nachname"
                        class="form-control"
                        autofocus
                        type="search"
                        [ngFormControl]="nachname">
                </div>
                <div class="col-sm-offset-2 col-sm-10"
                     *ngIf="!nachname.valid && nachname.touched">
                    Ein Nachname muss mit einem Buchstaben oder einer Ziffer
                    beginnen.
                </div>
            </div>
            
            <div class="form-group row"
                 [class.text-danger]="!vorname.valid && vorname.touched">
                <label class="col-sm-2 form-control-label">
                Vorname *
                </label>
                <div class="col-sm-10">
                    <input id="vornameInput"
                        placeholder="Vorname"
                        class="form-control"
                        type="search"
                        [ngFormControl]="vorname">
                </div>
                <div class="col-sm-offset-2 col-sm-10"
                     *ngIf="!vorname.valid && vorname.touched">
                    Ein Vorname muss mit einem Buchstaben oder einer Ziffer
                    beginnen.
                </div>
            </div>
                    
            <div class="form-group row"
                [class.text-danger]="!rabatt.valid && rabatt.touched">
                <label for="rabattInput" class="col-sm-2 form-control-label">
                    Rabatt *
                </label>
                <div class="col-sm-10">
                    <input id="rabattInput"
                        placeholder="Rabatt in Prozent, z.B. 5.67"
                        required
                        class="form-control"
                        type="search"
                        [ngFormControl]="rabatt"/>
                </div>
                <div class="col-sm-offset-2 col-sm-10"
                    *ngIf="!rabatt.valid && rabatt.touched">
                    Ein Rabatt muss in Prozent eingegeben werden, z.B. 5.67
                </div>
            </div>
                      
            <!-- Fuer DatePicker, Rating usw. gibt es noch keine brauchbaren
                 AngularJS-Direktiven auf Basis von Bootstrap -->
            
            <div class="form-group row">
                <div class="col-sm-offset-2 col-sm-10">
                    <button class="btn btn-primary" (click)="update()"
                            [disabled]="form.pristine || !form.valid">
                        <i class="fa fa-check"></i> &nbsp; Stammdaten aktualisieren
                    </button>
                </div>
            </div>
        </form>
    `
})
export default class Stammdaten implements OnInit {
    // <stammdaten [kunde]="...">
    @Input() kunde: Kunde;

    form: ControlGroup;
    nachname: Control;
    vorname: Control;
    rabatt: Control;
    constructor(
        private _formBuilder: FormBuilder,
        private _kundenService: KundenService, private _router: Router) {
        console.log('Stammdaten.constructor()');
    }

    /**
     * Das Formular als Gruppe von Controls initialisieren und mit den
     * Stammdaten des zu &auml;ndernden Kunden vorbelegen.
     */
    ngOnInit(): void {
        console.log('Stammdaten.ngOnInit(): kunde=', this.kunde);

        // Definition und Vorbelegung der Eingabedaten
        this.nachname =
            new Control(this.kunde.identity.nachname, KundeValidator.nachname);
        this.vorname = new Control(this.kunde.identity.vorname);
        this.rabatt = new Control(this.kunde.rabatt);
        this.form = this._formBuilder.group({
            // siehe ngFormControl innerhalb von @Component({template: `...`})
            'nachname': this.nachname,
            'vorname': this.vorname,
            'rabatt': this.rabatt
        });
    }

    /**
     * Die aktuellen Stammdaten f&uuml;r das angezeigte Kunden-Objekt
     * zur&uuml;ckschreiben.
     * @return false, um das durch den Button-Klick ausgel&ouml;ste Ereignis
     *         zu konsumieren.
     */
    @log
    update(): boolean {
        if (this.form.pristine) {
            console.log('Stammdaten.update(): keine Aenderungen');
            return;
        }

        if (isBlank(this.kunde)) {
            console.error('Stammdaten.update(): kunde === null/undefined');
            return;
        }

        // rating, preis und rabatt koennen im Formular nicht geaendert werden
        this.kunde.updateStammdaten(
            this.nachname.value, this.vorname.value, this.kunde.kategorie,
            this.kunde.newsletter, parseFloat(this.rabatt.value),
            this.kunde.umsatz, this.kunde.agbAkzeptiert,
            this.kunde.bemerkungen);
        console.log('Stammdaten.update(): kunde=', this.kunde);

        const successFn: () => void = () => {
            console.log(
                /* tslint:disable:max-line-length */
                `Stammdaten.update(): successFn: navigate: ${APP_ROUTES.homeDef.name}`);
            /* tslint:enable:max-line-length */
            this._router.navigate([APP_ROUTES.homeDef.name]);
        };
        this._kundenService.update(this.kunde, successFn, null);

        // damit das (Submit-) Ereignis konsumiert wird und nicht an
        // uebergeordnete Eltern-Komponenten propagiert wird bis zum
        // Refresh der gesamten Seite
        return false;
    }

    toString(): String { return 'Stammdaten'; }
}
