import pytest
from currencyunit import CurrencyUnit
from decimal import Decimal


def test_create_denomination_raises_errors_with_arguments_of_invalid_types():
    with pytest.raises(TypeError):  # first term should be string
        CurrencyUnit("20 dollar bill", 20.00, 1)

    with pytest.raises(TypeError):  # last term should be integer
        CurrencyUnit("20 dollar bill", "20.00", "1")
    with pytest.raises(TypeError):  # last term should be integer
        CurrencyUnit("20 dollar bill", "20.00", 0.1)


def test_create_denomination_raises_errors_with_invalid_argument_values():
    with pytest.raises(ValueError):  # first term must be valid decimal string
        CurrencyUnit(".", 1)
    with pytest.raises(ValueError):  # ... should be nonzero decimal string
        CurrencyUnit("0.", 1)
    with pytest.raises(ValueError):  # ... should be nonzero decimal string
        CurrencyUnit("0.0", 1)
    with pytest.raises(ValueError):  # ... should be nonzero decimal string
        CurrencyUnit(".0", 1)

    with pytest.raises(ValueError):  # last term should be positive integer
        CurrencyUnit("20.00", -1)


def test_create_currencyunit():
    cu = CurrencyUnit("20.00", 1)
    a = cu.worth.compare(Decimal("20.00"))
    assert a == Decimal('0')
    assert cu.count == 1

    # Checking the edge cases with strange values that people input
    cu = CurrencyUnit("1.", 1)
    a = cu.worth.compare(Decimal("1.00"))
    assert a == Decimal('0')
    assert cu.count == 1

    cu = CurrencyUnit(".1", 1)

    a = cu.worth.compare(Decimal("0.10"))
    assert a == Decimal('0')
    assert cu.count == 1

    cu = CurrencyUnit(".10", 1)
    a = cu.worth.compare(Decimal("0.10"))
    assert a == Decimal('0')
    assert cu.count == 1

    # worth should never be less than 0
    with pytest.raises(ValueError):
        cu = CurrencyUnit("-0.10", 1)
    with pytest.raises(ValueError):
        cu = CurrencyUnit("-.1", 1)
    with pytest.raises(ValueError):
        cu = CurrencyUnit("-1.", 1)


def test_currencyunit_set_count():
    cu = CurrencyUnit("5.00", 1)
    cu.set_count(2)
    assert cu.count == 2

    cu.set_count(0)
    assert cu.count == 0

    with pytest.raises(ValueError):
        cu.set_count(-1)
    with pytest.raises(TypeError):
        cu.set_count("A")
    assert cu.count == 0


def test_currencyunit_increment():
    cu = CurrencyUnit("5.00", 1)
    cu.increment(2)
    assert cu.count == 3

    with pytest.raises(ValueError):
        cu.increment(-1)
    with pytest.raises(TypeError):
        cu.set_count("A")
    assert cu.count == 3


def test_currencyunit_decrement():
    cu = CurrencyUnit("5.00", 5)
    cu.decrement(3)
    assert cu.count == 2
    cu.decrement(3)
    assert cu.count == 0

    with pytest.raises(ValueError):
        cu.decrement(-1)
    with pytest.raises(TypeError):
        cu.decrement("A")
    assert cu.count == 0
