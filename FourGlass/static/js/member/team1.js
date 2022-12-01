$(document).ready(function(){
    show_comment('/fourglass/team1_get_cmt', '#sampleDiv')
});

function isDefined(value){
    if(value === undefined){
        return false
    }
    return true
}
let clicked = 0

function isEmpty(value, toggle){
    clicked = 1
    if(value == ""){
        modalOpen("빈칸이 없도록 입력해주세요.")
    } else if(toggle == 0){
        clicked = 0
        modalOpen(value)
    }
}

function create_comment(get_url, add_url){
    let name = $('#name').val();
    let comment = $('#comment').val();
    let pass = $('.pass').val();
    let date = getFormatDate(new Date())
    isEmpty(name, clicked)
    isEmpty(comment, clicked)
    isEmpty(pass, clicked)
    function get_index(callbackfunc){
        $.ajax({
            type : "GET",
            url : get_url,
            data : {},
            success : function(response){
                let rows = response['comments']
                callbackfunc(rows)
            },
            error : function(response) {
                console.log(response)
            }
        });
    }
    get_index(function(rows){
        let idx =1
        for(let i=0; i<rows.length; i++) {
            if(!isDefined(rows[0])){
                break;
            }
            let temp = rows[i]['idx']
            if (temp > idx) {
                idx = temp
            }  //db의 index중 제일 큰값이 idx가 됨
            idx++
        }
        $.ajax({    //댓글 추가
            type: 'POST',
            url: add_url,
            data: {'id_give': idx, 'name_give': name, 'comment_give': comment, 'pass_give': pass, 'date_give': date},
            success: function (response) {
                isEmpty(response['msg'], clicked)
            },
            error: function (response) {
                console.log(response);
            }
        });
    });
}

$(document).on('click', '#delBtn', function(){
    let id = $(this).attr('class')
    let prompt = $("#prompt"+id)
    isEmpty(prompt.val())
    function find_cmt(callbackfunc) {
        $.ajax({
            type : 'POST',
            url : '/fourglass/team1_find_cmt',
            data : {'id_give': id},
            success : function (response){
                let result = response['result']
                if(prompt.val() != result[0]['pass']){
                    isEmpty("비밀번호가 일치하지 않습니다.", 0)
                    return
                }
                callbackfunc(result[0]['idx'])
            }
        })
    }
    find_cmt(function(idx){
         $.ajax({
            type: 'POST',
            url: 'fourglass/team1_del_cmt',
            data: {'id_give': idx},
            success: function (response) {
                isEmpty(response['msg'], clicked)
            }
        });
    });
});

$(document).on('click', '#modifyBtn', function(){   //수정 버튼 클릭
    let comment_id = $(this).attr('class')    //댓글의 id번호 가져오기
    let prompt = $("#prompt"+comment_id)
    isEmpty(prompt.val(), clicked)
    function password_check(callbackfunc){
        $.ajax({
            type: 'POST',
            url: '/fourglass/team1_find_cmt',
            data: {'id_give': comment_id},
            success: function (response) {
                let result = response['result']
                if (prompt.val() != result[0]['pass']) {
                    isEmpty("비밀번호가 일치하지 않습니다.", 0)
                    return
                }
                callbackfunc((result[0]['idx']))
            }
        })
    }
    password_check(function(idx){
        isEmpty("비밀번호가 일치합니다. <br> 댓글을 수정 후 확인 버튼을 클릭하세요", 0)
        prompt.val('')
        $('#comment'+idx).attr('readonly', false)
        $('#comment'+idx).attr('onfocus', this.value=$('#comment'+idx).val())
        $('#name'+idx).attr('readonly', false)
        $('#name'+idx).attr('onfocus', this.value=$('#name'+idx).val())
        $("#modifyCheckBtn"+idx).attr('style', 'visibility:visible')
    })
})

function modifyCheck(id){
    let name = $('#name'+id).val()
    let comment = $('#comment'+id).val()
    let date = getFormatDate(new Date())
    $.ajax({
        type : 'POST',
        url : "/fourglass/team1_update_cmt",
        data : {'id_give': id, 'name_give': name, 'comment_give': comment, 'date_give': date},
        success : function(response){
            isEmpty(response['msg'], clicked)
        }
    })
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
                let date = rows[i]['date']
                let temp_div = `<div style="overflow: hidden">
                                <input class="commentName" id="name${idx}" name="name" type="text" readonly value="${name}" onfocus="this.blur();">
                                <input class="commentText" id="comment${idx}" name="comment" type="text" readonly value="${comment}" onfocus="this.blur();">
                                <button class="${idx}" id="replyModalBtn" type="button">답글 보기</button>
                                <div class="timeBlock">${date}</div>
                                <button class="${idx}" id="delBtn" type="button">삭제</button>
                                <button class="${idx}" id="modifyBtn" type="button">수정</button>
                                <input class="passwordInput" id="prompt${idx}" type="password" placeholder="비밀번호">
                                <div id="hiddenBtn">
                                <button class="${idx}" id="modifyCheckBtn${idx}" onclick="modifyCheck(${idx})" type="button">확인</button>
                                </div>
                            </div>
                            <div id="replyModal${idx}" style="display:none">
                            <hr>
                                <div style="display:table" id="showReply${idx}"></div>
                                <div style="overflow: hidden" id="replyCmt">
                                    <input class="replyName" id="replyName${idx}" name="replyName" type="text" placeholder="이름">
                                    <input class="replyText" id="replyText${idx}" name="replyText" type="text" placeholder="답글">
                                    <button class="${idx}" id="replyBtn" type="button">댓글 달기</button>
                                </div>
                            </div>
                            <hr>`
                $(add_tag).prepend(temp_div)
            }

        }
    })
}

//답글 열고 닫기
$(document).on('click', '#replyModalBtn', function(){   //답글을 열고 닫기 위한 함수
    let id = $(this).attr('class')
    $('#showReply'+id).empty()
    let modal = $('#replyModal'+id)
    if(modal.attr('style')=="display:none"){
        modal.attr('style', 'display:block')
        $(this).html('댓글 닫기')
    } else{
        modal.attr('style', 'display:none')
        $(this).html('댓글 보기')
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

//답글 추가
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


// function 함수명(매개변수){}
// $('#ID값').click(function(e){}
// $(document).on('click', '#ID값', function(){}
