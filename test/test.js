import mocha from "mocha"
const {describe, it} = mocha
import {assert, expect} from "chai"

import {Decimal} from '../decimal.js'
import { CurrencyUnits, CurrencyUnit } from '../currencyunits.js';

describe("CurrencyUnitTestSuite", () => {
    it("CurrencyUnitDoesNotThrowTypeErrorWhenConstructedWithStringPrimitive", () => {
        assert.doesNotThrow(() => {
            new CurrencyUnit("", new Decimal("0.01"), 1);
        }, TypeError);
    });

    it("CurrencyUnitDoesNotThrowTypeErrorWhenConstructedWithStringObject", () => {
        assert.doesNotThrow(() => {
            new CurrencyUnit(new String(), new Decimal("0.01"), 1);
        }, TypeError);
    });

    it("CurrencyUnitThrowsTypeErrorWhenConstructedWithNumberName", () => {
        assert.throws(() => {
            new CurrencyUnit(1, new Decimal("0.01"), 1)
        }, TypeError, "TypeError: name should be of type String!");
    });

    it("CurrencyUnitThrowsTypeErrorWhenConstructedWithNullName", () => {
        assert.throws(() => {
            new CurrencyUnit(null, new Decimal("0.01"), 1)
        }, TypeError, "TypeError: name should be of type String!");
    });

    it("CurrencyUnitThrowsTypeErrorWhenConstructedWithUndefinedName", () => {
        assert.throws(() => {
            new CurrencyUnit(undefined, new Decimal("0.01"), 1)
        }, TypeError, "TypeError: name should be of type String!");
    });

    it("CurrencyUnitThrowsTypeErrorWhenConstructedWithNumberWorth", () => {
        assert.throws(() => {
            new CurrencyUnit("1 dollar bill", 0.01, 1)
        }, TypeError, "TypeError: worth should be of type Decimal!");
    });

    it("CurrencyUnitThrowsTypeErrorWhenConstructedWithStringQty", () => {
        assert.throws(() => {
            new CurrencyUnit("1 dollar bill", new Decimal("0.01"), "1")
        }, TypeError,"TypeError: qty should be of type Number!");   
    });

    it("CurrencyUnitThrowsTypeErrorWhenConstructedWithBigIntegerQty", () => {
        assert.throws(() => {
            new CurrencyUnit(
                "1 dollar bill", new Decimal("0.01"), 
                BigInt("0b11111111111111111111111111111111111111111111111111111")
            );
        }, TypeError, "TypeError: qty should be of type Number!");
    });    

    it("CurrencyUnitThrowsRangeErrorWhenConstructedWithNonintegerQty", () => {
        assert.throw(() => {
            new CurrencyUnit("1 dollar bill", new Decimal("0.01"), 0.01);
        }, RangeError, 
        "RangeError: qty should be from 0 to Number.MAX_SAFE_INTEGER!");
    });

    it("CurrencyUnitThrowsRangeErrorWhenConstructedWithNegativeQty", () => {
        assert.throw(() => {
            new CurrencyUnit("1 dollar bill", new Decimal("0.01"), -1);
        }, RangeError, 
        "RangeError: qty should be from 0 to Number.MAX_SAFE_INTEGER!");
    });

    it("CurrencyUnitThrowsRangeErrorWhenConstructedWithQtyAboveMaxInteger", () => {
        assert.throw(() => {
            new CurrencyUnit("1 dollar bill", new Decimal("0.01"), Number.MAX_SAFE_INTEGER + 1);
        }, RangeError, 
        "RangeError: qty should be from 0 to Number.MAX_SAFE_INTEGER!");
    });

    it("CurrencyUnitThrowsRangeErrorWhenConstructedWithNegativeWorth", () => {
        assert.throw(() => {
            new CurrencyUnit("1 dollar bill", new Decimal("-0.01"), 0);
        }, RangeError, 
        "RangeError: worth should be non-zero, positive, and finite!");
    });

    it("CurrencyUnitThrowsRangeErrorWhenConstructedWithZeroWorth", () => {
        assert.throw(() => {
            new CurrencyUnit("1 dollar bill", new Decimal("0.00"), 0);
        }, RangeError, 
        "RangeError: worth should be non-zero, positive, and finite!");
    });

    it("CurrencyUnitThrowsRangeErrorWhenConstructedWithPositiveInfiniteValues", () => {
        assert.throw(() => {
            new CurrencyUnit("1 dollar bill", new Decimal("9.999e9000000000000001"), 0);
        }, RangeError, 
        "RangeError: worth should be non-zero, positive, and finite!");
    });

    it("CurrencyUnitThrowsTypeErrorWhenSettingNameToNonstring", () => {
        assert.throw(() => {
            let c = new CurrencyUnit("1 dollar bill", new Decimal("1.00"), 1);
            c.name = 2;
        }, TypeError, 
        "TypeError: name should be of type String!");
    });

    it("CurrencyUnitThrowsTypeErrorWhenSettingWorthToNondecimal", () => {
        assert.throw(() => {
            let c = new CurrencyUnit("1 dollar bill", new Decimal("1.00"), 1);
            c.worth = 5;
        }, TypeError, 
        "TypeError: worth should be of type Decimal!");
    });

    it("CurrencyUnitThrowsRangeErrorWhenSettingWorthToZeroDecimal", () => {
        assert.throw(() => {
            let c = new CurrencyUnit("1 dollar bill", new Decimal("1.00"), 1);
            c.worth = new Decimal("0.00");
        }, RangeError, 
        "RangeError: worth should be non-zero, positive, and finite!");
    });

    it("CurrencyUnitThrowsRangeErrorWhenSettingWorthToNegativeDecimal", () => {
        assert.throw(() => {
            let c = new CurrencyUnit("1 dollar bill", new Decimal("1.00"), 1);
            c.worth = new Decimal("-0.01");
        }, RangeError, 
        "RangeError: worth should be non-zero, positive, and finite!");
    });

    it("CurrencyUnitThrowsRangeErrorWhenSettingWorthToPositiveInfiniteDecimal", () => {
        assert.throw(() => {
            let c = new CurrencyUnit("1 dollar bill", new Decimal("1.00"), 1);
            c.worth = new Decimal("9.999e9000000000000001");
        }, RangeError, 
        "RangeError: worth should be non-zero, positive, and finite!");
    });

    it("CurrencyUnitThrowsRangeErrorWhenSettingQtyToDecimal", () => {
        assert.throw(() => {
            let c = new CurrencyUnit("1 dollar bill", new Decimal("1.00"), 1);
            c.qty = new Decimal("9.999e9000000000000001");
        }, TypeError, 
        "TypeError: qty should be of type Number!");
    });

    it("CurrencyUnitThrowsRangeErrorWhenSettingQtyToNegativeNumber", () => {
        assert.throw(() => {
            let c = new CurrencyUnit("1 dollar bill", new Decimal("1.00"), 1);
            c.qty = -1;
        }, RangeError, 
        "RangeError: qty should be from 0 to Number.MAX_SAFE_INTEGER!");
    });

    it("CurrencyUnitThrowsRangeErrorWhenSettingQtyToNonwholeNumber", () => {
        assert.throw(() => {
            let c = new CurrencyUnit("1 dollar bill", new Decimal("1.00"), 1);
            c.qty = 0.01;
        }, RangeError, 
        "RangeError: qty should be from 0 to Number.MAX_SAFE_INTEGER!");
    });

    it("CurrencyUnitThrowsRangeErrorWhenSettingQtyToPositiveInfinity", () => {
        assert.throw(() => {
            let c = new CurrencyUnit("1 dollar bill", new Decimal("1.00"), 1);
            c.qty = Number.MAX_SAFE_INTEGER + 1;
        }, RangeError, 
        "RangeError: qty should be from 0 to Number.MAX_SAFE_INTEGER!");
    });
});


describe("CurrencyUnitsTestSuite", () => {
    it("CurrencyUnitsConstructsWithNoArrayAsArg", () => {
        let curr = new CurrencyUnits();
        assert.isArray(curr.units);
        assert.isEmpty(curr.units);
    })

    it("CurrencyUnitsConstructsWithEmptyArray", () => {
        let curr = new CurrencyUnits([]);
        assert.isArray(curr.units);
        assert.isEmpty(curr.units);
    })

    // Other currency unit methods rely on an array to exist...
    it("CurrencyUnitsThrowsTypeErrorWhenConstructedWithNull", () => {
        assert.throws(
            () => { let curr = new CurrencyUnits(null); },
            TypeError,
            "TypeError: CurrencyUnits must be constructed with an Array."
        );
    })

    it("CurrencyUnitsThrowsTypeErrorWhenConstructedWithNonCurrencyUnits", () => {
        assert.throws(
            () => { let curr = new CurrencyUnits([1,2,3,4,5]); },
            TypeError
        );
    })

    it("CurrencyUnitsConstructesWithArrayOfObjectsSimilarToCurrencyUnits", () => {
        assert.doesNotThrow(
            () => { 
                let USD = [
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
                let curr = new CurrencyUnits(USD); },
            TypeError
        );
    })

    it("CurrencyUnitsConstructesWithArrayOfCurrencyUnits", () => {
        assert.doesNotThrow(
            () => { 
                let arr = [
                    new CurrencyUnit("1 dollar bill", new Decimal(1), 2),
                    new CurrencyUnit("2 dollar bill", new Decimal(2), 2)
                ];
                let curr = new CurrencyUnits(arr); 
            },
            TypeError
        );
    })

    it("CurrencyUnitsGetUnitNamesReturnsNamesInCurrency", () => {
        let arr = [
            new CurrencyUnit("5 dollar bill", new Decimal(5), 2),
            new CurrencyUnit("1 dollar bill", new Decimal(1), 2),
            new CurrencyUnit("2 dollar bill", new Decimal(2), 2)
        ];
        let curr = new CurrencyUnits(arr); 
        assert.sameOrderedMembers(curr.get_unit_names(),
            ["5 dollar bill", "1 dollar bill", "2 dollar bill"]);
    })

    it("CurrencyUnitsGetBalance", () => {
        let arr = [
            new CurrencyUnit("5 dollar bill", new Decimal(5), 2),
            new CurrencyUnit("1 dollar bill", new Decimal(1), 2),
            new CurrencyUnit("2 dollar bill", new Decimal(2), 2),
            new CurrencyUnit("penny", new Decimal("0.01"), 25)
        ];
        let curr = new CurrencyUnits(arr); 
        assert.isTrue(
            curr.get_balance().cmp(new Decimal("16.25")) == 0)
    })

    it("CurrencyUnitsGetBalanceWithoutRounding", () => {
        let arr = [
            new CurrencyUnit("5 dollar bill", new Decimal(5), 2),
            new CurrencyUnit("1 dollar bill", new Decimal(1), 2),
            new CurrencyUnit("2 dollar bill", new Decimal(2), 2),
            new CurrencyUnit("penny", new Decimal("0.01"), 25),
            new CurrencyUnit("superpenny", new Decimal("0.001"), 26)
        ];
        let curr = new CurrencyUnits(arr); 
        assert.isTrue(
            curr.get_balance().cmp(new Decimal("16.276")) == 0);
    });
    
    it("CurrencyUnitsSortCurrencyUnitsByGreatestWorthToLeast", () => {
        let arr = [
            new CurrencyUnit("5 dollar bill", new Decimal(5), 2),
            new CurrencyUnit("1 dollar bill", new Decimal(1), 2),
            new CurrencyUnit("2 dollar bill", new Decimal(2), 2),
            new CurrencyUnit("penny", new Decimal("0.01"), 25),
            new CurrencyUnit("superpenny", new Decimal("0.001"), 26)
        ];
        let curr = new CurrencyUnits(arr); 
        curr.sort_units();
        assert.sameOrderedMembers(curr.get_unit_names(),
            ["5 dollar bill", "2 dollar bill", 
            "1 dollar bill", "penny", "superpenny"]);
    });

    it("CurrencyUnitsNodifiesExistingUnitWhenAddingUnitWithSameName", () => {
        let arr = [
            new CurrencyUnit("5 dollar bill", new Decimal(5), 2),
            new CurrencyUnit("1 dollar bill", new Decimal(1), 2),
            new CurrencyUnit("2 dollar bill", new Decimal(2), 2),
            new CurrencyUnit("penny", new Decimal("0.01"), 25),
            new CurrencyUnit("superpenny", new Decimal("0.001"), 26)
        ];
        let curr = new CurrencyUnits(arr); 
        curr.add_unit("superpenny", new Decimal(10000000), 5000000);
        let sp = curr.get_unit("superpenny");
        assert.isTrue(curr.units.length == 5);
        assert.isTrue(sp.name == "superpenny");
        assert.isTrue(sp.worth.cmp(new Decimal(10000000)) == 0);
        assert.isTrue(sp.qty == 5000000);
    });

    it("CurrencyUnitsAddsNewUnitWhenNoExistingUnitHasSameName", () => {
        let arr = [
            new CurrencyUnit("5 dollar bill", new Decimal(5), 2),
            new CurrencyUnit("1 dollar bill", new Decimal(1), 2),
            new CurrencyUnit("2 dollar bill", new Decimal(2), 2),
            new CurrencyUnit("penny", new Decimal("0.01"), 25),
        ];
        let curr = new CurrencyUnits(arr); 
        curr.add_unit("superpenny", new Decimal(10000000), 5000000);
        let sp = curr.get_unit("superpenny");
        assert.isTrue(curr.units.length == 5);
        assert.isTrue(sp.name == "superpenny");
        assert.isTrue(sp.worth.cmp(new Decimal(10000000)) == 0);
        assert.isTrue(sp.qty == 5000000);
    });

    it("CurrencyUnitsAddsNewUnitWhenNoExistingUnitHasSameName", () => {
        let arr = [
            new CurrencyUnit("5 dollar bill", new Decimal(5), 2),
            new CurrencyUnit("1 dollar bill", new Decimal(1), 2),
            new CurrencyUnit("2 dollar bill", new Decimal(2), 2),
            new CurrencyUnit("penny", new Decimal("0.01"), 25),
        ];
        let curr = new CurrencyUnits(arr); 
        curr.add_unit("superpenny", new Decimal(10000000), 5000000);
        let sp = curr.get_unit("superpenny");
        assert.isTrue(curr.units.length == 5);
        assert.isTrue(sp.name == "superpenny");
        assert.isTrue(sp.worth.cmp(new Decimal(10000000)) == 0);
        assert.isTrue(sp.qty == 5000000);
    });

    it("CurrencyUnitsAddUnitThrowsTypeErrorWhenGivenIntegerName", () => {
        assert.throws(
            () => {
                let arr = [
                    new CurrencyUnit("5 dollar bill", new Decimal(5), 2),
                    new CurrencyUnit("1 dollar bill", new Decimal(1), 2),
                    new CurrencyUnit("2 dollar bill", new Decimal(2), 2),
                    new CurrencyUnit("penny", new Decimal("0.01"), 25),
                ];
                let curr = new CurrencyUnits(arr); 
                curr.add_unit(1, new Decimal(10000000), 5000000);
            },
            TypeError,
            "TypeError: name should be of type String!"
        );
    });

    it("CurrencyUnitsRemovesExistingUnit", () => {
        let arr = [
            new CurrencyUnit("5 dollar bill", new Decimal(5), 2),
            new CurrencyUnit("1 dollar bill", new Decimal(1), 2),
            new CurrencyUnit("2 dollar bill", new Decimal(2), 2),
            new CurrencyUnit("penny", new Decimal("0.01"), 25)
        ];
        let curr = new CurrencyUnits(arr); 
        curr.remove_unit("penny");
        assert.sameMembers(
            curr.get_unit_names(),
            ["5 dollar bill", "1 dollar bill", "2 dollar bill"]);
    });

    it("CurrencyUnitsRemovesNonexistentUnit", () => {
        let arr = [
            new CurrencyUnit("5 dollar bill", new Decimal(5), 2),
            new CurrencyUnit("1 dollar bill", new Decimal(1), 2),
            new CurrencyUnit("2 dollar bill", new Decimal(2), 2),
            new CurrencyUnit("penny", new Decimal("0.01"), 25)
        ];
        let curr = new CurrencyUnits(arr); 
        curr.remove_unit("superpenny");
        assert.sameMembers(
            curr.get_unit_names(),
            ["5 dollar bill", "1 dollar bill", "2 dollar bill", "penny"]);
    });

    it("CurrencyUnitsCalculateChangeUnitsWithEnoughChange", () => {
        let USD = [
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
        let curr = new CurrencyUnits(USD); 
        let change = curr.calculateChangeUnits(new Decimal("2.25"));       
        assert.equal(curr.get_unit("2 dollar bill").qty, 0);
        assert.equal(curr.get_unit("quarter").qty, 0);
        assert.isTrue(
            change.curr_units.get_balance().cmp(Decimal("2.25")) == 0);
        assert.isTrue(change.remainder.cmp(Decimal(0)) == 0);
    });

    it("CurrencyUnitsCalculateChangeUnitsWithNotEnoughChange", () => {
        let USD = [
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
        let curr = new CurrencyUnits(USD); 
        let change = curr.calculateChangeUnits(new Decimal("39.06"));
        assert.isTrue(
            change.curr_units.get_balance().cmp(Decimal("39.05")) == 0);
        assert.isTrue(change.remainder.cmp(Decimal("0.01")) == 0);
    });
});