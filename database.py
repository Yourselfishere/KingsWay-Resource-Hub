# database.py
# Handles the database connection and query

# import mysql connector library
import mysql.connector

# DB_Config dictionary stores connection details in one place
DB_CONFIG = {
    "host":"localhost",
    "user":"root",
    "password":"",
    "database":"app"
}

# Connect to the database
def get_db_connection():
    connection = mysql.connector.connect(**DB_CONFIG)
    return connection

def query_db(query, params=()):
    # open the connection
    connection = get_db_connection()

    # Store the params as a dictionary instead of plain text
    cursor = connection.cursor(dictionary=True)

    # execute query with params - prevents SQL injection
    cursor.execute(query, params)

    # fetch results as dictionaries
    results = cursor.fetchall()

    # close cursor 
    cursor.close()
    connection.close()

    # results
    return results