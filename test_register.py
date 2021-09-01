from typing import Type
from currency import Currency
from currencyunit import CurrencyUnit
import pytest  # I wanted to try learning a new unit test library

from decimal import Decimal
import decimal
import register


# Testing assumptions about Decimal library
def test_decimal_converts_string_properly():
    a = Decimal('8.67').compare(Decimal((0, (8, 6, 7), -2)))
    # compare method returns Decimal('0') if a and b are equal
    # compare should be used to comply with IEE 854
    assert a == Decimal('0')

    a = Decimal('10.67').compare(Decimal((0, (1, 0, 6, 7), -2)))
    assert a == Decimal('0')

    a = Decimal('10000001.67').compare(
        Decimal((0, (1, 0, 0, 0, 0, 0, 0, 1, 6, 7), -2)))
    assert a == Decimal('0')


def test_decimal_converts_string_edge_cases_properly():
    a = Decimal('0.67').compare(Decimal((0, (6, 7), -2)))
    assert a == Decimal('0')

    a = Decimal('.67').compare(Decimal((0, (6, 7), -2)))
    assert a == Decimal('0')

    a = Decimal('0.6').compare(Decimal((0, (6,), -1)))
    assert a == Decimal('0')

    a = Decimal('.6').compare(Decimal((0, (6,), -1)))
    assert a == Decimal('0')

    a = Decimal('3.00').compare(Decimal((0, (3,), 0)))
    assert a == Decimal('0')

    a = Decimal('3.0').compare(Decimal((0, (3,), 0)))
    assert a == Decimal('0')

    a = Decimal('3.').compare(Decimal((0, (3,), 0)))
    assert a == Decimal('0')

    a = Decimal('0.0').compare(Decimal((0, (0,), 0)))
    assert a == Decimal('0')


def test_decimal_conversion_of_illegal_things_raises_error():
    # Constructing Decimal objects from floats will bring over the inexactness
    # of the binary representation of the original number
    a = Decimal(0.67).compare(Decimal((0, (6, 7), -2)))
    # this checks to see that they're unequal
    assert a != Decimal('0')

    # Constructing Decimal objects from things that can't be numbers won't work
    with pytest.raises(decimal.InvalidOperation):
        Decimal('.')
    with pytest.raises(decimal.InvalidOperation):
        Decimal('0..')
    with pytest.raises(decimal.InvalidOperation):
        Decimal('A')


def test_zero_change_given_when_purchase_and_payment_equal_one_another():
    # We're using strings to construct the Decimal objects to avoid
    # errors from floats
    total_purchase = Decimal('1.17')
    total_payment = Decimal('1.17')
    a = register.calculate_change(total_payment, total_purchase)
    assert a == Decimal('0')


def test_positive_change_given_when_payment_exceeds_purchase():
    total_payment = Decimal('1.17')
    total_purchase = Decimal('1.16')
    a = register.calculate_change(total_payment, total_purchase).compare(
        Decimal('0.01'))
    assert a == Decimal('0')


def test_negative_change_given_when_payment_insufficient_for_purchase():
    total_payment = Decimal('0.00')
    total_purchase = Decimal('1.16')
    a = register.calculate_change(total_payment, total_purchase).compare(
        Decimal('-1.16'))
    assert a == Decimal('0')


def test_change_denominations_works_properly():
    assert register.change_denominations(Decimal('20.02')) ==\
        (1, 0, 0, 0, 0, 0, 0, 0, 0, 2)
    assert register.change_denominations(Decimal('18.65')) ==\
        (0, 1, 1, 1, 1, 1, 0, 1, 1, 0)


def test_register():
    '''This function tests the creation of a Register object.
    '''
    register.Register({})
    register.Register({"USD": Currency()})

    with pytest.raises(TypeError):
        register.Register([])

    # not all string keys
    with pytest.raises(TypeError):
        register.Register({
            "USD": {2: CurrencyUnit("2.0", 2)}
        })

    # a empty string key
    with pytest.raises(TypeError):
        register.Register({
            "USD": {"": CurrencyUnit("2.0", 2)}
        })

    # a whitespace key
    with pytest.raises(TypeError):
        register.Register({
            "USD": {" ": CurrencyUnit("2.0", 2)}
        })

    # a non currency value
    with pytest.raises(TypeError):
        register.Register({
            "USD": {"2 dollar bill": 2.0}
        })


def test_register_add_currency_with_invalid_currency_name():
    r1 = register.Register({})

    with pytest.raises(TypeError):  # currency name not string
        r1.add_currency(2, Currency())
    with pytest.raises(ValueError):  # whitespace currency name
        r1.add_currency(" ", Currency())
    with pytest.raises(ValueError):  # blank currency name
        r1.add_currency("", Currency())

    r1.add_currency("USD", Currency())  # adding an empty currency
    assert len(r1.currencies) == 0


def test_register_add_currency_with_invalid_currency_unit_initialization():
    r1 = register.Register({})
    with pytest.raises(TypeError):  # invalid currency unit worth
        r1.add_currency("USD",
                        Currency({"2 dollar bill": CurrencyUnit(2, 1)}))
    with pytest.raises(TypeError):  # invalid currency unit count
        r1.add_currency("USD",
                        Currency({"2 dollar bill": CurrencyUnit("2.00", "1")}))
    with pytest.raises(ValueError):  # zero or less currency unit count
        r1.add_currency("USD",
                        Currency({"2 dollar bill": CurrencyUnit("2.00", 0)}))
    with pytest.raises(ValueError):  # zero or less currency unit count
        r1.add_currency("USD",
                        Currency({"2 dollar bill": CurrencyUnit("2.00", -1)}))


def test_register_add_currency_with_proper_currency_units():
    # empty register, add regular currency
    r1 = register.Register({})
    r1.add_currency("USD",
                    Currency({"2 dollar bill": CurrencyUnit("2.00", 1)}))
    assert len(r1.currencies) == 1

    # nonempty register, add new currency
    r1.add_currency("NT", Currency({"1 dollar bill": CurrencyUnit("1.00", 1)}))
    assert len(r1.currencies) == 2

    # nonempty register, add currency that shares the same name
    r1.add_currency("USD",
                    Currency({"100 dollar bill": CurrencyUnit("100.00", 2)}))
    a = r1.currencies["USD"]
    assert len(a.currency_units) == 1
    a = a.currency_units["100 dollar bill"]
    assert a.worth.compare(Decimal("100.00")) == Decimal(0) and a.count == 2
    assert len(r1.currencies) == 2


def test_register_remove_currency():
    r1 = register.Register({
        "USD": Currency({"2 dollar bill": CurrencyUnit("2.00", 1)}),
        "NT": Currency({"1 dollar bill": CurrencyUnit("1.00", 2)})
    })
    with pytest.raises(TypeError):
        r1.remove_currency(2)
    a = r1.remove_currency("NT").currency_units["1 dollar bill"]
    assert a.worth.compare(Decimal("1.00")) == Decimal(0) and a.count == 2
    assert len(r1.currencies) == 1


def test_register_add_unit_to_currency():
    r1 = register.Register({
        "USD": Currency({"2 dollar bill": CurrencyUnit("2.00", 1)})})
    r1.add_unit_to_currency("USD", "1 dollar bill", "1.00", 19)
    assert len(r1.currencies["USD"].currency_units) == 2
    r1.add_unit_to_currency("NT", "50 dollar bill", "50.00", 67)
    assert len(r1.currencies) == 2

    r1.add_unit_to_currency("NT", "50 dollar bill", "20.00", 69)
    assert len(r1.currencies) == 2
    a = r1.currencies["NT"].currency_units["50 dollar bill"]
    assert a.count == 69 and a.worth.compare(
        Decimal("20.00")) == Decimal("0")

    with pytest.raises(TypeError):
        r1.add_unit_to_currency(12, "1 dollar bill", "1.00", 19)
    with pytest.raises(ValueError):
        r1.add_unit_to_currency(" ", "1 dollar bill", "1.00", 19)
    with pytest.raises(ValueError):
        r1.add_unit_to_currency("", "1 dollar bill", "1.00", 19)


def test_register_remove_unit_from_currency():
    r1 = register.Register({
        "USD": Currency({
            "2 dollar bill": CurrencyUnit("2.00", 2),
            "1 dollar bill": CurrencyUnit("1.00", 1)
            })})

    # proper removal
    a = r1.remove_unit_from_currency("USD", "1 dollar bill")
    assert a.count == 1 and a.worth.compare(Decimal("1.00")) == Decimal(0)
    assert len(r1.currencies["USD"].currency_units) == 1

    # removing from nonexistent currency
    a = r1.remove_unit_from_currency("NT", "1 dollar bill")
    assert a is None

    # removing nonexistent currency_unit from currency
    a = r1.remove_unit_from_currency("USD", "3 dollar bill")
    assert a is None

    # removal resulting in an empty currency object
    # doesn't automatically remove it
    a = r1.remove_unit_from_currency("USD", "2 dollar bill")
    assert a.count == 2 and a.worth.compare(Decimal("2.00")) == Decimal(0)
    assert "USD" in r1.currencies
    assert len(r1.currencies["USD"].currency_units) == 0


def test_register_change_denominations_enough_for_all_denominations():
    r1 = register.Register({
        "USD": Currency({
            "10 dollar bill": CurrencyUnit("10.00", 10),
            "5 dollar bill": CurrencyUnit("5.00", 10),
            "2 dollar bill": CurrencyUnit("2.00", 10),
            "1 dollar bill": CurrencyUnit("1.00", 10),
            "half-dollar": CurrencyUnit("0.5", 10),
            "quarter": CurrencyUnit("0.25", 10),
            "dime": CurrencyUnit("0.10", 10),
            "nickle": CurrencyUnit("0.05", 10),
            "penny": CurrencyUnit("0.01", 10),
        })
    })

    change = r1.change_denominations("USD", "10.65")
    assert change == [Decimal(0.00),
           {
            "10 dollar bill": CurrencyUnit("10.00", 1),
            "half-dollar": CurrencyUnit("0.50", 1),
            "dime": CurrencyUnit("0.10", 1),
            "nickle": CurrencyUnit("0.05", 1),
           }
    ]


def test_register_change_denominations_not_enough_one_denomination():
    r1 = register.Register({
        "USD": Currency({
            "10 dollar bill": CurrencyUnit("10.00", 8),
            "5 dollar bill": CurrencyUnit("5.00", 10),
            "2 dollar bill": CurrencyUnit("2.00", 10),
            "1 dollar bill": CurrencyUnit("1.00", 10),
            "half-dollar": CurrencyUnit("0.5", 10),
            "quarter": CurrencyUnit("0.25", 10),
            "dime": CurrencyUnit("0.10", 10),
            "nickle": CurrencyUnit("0.05", 10),
            "penny": CurrencyUnit("0.01", 10),
        })
    })
    change = r1.change_denominations("USD", "110.65")
    assert change == [Decimal(0.00),
           {
            "10 dollar bill": CurrencyUnit("10.00", 8),
            "5 dollar bill": CurrencyUnit("5.00", 6),
            "half-dollar": CurrencyUnit("0.50", 1),
            "dime": CurrencyUnit("0.10", 1),
            "nickle": CurrencyUnit("0.05", 1)
           }
    ]
    print(r1.currencies["USD"])


def test_register_change_denominations_not_enough_money():
    r1 = register.Register({
        "USD": Currency({
            "10 dollar bill": CurrencyUnit("10.00", 8),
            "2 dollar bill": CurrencyUnit("2.00", 10),
            "nickle": CurrencyUnit("0.05", 10),
            "penny": CurrencyUnit("0.01", 10),
        })
    })
    change = r1.change_denominations("USD", "110.65")
    assert change == [Decimal("10.05"),
           {
            "10 dollar bill": CurrencyUnit("10.00", 8),
            "2 dollar bill": CurrencyUnit("2.00", 10),
            "nickle": CurrencyUnit("0.05", 10),
            "penny": CurrencyUnit("0.01", 10),
           }
    ]
