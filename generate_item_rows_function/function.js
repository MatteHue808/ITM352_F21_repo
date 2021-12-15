// Function that calculates values for the invoice (Taken from Invoice4 WOD)
function generate_item_rows(POST, response) {
    {
            // Subtotal is 0 at first
            subtotal = 0;
            invoice_rows = '';
            // If quantity is greater than 0, display the invoice 
            for (i in products_array) {
                qty = quantity_data[`quantity${i}`];
                if(qty > 0) {
                    // Generates the item rows for products -> Taken from Invoice4 WOD
                    extended_price = qty * products_array[i].price
                    subtotal = subtotal + extended_price;
                    invoice_rows += (`
                    <tr>
                    <td style="text-align: left;">${products_array[i].product}</td>
                    <td align="center">${qty}</td>
                    <td style="text-align: center">\$${products_array[i].price}</td>
                    <td style="text-align: right;">\$${extended_price.toFixed(2)}</td>
                  </tr>
          `);
                }
            }
    
        // Load template and send invoice
        var contents = fs.readFileSync('./template/invoice.template', 'utf8'); // Use an Invoice Template to display invoice
        response.send(eval('`' + contents + '`'));
    
        }
    } 


 // Process purchase requests (validate quantities, check quantity available)
 // If the quantities are valid, display invoice. If not, send back to products_display
 app.post("/purchase", function (request, response) {
    //if there are quantities and there are no error display the invoice if not then alert 
       quantity_data = request.body;
       console.log(request.body);
       // Assume no errors at first
       var errorsfound = false;
       // Assume no quantities at first
       var quantitiesfound = false;    
       // Assume that there are quantities available
       var quantitiesavailable = true;
       // Check if no errors, if error is false, check if has quantities if there are, check if products are in stock (modified function in Invoice 4 WOD)
       for (let i in products_array) {
           let qty = request.body[`quantity${i}`];
           // Check if the quantity is available!
           if (qty > products_array[i].quantity_available) {
               quantitiesavailable = false;
           }
           // Check if this quantity is non neg int
           if (isStringNonNegInt(qty) == false) {
               errorsfound = true;
           }
           // Check if we have at least 1
           if(qty > 0) {
               quantitiesfound = true;
           }
       }
       // If quantities are found and no errors are found in the textbox, then generate an invoice, otherwise, send an error alert!
           if (errorsfound == false && quantitiesfound == true && quantitiesavailable == true) {
           
           // Subtract from inventory using quantities
           for (i = 0; i < products_array.length; i++) {
               products_array[i].quantity_available -= Number(request.body[`quantity${i}`]);
           }
           // Creates variables for potential errors (assumes no errors initially)
           var incorrect_login = [];
           var incorrect_password = [];
           var incorrect_username = [];
   
           // Displays the login page
           var contents = fs.readFileSync(__dirname + '/template/login_page.template', 'utf8'); // Uses template from template folder for formatting
           response.send(eval('`' + contents + '`'));
           
       } else {// If there are errors then show error
           response_string="<script> alert('Invalid quantities detected. Please review your purchase.');</script>";
           response.send(response_string);
           response.redirect("./products_display.html");
           location.reload()
       }
   }); 