from pymongo import MongoClient
import certifi

from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

ca = certifi.where()

# client = MongoClient(
#     "mongodb+srv://test:sparta@cluster0.uerebxa.mongodb.net/?retryWrites=true&w=majority", tlsCAFile=ca)
# db = client.sparta


client = MongoClient('mongodb+srv://test:sparta@cluster0.sbbe9i1.mongodb.net/?retryWrites=true&w=majority')
db = client.dbsparta

# *----------------------송지훈------------------------------


@app.route('/team4')
def team4():
    return render_template('/members/team4.html')


@app.route("/fourglass/team4_insert_review", methods=["POST"])
def team4_insert_review():
    review_receive = request.form['review_give']
    count = 0
    if (db.team4.count_documents({}) != 0):
        count = (db.team4.find({}, {'_id': False})
        .sort('_id', -1)[0]['num']) + 1

    doc = {
        'review': review_receive,
        'num': count,
    }
    db.team4.insert_one(doc)
    return jsonify({'msg': '저장완료'})


@app.route("/fourglass/team4_read_review", methods=["GET"])
def team4_read_review():
    reviews = list(db.team4.find({}, {'_id': False}).sort('_id', -1).limit(5))
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


@app.route("/fourglass/main_modified_cmt", methods=["POST"])
def main_modified_cmt():
    before_receive = request.form['before_give']
    modified_receive = request.form['modified_give']

    print(before_receive)
    print(modified_receive)
    db.main_comment.update_one({'comment': before_receive}, {
        '$set': {'comment': modified_receive}})
    return jsonify({'msg': '연결'})


@app.route("/fourglass/main_find_cmt2", methods=["POST"])
def main_find_cmt2():
    name_receive = request.form['name_give']
    pass_receive = request.form['pass_give']

    find_list = list(db.main_comment.find(
        {'$and': [
            {'name': name_receive},
            {'pass': pass_receive},
        ]},
        {'_id': False}
    ))

    return jsonify({'result': find_list})


# -----------------------송지훈-----------------------------*

# ------------------메인페이지 댓글----------------
@app.route('/')
def home():
    return render_template('mainpage.html')


@app.route("/main", methods=["GET"])
def mainpage_get():
    main_list = list(db.main_comment.find({}, {'_id': False}))
    return jsonify({'main': main_list})


@app.route("/main", methods=["POST"])
def main_comment_post():
    name_receive = request.form['name_give']
    comment_receive = request.form['comment_give']
    pass_receive = request.form["pass_give"]
    main_list = list(db.main_comment.find({}, {'_id': False}))
    count = len(main_list) + 1

    doc = {'idx': count, 'name': name_receive,
           'comment': comment_receive, 'pass': pass_receive}
    db.main_comment.insert_one(doc)

    return jsonify({'msg': '어서오세요!'})


@app.route("/fourglass/main_find_cmt", methods=["POST"])  # 댓글의 인덱스 번호 찾기
def main_find_cmt():
    id_receive = int(request.form['id_give'])
    find_list = list(db.main_comment.find(
        {"idx": id_receive}, {'_id': 0}))  # '_id' 제외(0)하고 찾음
    return jsonify({'result': find_list})


@app.route("/fourglass/main_del_cmt", methods=["POST"])  # 팀원1의 댓글 삭제
def main_del_cmt():
    id_receive = int(request.form["id_give"])
    db.main_comment.delete_one({'idx': id_receive})
    return jsonify({'msg': '삭제 완료!'})


# main end-----------------------------------------------------------------------


@app.route('/team3')
def team3comment():
    return render_template('members/team3.html')


@app.route("/team3comment", methods=["POST"])
def team3_post():
    name_receive = request.form['name_give']
    comment_receive = request.form['comment_give']
    pass_receive = request.form["pass_give"]
    team3_list = list(db.team3_comment.find({}, {'_id': False}))
    count = len(team3_list) + 1

    doc = {'idx': count, 'name': name_receive,
           'pass': pass_receive, 'comment': comment_receive}
    db.team3_comment.insert_one(doc)

    return jsonify({'msg': '응원 감사합니다!!'})


@app.route("/fourglass/team3_find_cmt", methods=["POST"])  # 댓글의 인덱스 번호 찾기
def team3_find_cmt():
    id_receive = int(request.form['id_give'])
    find_list = list(db.team3_comment.find(
        {"idx": id_receive}, {'_id': 0}))  # '_id' 제외(0)하고 찾음
    return jsonify({'result': find_list})


@app.route("/fourglass/team3_del_cmt", methods=["POST"])  # 팀원1의 댓글 삭제
def team3_del_cmt():
    id_receive = int(request.form["id_give"])
    db.team3_comment.delete_one({'idx': id_receive})
    return jsonify({'msg': '삭제 완료!'})


@app.route("/team3comment", methods=["GET"])
def team3_get():
    team3_list = list(db.team3_comment.find({}, {'_id': False}))
    return jsonify({'team3comment': team3_list})


# team3 end-----------------------------------------------------------------------

# =======
@app.route('/team1')
def team1():
    return render_template('members/team1.html')


@app.route("/fourglass/team1_add_cmt", methods=["POST"])  # 방명록 남기기
def team1_add_cmt():
    id_receive = int(request.form["id_give"])
    name_receive = request.form["name_give"]
    comment_receive = request.form["comment_give"]
    pass_receive = request.form["pass_give"]
    doc = {
        'idx': id_receive,
        'name': name_receive,
        'comment': comment_receive,
        'pass': pass_receive
    }
    db.team1_comment.insert_one(doc)
    return jsonify({'msg': '방명록 작성 완료!'})


@app.route("/fourglass/team1_get_cmt", methods=["GET"])  # 방명록 목록 가져오기
def team1_get_cmt():
    comment_list = list(db.team1_comment.find({}, {'_id': False}))
    return jsonify({'comments': comment_list})


@app.route("/fourglass/team1_find_cmt", methods=["POST"])  # 방명록의 인덱스 번호 찾기
def team1_find_cmt():
    id_receive = int(request.form['id_give'])
    find_list = list(db.team1_comment.find(
        {"idx": id_receive}, {'_id': 0}))  # '_id' 제외(0)하고 찾음
    print(find_list)
    return jsonify({'result': find_list})


@app.route("/fourglass/team1_del_cmt", methods=["POST"])  # 방명록 삭제
def team1_del_cmt():
    id_receive = int(request.form["id_give"])
    db.team1_comment.delete_one({'idx': id_receive})
    return jsonify({'msg': '삭제 완료!'})


@app.route("/fourglass/team1_update_cmt", methods=["POST"])  # 방명록 수정
def team1_update_cmt():
    id_receive = int(request.form["id_give"])
    name_receive = request.form["name_give"]
    comment_receive = request.form["comment_give"]
    db.team1_comment.update_one({'idx': id_receive}, {
        '$set': {'name': name_receive, 'comment': comment_receive}})
    return jsonify({'msg': '수정 완료!'})


@app.route("/fourglass/team1_add_reply", methods=["POST"])  # 댓글 추가
def team1_add_reply():
    cmtid_receive = request.form["id_give"]
    name_receive = request.form["name_give"]
    text_receive = request.form["text_give"]
    comment_list = list(db.team1_reply.find({}, {'_id': False}))
    count = len(comment_list) + 1
    doc = {
        'idx': count,
        'comment_id': cmtid_receive,
        'replyName': name_receive,
        'replyText': text_receive
    }
    db.team1_reply.insert_one(doc)
    return jsonify({'msg': True})


@app.route("/fourglass/team1_get_reply", methods=["POST"])  # 댓글 불러오기
def team1_get_reply():
    cmtid_receive = request.form["id_give"]
    find_list = list(db.team1_reply.find({"comment_id": cmtid_receive}, {'_id': 0}).sort('idx', -1))
    # 방명록의 id에 맞는 댓글을 _id를 제외하고 idx기준 내림차순으로 정렬
    return jsonify({'list': find_list})


# team1 end-----------------------------------------------------------------------


@app.route('/team2')
def team2():
    return render_template('members/team2.html')


@app.route("/fourglass/team2_add_cmt", methods=["POST"])
def team2_add_cmt_post():
    name_receive = request.form["name_give"]
    pass_receive = request.form["pass_give"]
    comment_receive = request.form["comment_give"]
    comment_list = list(db.team2_comment.find({}, {'_id': False}))
    count = len(comment_list) + 1
    doc = {
        'idx': count,
        'name': name_receive,
        'comment': comment_receive,
        'pass': pass_receive
    }
    db.team2_comment.insert_one(doc)
    return jsonify({'msg': '작성 완료!'})


@app.route("/fourglass/team2_get_cmt", methods=["GET"])
def team2_get_cmt_get():
    comment_list = list(db.team2_comment.find({}, {'_id': False}))
    return jsonify({'comments': comment_list})


@app.route("/fourglass/team2_find_cmt", methods=["POST"])  # 댓글의 인덱스 번호 찾기
def team2_find_cmt():
    id_receive = int(request.form['id_give'])
    find_list = list(db.team2_comment.find(
        {"idx": id_receive}, {'_id': 0}))  # '_id' 제외(0)하고 찾음
    return jsonify({'result': find_list})


@app.route("/fourglass/team2_del_cmt", methods=["POST"])  # 팀원1의 댓글 삭제
def team2_del_cmt():
    id_receive = int(request.form["id_give"])
    db.team2_comment.delete_one({'idx': id_receive})
    return jsonify({'msg': '삭제 완료!'})


@app.route("/fourglass/team2_cor_cmt", methods=["POST"])  # 팀원1의 댓글 수정
def team2_cor_cmt():
    id_receive = int(request.form["id_give"])
    comment_receive = request.form["comment_give"]
    db.team2_comment.update_one(
        {'idx': id_receive}, {'$set': {'comment': comment_receive}})
    return jsonify({'msg': '수정 완료!'})


# team2 end-----------------------------------------------------------------------

if __name__ == '__main__':
    app.run('0.0.0.0', port=5000, debug=True)
