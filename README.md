<h1>
    About the
    <a href="https://khuang0312.github.io/ChangeCalculator/">Change Calculator</a>
</h1>
    <p>
    This is a very primitive implementation of an cash register. What this
    does is essentially take an total payment amount required, the cash
    paid by the customer, then calculates the change as well as which
    currency units are needed to pay for it.
    </p>
    <p>
    The register can be altered. For instance, you can modify how much
    of each currency unit is currently in the register. You can also
    change the sales tax percentage. The whole application is client-side
    so no data is saved if the page is refreshed. This keeps things rather
    simple. No server to speak of.
    </p>

<h1>Design Assumptions In Program</h1>
    <li>Employee assumptions:</li> 
        <ul>
            <li>Employees use a single currency (USD) throughout the day.</li>
            <li>Employees update the register promptly when they receive more currency units.</li>
            <li>Any transaction employees cannot pay full change for must be skipped.</li>
            <li>The cash register automatically decrements currency units appropriately
                when full change is given to consumer.</li>
            <li>Employee does not close or refresh the browser until all transactions
                are complete.</li>
        </ul>
    <li>Customer Assumptions</li>
        <ul>
            <li>Customers only purchase and pay in USD up to $100. (This makes sense as highest 
                denomination available in register is a 20.)</li>
            <li>Customers only use currency units available in the register.</li>
            <li>Customers pay in optimal units. (This is done to lower inputs required.)</li>
            <li>Customers cannot buy anything if they can't pay at least full price.</li>
        </ul>
    <li>CurrencyUnit assumptions:</li>
        <ul>
            <li>The worth of each currrency unit is in base 10.</li>
            <li>Currency units in the same denomination are tracked separately... 
                a dollar coin is "different" from a dollar bill. 
                However, in the calculation of change, it doesn't matter which is used, 
                dollar coin or dollar bill.</li>
            <li>Currency units don't have non-positive worth, non-positive counts,
                nor an blank or whitespace name.</li>
            <li>Worth and name of currency units do not change.</li>
        </ul>
    
  
<h1>How to Setup Cash Register and Testing Suite</h1>
<ol>
    <li>Host an HTTP server and put the HTML, CSS, and JS files in the same directory on it. 
        I personally used <a href="https://www.npmjs.com/package/http-server">this server</a>
        to test out my site. Then navigate to that file on your server.</li>
    <li>If you are using a Linux system, I have provided <code>server.sh</code>.
        It contains the parameters to deploy the website on the server.</li>
    <li>Run <code>npm i</code> in the installation directory, then <code>npm test</code>!</li>
</ol>

<h1>How to use the Cash Register</h1>
    <h2>Subtotal Calculation</h2>
        <ol>
            <li>Fill out Total Price field to indicate total price of
                consumer purchases.</li>
            <li>Clicking Subtotal will calculate sales tax 
                and the subtotal. The Calculate Change section should appear.</li>
        </ol>
    <h2>Calculate Change</h2>
        <ol>
            <li>Fill out Amount Paid field to indicate how much they pay.</li>
            <li>Clicking Cash Tendered will show a table depicting information
                about each currency unit needed to pay the consumer's change.</li>
            <li>If the amount paid is less than subtotal, the transaction 
                is not counted and the user will start over at Subtotal Calculation.
                Otherwise if it is equal, the table will simply only have the header.</li>
            <li>Click Next Transaction to start another transaction.</li>
        </ol>
    <h2>Register Status</h2>
        <ol>
            <li>Feel free to adjust Sales Tax and Quantities of each currency unit.
                Once you're done with your change, click Update Register to update
                the register. Sales Tax is done in percent. For example, input 9.25
                for 9.25% sales tax.</li>
            <li>Successful transactions are any transaction where the customer
                could pay at least full price and the cashier can give sufficient
                change to the customer.</li>
        </ol>
 