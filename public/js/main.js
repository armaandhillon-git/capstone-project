

function sign_in_form(event) {
  event.preventDefault();

  let email = $("#email").val().trim();
  let password = $("#password").val().trim();

  if (password.length < 3) return;

  let fdata = { ch: "sign_in", email, password };

  let sbutton = $("#sbutton").html(); //grab the initial content

  $("#form_error").html("");
  $(".form_error").remove();

  $("#sbutton").html(
    '<span class="fa fa-spin fa-spinner fa-2x"></span>Please wait...'
  );

  $.ajax({
    type: "POST",
    url: "/login",
    data: fdata,
    success: function (data) {
      console.log(data);
      if(data == 'PASS'){
        $("#cform").trigger('reset');
        $("#sbutton").html(
          '<span style="font-size:16px; color:#092; font-weight: bold" class="text-success"> Signing in ......</span>'
        );
        $("form").trigger("reset");
        window.location.replace("/user");
      }
      else{
          $("#sbutton").html(sbutton);
          try{
              let rdata = JSON.parse(data);
              rdata.forEach(function(row){
                  $("#"+row[0]).after('<div class="form_error">'+row[1]+'</div>');
                  $("#"+row[0])[0].focus();
              });
          }catch(exception){
              alert(data);
          }
          
      }

    },
  });
}


function sign_up_form(event) {
  event.preventDefault();

  let email = $("#email").val().trim();
  let password = $("#password").val().trim();
  let password2 = $("#password2").val().trim();
  let fname = $("#fname").val().trim();
  let phone = $("#phone").val().trim();
  let address = $("#address").val().trim();

  if (password.length < 3) return;

  let fdata = { ch: "sign_up", email, fname, phone, address, password, password2 };

  let sbutton = $("#sbutton").html(); //grab the initial content

  $("#errmsg").html("");
  $(".form_error").remove();

  $("#sbutton").html(
    '<span class="fa fa-spin fa-spinner fa-2x"></span>Please wait...'
  );

  $.ajax({
    type: "POST",
    url: "/sign-up",
    data: fdata,
    success: function (data) {
      console.log(data);
      if(data == 'PASS'){
        $("#cform").trigger('reset');
        $("#cform").html('<div class="alert alert-success text-center py-5"><span class="fa  fa-4x fa-check-circle text-success"></span> <br> <br>You have successfully created an account <br><br> <a href="/login">Login to continue</a> </div>');
      }
      else{
          $("#sbutton").html(sbutton);
          try{
              let rdata = JSON.parse(data);
              rdata.forEach(function(row){
                  $("#"+row[0]).after('<div class="form_error">'+row[1]+'</div>');
                  $("#"+row[0])[0].focus();
              });
          }catch(exception){
              alert(data);
          }
          
      }

    },
  });
}



