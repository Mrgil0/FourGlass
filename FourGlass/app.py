from pymongo import MongoClient
import certifi

from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

ca = certifi.where()

client = MongoClient(
    "mongodb+srv://test:sparta@cluster0.uerebxa.mongodb.net/?retryWrites=true&w=majority", tlsCAFile=ca)
db = client.sparta


# *----------------------송지훈------------------------------


@app.route('/team4')
def team4():
    return render_template('team4.html')


@app.route("/fourglass/team4_insert_review", methods=["POST"])
def team4_insert_review():
    review_receive = request.form['review_give']
    count = 0
    if (db.team4.count_documents({}) != 0):
        count = (db.team4.find({},{'_id': False})
                 .sort('_id', -1)[0]['num']) + 1

    doc = {
        'review': review_receive,
        'num': count,
    }
    db.team4.insert_one(doc)
    return jsonify({'msg': '저장완료'})


@app.route("/fourglass/team4_read_review", methods=["GET"])
def team4_read_review():
    reviews = list(db.team4.find({}, {'_id': False}).sort('_id', -1).limit(3))
    return jsonify({'reviews': reviews})


@app.route("/fourglass/team4_delete_review", methods=["POST"])
def team4_delete_review():
    num_receive = request.form['num_give']
    db.team4.delete_one({'num': int(num_receive)})
    return jsonify({'msg': 'linked'})


@app.route("/fourglass/team4_update_review", methods=["POST"])
def team4_update_review():
    num_receive = request.form['num_give']
    input_receive = request.form['input_give']
    db.team4.update_one(
        {'num': int(num_receive)},
        {'$set': {'review': input_receive}})
    return jsonify({'msg': 'linked'})


@app.route("/fourglass/team4_release_review", methods=["GET"])
def team4_release_review():
    db.team4.delete_many({})
    return jsonify({'msg': 'linked'})

# 팀 소개 페이지의 댓글 수정
# @app.route("/fourglass/team4_update_review", methods=["POST"])
# def team4_update_review():
#     review_receive = request.form['review_give']
#     num_receive = request.form['num_give']

#     db.team4.update_one({'num': int(num_receive)}, {
#                         '$set': {'reivew': review_receive}})
#     return jsonify({'msg': '연결'})


# -----------------------송지훈-----------------------------*

# ------------------메인페이지 댓글----------------
@app.route('/main')
def home():
    return render_template('mainpage.html')


@app.route("/main", methods=["POST"])
def main_post():
    name_receive = request.form['name_give']
    comment_receive = request.form['comment_give']
    main_list = list(db.main.find({}, {'_id': False}))
    count = len(main_list) + 1

    doc = {'num': count, 'name': name_receive, 'comment': comment_receive}
    db.main.insert_one(doc)

    return jsonify({'msg': '댓글감사합니다!!'})


@app.route("/main", methods=["GET"])
def main_get():
    main_list = list(db.main.find({}, {'_id': False}))
    return jsonify({'main': main_list})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)


# ----------------------------------------------

# ----------------------------------------------
@app.route('/team1')
def team1():
    return render_template('team1.html')


# ------------------team3yook---------------------------------
@app.route('/team3')
def team3():
    return render_template('team3.html')


# <<<<<<< HEAD
@app.route("/team3", methods=["POST"])
def intro_post():
    name_receive = request.form['name_give']
    comment_receive = request.form['comment_give']
    intro_list = list(db.intro.find({}, {'_id': False}))
    count = len(intro_list) + 1

    doc = {'num': count, 'name': name_receive, 'comment': comment_receive}
    db.intro.insert_one(doc)

    return jsonify({'msg': '응원 감사합니다!!'})


@app.route("/team3", methods=["GET"])
def intro_get():
    intro_list = list(db.intro.find({}, {'_id': False}))
    return jsonify({'intro': intro_list})


# ------------------team3yook---------------------------------

# =======
@app.route("/fourglass/team1_add_cmt", methods=["POST"])  # 댓글 남기기
def team1_add_cmt():
    name_receive = request.form["name_give"]
    comment_receive = request.form["comment_give"]
    pass_receive = request.form["pass_give"]
    comment_list = list(db.team1_comment.find({}, {'_id': False}))
    count = len(comment_list) + 1
    doc = {
        'idx': count,
        'name': name_receive,
        'comment': comment_receive,
        'pass': pass_receive
    }
    db.team1_comment.insert_one(doc)
    return jsonify({'msg': '작성 완료!'})


@app.route("/fourglass/team1_get_cmt", methods=["GET"])  # 댓글목록 가져오기
def team1_get_cmt():
    comment_list = list(db.team1_comment.find({}, {'_id': False}))
    return jsonify({'comments': comment_list})


@app.route("/fourglass/team1_find_cmt", methods=["POST"])  # 댓글의 인덱스 번호 찾기
def team1_find_cmt():
    id_receive = int(request.form['id_give'])
    find_list = list(db.team1_comment.find(
        {"idx": id_receive}, {'_id': 0}))  # '_id' 제외(0)하고 찾음
    return jsonify({'result': find_list})


@app.route("/fourglass/team1_del_cmt", methods=["POST"])  # 팀원1의 댓글 삭제
def team1_del_cmt():
    id_receive = int(request.form["id_give"])
    db.team1_comment.delete_one({'idx': id_receive})
    return jsonify({'msg': '삭제 완료!'})


@app.route("/4glass", methods=["POST"])
@app.route('/team2')
def team2():
    return render_template('team2.html')


@app.route("/fourglass/team2/addReply", methods=["POST"])
def teamTwo_post():
    name_receive = request.form['name_give']
    comment_receive = request.form['comment_give']
    doc = {
        'name': name_receive,
        'comment': comment_receive
    }
    db.teamTwo.insert_one(doc)

    return jsonify({'msg': '작성 완료!'})


@app.route("/fourglass/team2/findReply", methods=["GET"])
def teamTwo_get():
    comment_list = list(db.teamTwo.find({}, {'_id': False}))
    return jsonify({'comments': comment_list})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
