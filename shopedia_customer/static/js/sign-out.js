$(document).ready(function() {
	$("#sign-out-btn").click(function (e) {
		$.ajax({
			type: 'GET',
			url: '/sign-out/',
			success: function (data) {
				console.log('Submission was successful.');
				if(data['status'] == "failed"){
					alert("An error occurred.")
				}
				else if (data['status'] == "successful"){
					alert('User has been singed out')
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