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
    print([dict(row) for row in subjects])

    # give the subjects list to index.html
    # makes the subjects a list of dictionaries 
    return render_template("index.html", subjects=subjects)
    

@app.errorhandler(404)
def page_not_found(e): 
    return render_template("404.html")

@app.route("/<subject_url>")
def subject_page(subject_url):
    mapping = {
        "mathematics": "maths.html",
        "science": "science.html",
        "english": "english.html",
        "digital-tech": "dgt.html",
    }
    template = mapping.get(subject_url)
    if not template:
        return render_template("404.html"), 404
    return render_template(template)

if __name__ == "__main__":
    app.run(debug=True)
