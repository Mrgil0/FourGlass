$(document).ready(function(){
    show_comment()
});
let num;
if(num==null){
    num = 0
}

function addComment(){
    if($('.name').val()=="" || $('.comment').val()=="" || $('#pass').val()==""){
        alert('이름이나 내용을 입력해주세요.');
        return;
    }
    let name = $('#name').val();
    let comment = $('#comment').val();
    let pass = $('.pass').val();
    let idx = create_index()
    $.ajax({
        type : 'POST',
        url : '/homework',
        data : {'idx_give':idx, 'name_give':name, 'comment_give':comment, 'pass_give':pass},
        success: function(response){
            alert("추가되었습니다.")
            location.reload()
        },
        error : function(response){
            console.log(response);
        }
    });
}
function create_index(){
    num++
    return num
}
function show_comment(){
    $('#sampleDiv').empty()
    $.ajax({
        type : 'get',
        url : '/fourglass/commentList',
        data : {},
        success : function (response){
            let rows = response['comments']
            for(let i=0; i<rows.length; i++){
                let idx = rows[i]['idx']
                let name = rows[i]['name']
                let comment = rows[i]['comment']
                let temp_div = `<div style="overflow: hidden" id="replyCmt">
                                    <p style="display:none">${idx}</p>
                                    <p style="float:left; margin:0 3px; padding:10px; border: 1px;">${name}</p>
                                    <p style="float:left; margin:0 3px; padding:10px; border: 1px;">${comment}</p>
                                    <button class="${rows[i]['idx']}" id="replyBtn" type="button" style="float:left; margin:0 3px; padding:10px; border: 1px;">댓글</button>
                                    <button class="${rows[i]['idx']}" id="delBtn" type="button" style="float:right; margin:0 3px; padding:10px; border: 1px;">삭제</button>
                                </div>`
                $('#sampleDiv').append(temp_div)
            }
        }
    })

}
$(document).on('click', '#delBtn', function(){
    let num = prompt('비밀번호를 입력하세요.')
    let id = $(this).attr('class')
    $.ajax({
        type : 'POST',
        url : '/fourglass/find',
        data : {'id_give' : id},
        success : function (response){
            let result = response['result']
            if(num == result[0]['pass']){
                removeCmt(result[0]['name'])
            } else{
                alert("비밀번호가 일치하지 않습니다.")
            }
        }
    })
});

$(document).one('click', '#replyBtn', function (){
    let idx = $(this).attr('class')
    $('#replyCmt').prepend('<form name="reply" action="fourglass/addReply" method="POST" style="display:inline-block">' +
        '<input name="idx" value="' + idx + '" type="hidden">' +
        '<input class="name" type="text" id="replyName" name="name" placeholder="이름 입력" maxlength="3" style="margin:0 3px; padding:10px; border: 5px;">' +
        '<input type="text" id="replyTxt" name="text", placeholder="내용" style="margin:0 3px; padding:10px; border: 5px;">' +
        '<button id="addReplyBtn" type="submit">추가</button></form>')
});

function showReply(){
    let temp_html = '<p style="float:left; margin:0 3px; padding:10px; border: 1px;">${name}</p>\n                                    ' +
                '            <p style="float:left; margin:0 3px; padding:10px; border: 1px;">${text}</p>'
    $('.replyCmt').append(temp_html)
}

function removeCmt(removeName){
    $.ajax({
        type : 'POST',
        url : '/fourglass/del',
        data : {'id_give' : removeName},
        success : function (response){
            alert(response['msg'])
            location.reload()
        }
    })
}