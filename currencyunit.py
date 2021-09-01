from decimal import Decimal, InvalidOperation
import decimal


# This class is used to implement Currency
#
# worth and count are not intended to be modified
class CurrencyUnit:
    cu_context = decimal.Context(prec=2)

    def __init__(self, worth: str, count=1):
        '''Constructs an CurrencyUnit object

        Arguments:
        worth : A positive decimal value as a string indicating currency value
        count : A positive integer indicating how much of the currency you have
        '''
        # numeric types won't be caught properly by try clause
        # therefore we have to check if worth is a string
        if not isinstance(worth, str):
            raise TypeError("Argument 'worth' must be a string!")

        # if the count is not greater than 0, raise an error
        # it doesn't make sense to have 0 of an currency unit
        if not (isinstance(count, int)):
            raise TypeError("Argument 'count' must be an int!")

        if count < 1:
            raise ValueError("Argument 'count' must be greater than 0!")
        else:
            self.count = count
            try:
                self.worth = Decimal(worth, context=CurrencyUnit.cu_context)
                if self.worth <= Decimal(0):
                    raise ValueError("Argument 'worth' should be more" +
                                     "than zero!")
            except decimal.InvalidOperation:
                # if the given worth of this currency unit is not able
                # to be constructed by Decimal, it is invalid
                raise ValueError(
                    "Argument 'worth' must be an proper decimal string!")

    def __eq__(self, o) -> bool:
        return self.worth == o.worth and self.count == o.count

    def __repr__(self) -> str:
        return "CurrencyUnit({}, {})".format(self.worth, self.count)

    # GETTERS
    def is_empty(self) -> bool:
        '''
        Returns True if the count is 0, otherwise False
        '''
        return True if self.count == 0 else False

    # SETTERS
    # This function is to avoid repeating error handling code
    # in set_count, increment, and decrement methods
    #
    # It's static since it doesn't rely on the object attributes
    # It's private because this really shouldn't be visible outside class
    @staticmethod
    def __count_error_handler(arg: int, arg_name: str):
        '''
        Raises type error if the argument is not an int or below 0
        '''
        if not isinstance(arg, int):
            raise TypeError("Argument '{}' must be an int!".format(arg_name))
        if arg < 0:
            raise ValueError(
                "Argument '{}' cannot be a negative number!".format(arg_name))

    def set_count(self, new_count: int) -> None:
        '''Set the count to any nonnegative number

            Raises TypeError if an negative number is provided
        '''
        CurrencyUnit.__count_error_handler(new_count, 'new_count')
        # self.count = 0 if new_count < 1 else new_count
        self.count = new_count

    def increment(self, add: int) -> None:
        CurrencyUnit.__count_error_handler(add, 'add')
        self.count += add

    def decrement(self, subtract: int) -> None:
        CurrencyUnit.__count_error_handler(subtract, 'subtract')
        self.count -= subtract
        if self.count < 1:
            self.count = 0
