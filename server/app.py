import sys
from flask import Flask, render_template, request, redirect, url_for, flash, make_response, jsonify
from flask_cors import CORS
import dronesDB

app = Flask(__name__)
CORS(app)
app.secret_key = 'your_secret_key'

# Create an instance of the Database class
db = dronesDB.Database('DroneZat.db')

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
    try:
        print('<< add drone >>')
        
        jsonData = request.get_json()
        print('json data: ', jsonData)
        
        squad_id = jsonData.get('squad', None)
        serial_number = jsonData.get('serial_number', None)
        in_the_air = 1 if jsonData.get('in_the_air', None) == True else 0

        success = db.insert_Drone(serial_number, squad_id, in_the_air)

        db.print_table()
        
        if success:
            print('Drone added successfully')
            return make_response("Drone added successfully", 200)
        else:
            print("An error occurred while adding the Drone details to the database")
            return make_response('{"error": \"something went worng\"}', 400)
        
    except:
        return make_response("Something went wrong, couldn't add this drone", 500)
    

@app.route('/update', methods=['POST'])
def update_InTheAir():
    try:
        print('<< update drone >>')
        
        jsonData = request.get_json()
        print("json date: ", jsonData)
        
        update_serial_number = jsonData['update_serial_number']
        update_in_the_air = 1 if jsonData['update_in_the_air'] == True else 0

        print('update in air to: ', update_in_the_air)
        if db.update_InTheAir(update_serial_number, update_in_the_air):
            return make_response(jsonify({
                "message": "Drone status updated successfully",
                "droneId": update_serial_number,
                "onAir": update_in_the_air
            }), 200)
        
        # if the DataBase was not updated
        return make_response("Couldn't update drone status", 400)
    except:
        return make_response("Something went wrong, couldn't update drone status", 500)


@app.route('/getDroneStatus/<droneId>', methods=['GET'])
def get_drone_status(droneId):
    db.print_table()
    
    print('drone id: ', droneId)
    
    if not droneId:
        print('drone id is not specified')
        return make_response(r'{"error": "drone id is not specified"}', 400)
        
    drone = db.get_drone_info(droneId)
    if drone:
        response = {
            'isOnAir': True if drone['inTheAir'] == 1 else False
        }
        return make_response(jsonify(response), 200)
    else:
        return make_response(r'{"error": "couldn\'t find the drone you specified"}', 404)
    

if __name__ == '__main__':
    print('Connect to the Database...')
    init_db()  # Initialize the database and table
    print('Start server')
    app.run(debug=True)
