function create_comment(get_url, add_url){ //리스트 가져오기 위한 get_url, 추가할 add_url
    if($('.name').val()=="" || $('.team1comment').val()=="" || $('#pass').val()==""){ //유효성 검사
        alert('빈칸이 없도록 입력해주세요.');
        return;
    }
    let name = $('#name').val();
    let comment = $('#comment').val();
    let pass = $('.pass').val();
    $.ajax({    //댓글 추가
        type : 'POST',
        url : add_url,          //클릭한 버튼의 url
        data : {'name_give':name, 'comment_give':comment, 'pass_give':pass},
        success: function(response){
            alert("추가되었습니다.")
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
                let temp_div = `<div style="overflow: hidden" id="replyCmt">
                                    <p style="float:left; margin:0 3px; padding:10px; border: 1px;">${name}</p>
                                    <p style="float:left; margin:0 3px; padding:10px; border: 1px;">${comment}</p>
                                    <button class="${idx}" id="delBtn" type="button" style="float:right; margin:0 3px; padding:10px; border: 1px;">삭제</button>
                                </div>`
                $(add_tag).append(temp_div)
            }
        }
    })
}

