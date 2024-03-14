## Purpose
This is a shopping cart page where user will enter item and its quantity, and the application will store it and display them on the webpage

### Chuk's approach:
1. Create 1 index.html in static => it will have a static page where user can input item and its quantity but wont display any item since they are none
2. Create 1 cart.html in template => User will be redirected to this page when there are items added. This page will show a table of items entered by user, as user continue to add items, the table will grow
3. Create an item class (model) => it consists of item name, quantity, converting to string, i.e. apple|10
4. Create an util class => it consists of mainly 2 methods: serialize and deserialize strings. For instance, a list of [apple|10,orange|10] will be converted to a string of "apple|10,orange|10" for serialization, and vice versa for desreialization.

### run project
mvn clean spring-boot:run


### dependencies needed
SpringWeb, ThymeLeaf, Spring Boot dev tools