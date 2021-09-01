
'''
Write an application to simulate a cash register clerk
who makes change. It’s one function should be to take a
purchase price and a payment amount and return the change
using all of the US dollar denominations $20 and less including
pennies, nickels, dimes, quarters, and fifty cent pieces.

Assume that there is a limited supply (possibly zero) of each denomination to
draw from in your register and that the change will include the minimum
amount of each denomination needed. For example, a payment of $1.00 for a
purchase of $0.89 will return change of a dime and a penny, or if there are
no dimes, then two nickels and a penny. Replenish the available currency stock
from the payments and simulate a series of transactions to
show multiple scenarios.
'''
from currency import Currency
import decimal  # This library helps prevent floating point arithmetic errors

from currencyunit import CurrencyUnit
from typing import Dict, Tuple


class Register:
    def __init__(self, currencies: Dict[str, Currency] = {}):
        '''Constructs an instance of an register
        '''
        # check to make sure currencies is correct type
        if not isinstance(currencies, dict):
            raise TypeError("Argument 'currenices' must be a dict!")
        for i in currencies:
            if not isinstance(i, str):
                raise TypeError(
                    "Argument 'currencies' must contain all string keys!")
            if i.isspace() or i == "":
                raise ValueError(
                    "All string keys in 'currencies' must not be whitespace" +
                    "or empty!")
            if not isinstance(currencies[i], Currency):
                raise TypeError(
                    "Argument 'currencies' must contain " +
                    "all Currency values!")
        self.currencies = currencies

    def get_currency_names(self):
        '''Returns a list of the names of the currencies available in register
        '''
        return self.currencies.keys()

    def add_currency(self,
                     currency_name: str,
                     currency: Currency) -> None:
        '''Add a new currency. If the Currency object is empty,
        the entry will not be added. If an entry exists already with the
        given currency name, override the existing entry.

        Arguments:
        currency_name : name of the currency
        currency : object representing currency
        '''
        # error check on currency_name
        if not isinstance(currency_name, str):
            raise TypeError("Argument 'currency_name' must be a string")

        # strip right away for consistency
        currency_name = currency_name.strip()

        if currency_name == "":
            raise ValueError(
                "Argument 'currency_name' must neither be an empty string nor\
                    composed solely of whitespace")

        # prevent adding currency with 0 currency units
        # prevents name from having spaces at beginning or end
        if len(currency.currency_units) != 0:
            self.currencies[currency_name] = currency

    def remove_currency(self, currency_name: str) -> Currency:
        '''Returns the currency that is removed.
        If the currency doesn't exist, return None.
        '''
        # error check on currency_name
        if not isinstance(currency_name, str):
            raise TypeError("Argument 'currency_name' must be a string")
        # provides default value in case key doesn't exist
        return self.currencies.pop(currency_name, None)

    def add_unit_to_currency(self,
                             currency_name: str,
                             unit_name: str,
                             worth: str,
                             count: int):
        '''Adds a new currency unit to a given currency.
        If the currency doesn't exist, create a new currency with the unit.

        Positional rguments:
        currency_name: the name of the currency
        unit_name: the name of the unit to be added to currency
        worth: the worth of that unit
        count: the count of that unit
        '''
        # check currency_name if it's an str
        if not isinstance(currency_name, str):
            raise TypeError("Argument 'currency_name' must be of type str!")

        # stripping simplifies check for whitespace and empty string
        currency_name = currency_name.strip()
        if currency_name == "":
            raise ValueError(
                "Argument 'currency_name' must not be whitespace" +
                "or empty!")

        # create an empty currency object to add to
        if currency_name not in self.currencies:
            self.currencies[currency_name] = Currency()
        self.currencies[currency_name].create_unit(unit_name, worth, count)

    def remove_unit_from_currency(self,
                                  currency_name: str,
                                  unit_name: str) -> CurrencyUnit:
        '''Returns the removed currency unit or None if the currency_name or
        unit_name doesn't exist. If the currency ends up having 0 units left,
        the currency will remain in the register.

        Arguments:
        currency_name: currency from which to delete the given unit
        currency_unit: the unit which will be deleted
        '''
        if not isinstance(currency_name, str):
            raise TypeError("Argument 'currency_name' should be a string!")
        if not isinstance(unit_name, str):
            raise TypeError("Argument 'unit_name' should be a string!")

        deleted_unit = None
        if currency_name in self.currencies:
            deleted_unit = self.currencies[currency_name].delete_unit(
                unit_name)
            # should i automatically delete the currency if it's empty?
        return deleted_unit

    def change_denominations(
        self,
        currency: str,
            total_change: str) -> Tuple[
                decimal.Decimal, Dict[str, CurrencyUnit]]:
        '''Returns a dictionary of the currency units and amount of each unit
        that pays off the change.

        If there isn't enough currency units to pay off the total change,
        "leftover" will be set to the remaining portion. Otherwise,
        "leftover" will be 0.
        '''
        # check string arguments if they are valid...
        if not isinstance(currency, str):
            raise TypeError("Argument 'currency' should be a string!")
        if not isinstance(total_change, str):
            raise TypeError

        # convert total_change to Decimal object
        try:
            total_change = decimal.Decimal(total_change)
            if total_change < decimal.Decimal(0):
                raise ValueError(
                    "Argument 'total_change' should not be negative!")
        except decimal.InvalidOperation:
            # if the given worth of this currency unit is not able
            # to be constructed by Decimal, it is invalid
            raise ValueError(
                "Argument 'total_change' must be an proper decimal string!")

        # if the selected currency doesn't exist, the remainder left to pay
        # would be the total change
        change = [total_change, {}]

        # do the actual change calculation
        if currency in self.currencies:
            # we start with the denominations with the largest value
            # therefore, we have to sort the units of the currency used
            sorted_currency = sorted(
                    self.currencies[currency].currency_units.items(),
                    key=lambda unit: unit[1].worth, reverse=True)
            context = decimal.Context()  # needed for several operations

            for i in sorted_currency:
                unit_name = i[0]
                unit = i[1]

                # max amount is the most a given current unit can divide
                # the total change
                print(total_change, unit.worth)
                max_amount = int(context.divide_int(total_change, unit.worth))

                try:
                    unit_amount = CurrencyUnit(str(unit.worth), max_amount)
                except ValueError:  # max_amount could end up being 0
                    continue
                else:
                    # if the actual supply of current unit is under max amount
                    # subtract current amount of unit multiplied by its worth
                    # remove unit from currency
                    if max_amount >= unit.count:
                        take_away = context.multiply(unit.worth, unit.count)
                        total_change = context.subtract(
                            total_change, take_away)
                        self.remove_unit_from_currency(currency, unit_name)
                        unit_amount.count = unit.count
                    else:
                        total_change = context.remainder(
                            total_change, unit.worth)
                        self.currencies[currency].decrement_unit(
                            unit_name, max_amount)

                    change[1][unit_name] = unit_amount
                    # update total money remaining
                    change[0] = total_change
        return change


def change_denominations(total_change: decimal.Decimal) -> (int):
    '''Returns a tuple of ?
    '''
    denominations = [
        decimal.Decimal('20.00'),
        decimal.Decimal('10.00'),
        decimal.Decimal('5.00'),
        decimal.Decimal('2.00'),
        decimal.Decimal('1.00'),
        decimal.Decimal('0.50'),
        decimal.Decimal('0.25'),
        decimal.Decimal('0.10'),
        decimal.Decimal('0.05'),
        decimal.Decimal('0.01')
        ]
    context = decimal.Context()  # needed for using several operations

    denom_arr = []
    for i in denominations:
        denom_amount = context.divide_int(total_change, i)
        denom_arr.append(denom_amount)
        total_change = context.remainder(total_change, i)
    return tuple(denom_arr)


def calculate_change(
    total_payment: decimal.Decimal,
        total_purchase: decimal.Decimal) -> decimal.Decimal:
    '''
    Returns a Decimal object indicating the total payment subtracted
    from the total purchase
    '''
    # this is just an helper function...
    return total_payment - total_purchase

