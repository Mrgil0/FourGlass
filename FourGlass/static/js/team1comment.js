function create_comment(get_url, add_url){ //리스트 가져오기 위한 get_url, 추가할 add_url
    let name = $('#name').val();
    let comment = $('#comment').val();
    let pass = $('.pass').val();
    if(name=="" || comment=="" || pass==""){ //유효성 검사
        alert('빈칸이 없도록 입력해주세요.');
        return;
    }
    $.ajax({    //댓글 추가
        type : 'POST',
        url : add_url,          //클릭한 버튼의 url
        data : {'name_give':name, 'comment_give':comment, 'pass_give':pass},
        success: function(response){
            alert(response['msg'])
            location.reload()
        },
        error : function(response){
            console.log(response);
        }
    });
}

function show_comment(show_url, add_tag){   //방명록 보여주기
    $(add_tag).empty() // 칸 비우기
    $.ajax({
        type : 'get',
        url : show_url,
        data : {},
        success : function (response){
            let rows = response['comments']
            for(let i=0; i<rows.length; i++){
                let idx = rows[i]['idx']
                let name = rows[i]['name']
                let comment = rows[i]['comment']
                let temp_div = `<div style="overflow: hidden">
                                    <input class="commentName" id="name${idx}" name="name" type="text" readonly value="${name}" onfocus="this.blur();">
                                    <input class="commentText" id="comment${idx}" name="comment" type="text" readonly value="${comment}" onfocus="this.blur();">
                                    <button class="${idx}" id="replyModalBtn" type="button">답글 보기</button>
                                    <button class="${idx}" id="delBtn" type="button">삭제</button>
                                    <button class="${idx}" id="modifyBtn" type="button">수정</button>
                                    <button class="${idx}" id="modifyCheckBtn" type="button">확인</button>
                                </div>
                                <div id="replyModal${idx}" style="display:none">
                                <hr>
                                    <div style="display:table" id="showReply${idx}"></div>
                                    <div style="overflow: hidden" id="replyCmt">
                                        <input class="replyName" id="replyName${idx}" name="replyName" type="text" placeholder="이름">
                                        <input class="replyText" id="replyText${idx}" name="replyText" type="text" placeholder="답글">
                                        <button class="${idx}" id="replyBtn" type="button">답글달기</button>
                                    </div>
                                </div>
                                <hr>`

                $(add_tag).prepend(temp_div)
            }
        }
    })
}

$(document).on('click', '#replyModalBtn', function(){   //답글을 열고 닫기 위한 함수
    let id = $(this).attr('class')
    $('#showReply'+id).empty()
    let modal = $('#replyModal'+id)
    if(modal.attr('style')=="display:none"){
        modal.attr('style', 'display:block')
        $(this).html('답글 닫기')
    } else{
        modal.attr('style', 'display:none')
        $(this).html('답글 보기')
    }
    $.ajax({
        type : "POST",
        url : "fourglass/team1_get_reply",
        data : {'id_give': id},
        success : function (response){  //성공하면 답글이 바로 위에 달린다
            let rows = response['list']
            for(let i=0; i<rows.length; i++){
                let replyName = rows[i]['replyName']
                let replyText = rows[i]['replyText']
                let temp_html = `<div style="display:table-row">
                                <input class="replyListName" readonly value="${replyName}" onfocus="this.blur();">
                                <input class="replyListText" readonly value="${replyText}" onfocus="this.blur();"></div>`
                $('#showReply'+id).prepend(temp_html)
            }
        }
    })
})

$(document).on('click', '#replyBtn', function(){
    let id = $(this).attr('class')
    let replyName = $('#replyName'+id).val()
    let replyText = $('#replyText'+id).val()
    $.ajax({
        type: "POST",
        url: "/fourglass/team1_add_reply",
        data: {'id_give': id, 'name_give': replyName, 'text_give': replyText},
        success: function (response) {
            let temp_html = `<div style="display:table-row">
                             <input class="replyListName" readonly value="${replyName}" onfocus="this.blur();">
                             <input class="replyListText" readonly value="${replyText}" onfocus="this.blur();"></div>`
            $('#replyName'+id).val("")
            $('#replyText'+id).val("")
            $('#showReply'+id).append(temp_html)
        },
        error: function (response) {
            console.log(response);
        }
    });
})
