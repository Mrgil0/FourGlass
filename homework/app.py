import certifi
import logging
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


@app.route("/homework", methods=["POST"])
def homework_post():
    idx_receive = request.form["idx_give"]
    name_receive = request.form["name_give"]
    comment_receive = request.form["comment_give"]
    pass_receive = request.form["pass_give"]
    doc = {
        'idx': idx_receive,
        'name': name_receive,
        'comment': comment_receive,
        'pass': pass_receive
    }
    db.comment.insert_one(doc)
    return jsonify({'msg': '작성 완료!'})


@app.route("/fourglass/commentList", methods=["GET"])
def homework_get():
    comment_list = list(db.comment.find({}, {'_id': False}))
    return jsonify({'comments': comment_list})

@app.route("/fourglass/findReply", methods=["POST"])
def fourglass_findReply():
    idx_receive = request.form["id_give"]
    find_list = list(db.reply.find({"idx":idx_receive}))
    return jsonify({'result': find_list})

@app.route("/fourglass/find", methods=["POST"])
def homework_find():
    id_receive = request.form["id_give"]
    find_list = list(db.comment.find({"name":id_receive}, {'_id': False}))
    return jsonify({'result': find_list})

@app.route("/fourglass/del", methods=["POST"])
def homework_del():
    id_receive = request.form["id_give"]
    db.comment.delete_one({'name': id_receive})
    return jsonify({'msg': '삭제 완료!'})

@app.route("/fourglass/addReply", methods=["POST"])
def fourglass_addReply():
    idx_receive = request.form["idx"]
    name_receive = request.form["name"]
    text_receive = request.form["text"]
    doc = {
        'idx': idx_receive,
        'name': name_receive,
        'reply': text_receive,
    }

    db.reply.insert_one(doc)
    return render_template('team1.html')

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
