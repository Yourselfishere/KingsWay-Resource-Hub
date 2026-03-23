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
    
# 404 page
@app.errorhandler(404)
def page_not_found(e): 
    return render_template("404.html")

# Subject pages
@app.route("/<subject_url>")
def subject_page(subject_url):
    # mapping of url to template file
    template_mapping = {
        "mathematics": "maths.html",
        "science": "science.html",
        "english": "english.html",
        "dgt": "dgt.html",
    }
    
    # check url is valid
    if subject_url not in template_mapping:
        return render_template("404.html"), 404
    
    # get subject from database matching url column
    subject = query_db(
        "SELECT * FROM subjects WHERE url = %s",
        (subject_url,)
    )
    
    if not subject:
        return render_template("404.html"), 404
    
    subject = subject[0]
    
    # get all resources for this subject joined with category names
    resources = query_db("""
        SELECT 
            resources.*,
            categories.name AS category_name
        FROM resources
        JOIN categories 
            ON resources.categories_id = categories.categories_id
        WHERE resources.subject_id = %s
        ORDER BY resources.date_added DESC
    """, (subject["subject_id"],))
    
    # get categories with resource counts
    categories = query_db("""
        SELECT 
            categories.categories_id,
            categories.name,
            COUNT(resources.resource_id) AS resource_count
        FROM categories
        JOIN resources 
            ON categories.categories_id = resources.categories_id
        WHERE resources.subject_id = %s
        GROUP BY categories.categories_id, categories.name
        ORDER BY categories.name
    """, (subject["subject_id"],))
    
    # get total resource count
    total = query_db("""
        SELECT COUNT(*) AS total
        FROM resources
        WHERE subject_id = %s
    """, (subject["subject_id"],))
    
    total_count = total[0]["total"] if total else 0
    
    # get correct template from mapping
    template = template_mapping[subject_url]
    
    return render_template(
        template,
        subject=subject,
        resources=resources,
        categories=categories,
        total_count=total_count
    )

if __name__ == "__main__":
    app.run(debug=True)
