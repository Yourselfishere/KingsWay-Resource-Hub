# database.py
# Handles the database connection and query

# import sqlite3
import sqlite3

# DB_Config - for SQLite, just the db file
DB_FILE = 'app.db'

# Connect to the database
def get_db_connection():
    connection = sqlite3.connect(DB_FILE)
    connection.row_factory = sqlite3.Row  # to get dict-like rows
    return connection

def query_db(query, params=()):
    # open the connection
    connection = get_db_connection()

    # Store the params as a dictionary instead of plain text
    cursor = connection.cursor()

    # execute query with params - prevents SQL injection
    cursor.execute(query, params)

    # fetch results as dictionaries
    results = cursor.fetchall()

    # close cursor 
    cursor.close()
    connection.close()

    # results
    return results