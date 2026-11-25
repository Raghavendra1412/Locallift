/* ==========================================
   LOCAL LIFT - MAIN JAVASCRIPT
========================================== */


/* ==========================================
   HOMEPAGE SEARCH
========================================== */

function searchBusinesses() {

    const searchInput =
        document.getElementById("homeSearch");

    if (!searchInput) return;

    const searchText =
        searchInput.value.trim();

    if (searchText === "") return;

    window.location.href =
        "businesses.html?search=" +
        encodeURIComponent(searchText);
}



/* ==========================================
   BUSINESS SEARCH
========================================== */

function filterBusinesses() {

    const input =
        document.getElementById("businessSearch");

    if (!input) return;

    const cards =
        document.querySelectorAll(".business-card");

    const searchText =
        input.value.toLowerCase().trim();


    cards.forEach(function(card) {

        const text =
            card.innerText.toLowerCase();

        if (text.includes(searchText)) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

}



/* ==========================================
   PRODUCT SEARCH
========================================== */

function filterProducts() {

    const input =
        document.getElementById("productSearch");

    if (!input) return;

    const cards =
        document.querySelectorAll(".product-card");

    const searchText =
        input.value.toLowerCase().trim();


    cards.forEach(function(card) {

        const text =
            card.innerText.toLowerCase();

        if (text.includes(searchText)) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

}



/* ==========================================
   PRODUCT CATEGORY FILTER
========================================== */

function filterProductsByCategory(category) {

    const cards =
        document.querySelectorAll(".product-card");


    cards.forEach(function(card) {

        const cardCategory =
            card.getAttribute("data-category");


        if (
            category === "all" ||
            cardCategory === category
        ) {

            card.style.display = "";

        } else {

            card.style.display = "none";

        }

    });

}



/* ==========================================
   LOGIN / REGISTER
========================================== */

function showRegister() {

    const loginCard =
        document.getElementById("loginCard");

    const registerCard =
        document.getElementById("registerCard");


    if (loginCard) {

        loginCard.style.display = "none";

    }


    if (registerCard) {

        registerCard.style.display = "block";

    }

}


function showLogin() {

    const loginCard =
        document.getElementById("loginCard");

    const registerCard =
        document.getElementById("registerCard");


    if (loginCard) {

        loginCard.style.display = "block";

    }


    if (registerCard) {

        registerCard.style.display = "none";

    }

}



/* ==========================================
   REGISTER
========================================== */

const registerForm =
    document.getElementById("registerForm");


if (registerForm) {

    registerForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("name")
                    .value
                    .trim();


            const email =
                document
                    .getElementById("registerEmail")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("registerPassword")
                    .value;


            const role =
                document
                    .getElementById("accountType")
                    .value;


            let users =
                JSON.parse(
                    localStorage.getItem(
                        "localLiftUsers"
                    )
                ) || [];


            const existingUser =
                users.find(function(user) {

                    return user.email === email;

                });


            if (existingUser) {

                alert(
                    "An account with this email already exists."
                );

                return;

            }


            const newUser = {

                name: name,

                email: email,

                password: password,

                role: role

            };


            users.push(newUser);


            localStorage.setItem(
                "localLiftUsers",
                JSON.stringify(users)
            );


            alert(
                "Account created successfully!"
            );


            registerForm.reset();

            showLogin();

        }
    );

}



/* ==========================================
   LOGIN
========================================== */

const loginForm =
    document.getElementById("loginForm");


if (loginForm) {

    loginForm.addEventListener(
        "submit",
        function(event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("email")
                    .value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("password")
                    .value;


            const selectedRole =
                document.querySelector(
                    'input[name="role"]:checked'
                ).value;


            const users =
                JSON.parse(
                    localStorage.getItem(
                        "localLiftUsers"
                    )
                ) || [];


            const user =
                users.find(function(user) {

                    return (
                        user.email === email &&
                        user.password === password &&
                        user.role === selectedRole
                    );

                });


            if (!user) {

                alert(
                    "Invalid email, password, or account type."
                );

                return;

            }


            localStorage.setItem(
                "localLiftLoggedInUser",
                JSON.stringify(user)
            );


            if (user.role === "customer") {

                window.location.href =
                    "index.html";

                return;

            }


            if (user.role === "business") {

                window.location.href =
                    "business-dashboard.html";

                return;

            }

        }
    );

}



/* ==========================================
   GET LOGGED-IN USER
========================================== */

function getLoggedInUser() {

    const user =
        localStorage.getItem(
            "localLiftLoggedInUser"
        );


    if (!user) {

        return null;

    }


    try {

        return JSON.parse(user);

    }

    catch (error) {

        localStorage.removeItem(
            "localLiftLoggedInUser"
        );

        return null;

    }

}



/* ==========================================
   LOGOUT
========================================== */

function logout() {

    localStorage.removeItem(
        "localLiftLoggedInUser"
    );

    window.location.href =
        "login.html";

}



/* ==========================================
   PROFILE / AUTH BUTTON
========================================== */

function handleAuthButton() {

    const user =
        getLoggedInUser();


    if (user) {

        window.location.href =
            "profile.html";

    }

    else {

        window.location.href =
            "login.html";

    }

}


function updateAuthButton() {

    const authButton =
        document.getElementById("authButton");


    if (!authButton) return;


    const user =
        getLoggedInUser();


    if (user) {

        authButton.textContent =
            "👤 Profile";

    }

    else {

        authButton.textContent =
            "Login";

    }

}



/* ==========================================
   LOGIN PROTECTION
========================================== */

function protectPage() {

    const currentPage =
        window.location.pathname.split("/").pop();

    const user = getLoggedInUser();

    // Login page does not require authentication
    if (currentPage === "login.html") {
        return;
    }

    // User must be logged in for protected pages
    if (!user) {
        window.location.href = "login.html";
        return;
    }

    // Business Dashboard is only for Business Owners
    if (
        currentPage === "business-dashboard.html" &&
        user.role !== "business"
    ) {
        window.location.href = "index.html";
        return;
    }

    // Customer Home is only for Customers
    if (
        currentPage === "index.html" &&
        user.role === "business"
    ) {
        window.location.href = "business-dashboard.html";
        return;
    }

    // Businesses and Products are accessible
    // to both Customers and Business Owners.
}


/* ==========================================
   PAGE INITIALIZATION
========================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        updateAuthButton();

        protectPage();

    }
);

// ==========================================
// BUSINESS REGISTRATION
// ==========================================

function registerBusiness(event) {

    event.preventDefault();

    const user = getLoggedInUser();

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    if (user.role !== "business") {
        window.location.href = "index.html";
        return;
    }


    const businessName =
        document.getElementById("businessName").value.trim();

    const category =
        document.getElementById("businessCategory").value;

    const address =
        document.getElementById("businessAddress").value.trim();

    const phone =
        document.getElementById("businessPhone").value.trim();

    const description =
        document.getElementById("businessDescription").value.trim();


    if (
        !businessName ||
        !category ||
        !address ||
        !phone ||
        !description
    ) {

        alert("Please fill in all the fields.");

        return;
    }


    // Get existing businesses
    let businesses =
        JSON.parse(
            localStorage.getItem("localLiftBusinesses")
        ) || [];


    // Check whether this owner already has a business
    const existingBusiness =
        businesses.find(
            business =>
                business.ownerEmail === user.email
        );


    if (existingBusiness) {

        alert("You have already registered a business.");

        window.location.href =
            "business-dashboard.html";

        return;
    }


    // Create new business
    const newBusiness = {

        id: Date.now(),

        ownerEmail: user.email,

        ownerName: user.name,

        name: businessName,

        category: category,

        address: address,

        phone: phone,

        description: description

    };


    // Save business
    businesses.push(newBusiness);

    localStorage.setItem(
        "localLiftBusinesses",
        JSON.stringify(businesses)
    );


    alert("Business registered successfully!");


    // Go back to dashboard
    window.location.href =
        "business-dashboard.html";
}


// Connect registration form
document.addEventListener(
    "DOMContentLoaded",
    function () {

        const businessForm =
            document.getElementById("businessForm");

        if (businessForm) {

            businessForm.addEventListener(
                "submit",
                registerBusiness
            );

        }

    }
);

// ==========================================
// PRODUCT REGISTRATION
// ==========================================

function registerProduct(event) {

    event.preventDefault();

    const user = getLoggedInUser();

    if (!user) {
        window.location.href = "login.html";
        return;
    }

    if (user.role !== "business") {
        window.location.href = "index.html";
        return;
    }


    // Check if business owner has a business

    const businesses =
        JSON.parse(
            localStorage.getItem("localLiftBusinesses")
        ) || [];


    const myBusiness =
        businesses.find(
            business =>
                business.ownerEmail === user.email
        );


    if (!myBusiness) {

        alert(
            "Please register your business first."
        );

        window.location.href =
            "add-business.html";

        return;
    }


    // Get form values

    const productName =
        document.getElementById(
            "productName"
        ).value.trim();

    const category =
        document.getElementById(
            "productCategory"
        ).value;

    const price =
        document.getElementById(
            "productPrice"
        ).value;

    const description =
        document.getElementById(
            "productDescription"
        ).value.trim();


    if (
        !productName ||
        !category ||
        !price ||
        !description
    ) {

        alert(
            "Please fill in all the fields."
        );

        return;
    }


    // Get existing products

    let products =
        JSON.parse(
            localStorage.getItem(
                "localLiftProducts"
            )
        ) || [];


    // Create product

    const newProduct = {

        id: Date.now(),

        ownerEmail:
            user.email,

        ownerName:
            user.name,

        businessId:
            myBusiness.id,

        businessName:
            myBusiness.name,

        name:
            productName,

        category:
            category,

        price:
            Number(price),

        description:
            description

    };


    // Save product

    products.push(newProduct);

    localStorage.setItem(
        "localLiftProducts",
        JSON.stringify(products)
    );


    alert(
        "Product added successfully!"
    );


    // Return to dashboard

    window.location.href =
        "business-dashboard.html";
}


// Connect product form

document.addEventListener(
    "DOMContentLoaded",
    function () {

        const productForm =
            document.getElementById(
                "productForm"
            );

        if (productForm) {

            productForm.addEventListener(
                "submit",
                registerProduct
            );

        }

    }
);