<%- include('../templates/user_header', {app: app_const, session, title: "Update Profile"}); %>
<!-- Page content-->
<div class="container-fluid">

  <h1 class="mt-4 text-center"><small>Update Profile</small></h1>


  <div class="cform">
    <div class="cform_wrapper">
      <?php
      if (isset($_SESSION['msg']) &&  $_SESSION['msg'] == "success") {
      ?>
        <div class="alert alert-info py-5">
          <h2>Profile updated successfull</h2>
        </div>
      <?php
        unset($_SESSION['msg']);
      } else {   ?>
        <form id="sign_form" action="" method="POST">
          <span class="aformError"><?php echo getError('form', $errors); ?></span>
          <div class="form-group">
            <label for="email"><b>Email</b></label>
            <input value="<?php echo $email; ?>" required class="form-control" type="email" placeholder="Enter Email" id="email" name="email" type="email" required>
            <span class="formError" id="emailError"><?php echo getError('email', $errors); ?></span>
          </div>
          <div class="form-group">
            <label for="fname"><b>Phone Number</b></label>
            <input value="<?php echo $phone; ?>" required class="form-control" placeholder="Phone number" id="phone" name="phone" required>
            <span class="formError" id="phoneError"><?php echo getError('phone', $errors); ?></span>
          </div>
          <div class="form-group">
            <label for="fname"><b>Full Name</b></label>
            <input value="<?php echo $fname; ?>" required class="form-control" placeholder="Enter Full namel" id="fname" name="fname" required>
            <span class="formError" id="fnameError"><?php echo getError('fname', $errors); ?></span>
          </div>
          <div class="form-group">
            <label for="address"><b>Address</b></label>
            <input value="<?php echo $address; ?>" required class="form-control" placeholder="Enter Address" id="address" name="address" required>
            <span class="formError" id="addressError"><?php echo getError('address', $errors); ?></span>
          </div>
          <div class="form-group" id="sbutton">
            <button type="submit" class="btn btn-block btn-lg btn-primary">Update Profile</button>
          </div>

        </form>
      <?php } ?>
    </div>

  </div>


</div>


<%- include('../templates/user_footer', {app: app_const}); %>