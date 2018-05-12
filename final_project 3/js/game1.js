var drop1 = false;
var drop2 = false;
var drop3 = false;
var drop4 = false;
var drop5 = false;
var drop6 = false;

$(function() {

      $("#rs1").draggable();
      $("#rs2").draggable();
      $("#rs3").draggable();
      $("#rs4").draggable();
      $("#rs5").draggable();
      $("#bs1").draggable();
      $("#bs2").draggable();
      $("#bs3").draggable();
      $("#bs4").draggable();
      $("#bs5").draggable();
      $("#r1").droppable({
        accept: "#rs1",
        tolerance:"touch",
        drop: function(event, ui) {
            $(this).attr("src","img/weiqi/plane-wing.png");
                   
            $("#rs1").css("visibility","hidden");
            drop1 = true;
        }
    });
      $("#r2").droppable({
        accept: "#rs2",
        tolerance:"touch",
        drop: function(event, ui) {
            $(this).attr("src","img/weiqi/plane-body.png");
                   
            $("#rs2").css("visibility","hidden");
            drop2 = true;
        }
    });
      $("#r3").droppable({
        accept: "#rs3",
        tolerance:"touch",
        drop: function(event, ui) {
            $(this).attr("src","img/weiqi/plane-wing2.png");
                   
            $("#rs3").css("visibility","hidden");
            drop3 = true;
            drop4 = true;
        }
    });

        $("#r4").droppable({
        accept: "#rs4",
        tolerance:"touch",
        drop: function(event, ui) {
            $(this).attr("src","img/weiqi/jet1.png");
            $("#r6").attr("src","img/weiqi/jet1.png");       
            $("#rs4").css("visibility","hidden");
            drop3 = true;
            drop4 = true;
        }
    });

      $("#r5").droppable({
        accept: "#rs5",
        tolerance:"touch",
        drop: function(event, ui) {
            $(this).attr("src","img/weiqi/plane-x.png");
                   
            $("#rs5").css("visibility","hidden");
            drop5 = true;
        }
    });

   $("#r6").droppable({
        accept: "#rs4",
        tolerance:"touch",
        drop: function(event, ui) {
            $(this).attr("src","img/weiqi/jet1.png");
             $("#r4").attr("src","img/weiqi/jet1.png"); 
                   
            $("#rs4").css("visibility","hidden");
            drop6 = true;
        }
    });

  /*boat*/


      $("#b1").droppable({
        accept: "#bs1",
        tolerance:"touch",
        drop: function(event, ui) {
            $(this).attr("src","img/weiqi/subrine-wing.png");
            $("#b3").attr("src","img/weiqi/subrine-wing2.png");      
            $("#bs1").css("visibility","hidden");
        }
    });
      $("#b2").droppable({
        accept: "#bs2",
        tolerance:"touch",
        drop: function(event, ui) {
            $(this).attr("src","img/weiqi/subrine-body.png");
                   
            $("#bs2").css("visibility","hidden");
        }
    });
      $("#b3").droppable({
        accept: "#bs1",
        tolerance:"touch",
        drop: function(event, ui) {
            $(this).attr("src","img/weiqi/subrine-wing2.png");
            $("#b1").attr("src","img/weiqi/subrine-wing.png"); 
                   
            $("#bs3").css("visibility","hidden");
        }
    });

        $("#b4").droppable({
        accept: "#bs3",
        tolerance:"touch",
        drop: function(event, ui) {
            $(this).attr("src","img/weiqi/cabine.png");
                
            $("#bs3").css("visibility","hidden");
        }
    });

      $("#b5").droppable({
        accept: "#bs5",
        tolerance:"touch",
        drop: function(event, ui) {
            $(this).attr("src","img/weiqi/subrine-x.png");
                   
            $("#bs5").css("visibility","hidden");
        }
    });

   $("#b6").droppable({
        accept: "#bs4",
        tolerance:"touch",
        drop: function(event, ui) {
            $(this).attr("src","img/weiqi/subrine-staw.png");
         
                   
            $("#bs4").css("visibility","hidden");
        }
    });

  $("#generate_button").click(function(){
    $(".generate_space").css("height","100%");
    $(".generate_space").css("opacity","1");
  });

  $("#close_button").click(function(){
    $(".generate_space").css("opacity","0");
    $(".generate_space").css("height","0");
  });

});
