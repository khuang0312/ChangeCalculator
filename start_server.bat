:: USE THIS TO CLEAR PORT FOR FLASK
:: netstat -ano | find "5000"
:: taskkill /F /PID 6104

set FLASK_APP=hello
flask run

