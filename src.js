import {Decimal} from "./decimal.js";
import {CurrencyUnits} from "./currencyunits.js";


/** 
 * A typedef necessary for documenting the return value of a function below...
 * @typedef {{"curr_units": CurrencyUnits, "remainder": Decimal}} Change;
*/
const USD = [
    {"name" : "20 dollar bill", "worth": new Decimal("20.00"), "qty": 1},
    {"name" : "10 dollar bill", "worth": new Decimal("10.00"), "qty": 1},
    {"name" : "5 dollar bill", "worth": new Decimal("5.00"), "qty": 1},
    {"name" : "2 dollar bill", "worth": new Decimal("2.00"), "qty": 1},
    {"name" : "1 dollar bill", "worth": new Decimal("1.00"), "qty": 1},
    {"name" : "half dollar", "worth": new Decimal("0.50"), "qty": 1},
    {"name" : "quarter", "worth": new Decimal("0.25"), "qty": 1},
    {"name" : "dime", "worth": new Decimal("0.10"), "qty": 1},
    {"name" : "nickel", "worth": new Decimal("0.05"), "qty": 1},
    {"name" : "penny", "worth": new Decimal("0.01"), "qty": 15}
];


let register = {
    "transactions" : 0,
    "sales_tax" : Decimal(".0925"), // stored as decimal
    "currency_code" : "USD",
    "max_amount" : 100,
    "min_amount" : Decimal("0.01"),
    "currencies" : {
        "USD" : new CurrencyUnits(USD)
    },
    // input:
    "sales_tax_input" : document.getElementById("sales_tax"),
    // output
    "counter": document.getElementById("transaction_counter"),
    "table" : document.getElementById("register_table"),
    "balance" : document.getElementById("register_balance"),
    // button
    "submit" : document.getElementById("submit_register_edit")
};


// divs
let subtotal_calc = {
    "div" : document.getElementById("subtotal_calculator"),
    // input
    "total_price" : document.getElementById("total_price"),
    // output fields
    "tax" : document.getElementById("tax"),
    "subtotal": document.getElementById("subtotal"),
    // button
    "submit": document.getElementById("submit_subtotal"),
};

let change_calc = {
    "div" : document.getElementById("change_calculator"),
    // input
    "total_paid" : document.getElementById("total_paid"),
    // output
    "change_awarded" : document.getElementById("change_awarded"),
    // button
    "submit" : document.getElementById("submit_cashtendered"),
};

let customer_change = {
    "div" : document.getElementById("customer_change"),
    // output
    "remainder" : document.getElementById("remainder"),
    "balance" : document.getElementById("change_paid_so_far"),
    // table
    "table" : document.getElementById("customer_change_table"),
    // button
    "submit" : document.getElementById("submit_change")
}


/**
 * A helper function for alerting user when their numerical inputs are not within bounds.
 */
function inputWithinNumericalBounds() {
    alert(`Must be a positive number from ${register.min_amount} to ${register.max_amount}.`);
}

/**
 * A helper function that gets the change units and modifies the existing currency supply
 * @param {Decimal} total_change
 * @return {Change} - the currency units and remainder
 */
function calculateCurrencyUnits(total_change) {
    let curr = register.currencies[register.currency_code];
    curr.sort_units()
    let change_units = new CurrencyUnits([]);

    for (let i = 0; i < curr.units.length; i++) {
        let unit = curr.units[i];
        let unit_amount = Decimal.min(unit.qty, total_change.divToInt(unit.worth));

        if (unit_amount > 0) {
            total_change = total_change.sub(unit.worth.mul(unit_amount));
            change_units.add_unit(unit.name, unit.worth, unit_amount.toNumber());
            unit.qty -= unit_amount.toNumber();
        }
    }
    return {"curr_units" : change_units, "remainder": total_change};
    
}


/**
 * Fills an existing table with rows for the corresponding currency units
 * @param {CurrencyUnits} currency 
 * @param {HTMLTableElement} table
 */
function fillCurrencyTable(currency, table) {
    let body = table.tBodies[0];

    for (let i = 0; i < currency.units.length; i++) {
        let unit = currency.units[i];
        let row = body.insertRow(-1);
        row.insertCell(-1).textContent = unit.name;
        row.insertCell(-1).textContent = unit.worth.toString();
        row.insertCell(-1).textContent = unit.qty.toString();
        row.insertCell(-1).textContent = unit.worth.mul(unit.qty).toFixed(2, Decimal.ROUND_UP).toString();
    }
}

/**
 * This listener updates the currency table with editable quantities.
 * @param {CurrencyUnits} currency 
 * @param {HTMLTableElement} table 
 */
function fillEditableCurrencyTable(currency, table) {
    let body = table.tBodies[0];

    while (body.rows.length > 0) {
        body.deleteRow(-1);
    }

    for (let i = 0; i < currency.units.length; i++) {
        let unit = currency.units[i];
        
        let row = body.insertRow();
        row.insertCell(-1).textContent = unit.name;
        row.insertCell(-1).textContent = unit.worth.toString();

        let input = document.createElement("input");
        input.type = "number";
        input.min = "0";
        input.max = "100";
        input.step = "1";
        input.defaultValue = unit.qty;
        
        row.insertCell(-1).appendChild(input);
        row.insertCell(-1).textContent = unit.worth.mul(unit.qty).toFixed(2, Decimal.ROUND_UP).toString();
    }
    register.counter.value = register.transactions.toString();
    register.balance.value = register.currencies[register.currency_code].get_balance();
}


/**
 * an event listener callback that calculates the subtotal when the
 * user clicks the subtotal button
 * @param {Event} event 
 */
function calculateSubtotal(event) {
    // get text from total price
    let total_price = Decimal(subtotal_calc.total_price.value);
    if (total_price.gte(register["min_amount"]) && total_price.lte(register["max_amount"])) {
        let tax_calculated = Decimal.mul(total_price, register.sales_tax);
        let subtotal = Decimal.add(total_price, tax_calculated).toFixed(2, Decimal.ROUND_UP);

        // update the fields with the values
        subtotal_calc.tax.value = tax_calculated.toString();
        subtotal_calc.subtotal.value = subtotal.toString();

        // unhide change calculation...
        change_calc.div.hidden = false;
        // automatically set the default value of the input for next form
        // to current subtotal - 0 change situation...
        change_calc.total_paid.value = subtotal_calc.subtotal.value.toString();
        subtotal_calc.submit.disabled = true;
    } else {
        inputWithinNumericalBounds(); // alert user that input is invalid...
    }
    event.preventDefault(); // prevent page from refreshing
 
} 

/**
 * A listener function that will calculate the total change owed and 
 * populate the change table as well as the remainder and change paid so far.
 * @param {Event} event 
 */
function calculateChange(event) {
    // get the total that customer pays
    let total_paid = Decimal(change_calc.total_paid.value);

    if (total_paid.gte(register["min_amount"]) && total_paid.lte(register["max_amount"])) {
        // if customer pays less than price, we go on to next transaction
        // store neither loses nor gain money
        // we go back to beginning... 
        //
        // otherwise, we see the change table...
        // if there aren't sufficient currency units... the remainder is filled out...
        let change_awarded = Decimal.sub(total_paid, Decimal(subtotal_calc.subtotal.value));
    
        if (change_awarded.lt(Decimal(0))) {
            alert("Total paid is insufficient. Next transaction!");
            change_calc.div.hidden = true;
            subtotal_calc.submit.disabled = false;
        } 
        else {
            change_calc.change_awarded.value = change_awarded;
            change_calc.submit.disabled = true;
            // show table
            customer_change.div.hidden = false;
            let changeUnit = calculateCurrencyUnits(change_awarded);
            customer_change.remainder.value = changeUnit.remainder;
            customer_change.balance.value = changeUnit.curr_units.get_balance();
            fillCurrencyTable(changeUnit.curr_units, customer_change.table);
            fillEditableCurrencyTable(register.currencies[register.currency_code], register.table);
        }
    } else {
        inputWithinNumericalBounds(); // alert user that input is invalid...
    }
    event.preventDefault(); // prevent page from refreshing
}

/**
 * Listener function that resets the program for another transaction once
 * @param {Event} event 
 */
function processTransaction(event) {
    console.log(customer_change.remainder);
    if (Decimal(customer_change.remainder.value).lte(0)) {
        register.transactions++;
    }

    // re-enable the buttons so user can repeat process
    subtotal_calc.submit.disabled = false;
    change_calc.submit.disabled = false;

    // hide the divs
    change_calc.div.hidden = true;
    customer_change.div.hidden = true;

    event.preventDefault(); // prevents the page from refreshing
}

/**
 * This button updates the amount in the register as well as the sales tax and currency used...
 * @param {Event} event 
 */
function updateRegister(event) {
    let body = register.table.tBodies[0];
    let code = register.currency_code;

    for (let i = 0; i < body.rows.length; i++) {
        let cells = body.rows[i].cells;
        let name = cells[0].textContent;
        let worth = cells[1].textContent;
        let qty = cells[2].firstChild.value;
        let total = cells[3].textContent;
        console.log(qty);
        register.currencies[code].modify_unit(name, name, Decimal(worth), parseInt(qty));
    }
    fillEditableCurrencyTable(register.currencies[register.currency_code], register.table);
    event.preventDefault(); // prevents the page from refreshing
}

// This allows me to display the register table at the very beginning
fillEditableCurrencyTable(register.currencies[register.currency_code], register.table);

// Attach event listeneres...
subtotal_calc.submit.addEventListener('click', calculateSubtotal);
change_calc.submit.addEventListener('click', calculateChange);
customer_change.submit.addEventListener('click', processTransaction);
register.submit.addEventListener('click', updateRegister);