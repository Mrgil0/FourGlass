src = "https://code.jquery.com/jquery-3.4.1.js"
$(document).ready(function () {
    set_temp()
    show_comment()
});

function set_temp() {
    $.ajax({
        type: "GET",
        url: "/main",
        data: {},
        success: function (response) {
            $('#temp').text(response['temp'])
        }
    })


}

function save_comment() {
    let name = $('#name').val()
    let comment = $('#comment').val()
    let pass = $(`#pass`).val()
    if ($("#name").val().length == 0) {
        alert("이름을 입력해주세요!");
        $("#name").focus();
        return false;
    }

    if ($("#comment").val().length == 0) {
        alert("댓글써주세요~");
        $("#comment").focus();
        return false;
    }
    if ($("#pass").val().length == 0) {
        alert("비밀번호입력해주세요");
        $("#pass").focus();
        return false;
    }

    $.ajax({
        type: 'POST',
        url: '/main',
        data: {name_give: name, comment_give: comment, pass_give: pass},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    })
}

function show_comment() {
    $.ajax({
        type: "GET",
        url: "/main",
        data: {},
        success: function (response) {
            let rows = response['main']
            for (let i = 0; i < rows.length; i++) {
                let name = rows[i]['name']
                let comment = rows[i]['comment']
                let idx = rows[i]['idx']
                let temp_html = `<div class="card" >
                                            <div class="card-body" style="box-shadow: black">
                                                <blockquote class="blockquote mb-0">
                                                    <p><span style="color: #7140dd">닉네임:</span> ${name}</p>
                                                    <footer class="blockquote-footer">${comment}
                                                    <hr></footer>
                                                    <button class="${idx}" id="delbtn" className="card-link">삭제</button>
                                                    <button class="${idx}" id="corbtn" className="card-link">수정</button>   
                                                </blockquote>
                                            </div>
                                        </div>`
                $('#comment-list').append(temp_html)


            }
        }
    });
}

$(document).on('click', '#delbtn', function () {
    let num = prompt('비밀번호를 입력하세요.')
    let id = $(this).attr('class')

    function find_comment(callbackfunc) {
        $.ajax({
            type: 'POST',
            url: '/fourglass/main_find_cmt',
            data: {'id_give': id},
            success: function (response) {
                console.log(response['result'])
                let result = response['result']
                if (num === result[0]['pass']) {
                    callbackfunc(result[0]['idx'])
                } else {
                    alert("비밀번호가 일치하지 않습니다.")
                }
            }
        })
    }

    find_comment(function (idx) {
        $.ajax({
            type: 'POST',
            url: 'fourglass/main_del_cmt',
            data: {'id_give': idx},
            success: function (response) {
                alert(response['msg'])
                location.reload()
            }
        })
    })
})