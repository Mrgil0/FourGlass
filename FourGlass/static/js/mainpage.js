src = "https://code.jquery.com/jquery-3.4.1.js";
$(document).ready(function () {
  show_comment();
});

function save_comment() {
  let name = $("#name").val();
  let comment = $("#comment").val();
  let pass = $(`#pass`).val();
  if (name == "" || comment == "" || pass == "")
    alert("빈칸이 없도록 입력해주세요.");

  $.ajax({
    type: "POST",
    url: "/main",
    data: { name_give: name, comment_give: comment, pass_give: pass },
    success: function (response) {
      alert(response["msg"]);
      window.location.reload();
    },
  });
}

function show_comment() {
  $.ajax({
    type: "GET",
    url: "/main",
    data: {},
    success: function (response) {
      let rows = response["main"];
      for (let i = 0; i < rows.length; i++) {
        let name = rows[i]["name"];
        let comment = rows[i]["comment"];
        let idx = rows[i]["idx"];
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
                                        </div>`;
        $("#comment-list").append(temp_html);
      }
      //수정버튼을 누르면 리스너 작동
      const corbtns = document.querySelectorAll("#corbtn");
      for (const corbtn of corbtns) {
        corbtn.addEventListener("click", modiRivew);
      }
    },
  });
}

$(document).on("click", "#delbtn", function () {
  let num = prompt("비밀번호를 입력하세요.");
  let id = $(this).attr("class");

  function find_comment(callbackfunc) {
    $.ajax({
      type: "POST",
      url: "/fourglass/main_find_cmt",
      data: { id_give: id },
      success: function (response) {
        console.log(response["result"]);
        let result = response["result"];
        if (num === result[0]["pass"]) {
          callbackfunc(result[0]["idx"]);
        } else {
          alert("비밀번호가 일치하지 않습니다.");
        }
      },
    });
  }

  find_comment(function (idx) {
    $.ajax({
      type: "POST",
      url: "fourglass/main_del_cmt",
      data: { id_give: idx },
      success: function (response) {
        alert(response["msg"]);
        location.reload();
      },
    });
  });
});

/**
 * 비밀번호를 체크하여 맞을경우 수정합니다.
 */
function modiRivew() {
  const getPass = prompt("비밀번호를 입력하세요.");
  const corbtnParent = this.parentNode;
  const name = corbtnParent.querySelector("p").textContent.split(":")[1].trim();
  const footer = corbtnParent.querySelector("footer");
  const content = footer.textContent.trim();

  $.ajax({
    type: "POST",
    url: "/fourglass/main_find_cmt2",
    data: { name_give: name, pass_give: getPass },
    success: function (response) {
      if (!response.result.length) {
        alert("비밀번호가 일치하지 않습니다.");
      } else {
        const getModified = prompt("수정할 내용을 입력하세요", content);
        if (getModified !== null) {
          $.ajax({
            type: "POST",
            url: "/fourglass/main_modified_cmt",
            data: { before_give: content, modified_give: getModified },
            success: function (response) {
              window.location.reload();
            },
          });
        }
      }
    },
  });
}
