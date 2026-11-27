/* ==========================================
   LOCAL LIFT - MAIN JAVASCRIPT
   Supabase-connected version
========================================== */


/* ==========================================
   SUPABASE CONFIGURATION
========================================== */

const SUPABASE_URL =
    "https://zhycqeiysojsxjehrwzq.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_rZciRY4sTgpo3CzL-TscPg_VYQJ5_TJ";

let supabaseClient = null;

if (window.supabase) {

    supabaseClient =
        window.supabase.createClient(
            SUPABASE_URL,
            SUPABASE_KEY
        );

    console.log(
        "Supabase connected:",
        supabaseClient
    );

} else {

    console.error(
        "Supabase JS library was not loaded."
    );

}


/* ==========================================
   HELPERS
========================================== */

function escapeCatalogueText(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


function getProductDisplayImage(product) {

    const text =
        `${product.name || ""} ${product.category || ""}`
            .toLowerCase();


    if (
        /sweet|sweets|laddu|mithai|chocolate|candy/
            .test(text)
    ) {
        return "🍬";
    }


    if (
        /rice|wheat|flour|atta|dal|pulses|grain/
            .test(text)
    ) {
        return "🌾";
    }


    if (/oil|ghee/.test(text)) {

        return "🫗";

    }


    if (/coffee|tea/.test(text)) {

        return "☕";

    }


    if (
        /burger|pizza|sandwich|food|snack/
            .test(text)
    ) {
        return "🍔";
    }


    if (
        /shirt|t-shirt|dress|jeans|fashion|clothes/
            .test(text)
    ) {
        return "👕";
    }


    if (/phone|mobile/.test(text)) {

        return "📱";

    }


    if (/earphone|headphone/.test(text)) {

        return "🎧";

    }


    if (/charger|cable/.test(text)) {

        return "🔌";

    }


    const category =
        String(product.category || "")
            .toLowerCase();


    const icons = {

        grocery: "🛒",
        food: "🍴",
        fashion: "👕",
        electronics: "💻",
        education: "📚",
        services: "🛠️"

    };


    return icons[category] || "📦";

}


/* ==========================================
   HOMEPAGE SEARCH
========================================== */

function searchBusinesses() {

    const input =
        document.getElementById("homeSearch");

    if (!input) return;


    const text =
        input.value.trim();


    if (!text) return;


    window.location.href =
        "businesses.html?search=" +
        encodeURIComponent(text);

}


/* ==========================================
   BUSINESS SEARCH / FILTER
========================================== */

function filterBusinesses() {

    const input =
        document.getElementById("businessSearch");

    if (!input) return;


    const text =
        input.value
            .toLowerCase()
            .trim();


    document
        .querySelectorAll(".business-card")
        .forEach(function(card) {

            card.style.display =
                card.innerText
                    .toLowerCase()
                    .includes(text)
                    ? ""
                    : "none";

        });

}


function filterBusinessesByCategory(category) {

    document
        .querySelectorAll(".business-card")
        .forEach(function(card) {

            const cardCategory =
                card.dataset.category || "";


            card.style.display =
                category === "all" ||
                cardCategory === category
                    ? ""
                    : "none";

        });

}


/* ==========================================
   PRODUCT SEARCH / FILTER
========================================== */

function filterProducts() {

    const input =
        document.getElementById("productSearch");

    if (!input) return;


    const text =
        input.value
            .toLowerCase()
            .trim();


    document
        .querySelectorAll(".product-card")
        .forEach(function(card) {

            card.style.display =
                card.innerText
                    .toLowerCase()
                    .includes(text)
                    ? ""
                    : "none";

        });

}


function filterProductsByCategory(category) {

    document
        .querySelectorAll(".product-card")
        .forEach(function(card) {

            const cardCategory =
                card.dataset.category || "";


            card.style.display =
                category === "all" ||
                cardCategory === category
                    ? ""
                    : "none";

        });

}


/* ==========================================
   LOGIN / REGISTER UI
========================================== */

function showRegister() {

    const loginCard =
        document.getElementById("loginCard");

    const registerCard =
        document.getElementById("registerCard");


    if (loginCard) {

        loginCard.style.display =
            "none";

    }


    if (registerCard) {

        registerCard.style.display =
            "block";

    }

}


function showLogin() {

    const loginCard =
        document.getElementById("loginCard");

    const registerCard =
        document.getElementById("registerCard");


    if (loginCard) {

        loginCard.style.display =
            "block";

    }


    if (registerCard) {

        registerCard.style.display =
            "none";

    }

}


/* ==========================================
   SUPABASE REGISTER
========================================== */

function setupRegisterForm() {

    const registerForm =
        document.getElementById("registerForm");


    if (!registerForm || !supabaseClient) {

        return;

    }


    registerForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const name =
                document
                    .getElementById("name")
                    ?.value
                    .trim();


            const email =
                document
                    .getElementById("registerEmail")
                    ?.value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("registerPassword")
                    ?.value;


            const role =
                document
                    .getElementById("accountType")
                    ?.value;


            if (
                !name ||
                !email ||
                !password ||
                !role
            ) {

                alert(
                    "Please fill in all the fields."
                );

                return;

            }


            if (password.length < 6) {

                alert(
                    "Password must be at least 6 characters."
                );

                return;

            }


            const {
                data,
                error
            } =
                await supabaseClient.auth.signUp({

                    email: email,

                    password: password,

                    options: {

                        data: {

                            name: name,

                            role: role

                        }

                    }

                });


            if (error) {

                console.error(
                    "Supabase registration error:",
                    error
                );

                alert(
                    error.message
                );

                return;

            }


            console.log(
                "Supabase account created:",
                data
            );


            registerForm.reset();

            showLogin();


            alert(
                "Account created successfully! You can now log in."
            );

        }

    );

}


/* ==========================================
   SUPABASE LOGIN
========================================== */

function setupLoginForm() {

    const loginForm =
        document.getElementById("loginForm");


    if (!loginForm || !supabaseClient) {

        return;

    }


    loginForm.addEventListener(
        "submit",
        async function(event) {

            event.preventDefault();


            const email =
                document
                    .getElementById("email")
                    ?.value
                    .trim()
                    .toLowerCase();


            const password =
                document
                    .getElementById("password")
                    ?.value;


            const selectedRole =
                document.querySelector(
                    'input[name="role"]:checked'
                )?.value;


            if (
                !email ||
                !password ||
                !selectedRole
            ) {

                alert(
                    "Please enter your email, password and account type."
                );

                return;

            }


            const {
                data,
                error
            } =
                await supabaseClient.auth.signInWithPassword({

                    email: email,

                    password: password

                });


            if (error) {

                console.error(
                    "Supabase login error:",
                    error
                );

                alert(
                    error.message
                );

                return;

            }


            const authUser =
                data.user;


            const name =
                authUser
                    .user_metadata
                    ?.name ||
                "LocalLift User";


            const role =
                authUser
                    .user_metadata
                    ?.role ||
                "customer";


            if (role !== selectedRole) {

                await supabaseClient.auth.signOut();


                alert(
                    "This account is registered as " +
                    (
                        role === "business"
                            ? "Business Owner"
                            : "Customer"
                    ) +
                    ". Please select the correct account type."
                );


                return;

            }


            const loggedInUser = {

                id:
                    authUser.id,

                name:
                    name,

                email:
                    authUser.email,

                role:
                    role

            };


            /*
             * Store only basic profile information
             * locally.
             *
             * Password is NEVER stored here.
             */

            localStorage.setItem(
                "localLiftLoggedInUser",
                JSON.stringify(
                    loggedInUser
                )
            );


            console.log(
                "Supabase login successful:",
                loggedInUser
            );


            if (role === "business") {

                window.location.href =
                    "business-dashboard.html";

            }

            else {

                window.location.href =
                    "index.html";

            }

        }

    );

}


/* ==========================================
   CURRENT USER
========================================== */

function getLoggedInUser() {
    const userData = localStorage.getItem("localLiftLoggedInUser");

    if (!userData) {
        return null;
    }

    try {
        return JSON.parse(userData);
    } catch (error) {
        console.error("Error reading logged-in user:", error);
        localStorage.removeItem("localLiftLoggedInUser");
        return null;
    }
}

/* ==========================================
   LOGOUT - SUPABASE
========================================== */

async function logout() {

    if (supabaseClient) {

        const {
            error
        } =
            await supabaseClient.auth.signOut();


        if (error) {

            console.error(
                "Supabase logout error:",
                error
            );

            alert(
                "Logout failed. Please try again."
            );

            return;

        }

    }


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


    window.location.href =
        user
            ? "profile.html"
            : "login.html";

}


function updateAuthButton() {

    const button =
        document.getElementById(
            "authButton"
        );


    if (!button) return;


    button.textContent =
        getLoggedInUser()
            ? "👤 Profile"
            : "Login";

}


function updateHomeLink() {

    const homeLink =
        document.getElementById(
            "homeNavLink"
        );


    if (!homeLink) return;


    const user =
        getLoggedInUser();


    homeLink.href =
        user &&
        user.role === "business"
            ? "business-dashboard.html"
            : "index.html";

}


/* ==========================================
   PAGE PROTECTION
========================================== */

async function protectPage() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    const user =
        getLoggedInUser();


    if (
        currentPage === "login.html" ||
        currentPage === ""
    ) {

        return;

    }


    if (!user) {

        window.location.href =
            "login.html";

        return;

    }


    /*
     * Check that the Supabase session
     * still exists.
     */

    if (supabaseClient) {

        const {
            data
        } =
            await supabaseClient.auth.getSession();


        if (!data.session) {

            localStorage.removeItem(
                "localLiftLoggedInUser"
            );

            window.location.href =
                "login.html";

            return;

        }

    }


    if (
        currentPage ===
            "business-dashboard.html" &&
        user.role !== "business"
    ) {

        window.location.href =
            "index.html";

        return;

    }


    if (
        currentPage === "index.html" &&
        user.role === "business"
    ) {

        window.location.href =
            "business-dashboard.html";

    }

}


/* ==========================================
   BUSINESS REGISTRATION - SUPABASE
========================================== */

async function registerBusiness(event) {

    event.preventDefault();


    const user =
        getLoggedInUser();


    if (!user) {

        window.location.href =
            "login.html";

        return;

    }


    if (user.role !== "business") {

        window.location.href =
            "index.html";

        return;

    }


    const businessName =
        document
            .getElementById("businessName")
            ?.value
            .trim();


    const category =
        document
            .getElementById("businessCategory")
            ?.value;


    const address =
        document
            .getElementById("businessAddress")
            ?.value
            .trim();


    const phone =
        document
            .getElementById("businessPhone")
            ?.value
            .trim();


    const description =
        document
            .getElementById("businessDescription")
            ?.value
            .trim();


    if (
        !businessName ||
        !category ||
        !address ||
        !phone ||
        !description
    ) {

        alert(
            "Please fill in all the fields."
        );

        return;

    }


    const {
        data: existingBusinesses,
        error: checkError
    } =
        await supabaseClient
            .from("businesses")
            .select("id")
            .eq(
                "owner_email",
                user.email
            );


    if (checkError) {

        console.error(
            "Error checking business:",
            checkError
        );

        alert(
            "Could not check your business. Please try again."
        );

        return;

    }


    if (
        existingBusinesses &&
        existingBusinesses.length > 0
    ) {

        alert(
            "You have already registered a business."
        );


        window.location.href =
            "business-dashboard.html";


        return;

    }


    const {
        data,
        error
    } =
        await supabaseClient
            .from("businesses")
            .insert([

                {

                    owner_email:
                        user.email,

                    owner_name:
                        user.name,

                    name:
                        businessName,

                    category:
                        category,

                    address:
                        address,

                    phone:
                        phone,

                    description:
                        description

                }

            ])
            .select();


    if (error) {

        console.error(
            "Supabase business error:",
            error
        );

        alert(
            "Business registration failed: " +
            error.message
        );

        return;

    }


    console.log(
        "Business saved to Supabase:",
        data
    );


    alert(
        "Business registered successfully!"
    );


    window.location.href =
        "business-dashboard.html";

}


/* ==========================================
   PRODUCT REGISTRATION - SUPABASE
========================================== */

async function registerProduct(event) {

    event.preventDefault();


    const user =
        getLoggedInUser();


    if (!user) {

        window.location.href =
            "login.html";

        return;

    }


    if (user.role !== "business") {

        window.location.href =
            "index.html";

        return;

    }


    const productName =
        document
            .getElementById("productName")
            ?.value
            .trim();


    const category =
        document
            .getElementById("productCategory")
            ?.value;


    const price =
        document
            .getElementById("productPrice")
            ?.value
            .trim();


    const description =
        document
            .getElementById("productDescription")
            ?.value
            .trim();


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


    const {
        data: businesses,
        error: businessError
    } =
        await supabaseClient
            .from("businesses")
            .select("id,name")
            .eq(
                "owner_email",
                user.email
            )
            .limit(1);


    if (businessError) {

        console.error(
            "Business lookup error:",
            businessError
        );

        alert(
            "Could not find your business."
        );

        return;

    }


    if (
        !businesses ||
        businesses.length === 0
    ) {

        alert(
            "Please register your business first."
        );


        window.location.href =
            "add-business.html";


        return;

    }


    const business =
        businesses[0];


    const {
        error
    } =
        await supabaseClient
            .from("products")
            .insert([

                {

                    owner_email:
                        user.email,

                    owner_name:
                        user.name,

                    business_id:
                        business.id,

                    business_name:
                        business.name,

                    name:
                        productName,

                    category:
                        category,

                    price:
                        price,

                    description:
                        description

                }

            ]);


    if (error) {

        console.error(
            "Supabase product error:",
            error
        );

        alert(
            "Product could not be added: " +
            error.message
        );

        return;

    }


    alert(
        "Product added successfully!"
    );


    window.location.href =
        "business-dashboard.html";

}


/* ==========================================
   CATALOGUE - SUPABASE
========================================== */

async function getMyCatalogue() {

    const user =
        getLoggedInUser();


    if (
        !user ||
        !supabaseClient
    ) {

        return [];

    }


    const {
        data,
        error
    } =
        await supabaseClient
            .from("products")
            .select("*")
            .eq(
                "owner_email",
                user.email
            )
            .order(
                "created_at",
                {
                    ascending: true
                }
            );


    if (error) {

        console.error(
            "Catalogue load error:",
            error
        );

        return [];

    }


    return data || [];

}


function addCatalogueRow(
    product = null
) {

    const tableBody =
        document.getElementById(
            "catalogueBody"
        );


    const emptyMessage =
        document.getElementById(
            "emptyMessage"
        );


    if (!tableBody) return;


    if (emptyMessage) {

        emptyMessage.style.display =
            "none";

    }


    const row =
        document.createElement("tr");


    row.dataset.productId =
        product?.id || "";


    row.innerHTML = `

        <td>

            <input
                type="text"
                class="product-name"
                placeholder="Product name"
                value="${escapeCatalogueText(
                    product?.name || ""
                )}"
            >

        </td>


        <td>

            <select
                class="product-category"
            >

                <option value="">
                    Select category
                </option>


                <option
                    value="grocery"
                    ${
                        product?.category === "grocery"
                            ? "selected"
                            : ""
                    }
                >
                    Grocery
                </option>


                <option
                    value="food"
                    ${
                        product?.category === "food"
                            ? "selected"
                            : ""
                    }
                >
                    Food
                </option>


                <option
                    value="fashion"
                    ${
                        product?.category === "fashion"
                            ? "selected"
                            : ""
                    }
                >
                    Fashion
                </option>


                <option
                    value="electronics"
                    ${
                        product?.category === "electronics"
                            ? "selected"
                            : ""
                    }
                >
                    Electronics
                </option>


                <option
                    value="education"
                    ${
                        product?.category === "education"
                            ? "selected"
                            : ""
                    }
                >
                    Education
                </option>


                <option
                    value="services"
                    ${
                        product?.category === "services"
                            ? "selected"
                            : ""
                    }
                >
                    Services
                </option>

            </select>

        </td>


        <td>

            <input
                type="text"
                class="product-price"
                placeholder="₹400/kg"
                value="${escapeCatalogueText(
                    product?.price || ""
                )}"
            >

        </td>


        <td>

            <input
                type="text"
                class="product-description"
                placeholder="Optional"
                value="${escapeCatalogueText(
                    product?.description || ""
                )}"
            >

        </td>


        <td class="delete-cell">

            <button
                class="delete-btn"
                type="button"
                onclick="deleteCatalogueRow(this)"
            >
                Delete
            </button>

        </td>

    `;


    tableBody.appendChild(row);

}


async function loadCatalogue() {

    const tableBody =
        document.getElementById(
            "catalogueBody"
        );


    const emptyMessage =
        document.getElementById(
            "emptyMessage"
        );


    if (!tableBody) return;


    tableBody.innerHTML = "";


    const products =
        await getMyCatalogue();


    if (!products.length) {

        if (emptyMessage) {

            emptyMessage.style.display =
                "block";

        }

        return;

    }


    if (emptyMessage) {

        emptyMessage.style.display =
            "none";

    }


    products.forEach(
        function(product) {

            addCatalogueRow(
                product
            );

        }
    );

}


async function saveCatalogue() {

    const user =
        getLoggedInUser();


    if (!user) {

        window.location.href =
            "login.html";

        return;

    }


    if (user.role !== "business") {

        window.location.href =
            "index.html";

        return;

    }


    const rows =
        document.querySelectorAll(
            "#catalogueBody tr"
        );


    const rowsToSave = [];


    for (
        const row of rows
    ) {

        const name =
            row
                .querySelector(
                    ".product-name"
                )
                ?.value
                .trim();


        const category =
            row
                .querySelector(
                    ".product-category"
                )
                ?.value;


        const price =
            row
                .querySelector(
                    ".product-price"
                )
                ?.value
                .trim();


        const description =
            row
                .querySelector(
                    ".product-description"
                )
                ?.value
                .trim();


        const id =
            row.dataset.productId;


        if (
            !name &&
            !category &&
            !price &&
            !description
        ) {

            continue;

        }


        if (
            !name ||
            !category ||
            !price
        ) {

            alert(
                "Please complete Product Name, Category and Price for every row."
            );

            return;

        }


        rowsToSave.push({

            id:
                id
                    ? Number(id)
                    : null,

            name:
                name,

            category:
                category,

            price:
                price,

            description:
                description

        });

    }


    const {
        data: businessRows,
        error: businessError
    } =
        await supabaseClient
            .from("businesses")
            .select("id,name")
            .eq(
                "owner_email",
                user.email
            )
            .limit(1);


    if (
        businessError ||
        !businessRows?.length
    ) {

        alert(
            "Please register your business first."
        );

        return;

    }


    const business =
        businessRows[0];


    /*
     * Remove the owner's existing catalogue
     * and write the current sheet.
     */

    const {
        error: deleteError
    } =
        await supabaseClient
            .from("products")
            .delete()
            .eq(
                "owner_email",
                user.email
            );


    if (deleteError) {

        console.error(
            "Catalogue delete error:",
            deleteError
        );

        alert(
            "Could not save catalogue: " +
            deleteError.message
        );

        return;

    }


    if (rowsToSave.length) {

        const insertRows =
            rowsToSave.map(
                function(product) {

                    return {

                        owner_email:
                            user.email,

                        owner_name:
                            user.name,

                        business_id:
                            business.id,

                        business_name:
                            business.name,

                        name:
                            product.name,

                        category:
                            product.category,

                        price:
                            product.price,

                        description:
                            product.description

                    };

                }
            );


        const {
            error: insertError
        } =
            await supabaseClient
                .from("products")
                .insert(
                    insertRows
                );


        if (insertError) {

            console.error(
                "Catalogue save error:",
                insertError
            );

            alert(
                "Could not save catalogue: " +
                insertError.message
            );

            return;

        }

    }


    alert(
        "Catalogue saved successfully!"
    );


    await loadCatalogue();

}


async function deleteCatalogueRow(
    button
) {

    const row =
        button.closest("tr");


    if (!row) return;


    const id =
        row.dataset.productId;


    if (
        id &&
        supabaseClient
    ) {

        const {
            error
        } =
            await supabaseClient
                .from("products")
                .delete()
                .eq(
                    "id",
                    Number(id)
                );


        if (error) {

            console.error(
                "Product delete error:",
                error
            );

            alert(
                "Could not delete product: " +
                error.message
            );

            return;

        }

    }


    row.remove();


    const body =
        document.getElementById(
            "catalogueBody"
        );


    const emptyMessage =
        document.getElementById(
            "emptyMessage"
        );


    if (
        body &&
        body.children.length === 0 &&
        emptyMessage
    ) {

        emptyMessage.style.display =
            "block";

    }

}


/* ==========================================
   LOAD BUSINESSES FROM SUPABASE
========================================== */

async function loadBusinesses() {

    const list =
        document.getElementById(
            "businessList"
        );


    if (
        !list ||
        !supabaseClient
    ) {

        return;

    }


    list.innerHTML =
        "<p>Loading businesses...</p>";


    const {
        data,
        error
    } =
        await supabaseClient
            .from("businesses")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Business loading error:",
            error
        );


        list.innerHTML =
            `<p>Could not load businesses: ${escapeCatalogueText(
                error.message
            )}</p>`;


        return;

    }


    if (
        !data ||
        !data.length
    ) {

        list.innerHTML =
            "<p>No businesses have been registered yet.</p>";

        return;

    }


    list.innerHTML = "";


    data.forEach(
        function(business) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "business-card";


            card.dataset.category =
                business.category || "";


            card.innerHTML = `

                <div class="business-card-content">

                    <h3>
                        ${escapeCatalogueText(
                            business.name
                        )}
                    </h3>


                    <p>
                        <strong>
                            Category:
                        </strong>

                        ${escapeCatalogueText(
                            business.category
                        )}
                    </p>


                    <p>
                        <strong>
                            Address:
                        </strong>

                        ${escapeCatalogueText(
                            business.address
                        )}
                    </p>


                    <p>
                        <strong>
                            Phone:
                        </strong>

                        ${escapeCatalogueText(
                            business.phone
                        )}
                    </p>


                    <p>
                        ${escapeCatalogueText(
                            business.description || ""
                        )}
                    </p>

                </div>

            `;


            list.appendChild(card);

        }
    );


    const params =
        new URLSearchParams(
            window.location.search
        );


    const search =
        params.get("search");


    if (search) {

        const input =
            document.getElementById(
                "businessSearch"
            );


        if (input) {

            input.value =
                search;

        }


        filterBusinesses();

    }

}


/* ==========================================
   LOAD PRODUCTS FROM SUPABASE
========================================== */

async function loadSupabaseProducts() {

    const grid =
        document.getElementById(
            "productGrid"
        );


    if (
        !grid ||
        !supabaseClient
    ) {

        return;

    }


    grid.innerHTML =
        "<p>Loading products...</p>";


    const {
        data,
        error
    } =
        await supabaseClient
            .from("products")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


    if (error) {

        console.error(
            "Product loading error:",
            error
        );


        grid.innerHTML =
            `<p>Could not load products: ${escapeCatalogueText(
                error.message
            )}</p>`;


        return;

    }


    if (
        !data ||
        !data.length
    ) {

        grid.innerHTML =
            "<p>No products have been added yet.</p>";

        return;

    }


    grid.innerHTML = "";


    data.forEach(
        function(product) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "product-card";


            card.dataset.category =
                product.category || "";


            card.innerHTML = `

                <div class="product-image">

                    ${getProductDisplayImage(
                        product
                    )}

                </div>


                <div class="product-info">

                    <h3>
                        ${escapeCatalogueText(
                            product.name
                        )}
                    </h3>


                    <p class="product-category">

                        ${escapeCatalogueText(
                            product.category
                        )}

                    </p>


                    <p class="product-price">

                        ${escapeCatalogueText(
                            product.price
                        )}

                    </p>


                    <p>

                        ${escapeCatalogueText(
                            product.description || ""
                        )}

                    </p>


                    <p class="product-business">

                        <strong>
                            Business:
                        </strong>

                        ${escapeCatalogueText(
                            product.business_name || ""
                        )}

                    </p>

                </div>

            `;


            grid.appendChild(card);

        }
    );

}



/* ==========================================
   PROFILE PAGE
========================================== */

function loadProfilePage() {

    const user = getLoggedInUser();

    if (!user) {
        return;
    }

    const profileName =
        document.getElementById("profileName");

    const profileFullName =
        document.getElementById("profileFullName");

    const profileEmail =
        document.getElementById("profileEmail");

    const profileRole =
        document.getElementById("profileRole");

    const profileAccountType =
        document.getElementById("profileAccountType");

    const displayRole =
        user.role === "business"
            ? "Business Owner"
            : "Customer";

    if (profileName) {
        profileName.textContent =
            user.name || "LocalLift User";
    }

    if (profileFullName) {
        profileFullName.textContent =
            user.name || "LocalLift User";
    }

    if (profileEmail) {
        profileEmail.textContent =
            user.email || "-";
    }

    if (profileRole) {
        profileRole.textContent =
            displayRole;
    }

    if (profileAccountType) {
        profileAccountType.textContent =
            displayRole;
    }
}


/* ==========================================
   BUSINESS DASHBOARD
========================================== */

async function loadBusinessDashboard() {

    const user = getLoggedInUser();

    if (
        !user ||
        user.role !== "business" ||
        !supabaseClient
    ) {
        return;
    }

    const {
        data: businesses,
        error: businessError
    } =
        await supabaseClient
            .from("businesses")
            .select("*")
            .eq("owner_email", user.email)
            .limit(1);

    if (businessError) {

        console.error(
            "Dashboard business loading error:",
            businessError
        );

        return;
    }

    const business =
        businesses && businesses.length
            ? businesses[0]
            : null;

    const {
        count: productCount,
        error: productError
    } =
        await supabaseClient
            .from("products")
            .select("id", {
                count: "exact",
                head: true
            })
            .eq("owner_email", user.email);

    if (productError) {

        console.error(
            "Dashboard product count error:",
            productError
        );

    }

    const totalProducts =
        productCount || 0;

    const dashboardHeading =
        document.querySelector(
            ".dashboard-header h1"
        );

    if (dashboardHeading) {

        dashboardHeading.innerHTML =
            `Welcome, <span>${escapeCatalogueText(
                user.name || "Business Owner"
            )}</span>`;

    }

    const dashboardSubtitle =
        document.querySelector(
            ".dashboard-header p"
        );

    if (dashboardSubtitle) {

        dashboardSubtitle.textContent =
            business
                ? "Manage your business and product catalogue from one place."
                : "Register your business to start using LocalLift.";

    }

    const statCards =
        document.querySelectorAll(
            ".stat-card"
        );

    statCards.forEach(function(card, index) {

        const label =
            card
                .querySelector("p")
                ?.textContent
                .toLowerCase() || "";

        const valueElement =
            card.querySelector("h2");

        if (!valueElement) {
            return;
        }

        if (label.includes("business")) {

            valueElement.textContent =
                business ? "1" : "0";

        }

        else if (label.includes("product")) {

            valueElement.textContent =
                String(totalProducts);

        }

        else if (
            label.includes("status") ||
            label.includes("active")
        ) {

            valueElement.textContent =
                business ? "Active" : "Pending";

        }

        else if (index === 0) {

            valueElement.textContent =
                business ? "1" : "0";

        }

        else if (index === 1) {

            valueElement.textContent =
                String(totalProducts);

        }

        else if (index === 2) {

            valueElement.textContent =
                business ? "Active" : "Pending";

        }

    });

    const infoCard =
        document.querySelector(
            ".dashboard-info-card"
        );

    if (infoCard) {

        const infoTitle =
            infoCard.querySelector("h2");

        const infoText =
            infoCard.querySelector(
                "p:not(.small-title)"
            );

        const smallTitle =
            infoCard.querySelector(
                ".small-title"
            );

        if (business) {

            if (smallTitle) {
                smallTitle.textContent =
                    business.category || "Business";
            }

            if (infoTitle) {
                infoTitle.textContent =
                    business.name || "My Business";
            }

            if (infoText) {

                infoText.textContent =
                    business.description ||
                    "Your LocalLift business profile is ready.";

            }

        }

        else {

            if (smallTitle) {
                smallTitle.textContent =
                    "Business Profile";
            }

            if (infoTitle) {
                infoTitle.textContent =
                    "No business registered";
            }

            if (infoText) {

                infoText.textContent =
                    "Register your business to start adding products and displaying your business on LocalLift.";

            }

        }

    }

    document
        .querySelectorAll(".dashboard-action")
        .forEach(function(action) {

            const actionText =
                action.textContent.toLowerCase();

            if (
                actionText.includes("catalogue") ||
                actionText.includes("catalog")
            ) {

                action.onclick =
                    function() {
                        window.location.href =
                            "catalogue.html";
                    };

            }

        });

}


/* ==========================================
   DOM INITIALIZATION
========================================== */


document.addEventListener(
    "DOMContentLoaded",
    function() {

        setupRegisterForm();

        setupLoginForm();


        updateAuthButton();

        updateHomeLink();

        protectPage();

        loadProfilePage();

        if (
            document.querySelector(
                ".dashboard-header"
            )
        ) {
            loadBusinessDashboard();
        }


        const businessForm =
            document.getElementById(
                "businessForm"
            );


        if (businessForm) {

            businessForm.addEventListener(
                "submit",
                registerBusiness
            );

        }


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


        if (
            document.getElementById(
                "catalogueBody"
            )
        ) {

            loadCatalogue();

        }


        if (
            document.getElementById(
                "businessList"
            )
        ) {

            loadBusinesses();

        }


        if (
            document.getElementById(
                "productGrid"
            )
        ) {

            loadSupabaseProducts();

        }

    }
);