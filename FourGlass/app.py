from pymongo import MongoClient
import certifi

from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

ca = certifi.where()

client = MongoClient(
    "mongodb+srv://test:sparta@cluster0.uerebxa.mongodb.net/?retryWrites=true&w=majority", tlsCAFile=ca)
db = client.sparta


# ------------------메인페이지 댓글----------------
@app.route('/')
def home():
    return render_template('mainpage.html')

# 송지훈 개인페이지
@app.route('/team4')
def jh():
    return render_template('team4.html')

# 송지훈 개인페이지
@app.route("/team4/review", methods=["POST"])
def insertReviewPost():
    review_receive = request.form['review_give']

    doc = {
        'review': review_receive,
    }
    db.jh.insert_one(doc)
    return jsonify({'msg': '저장완료'})

# 송지훈 개인페이지
@app.route("/team4/review", methods=["GET"])
def homework_get_jh():
    reviews = list(db.jh.find({}, {'_id': False}).sort('_id', -1).limit(3))
    print(reviews)
    return jsonify({'reviews': reviews})



@app.route("/", methods=["POST"])
def intro_maindet():
    name_receive = request.form['name_give']
    comment_receive = request.form['comment_give']
    maindet_list = list(db.imaindet.find({}, {'_id': False}))
    count = len(maindet_list) + 1

    doc = {'num': count, 'name': name_receive, 'team1comment': comment_receive}
    db.maindet.insert_one(doc)

    return jsonify({'msg': '댓글감사합니다!!'})


@app.route("/maindet", methods=["GET"])
def maindet_get():
    maindet_list = list(db.maindet.find({}, {'_id': False}))
    return jsonify({'intro': maindet_list})


# ----------------------------------------------
@app.route('/team1')
def team1():
    return render_template('team1.html')


# ------------------team3yook---------------------------------
@app.route('/team3')
def team3():
    return render_template('team3.html')


# <<<<<<< HEAD
@app.route("/intro", methods=["POST"])
def intro_post():
    name_receive = request.form['name_give']
    comment_receive = request.form['comment_give']
    intro_list = list(db.intro.find({}, {'_id': False}))
    count = len(intro_list) + 1

    doc = {'num': count, 'name': name_receive, 'team1comment': comment_receive}
    db.intro.insert_one(doc)

    return jsonify({'msg': '응원 감사합니다!!'})


@app.route("/intro", methods=["GET"])
def intro_get():
    intro_list = list(db.intro.find({}, {'_id': False}))
    return jsonify({'intro': intro_list})


# ------------------team3yook---------------------------------

# =======
# >>>>>>> 9946db5f51c57e6651ddee92391d70e3d46cac31
@app.route("/fourglass/team1_add_cmt", methods=["POST"])
def homework_post():
    idx_receive = int(request.form["idx_give"])
    name_receive = request.form["name_give"]
    comment_receive = request.form["comment_give"]
    pass_receive = request.form["pass_give"]
    doc = {
        'idx': idx_receive,
        'name': name_receive,
        'team1comment': comment_receive,
        'pass': pass_receive
    }
    db.comment.insert_one(doc)
    return jsonify({'msg': '작성 완료!'})


@app.route("/fourglass/team1_get_cmt", methods=["GET"])
def homework_get():
    comment_list = list(db.comment.find({}, {'_id': False}))
    return jsonify({'comments': comment_list})

@app.route("/fourglass/team1_find_reply", methods=["POST"])

def fourglass_findReply():
    idx_receive = request.form["id_give"]
    find_list = list(db.reply.find({"idx": idx_receive}))
    return jsonify({'result': find_list})


@app.route("/fourglass/team1_find_cmt", methods=["POST"]) #댓글의 인덱스 번호 찾기
def homework_find():
    id_receive = int(request.form['id_give'])
    find_list = list(db.comment.find({"idx": id_receive}, {'_id': 0}))
    return jsonify({'result': find_list})

@app.route("/fourglass/team1_del_cmt", methods=["POST"]) #팀원1의 댓글 삭제

def homework_del():
    id_receive = int(request.form["id_give"])
    db.comment.delete_one({'idx': id_receive})
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
        'team1comment': comment_receive
    }
    db.teamTwo.insert_one(doc)

    return jsonify({'msg': '작성 완료!'})


@app.route("/fourglass/team2/findReply", methods=["GET"])
def teamTwo_get():
    comment_list = list(db.teamTwo.find({}, {'_id': False}))
    return jsonify({'comments': comment_list})


if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
