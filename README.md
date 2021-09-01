The Cash Register Problem


Write an application to simulate a cash register clerk who makes change. 
It’s one function should be to take a purchase price and a payment amount and 
return the change using all of the US dollar denominations $20 and less including pennies, 
nickels, dimes, quarters, and fifty cent pieces. Assume that there is a limited supply 
(possibly zero) of each denomination to draw from in your register and that the change will 
include the minimum amount of each denomination needed. For example, a payment of $1.00 for a 
purchase of $0.89 will return change of a dime and a penny, or if there are no dimes, then two 
nickels and a penny. Replenish the available currency stock from the payments and simulate a 
series of transactions to show multiple scenarios.

Document any assumptions you make that are not in the requirements
Provide unit tests sufficient to prove your program works
 
You can choose whether to implement your solution as a server side or client side application. 
Please choose either ‘Server Side’ or ‘Client Side’ options below.

Server Side Option
Optional: Include some form of user friendly UI for accessing your program as a cash register to demonstrate how it works. 

Client Side Option
You should include a user friendly UI for accessing your program as a cash register to demonstrate how it works. 

If you provide a UI, please ensure that your UI can be run conveniently by our engineers without them having to spend undue amounts of time in setup.


Design Assumptions


<h1>Design Assumptions In Program</h1>
    <li>Inputs into the cash register by employees are parsed as string inputs</li>
        <ul>
            <li>Allows Decimal library to handle error checking of inputs...</li>
        </ul>
    <li>Employee assumptions:</li> 
        <ul>
            <li>They use a single currency throughout the day</li>
            <li>They keep track of how many of each currency unit are in register at the beginning of each day</li>
            <li>They track any new currency units added...</li>
            <li>Any transaction that they cannot pay the whole change for, they must skip.</li>
        </ul>
    <li>CurrencyUnit assumptions:</li>
        <ul>
            <li>The worth of each currrency unit is in base 10.</li>
            <li>Currency units in the same denomination are tracked separately... 
                a dollar coin is "different" from a dollar bill. 
                However, in the calculation of change, it doesn't matter which is used, 
                dollar coin or dollar bil.</li>
            <li>You cannot create an currency unit with a non-positive worth, a non-positive count,
                or an blank or whitespace name. The name is stripped automatically upon creation.</li>
        </ul>
    <li>Register assumptions:</li>
        <ul>
            <li>You can create an empty register</li>
            <li>Adding an currency to the register requires a name and at least one currency unit</li>
            <li>Adding an currency unit can override an existing unit, 
                create an new currency, or add to an existing currency</li>
            <li>You cannot add 0 of an currency unit to an currency.</li>
            <li>Removing the last currency unit from an currency does not automatically delete the currency.
                This keeps the user from having to recreate the currency...</li>
            <li>You can create an empty currency object. However, you cannot actually have an empty
                currency in the program.</li>
            <li></li>
            <li></li>
        </ul>
    

<h1>Cash Register</h1>
    <h2>Configure Register</h2>
        <ul>
            <li>Currency drop down allows you to select from different currency options.</li>
            <li>Selecting Custom grays out Continue until you have at least one currency unit</li>
            <li>Sales tax cannot be below 0 or above 100%</li>
            <li>There are three buttons: Advanced, Continue, and Quit.</li>
            <li>The first two buttons will be grayed out until you select an currency and input a sales tax percentage.</li>
            <li>Advanced allows you to modify the currently selected currency. 
                You can add currency units by inputting their worth, name, and count as well as delete existing currency units.
                There must be at least one denomination in the current currency.</li>
        </ul>
    <h2>Register</h2>
        <ul>
            <li>The numpad on the left is the primary input.</li>
                <ul>
                    <li>0 - will not do anything if the input currently says 0</li>
                    <li>00 - works similarily to 0 but types two zeroes</li>
                    <li>CE - clear entry</li>
                </ul>
            <li>There are five buttons in an column to the right of the numpad. Only Subtotal and Exit will be available at first.</li>
                <ul>
                    <li>Restart - Numpad is clickable. The current transaction is cancelled. Available anytime before changed.</li>
                    <li>Exit - Ends program.</li>
                    <li>Subtotal - Sales tax is calculated and always rounded up to the next hundreth. 
                        Price and tax breakdown is shown. The numpad is locked. Tender and Restart are now available.</li>
                    <li>Tender - A popup opens with two buttons: Optimal and Custom</li>
                        <ul>
                            <li>Optimal means that their payment is split up optimally using the existing denominations.</li>
                            <li>Custom means that the payment is split up according to the user's selection in another popup window.
                                The selection must be consistent with the amount paid.</li>
                            <li>Change is now available.</li>
                        </ul>
                    <li>Change - Calculate the breakdown of the change. 
                        If there aren't enough currency units, the transaction will skip calculation step and reset.
                        Otherwise, the appropriate currency units are paid to customer and balance is added to register.</li>
                </ul>
            <li>At the bottom is the current status of the register. Balance keeps track of total money in register. 
                Currency units, counts, and worths are available below.</li>
        </ul>
 