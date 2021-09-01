import tkinter as tk
import tkinter.ttk as ttk  # provides more universal widgets


class RegisterApp:
    '''
    '''
    def __init__(self):
        '''
        '''
        root = tk.Tk()

        # putting frame inside window ensures correct background
        mainframe = ttk.Frame(root, padding="5 2 2 5")

        # c
        mainframe.grid(column=0, row=0, sticky=(tk.N, tk.W, tk.E, tk.S))
        #  root.columnconfigure(0, weight=1)
        #  root.rowconfigure(0, weight=1)

        # allows methods to work with root and main frame
        self.root = root
        self.mainframe = mainframe

    def setup(self):
        # currency selection
        register_currency = tk.StringVar()  # stores selected currency
        ttk.Label(
            self.mainframe,
            text="Currency: ").grid(row=1, column=1, sticky=tk.W)
        ttk.Combobox(
            self.mainframe,
            textvariable=register_currency
            ).grid(row=1, column=2, sticky=tk.W, columnspan=2)

        # sales tax
        sales_tax = tk.StringVar()  # stored as string to convert to Decimal
        ttk.Label(
            self.mainframe,
            text="Sales Tax: ").grid(row=2, column=1, sticky=tk.W)
        ttk.Spinbox(
            self.mainframe,
            textvariable=sales_tax,
            from_=0,
            to=100,
            increment=.01
            ).grid(row=2, column=2, sticky=tk.W, columnspan=2)

        # buttons
        ttk.Button(self.mainframe, text="Quit").grid(row=3, column=1)
        ttk.Button(self.mainframe, text="Advanced").grid(row=3, column=2)
        ttk.Button(self.mainframe, text="Continue").grid(row=3, column=3)
        

    def run(self):
        self.root.mainloop()

r = RegisterApp()
r.setup()
r.run()
