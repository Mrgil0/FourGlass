src="https://code.jquery.com/jquery-3.4.1.js"
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
        url: '/main',
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
        url: "/main",
        data: {},
        success: function (response) {
            let rows = response['main']
            for (let i = 0; i < rows.length; i++) {
                let name = rows[i]['name']
                let comment = rows[i]['comment']


                let temp_html = `<div class="comcard" >
                                            <div class="card-body" style="box-shadow: black">
                                                <blockquote class="blockquote mb-0">
                                                    <p><span style="color: #7140dd">닉네임:</span> ${name}</p>
                                                    <footer class="blockquote-footer">${comment}
                                                    <hr></footer>
                                                </blockquote>
                                            </div>
                                        </div>`
                $('#comment-list').append(temp_html)


            }
        }
    });
}


