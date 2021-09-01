from decimal import Decimal
import pytest

from currency import Currency
from currencyunit import CurrencyUnit


def test_create_currency():  # testing creation of currency
    c = Currency({})
    assert c.currency_units == {}
    cu = {
        "2 dollar bill": CurrencyUnit("2.00", 2),
        "1 dollar bill": CurrencyUnit("1.00", 2),
    }
    c = Currency(cu)
    assert c.currency_units == cu


def test_create_currency_raises_errors_with_nondict_currencyunits():
    # Currency should only have dicts as second argument
    with pytest.raises(TypeError):
        Currency([])
    with pytest.raises(TypeError):
        Currency((1,))
    with pytest.raises(TypeError):
        Currency(set())
    with pytest.raises(TypeError):
        Currency("currency")
    with pytest.raises(TypeError):
        Currency(5)
    with pytest.raises(TypeError):
        Currency(5.2)


def test_create_currency_raises_errors_with_nonstring_keys():
    with pytest.raises(TypeError):
        Currency({2: CurrencyUnit("2.00", 2)})


def test_create_currency_raises_errors_with_noncurrency_values():
    with pytest.raises(TypeError):
        Currency({"2 dollar bill": []})


def test_create_currency_raises_errors_with_whitespace_units():
    with pytest.raises(ValueError):
        Currency({" ": CurrencyUnit("2.00", 2)})


def test_create_currency_raises_errors_with_blank_units():
    with pytest.raises(ValueError):
        Currency({"": CurrencyUnit("2.00", 2)})


def test_currency_create_unit():
    cu = Currency({"2 dollar bill": CurrencyUnit("2.00", 2)})
    cu.create_unit("1 dollar bill", "1.00", 10)

    a = cu.get_unit("2 dollar bill")
    b = cu.get_unit("1 dollar bill")

    assert a.count == 2 and\
        a.worth.compare(Decimal("2.00")) == Decimal(0)
    assert b.count == 10 and\
        b.worth.compare(Decimal("1.00")) == Decimal(0)


def test_currency_create_unit_with_invalid_worth_or_count():
    cu = Currency({"2 dollar bill": CurrencyUnit("2.00", 2)})
    with pytest.raises(ValueError):
        cu.create_unit("1 dollar bill", "-1.00", 10)
    with pytest.raises(ValueError):
        cu.create_unit("1 dollar bill", "0.00", 10)
    with pytest.raises(ValueError):
        cu.create_unit("1 dollar bill", "1.00", -10)
    with pytest.raises(ValueError):
        cu.create_unit("1 dollar bill", "1.00", 0)


def test_currency_create_unit_with_existing_name():
    cu = Currency({"moolah": CurrencyUnit("2.00", 2)})
    cu.create_unit("moolah", "1.00", 10)
    moolah = cu.get_unit("moolah")
    assert moolah.worth.compare(Decimal("1.00")) == Decimal(0)\
        and moolah.count == 10


def test_currency_delete_unit():
    cu = Currency({
        "2 dollar bill": CurrencyUnit("2.00", 2),
        "1 dollar bill": CurrencyUnit("1.00", 10)})
    cu.delete_unit("1 dollar bill")
    assert len(cu.currency_units) == 1


def test_currency_delete_unit_with_nonexistent_name():
    cu = Currency({
        "2 dollar bill": CurrencyUnit("2.00", 2),
        "1 dollar bill": CurrencyUnit("1.00", 10)})
    cu.delete_unit("3 dollar bill")
    assert len(cu.currency_units) == 2


def test_currency_increment_unit():
    cu = Currency({"2 dollar bill": CurrencyUnit("2.00", 2)})
    cu.increment_unit("2 dollar bill", 2)
    assert cu.get_unit("2 dollar bill").count == 4


def test_currency_increment_unit_with_invalid_args():
    cu = Currency({"2 dollar bill": CurrencyUnit("2.00", 2)})
    cu.increment_unit("2 dollar bill", 0)
    assert cu.get_unit("2 dollar bill").count == 2

    with pytest.raises(TypeError):
        cu.increment_unit("2 dollar bill", "-2")
    with pytest.raises(TypeError):
        cu.increment_unit("2 dollar bill", -2.2)
    with pytest.raises(ValueError):
        cu.increment_unit("2 dollar bill", -2)


def test_currency_decrement_unit():
    cu = Currency({"2 dollar bill": CurrencyUnit("2.00", 2)})
    cu.decrement_unit("2 dollar bill", 0)
    assert cu.get_unit("2 dollar bill").count == 2

    cu.decrement_unit("2 dollar bill", 1)
    assert cu.get_unit("2 dollar bill").count == 1

    with pytest.raises(TypeError):
        cu.decrement_unit("2 dollar bill", "-2")
    with pytest.raises(TypeError):
        cu.decrement_unit("2 dollar bill", -2.2)
    with pytest.raises(ValueError):
        cu.decrement_unit("2 dollar bill", -2)

    cu.decrement_unit("2 dollar bill", 1)
    assert len(cu.currency_units) == 0
