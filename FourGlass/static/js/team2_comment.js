function save_comment(get_url, add_url) {
    if ($('#name').val() == "" || $('#team1comment').val() == "" || $('#pass').val() == "") {
        alert('빈칸이 없도록 입력해주세요.');
        return;
    }
    let name = $('#name').val();
    let comment = $('#comment').val();
    let pass = $('#pass').val();
    $.ajax({
        type: 'post',
        url: add_url,
        data: {'name_give': name, 'comment_give': comment, 'pass_give': pass},
        success: function (response) {
            alert('추가되었습니다')
            location.reload()
        },
        error: function (response) {
            console.log(response)
        }
    });
}

function show_comment(show_url, add_tag) {
    $(add_tag).empty() // 칸 비우기
    $.ajax({
        type: 'get',
        url: show_url,
        data: {},
        success: function (response) {
            let rows = response['comments']
            for (let i = 0; i < rows.length; i++) {
                let idx = rows[i]['idx']
                let name = rows[i]['name']
                let comment = rows[i]['comment']

                let temp_html = `<div className="card" style="max-width: 990px; border: 1px solid black; padding: 5px; margin: 5px;>
                                            <div class="card-body">
                                            <h5 class="card-title">${name}</h5>
                                            <p class="card-text"> -- ${comment}</p>
                                            <button class="${idx}" id="delbtn" className="card-link" style="margin-right: 5px">삭제</a>
                                            <button className="card-link">수정</button>
                                            </div></div>`
                $(add_tag).append(temp_html)
            }
        }
    });
}

