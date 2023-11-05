import sys
from flask import Flask, render_template, request, redirect, url_for, flash, make_response, jsonify
from flask_cors import CORS
from database import Database

app = Flask(__name__)
CORS(app)
app.secret_key = 'your_secret_key'

# Create an instance of the Database class
db = Database('DroneZat.db')

# Function to initialize the database and table
def init_db():
    db.connect()  # Establish a database connection
    db.create_table()  # Create the "drones" table

@app.route('/')
def landing_page():
    # return render_template('landing.html')
    return render_template('index.html')

@app.route('/add', methods=['POST'])
def add_Drone():
    print('add drone activated')
    print(request.data)
    
    if request.form.get("add"):  # Check which button was clicked (Add to Database)
        print("form: ", request.form)
        serial_number = request.form['serial_number']
        in_the_air = 1 if 'in_the_air' in request.form else 0

        if db.insert_Drone(serial_number, in_the_air):
            flash("Drone added successfully")
        else:
            flash("An error occurred while adding the Drone details to the database")
            return make_response('{"error": \"something went worng\"}', 400)
    
    db.print_table()
    
    return redirect(url_for('landing_page'))

@app.route('/update', methods=['POST'])
def update_InTheAir():
    if request.form.get("update"):  # Check which button was clicked (Update In The Air Status)
        print("form: ", request.form)
        update_serial_number = request.form['update_serial_number']
        update_in_the_air = 1 if 'update_in_the_air' in request.form else 0

        if db.update_InTheAir(update_serial_number, update_in_the_air):
            flash("Drone status updated successfully")
        else:
            flash("An error occurred while updating the drone status")

    return redirect(url_for('landing_page'))


@app.route('/getDroneStatus', methods=['GET'])
def get_drone_info():
    drone_id = request.args.get('droneId')
    drones = db.get_drone_info(drone_id)
    try:
        response = {
            'isOnAir': True if drones[0][1] == 1 else False
        }
        return make_response(jsonify(response), 200)
    except:
        return make_response('{"error": \"something went worng\"}', 400)
    

if __name__ == '__main__':
    print('Connect to the Database...')
    init_db()  # Initialize the database and table
    print('Start server')
    app.run(debug=True)
