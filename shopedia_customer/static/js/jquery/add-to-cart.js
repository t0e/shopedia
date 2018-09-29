$(document).ready(function(){
	$(".add-to-cart" ).click(function() {
		console.log("zzzzzz")
		var user_id = $(this).attr('user_id');
		var item_id = parseInt($(this).attr('itemid'));
		var data = {
			user_id: user_id,
			items: [item_id]
		};

		console.log(JSON.stringify(data))

		$.ajax({
			type: "POST",
			url: "/add-to-cart/",
			dataType: "json",
			data: JSON.stringify(data),
			success: function(){
				alert('Item has been successfully added to cart');
			}
		});
	});
});

