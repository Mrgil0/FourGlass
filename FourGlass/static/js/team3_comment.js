src = "https://code.jquery.com/jquery-3.4.1.js"

function printTime() {
    var now = new Date()
    var nowTime = now.getFullYear() + "년" + (now.getMonth() + 1) + "월" + now.getDate() + "일" + now.getHours() + "시" + now.getMinutes() + "분" + now.getSeconds() + "초";
    clock.innerHTML = nowTime;
    setTimeout("printTime()", 1000);
}

window.onload = function () {
    printTime();
}


$(document).ready(function () {
    set_temp()
    show_comment()
});

function set_temp() {
    $.ajax({
        type: "GET",
        url: "/team3comment",
        data: {},
        success: function (response) {
            $('#temp').text(response['temp'])
        }
    })


}

function save_comment() {
    let name = $('#name').val()
    let comment = $('#comment').val()

    if ($("#name").val().length == 0) {
        alert("이름을 입력해주세요!");
        $("#name").focus();
        return false;
    }

    if ($("#comment").val().length == 0) {
        alert("응원해주세요~");
        $("#comment").focus();
        return false;
    }

    $.ajax({
        type: 'POST',
        url: '/team3comment',
        data: {name_give: name, comment_give: comment},
        success: function (response) {
            alert(response['msg'])
            window.location.reload()
        }
    })
}

function show_comment() {
    $.ajax({
        type: "GET",
        url: "/team3comment",
        data: {},
        success: function (response) {
            let rows = response['team3comment']
            for (let i = 0; i < rows.length; i++) {
                let name = rows[i]['name']
                let comment = rows[i]['comment']
                let temp_html = `<div class="card" >
                                            <div class="card-body" style="box-shadow: black">
                                                <blockquote class="blockquote mb-0">
                                                    <p><span style="color: #7140dd">닉네임:</span> ${name}</p>
                                                    <footer onclick="done_intro()" class="blockquote-footer">${comment}</footer>
                                                </blockquote>
                                            </div>
                                        </div>`
                $('#comment-list').append(temp_html)


            }
        }
    });
}


