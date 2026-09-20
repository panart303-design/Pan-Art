// ========================================
// PAN ART - ADMIN ARTWORK UPLOAD
// ========================================

// ========================================
// GET ELEMENTS
// ========================================

const uploadForm = document.getElementById(
"artworkUploadForm"
);

const artworkImage = document.getElementById(
"artworkImage"
);

const imagePreviewContainer =
document.getElementById(
"imagePreviewContainer"
);

const imagePreview =
document.getElementById(
"imagePreview"
);

const uploadButton =
document.getElementById(
"uploadBtn"
);

const message =
document.getElementById(
"message"
);

const logoutButton =
document.getElementById(
"logoutBtn"
);

// ========================================
// IMAGE PREVIEW
// ========================================

artworkImage.addEventListener(
"change",
() => {


    const file =
        artworkImage.files[0];

    if (!file) {

        imagePreviewContainer.classList.add(
            "hidden"
        );

        imagePreview.src = "";

        return;
    }


    // Check image type

    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ];


    if (
        !allowedTypes.includes(
            file.type
        )
    ) {

        showMessage(
            "Please select a JPG, JPEG, PNG or WEBP image.",
            "error"
        );

        artworkImage.value = "";

        imagePreviewContainer.classList.add(
            "hidden"
        );

        return;
    }


    // Check image size

    const maxSize =
        5 * 1024 * 1024;


    if (file.size > maxSize) {

        showMessage(
            "Image size must not exceed 5MB.",
            "error"
        );

        artworkImage.value = "";

        imagePreviewContainer.classList.add(
            "hidden"
        );

        return;
    }


    // Create preview

    const imageUrl =
        URL.createObjectURL(file);

    imagePreview.src =
        imageUrl;

    imagePreviewContainer.classList.remove(
        "hidden"
    );

}

);

// ========================================
// SUBMIT UPLOAD FORM
// ========================================

uploadForm.addEventListener(
"submit",
async (event) => {

    event.preventDefault();


    // Clear previous message

    message.textContent = "";

    message.className = "message";


    // Check image

    if (
        !artworkImage.files[0]
    ) {

        showMessage(
            "Please select an artwork image.",
            "error"
        );

        return;
    }


    // Disable button

    uploadButton.disabled = true;

    uploadButton.textContent =
        "Uploading...";


    try {

        // ====================================
        // CREATE FORM DATA
        // ====================================

        const formData =
            new FormData(
                uploadForm
            );


        // ====================================
        // SEND TO BACKEND
        // ====================================

        const response =
            await fetch(
                "/api/admin/artworks/upload",
                {
                    method: "POST",

                    body: formData,

                    credentials: "include"
                }
            );


        // ====================================
        // READ RESPONSE
        // ====================================

        const data =
            await response.json();


        // ====================================
        // CHECK RESPONSE
        // ====================================

        if (!response.ok || !data.success) {

            showMessage(
                data.message ||
                "Unable to upload artwork.",
                "error"
            );

            return;
        }


        // ====================================
        // SUCCESS
        // ====================================

        showMessage(
            data.message ||
            "Artwork uploaded successfully!",
            "success"
        );


        // ====================================
        // RESET FORM
        // ====================================

        uploadForm.reset();

        imagePreview.src = "";

        imagePreviewContainer.classList.add(
            "hidden"
        );


    } catch (error) {

        console.error(
            "Upload error:",
            error
        );

        showMessage(
            "Unable to connect to the server.",
            "error"
        );

    } finally {

        // Re-enable button

        uploadButton.disabled = false;

        uploadButton.textContent =
            "Upload Artwork";

    }

}

);

// ========================================
// SHOW MESSAGE
// ========================================

function showMessage(
text,
type
) {

message.textContent =
    text;

message.className =
    `message ${type}`;

}

// ========================================
// ADMIN LOGOUT
// ========================================

logoutButton.addEventListener(
"click",
async () => {

    try {

        const response =
            await fetch(
                "/api/admin/logout",
                {
                    method: "POST",

                    credentials: "include"
                }
            );


        const data =
            await response.json();


        if (
            response.ok &&
            data.success
        ) {

            window.location.href =
                "/admin-login.html";

            return;
        }


        showMessage(
            "Unable to logout.",
            "error"
        );


    } catch (error) {

        console.error(
            "Logout error:",
            error
        );

        showMessage(
            "Unable to connect to the server.",
            "error"
        );

    }

}

);