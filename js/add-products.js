
const btnCreate = document.getElementById('btn-create-product');

btnCreate.addEventListener('click', async () => {

    const productForm = document.getElementById('product-form');

    const nombre = productForm.querySelector('#product-select').value;
    const precio = productForm.querySelector('#priceProduct').value;
    const descripcion = productForm.querySelector('#descriptionProduct').value;
    const stock = productForm.querySelector('#stockProduct').value;
    const imagen = document.getElementById('imagen-pro').attributes[1].value;

     const response = await fetch('http://localhost:3000/api/productos', {
         method: 'POST',
         headers: {
                 'Content-Type': 'application/json'
             },
         body: JSON.stringify({
                 nombre,
                 descripcion,
                 precio,
                 stock,
                 imagen
             })
     })
     const data = await response.json()
     if (data.id) {
         alert("Producto Creado con éxito");
         productForm.reset();
     }

})