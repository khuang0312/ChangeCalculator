"use strict";

import {Decimal} from "./decimal.js";


/**
 * A number, or a string containing a number.
 * @typedef {{"name": String, "worth": Decimal, "qty" : Number}} CurrencyUnit
 */
class CurrencyUnits {
    /**
     * Creates a currency with units.
     * @param {CurrencyUnit[]} units - the currency to be created
     */
    constructor(units) {
        this.units  = units;
    }

    /**
     * Returns the names of every unit in this currency
     * @returns {String[]}
     */
    get_unit_names() {
        return this.units.map(x => x.name);
    }

    /**
     * Returns the total balance of all the currency units
     * @returns {Decimal}
     */
    get_balance() {
        return this.units.reduce(
            (prev, curr) => Decimal.add(prev, curr.worth.mul(curr.qty)), 
            Decimal(0).toFixed(2, Decimal.ROUND_UP)
        );
    }

    /**
     * Returns an unit of currency
     * @param {String} unit_name 
     * @returns {CurrencyUnit}
     */
    get_unit(unit_name) {
        for (let i = 0; i < this.units.length; i++) {
            if (this.units[i].name == unit_name) {
                return this.units[i];
            }
        }
    }
    
    /**
     * Sorts currency units from greatest to least by worth.
     * If worth ties... then by alphabetical order...
     */
    sort_units() {
        this.units.sort(
            function (a, b) {
                if (a.worth.gt(b.worth)) {
                    return -1;
                } else if (a.worth.lt(b.worth)) {
                    return 1;
                } else if (a.name > b.name) { // a and b tie
                    return 1;
                } else if (a.name < b.name) {
                    return -1;
                } else {
                    return 0;
                }
        })
    }

    /**
     * Add a currency unit with the given name, worth, and quantity.
     * @param {String} unit_name 
     * @param {Decimal} worth 
     * @param {Number} qty 
     */
    add_unit(unit_name, worth, qty) {
        this.units.push({"name" : unit_name, "worth" : worth, "qty" : qty});
    }

    /**
     * Remove a currency unit with the given name.
     * @param {String} unit_name 
     */
    remove_unit(unit_name) {
        for (let i = 0; i < this.units.length; i++) {
            if (this.units[i].name == unit_name) {
                this.units = this.units.splice(i, 1);
            }
        }
    }

    /**
     * Modifies an existing currency unit. If the unit doesn't exist,
     * add the unit to the currency.
     * @param {String} unit_name 
     * @param {String} new_name 
     * @param {Decimal} new_worth
     * @param {Number} new_qty 
     */
    modify_unit(unit_name, new_name, new_worth, new_qty) {
        for (let i = 0; i < this.units.length; i++) {
            if (this.units[i].name == unit_name) {
                this.units[i].name = new_name;
                this.units[i].worth = new_worth;
                this.units[i].qty = new_qty;
                return;
            }
        }
        this.add_unit(new_name, new_worth, new_qty);
    }
}

export {CurrencyUnits};
