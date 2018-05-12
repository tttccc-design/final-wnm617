$(function() {
    $(".recycle_box").click(function(){
        var css = $(this).find(".box_content").attr("class");

        if(css =="box_content row"){
            $(this).find(".box_content").addClass("box_content_open");
        }else{
            $(this).find(".box_content").removeClass("box_content_open");
        }

    });

});