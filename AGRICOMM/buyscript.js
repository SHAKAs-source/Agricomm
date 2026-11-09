function calculateTotal(){
    let tomatoes = Number(document.getElementById("tomatoesQuantity").value) || 0;
    let matooke = Number(document.getElementById("matookeQuantity").value) || 0;
    let beans = Number(document.getElementById("beansQuantity").value) || 0;
    let irishpotatoes = Number(document.getElementById("irishPotatoesQuantity").value) || 0;

    let tomatoesPrice = 5000;
    let beansPrice = 3500;
    let matookePrice = 50000;
    let irishPotatoesPrice = 10000;

    let finalTotal = (tomatoes * tomatoesPrice) + (beans * beansPrice) + (matooke * matookePrice) + (irishPotatoesPrice * irishpotatoes);

    document.getElementById("resultDisplay").innerHTML = "Total = UGX " + finalTotal;
}
                
function addToCart(product, quantityId){
    let qty = Number(document.getElementById(quantityId).value) || 0;

    if (qty <= 0) {
        alert("No quantity for " + product + " entered");
    } else {
        calculateTotal();
        alert(product + " added to cart");
    }
}
