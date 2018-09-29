$(document).ready(function() {
	$("#login-btn").click(function (e) {
		var username = document.forms["login-form"]["username"].value;
		var password = document.forms["login-form"]["password"].value;

		e.preventDefault();

		$.ajax({
			type: 'POST',
			url: '/login/',
			data: {"username": username, "password": password},
			success: function (data) {
				console.log('Submission was successful.');
				if(data['status'] == "failed"){
					alert("login failed")
				}
				else if (data['status'] == "successful"){
					alert('login successful')
					location.reload();
				}
			},
			error: function (data) {
				console.log('An error occurred.');
				console.log(data);
			},
		});
	});
});