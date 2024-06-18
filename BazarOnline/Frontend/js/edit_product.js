$(document).ready(function() {
    const params = new URLSearchParams(window.location.search);
    const productId = params.get('id');

    if (productId) {
        $.ajax({
            type: "GET",
            url: "../../Backend/config/edit_product.php",
            data: { id: productId },
            success: function(response) {
                if (response.success === false) {
                    alert(response.message);
                } else {
                    $('#product-id').val(response.id);
                    $('#product-name').val(response.name);
                    $('#product-description').val(response.description);
                    $('#product-rating').val(response.rating);
                    $('#product-price').val(response.price);
                    $('#product-image-url').val(response.url);
                    $('#product-category').val(response.category);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX error:', status, error);
                alert('An error occurred while fetching product details.');
            }
        });
    }

    $('#edit-product-form').submit(function(event) {
        event.preventDefault();
        const formData = $(this).serialize();
        $.ajax({
            type: "POST",
            url: "../../Backend/config/edit_product.php",
            data: formData,
            success: function(response) {
                if (response.success) {
                    alert('Produkt erfolgreich bearbeitet.');
                    window.location.href = '../../Backend/config/admin.php';
                } else {
                    alert(response.message);
                }
            },
            error: function(xhr, status, error) {
                console.error('AJAX error:', status, error);
                alert('An error occurred while saving the product.');
            }
        });
    });
});
