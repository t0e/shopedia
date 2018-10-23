$(document).ready(function() {
	$("#sign-out-btn").click(function (e) {
		$.get("/sign-out/", function(response) {
			location.reload();
		});
	});
});
