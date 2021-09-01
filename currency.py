from currencyunit import CurrencyUnit
from typing import Dict, List  # necessary for type annotations


# This class is used to help implement an CashRegister which can support
# different types of currencies.
#
# name and currency_units are not intended to be modified
class Currency:
    def __init__(self, currency_units: Dict[str, CurrencyUnit] = {}):
        '''
        '''
        # make sure the argument is a dict of str and CurrencyUnits
        if not isinstance(currency_units, dict):
            raise TypeError(
                "Argument 'self.currency_units' should be a dict!")
        self.currency_units = currency_units
        # check currency_units to make sure the type is correct
        # and that the values are "valid"
        #
        # no whitespace names, no blank names
        for i in self.currency_units:
            if not isinstance(i, str):
                raise TypeError(
                    "All keys in 'currency_units' should be strings!")
            if not isinstance(self.currency_units[i], CurrencyUnit):
                raise TypeError(
                    "All values in 'currency_units' should be CurrencyUnits!"
                )
            if i.isspace() or i == "":
                raise ValueError(
                    "All keys in 'currency_units' should not be whitespace " +
                    "or empty!")

    # GETTERS
    def get_unit_names(self) -> List[str]:
        '''Returns a list of names of all the units available in the currency
        '''
        return self.currency_units.keys()

    # SETTERS
    def create_unit(self, name: str, worth: str, count: int) -> None:
        '''Adds a new unit to currency_units.
            If the name is the same as an existing currency unit,
            it will override the existing value.

            Positional arguments:
            name : the name of the currency unit
            worth : the value of the currency as a string, ex: "0.50"
            count : the amount of said currency unit available
        '''
        # check that arguments are actually their types
        if not isinstance(name, str):
            raise TypeError("Argument 'name' should be a string!")
        elif not isinstance(worth, str):
            raise TypeError("Argument 'worth' should be a string!")
        elif not isinstance(count, int):
            raise TypeError("Argument 'count' should be a int!")

        # we don't want whitespaces at beginning or end...
        self.currency_units[name.strip()] = CurrencyUnit(worth, count)

    def delete_unit(self, name: str) -> CurrencyUnit:
        '''Removes corresponding CurrencyUnit entry and returns value deleted
            If the currency unit doesn't exist, this returns None
        '''
        # avoids KeyError by providing default value to return
        return self.currency_units.pop(name, None)

    def get_unit(self, name: str) -> CurrencyUnit:
        '''Returns the CurrencyUnit object associated with given currency unit
            If the currency unit doesn't exist, get_unit() returns None.

            Positional arguments:
            name : the name of the currency unit
        '''
        if not isinstance(name, str):
            raise TypeError("Argument 'name' should be a string!")
        try:
            return self.currency_units[name]
        except KeyError:
            return None

    def increment_unit(self, name: str, add: int) -> None:
        '''Calls the increment method on the CurrencyUnit object associated
        with the given currency unit.

        Positional arguments:
        name : name of the currency unit to be modified
        add : how much the count of the currency unit should increase
        '''
        if name in self.currency_units:
            self.currency_units[name].increment(add)

    def decrement_unit(self, name: str, subtract: int) -> None:
        '''Calls the decrement method on the CurrencyUnit object associated
        with the given currency unit. Count of the object won't go below 0.
        If the count of the object ends up being 0... the unit is removed.

        Positional arguments:
        name : name of the currency unit to be modified
        subtract : how much the count of the currency unit should decrease
        '''
        if name in self.currency_units:
            self.currency_units[name].decrement(subtract)
            if self.currency_units[name].count == 0:
                del self.currency_units[name]
