import certifi
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

ca = certifi.where()
from pymongo import MongoClient

client = MongoClient("mongodb+srv://test:sparta@cluster0.uerebxa.mongodb.net/?retryWrites=true&w=majority",
                     tlsCAFile=ca)
db = client.sparta


@app.route('/')
def home():
    return render_template('team1.html')


