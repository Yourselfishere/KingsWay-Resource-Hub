# app.py 
# Defines all the flask routes and each route handles one url template

# import flask
from flask import Flask, render_template, request, jsonify

# import query_db
from database import query_db

app = Flask(__name__)

# index page route
# handles all queries to the homepage "/"
@app.route("/")
def index():
    # query all rows from the subjects table and order by subject_id
    subjects = query_db("SELECT * FROM subjects ORDER BY subject_id")

    # give the subjects list to index.html
    # makes the subjects a list of dictionaries 
    return render_template("index.html", subjects=subjects)

if __name__ == "__main__":
    app.run(debug=True)