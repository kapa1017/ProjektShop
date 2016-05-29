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

import {Component, OnInit, ElementRef} from 'angular2/core';
import {CanActivate} from 'angular2/router';

import KundenService from '../../service/kunden_service';
import {isAdmin} from '../../../iam/iam';

/**
 * Komponente mit dem Tag &lt;liniendiagramm-bewertungen&gt; zur Visualisierung
 * von Bewertungen durch ein Liniendiagramm.
 */
@Component({
    selector: 'liniendiagramm-bewertungen',
    template: `
        <section id="stats">
            <canvas id="chart" width="1000" height="800"></canvas>
        </section>
    `
})
@CanActivate(isAdmin)
export default class LiniendiagrammBewertungen implements OnInit {
    constructor(
        private _buecherService: KundenService,
        private _elementRef: ElementRef) {
        console.log('LiniendiagrammBewertungen.constructor()');
    }

    /**
     * Das Liniendiagramm beim Tag mit der id <code>chart</code> einf&uuml;gen.
     * Erst in ngOnInit ist das Rendering des Templates abgeschlossen.
     */
    ngOnInit(): void {
        console.log('LiniendiagrammBewertungen.ngOnInit()');
        const chartElement: HTMLCanvasElement =
            this._elementRef.nativeElement.querySelector('#chart');
        this._buecherService.setLinearChart(chartElement);
    }
}
