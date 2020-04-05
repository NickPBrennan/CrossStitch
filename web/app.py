#############################
#### Main 
#############################


import os
from flask import Flask, redirect, url_for, request, render_template
from pymongo import MongoClient

app = Flask(__name__, static_folder='static')

client = MongoClient('db', 27017)
xwordDB = client.xwordDB

"""
Home Page
"""
@app.route('/')
def index():

    _items = xwordDB.grids.find()
    items = [item['name'] for item in _items]

    return render_template('index.html', items=items)

"""
Puzzle Gallery Page
"""
@app.route('/new')
def new():
	xwordDB.grids.insert_one({'name':'test'})
	return redirect(url_for('index'))


if __name__ == "__main__":
    app.run(host='0.0.0.0', debug=True)


