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

import ArtikelsService from '../../service/artikels_service';
import Artikel from '../../model/artikel';
import ArtikelValidator from '../validator/artikels_validator';
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
                 [class.text-danger]="!bezeichnung.valid && bezeichnung.touched">
                <label for="bezeichnungInput" class="col-sm-2 form-control-label">
                    Bezeichnung *
                </label>
                <div class="col-sm-10">
                    <input id="bezeichnungInput"
                        placeholder="Artikelsname"
                        class="form-control"
                        autofocus
                        type="search"
                        [ngFormControl]="bezeichnung">
                </div>
                <div class="col-sm-offset-2 col-sm-10"
                     *ngIf="!bezeichnung.valid && bezeichnung.touched">
                    Ein Artikelname muss mit einem Buchstaben oder einer Ziffer
                    beginnen.
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
    // <stammdaten [buch]="...">
    @Input() artikel: Artikel;

    form: ControlGroup;
    bezeichnung: Control;
    constructor(
        private _formBuilder: FormBuilder,
        private _artikelsService: ArtikelsService, private _router: Router) {
        console.log('Stammdaten.constructor()');
    }

    /**
     * Das Formular als Gruppe von Controls initialisieren und mit den
     * Stammdaten des zu &auml;ndernden Buchs vorbelegen.
     */
    ngOnInit(): void {
        console.log('Stammdaten.ngOnInit(): artikel=', this.artikel);

        // Definition und Vorbelegung der Eingabedaten
        this.bezeichnung =
            new Control(this.artikel.bezeichnung, ArtikelValidator.apply);
        this.form = this._formBuilder.group({
            // siehe ngFormControl innerhalb von @Component({template: `...`})
            'bezeichnung': this.bezeichnung,
        });
    }

    /**
     * Die aktuellen Stammdaten f&uuml;r das angezeigte Buch-Objekt
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

        if (isBlank(this.artikel)) {
            console.error('Stammdaten.update(): artikel === null/undefined');
            return;
        }

        // rating, preis und rabatt koennen im Formular nicht geaendert werden
        this.artikel.updateStammdaten(
            this.bezeichnung.value, this.artikel.kategorie,
            this.artikel.ausgesondert, this.artikel.preis, this.artikel.rating);
        console.log('Stammdaten.update(): artikel=', this.artikel);

        const successFn: () => void = () => {
            console.log(
                /* tslint:disable:max-line-length */
                `Stammdaten.update(): successFn: navigate: ${APP_ROUTES.homeDef.name}`);
            /* tslint:enable:max-line-length */
            this._router.navigate([APP_ROUTES.homeDef.name]);
        };
        this._artikelsService.update(this.artikel, successFn, null);

        // damit das (Submit-) Ereignis konsumiert wird und nicht an
        // uebergeordnete Eltern-Komponenten propagiert wird bis zum
        // Refresh der gesamten Seite
        return false;
    }

    toString(): String { return 'Stammdaten'; }
}
