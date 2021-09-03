"use strict";

import {Decimal} from "./decimal.js";

// ERROR CHECKING HELPERS
// Placed up here so they're visible to classes below
/**
 * Helper function for CurrencyUnit that
 * checks if name is of type string. 
 * @param {String} name
 * @throws {TypeError} 
 */
 function checkName(name) {
    if (!(typeof(name) == "string") && !(name instanceof String)) {
        throw TypeError("TypeError: name should be of type String!");
    }
}

/**
 * Helper function for CurrencyUnit checking if worth is 
 * a non-zero, positive, finite Decimal.
 * @param {Decimal} worth 
 * @throws {TypeError}
 * @throws {RangeError}
 */
function checkWorth(worth) {
    if (!(worth instanceof Decimal)) {
        throw TypeError("TypeError: worth should be of type Decimal!");
    } 
    // check if worth is non-zero and positive and finite
    if (!(Decimal.sign(worth) == 1 && worth.isFinite())) { 
        throw RangeError(
            "RangeError: worth should be non-zero, positive, and finite!");
    }
}

/**
 * Helper function for CurrencyUnit that 
 * checks if qty is nonnegative, finite, whole Number
 * @param {Number} qty 
 */
function checkQty(qty) {
    if (typeof(qty) != "number") {
        throw TypeError("TypeError: qty should be of type Number!");
    }

    // check if qty is nonnegative integer
    if (!(Number.isSafeInteger(qty) && qty >= 0)) {
        throw RangeError(
            "RangeError: qty should be from 0 to Number.MAX_SAFE_INTEGER!");
    }
}

/**
 * A helper function for CurrencyUnits checking if an given
 * object is a CurrencyUnit. It's valid if the object
 * has a valid name, worth, and qty.
 * @param {obj} Object
 */
 function isCurrencyUnit(obj) {
    let members = ["name", "worth", "qty"]
    // (CurrencyUnit or CurrencyUnit-similar object?
    let isCUObj = (obj instanceof CurrencyUnit ? true: false);
 
    for (let i = 0; i < members.length; i++) {
        let member = members[i];
        // CurrencyUnit properties have the underscore
        // CurrencyUnit-similar objects don't...
        // However... we can access them with setters and getters
        // without the underscore
        let prop_name = (isCUObj ? "_" + member : member)
        if (!obj.hasOwnProperty(prop_name)) {
            throw TypeError(`TypeError: Missing ${member} attribute!`);
        }
        switch (member) {
            case "name":
                checkName(obj[prop_name]);
                break;
            case "worth":
                checkWorth(obj[prop_name]);
                break;
            case "qty":
                checkQty(obj[prop_name]);
                break;
        }
    }
}

/**
 * A helper function for CurrencyUnits to check if units array
 * contains objects supported by the class methods
 * @param {Array} units 
 */
function checkUnits(units) {
    if (!Array.isArray(units)) { // isArray returns false on null and undefined
        throw new TypeError(
            "TypeError: CurrencyUnits must be constructed with an Array.");
    }
    // checks if each object in array can work as a valid currency unit...
    // I wanted to allow objects that have the members of CurrencyUnit
    // but aren't CurrencyUnit objects (no instanceof CurrencyUnit check)
    units.forEach(element => {
        isCurrencyUnit(element);
    });
}


class CurrencyUnit {
    /**
     * Constructs a currency unit object.
     * @param {String} name - the name of the currency unit
     * @param {Decimal} worth - A positive worth of the currency unit
     * @param {Number} qty - A nonnegative number representing the quantity...
     * 
     * @throws {TypeError} If arguments are not the above types.
     * @throws {RangeError} worth must be from 0.01 to before its exponent exceeds Decimial.maxE
     * @throws {RangeError} qty must be from 0 to Number.MAX_SAFE_INTEGER
     */
    constructor(name, worth, qty) {
        checkName(name);
        checkWorth(worth);
        checkQty(qty);
        this._name = name;  // no simple way of making members private
        this._worth = worth;
        this._qty = qty;
        Object.seal(this); 
    }
    
    // These getters and setters provide an interface that checks for
    // errors as user modifies these objects...

    // getters
    get name() { return this._name; }
    get worth() { return this._worth; }
    get qty() { return this._qty; }

    // setters
    set name(new_name) {
        checkName(new_name);
        this._name = new_name;
    }
    set worth(new_worth) {
        checkWorth(new_worth);
        this._worth = new_worth;
    }
    set qty(new_qty) {
        checkQty(new_qty);
        this._qty = new_qty;
    }
}


class CurrencyUnits {
    /**
     * Creates a currency with units.
     * @param {Array} units - the currency to be created
     */
    constructor(units = []) {
        checkUnits(units);
        this._units = units;
    }

    get units() {
        return this._units;
    }

    set units(units) {
        checkUnits(units);
        this._units = units;
    }

    /**
     * Returns the names of every unit in this currency
     * @returns {String[]}
     */
    get_unit_names() {
        checkUnits(this._units);
        return this._units.map(x => x.name);
    }

    /**
     * Returns the total balance of all the currency units
     * Does not round to any precision...
     * @returns {Decimal}
     */
    get_balance() {
        checkUnits(this._units);
        return this._units.reduce(
            (prev, curr) => Decimal.add(prev, curr.worth.mul(curr.qty)), 
            Decimal(0)
        );
    }

    /**
     * Returns an unit of currency. If it's not there... return undefined.
     * @param {String} name 
     * @returns {CurrencyUnit}
     */
    get_unit(name) {
        checkName(name);
        checkUnits(this._units);
        for (let i = 0; i < this._units.length; i++) {
            if (this._units[i].name == name) {
                return this._units[i];
            }
        }
        return undefined;
    }
    
    /**
     * Sorts currency units from greatest to least by worth.
     * If worth ties... then by alphabetical order...
     */
    sort_units() {
        // sort method sorts in place
        // Having it automatically called might just present issues...
        // Plus... sorting is only really necessary once...
        checkUnits(this._units);
        this._units.sort(
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
        });
    }

    /**
     * Add an currency unit. If a unit with the same name exists,
     * modify the existing unit. Otherwise, add it to the currency.
     * @param {String} name 
     * @param {Decimal} unit_worth
     * @param {Number} unit_qty 
     */
    add_unit(name, worth, qty) {
        checkUnits(this._units);
        let cu = new CurrencyUnit(name, worth, qty);
        // find a corresponding currency unit to override
        for (let i = 0; i < this._units.length; i++) {
            if (this._units[i].name == name) {
                this._units[i] = cu;
                return;
            }
        }
        this._units.push(cu);
    }

    /**
     * Remove a currency unit with the given name.
     * @param {String} name 
     */
    remove_unit(name) {
        checkUnits(this._units);
        checkName(name);
        for (let i = 0; i < this._units.length; i++) {
            if (this._units[i].name == name) {
               this.units.splice(i, 1);
            }
        }
    }

    /**
     * Returns the change units and modifies the currency units
     * @param {Decimal} total_change
     * @typedef {{"curr_units": CurrencyUnits, "remainder": Decimal}} Change;
     * @return {Change} currency_units and remainder
     */
    calculateChangeUnits(total_change) {
        this.sort_units();
        let change_units = new CurrencyUnits([]);
        for (let i = 0; i < this._units.length; i++) {
            let unit = this._units[i];
            let unit_amount = Decimal.min(unit.qty, total_change.divToInt(unit.worth));

            if (unit_amount > 0) {
                total_change = total_change.sub(unit.worth.mul(unit_amount));
                change_units.add_unit(unit.name, unit.worth, unit_amount.toNumber());
                unit.qty -= unit_amount.toNumber();
            }
        }
        return {"curr_units" : change_units, "remainder": total_change};
    }
}

export {CurrencyUnits, CurrencyUnit};


