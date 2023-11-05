import sqlite3

class Database:
    def __init__(self, db_name):
        self.db_name = db_name
        self.connection = None
        self.cursor = None
        
    def connect(self):
            self.connection = sqlite3.connect(self.db_name, check_same_thread=False)
            self.cursor = self.connection.cursor()
            self.cursor.execute('PRAGMA foreign_keys=ON')
            i = 0
            return self.connection
    
    def create_table(self):
     self.cursor.execute('''
           CREATE TABLE IF NOT EXISTS drones (
                serial_number TEXT UNIQUE,  -- Add UNIQUE constraint to serial_number
                squad_id number NOT NULL,
                inTheAir BOOLEAN
           )
        ''')
     self.connection.commit()

    def insert_Drone(self, serial_number, squad, in_the_air):
        try:
            self.cursor.execute("SELECT COUNT(*) FROM drones WHERE serial_number = ?", (serial_number,))
            count = self.cursor.fetchone()[0]

            if count == 0:
                self.cursor.execute("INSERT INTO drones (serial_number, squad_id, inTheAir) VALUES (?, ?, ?)", (serial_number, squad, in_the_air))
                self.connection.commit()
                return True
        except Exception as e:
            print("Error:", str(e))
            return False


    
    def update_InTheAir(self, serial_number, in_the_air):
        try:
            self.cursor.execute("UPDATE drones SET inTheAir = ? WHERE serial_number = ?", (in_the_air, serial_number))
            self.connection.commit()
            return True
        except Exception as e:
            print("Error:", str(e))
            return False
    
    
    
    def get_drone_info(self, drone_id):
        if self.connection is None:
            return
        self.cursor.execute("SELECT serial_number, squad_id, inTheAir FROM drones WHERE serial_number = ?;", (drone_id,))
        rows = self.cursor.fetchall()
        print(rows)
        if len(rows) > 0:
            return {
                "serial_number": rows[0][0],
                "inTheAir": rows[0][1]
            }
        else:
            return None
    
    
    def print_table(self):
        """
        Print visualization of the table {drowns}
        """
        print('print table')
        if self.connection is None:
            return
        self.cursor.execute("SELECT * FROM drones;")
        rows = self.cursor.fetchall()
        line_sep = "".join(["_" for i in range(len(self.cursor.description) * 22)]) + "_\n"
        print(line_sep)
        print("|",end="")
        for column_name in self.cursor.description:
            print(f" {column_name[0].replace('_', ' ').ljust(20, ' ')}", end="|")
        print(f"\n{line_sep}")

        for row in rows:
            print("|",end="")
            for item in row:
                print(f" {str(item).ljust(20, ' ')}", end="|")
            print(f"\n{line_sep}")
        
        print('print table')
    
    
    def close(self):
        self.connection.close()