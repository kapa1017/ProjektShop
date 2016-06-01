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

import {Component} from 'angular2/core';

/**
 * Komponente f&uuml;r die Startseite mit dem Tag &lt;home&gt;.
 */
@Component({
    selector: 'home',
    template: `
        <div class="jumbotron">
            <h1>Home</h1>
            <h2>Die Heimat der SPA</h2>
        </div>
    `
})
export default class Home {
    constructor() { console.log('Home.constructor()'); }
}
