/*!
* Start Bootstrap - Simple Sidebar v6.0.5 (https://startbootstrap.com/template/simple-sidebar)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-simple-sidebar/blob/master/LICENSE)
*/
// 
// Scripts
// 
window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
        // if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
        //     document.body.classList.toggle('sb-sidenav-toggled');
        // }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});






function create_category(){
	$("#modal_entry form").trigger('reset');
	$('#modal_entry .modal-header h5').html('New  category');
	$('#modal_entry form button:eq(1)').html('<span class="fa fa-plus"></span> Create');
	$('#modal_entry').modal('show');
	$("#errmsg").html('');
    global_ch_dir = 'create_category';
}

function edit_category(event){
	event.preventDefault();

    let row = $(event.target).closest('tr');
    let cat_id = row.data('id');
    let name = row.data('name');

	$("#modal_entry form").trigger('reset');	
	$("#name").val(name);
    $("#cat_id").val(cat_id);

	global_ch_dir = 'edit_category';
	
	$('#modal_entry .modal-header h5').html('Update Category Name');
	$('#modal_entry form button').html('<span class="fa fa-save"></span> Update');
	$('#modal_entry').modal('show');
	$("#errmsg").html('');

}


function update_category(event){
	
	event.preventDefault();
	
	let name = $("#name").val().trim();
	let cat_id = $("#cat_id").val().trim();
	
	let fdata = {ch: global_ch_dir, name, cat_id};

	let sbutton = $("#sbutton").html(); //grab the initial content
	$("#errmsg").html('');
	$("#sbutton").html('<span class="fa fa-spin fa-spinner fa-2x"></span> Submitting...');
   
   $.ajax({
	 type: "POST",
	 url:   "/user/item-categories",
	 data: fdata,
	 success: function(data){
		     data = data.trim();
			 $("#sbutton").html(sbutton);
			if(data.substr(0, 4) == "PASS"){
				 cat_id = data.substr(4);
                 if(global_ch_dir == 'edit_category'){
                     let row = $("#row_"+cat_id);
                     row.data("name", name);
                     row.find("td:eq(1)").html(name);
                     $("#modal_entry form").trigger('reset');
					 $("#errmsg").html('<div  class="alert alert-success">Category updated successfulyl</div>');
				 }
				 else{
					let html = '<tr id="row_'+cat_id+'" data-id="'+cat_id+'" data-name="'+name+'">'+
                    '<td>'+cat_id+'</td>'+
                    '<td>'+name+'</td>'+
                    '<td class="btn_row"><button onclick="edit_category(event)" class="btn btn-primary">Edit</button> | <button onclick="remove_category(event, 0)" class="btn btn-danger">Delete</button> </td>'+
                    '</tr>';
                    $(".table").prepend(html);
                }
				 $('#modal_entry').modal('hide');
			 }
			 else{
			   $("#errmsg").html('<span class="text-danger">' +data + '</span>');
			  }
		    },
		  });
}


 
function remove_category(event, np){
	    
	   if(np == 0){
		 
        event.preventDefault();
		 glob_entry_id = $(event.target).closest('tr').data('id');

		 $("#modal_delete .modal-body").html('Do you want to remove this Category?'); 
		 $("#modal_delete .delete_action_btn")[0].setAttribute('onClick', 'remove_category(event, 1)');
		 $("#modal_delete").modal('show');  
	 }
     else{
	    let sbutton = $('.table  #row_'+ glob_entry_id + ' .btn_row').html();
	    $('.table  #row_'+ glob_entry_id + ' .btn_row').html('<span class="fa fa-spin fa-spinner"></span> processing...')
			
		 $.ajax({
		 type: "DELETE",
		 url:  "/user/item-categories/"+glob_entry_id,
		 success: function(data){  console.log(data);
		 		if(data.substr(0,4) == 'PASS'){
					
					$('.table  #row_'+ glob_entry_id).remove();
					 
					}
				   else{
                        $('.table  #row_'+ glob_entry_id + ' .btn_row').html(sbutton)
					   alert(data);
					}
				},
			  });	
		}
}




///  Location



function create_location(){
	$("#modal_entry form").trigger('reset');
	$('#modal_entry .modal-header h5').html('New  Location');
	$('#modal_entry form button:eq(1)').html('<span class="fa fa-plus"></span> Create');
	$('#modal_entry').modal('show');
	$("#errmsg").html('');
    global_ch_dir = 'create_location';
}

function edit_location(event){
	event.preventDefault();

    let row = $(event.target).closest('tr');
    let loc_id = row.data('id');
    let name = row.data('name');

	$("#modal_entry form").trigger('reset');	
	$("#name").val(name);
    $("#loc_id").val(loc_id);

	global_ch_dir = 'edit_location';
	
	$('#modal_entry .modal-header h5').html('Update Location Name');
	$('#modal_entry form button').html('<span class="fa fa-save"></span> Update');
	$('#modal_entry').modal('show');
	$("#errmsg").html('');

}


function update_location(event){
	
	event.preventDefault();
	
	let name = $("#name").val().trim();
	let loc_id = $("#loc_id").val().trim();
	
	let fdata = {ch: global_ch_dir, name, loc_id};

	let sbutton = $("#sbutton").html(); //grab the initial content
	$("#errmsg").html('');
	$("#sbutton").html('<span class="fa fa-spin fa-spinner fa-2x"></span> Submitting...');
   
   $.ajax({
	 type: "POST",
	 url:   "/user/item-locations",
	 data: fdata,
	 success: function(data){
		     data = data.trim();
			 $("#sbutton").html(sbutton);
			if(data.substr(0, 4) == "PASS"){
				 loc_id = data.substr(4);
                 if(global_ch_dir == 'edit_location'){
                     let row = $("#row_"+loc_id);
                     row.data("name", name);
                     row.find("td:eq(1)").html(name);
                     $("#modal_entry form").trigger('reset');
					 $("#errmsg").html('<div  class="alert alert-success">Location updated successfulyl</div>');
				 }
				 else{
					let html = '<tr id="row_'+loc_id+'" data-id="'+loc_id+'" data-name="'+name+'">'+
                    '<td>'+loc_id+'</td>'+
                    '<td>'+name+'</td>'+
                    '<td class="btn_row"><button onclick="edit_location(event)" class="btn btn-primary">Edit</button> | <button onclick="remove_location(event, 0)" class="btn btn-danger">Delete</button> </td>'+
                    '</tr>';
                    $(".table").prepend(html);
                }
				 $('#modal_entry').modal('hide');
			 }
			 else{
			   $("#errmsg").html('<span class="text-danger">' +data + '</span>');
			  }
		    },
		  });
}


 
function remove_location(event, np){
	    
	   if(np == 0){
		 
        event.preventDefault();
		 glob_entry_id = $(event.target).closest('tr').data('id');

		 $("#modal_delete .modal-body").html('Do you want to remove this location?'); 
		 $("#modal_delete .delete_action_btn")[0].setAttribute('onClick', 'remove_location(event, 1)');
		 $("#modal_delete").modal('show');  
	 }
     else{
		
	    let sbutton = $('.table  #row_'+ glob_entry_id + ' .btn_row').html();
	    $('.table  #row_'+ glob_entry_id + ' .btn_row').html('<span class="fa fa-spin fa-spinner"></span> processing...')
			
		 $.ajax({
		 type: "DELETE",
		 url:  "/user/item-locations/"+glob_entry_id,
		 success: function(data){  console.log(data);
		 		if(data.substr(0,4) == 'PASS'){
					
					$('.table  #row_'+ glob_entry_id).remove();
					 
					}
				   else{
                        $('.table  #row_'+ glob_entry_id + ' .btn_row').html(sbutton)
					   alert(data);
					}
				},
			  });	
		}
}


// END Location



// START ADD/EDIT PRODUCT
function update_item(event, ch){
	
	event.preventDefault();	
	let fdata = new FormData($(event.target)[0]);
	fdata.append("ch", ch);

	$(".form_error").remove();
	let sbutton = $("#sbutton").html(); //grab the initial content
	$("#errmsg").html('');
	$("#sbutton").html('<span class="fa fa-spin fa-spinner fa-2x"></span> Submitting...');
   
   $.ajax({
	 type: "POST",
	 url:   (ch == 'add_item')?"/user/add-item":"/user/edit-item",
	 data: fdata,
	 cache: false,
	 processData : false,
	 contentType : false,
	 success: function(data){
		     data = data.trim();
			 $("#sbutton").html(sbutton);

             try{
                 let rdata = JSON.parse(data);
                 if('prd_id' in rdata){ // Added successfully
                    if(ch == 'add_item'){
                        myalert('<div class="alert alert-success"><h2>Your item has been added successfully!</h2></div>');
                        $("form")[0].reset();
                        $("form")[0].scrollIntoView();
                    }
                    else{
                        myalert('<div class="alert alert-success"><h2>Item updated successfully!</h2></div>');
                    }
                }
                 else{
                     rdata['errors'].forEach(function(error){
                         $("#"+error[0]).after('<span class="form_error">'+error[1]+'</span>');
						 $("#"+error[0])[0].focus();
                     });
                     myalert('<div class="alert alert-danger">Error!</div>');
                 }

             }
             catch(exception){
                myalert('<div class="alert alert-danger">'+data+'</div>');
             }

		},
	});	
}
// END ADD?EDIT PRODUCT 



// REMOVE PRODUCT

function remove_item(event, np){
	    
    if(np == 0){
      
     event.preventDefault();
      glob_entry_id = $(event.target).closest('tr').data('id');

      $("#modal_delete .modal-body").html('Do you want to remove this Item?'); 
      $("#modal_delete .delete_action_btn")[0].setAttribute('onClick', 'remove_item(event, 1)');
      $("#modal_delete").modal('show');  
  }
  else{
     
     let fdata = {prd_id: glob_entry_id};
     let sbutton = $('.table  #row_'+ glob_entry_id + ' .btn_row').html();
     $('.table  #row_'+ glob_entry_id + ' .btn_row').html('<span class="fa fa-spin fa-spinner"></span> processing...')
         
      $.ajax({
      type: "DELETE",
      url:  "/user/remove-item/"+glob_entry_id,
      success: function(data){  console.log(data);
              if(data.substr(0,4) == 'PASS'){
                 
                 $('.table  #row_'+ glob_entry_id).remove();
                  
                 }
                else{
                     $('.table  #row_'+ glob_entry_id + ' .btn_row').html(sbutton)
                    alert(data);
                 }
             },
           });	
     }
}




function update_profile(event) {
	event.preventDefault();
  
	let email = $("#email").val().trim();
	let fname = $("#fname").val().trim();
	let phone = $("#phone").val().trim();
	let address = $("#address").val().trim();
  
	let fdata = {email, fname, phone, address};
  
	let sbutton = $("#sbutton").html(); //grab the initial content
  
	$("#errmsg").html("");
	$(".form_error").remove();
  
	$("#sbutton").html(
	  '<span class="fa fa-spin fa-spinner fa-2x"></span>Please wait...'
	);
	$("#report").html('');
  
	$.ajax({
	  type: "POST",
	  url: "/user/update-profile",
	  data: fdata,
	  success: function (data) {
		$("#sbutton").html(sbutton);
		if(data == 'PASS'){
		  $("#report").html('<div class="alert alert-success text-center py-3"><span class="fa  fa-2x fa-check-circle text-success"></span> Account updated succefully </div>');
		}
		else{
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
  


  
function  update_password(event){
	event.preventDefault();
  
	let opassword = $("#opassword").val().trim();
	let password = $("#password").val().trim();
	let password2 = $("#password2").val().trim();
	
	let fdata = {opassword, password, password2};
  
	let sbutton = $("#sbutton").html(); //grab the initial content
  
	$("#errmsg").html("");
	$(".form_error").remove();
  
	$("#sbutton").html(
	  '<span class="fa fa-spin fa-spinner fa-2x"></span>Please wait...'
	);
	$("#report").html('');
  
	$.ajax({
	  type: "POST",
	  url: "/user/change-password",
	  data: fdata,
	  success: function (data) {
		$("#sbutton").html(sbutton);
		if(data == 'PASS'){
			$("#cform")[0].reset();
		  $("#report").html('<div class="alert alert-success text-center py-3"><span class="fa  fa-2x fa-check-circle text-success"></span> Password updated succefully </div>');
		}
		else{
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
  


function myalert(msg){
    $("#modal_alert .modal-body").html(msg);
    $("#modal_alert").modal('show');
}





