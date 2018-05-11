/* 可以在此文件中附加页面js */
function hook_main(){
    $("#maintitle").hide();
    $("#subtitle").hide();
}

/* 添加注册说明 */
function hook_register(){
    $("#register .layer-content").prepend(`<div class="layer-content-desc">*请填写真实信息，一旦确认，无法修改。</div>`);
}
