//Update the quantity of products in the shopping cart
const inputsQuantity = document.querySelectorAll("input[name='quantity']");
if (inputsQuantity.length > 0) {
    inputsQuantity.forEach(input => {
        input.addEventListener("change", () => {
            const productId = input.getAttribute("product-id");
            const quantity = input.value;

            console.log(productId);
            console.log(quantity);

            window.location.href = `/cart/update/${productId}/${quantity}`;
        });
    });
}
// End Update the quantity of products in the shopping cart