const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const requireAdmin = require("../middleware/adminMiddleware");

const router = express.Router();

// ========================================
// ARTWORK STORAGE LOCATION
// ========================================

const artworkFolder = path.join(
__dirname,
"../uploads/artworks"
);

// Create the folder automatically if it
// does not already exist.

if (!fs.existsSync(artworkFolder)) {
fs.mkdirSync(artworkFolder, {
recursive: true
});
}

// ========================================
// MULTER STORAGE
// ========================================

const storage = multer.diskStorage({

destination: (req, file, cb) => {

    cb(null, artworkFolder);

},

filename: (req, file, cb) => {

    const extension =
        path.extname(file.originalname)
            .toLowerCase();

    const uniqueName =
        `art-${Date.now()}-${Math.round(
            Math.random() * 100000
        )}${extension}`;

    cb(null, uniqueName);

}

});

// ========================================
// ALLOWED IMAGE TYPES
// ========================================

const allowedTypes = [
"image/jpeg",
"image/jpg",
"image/png",
"image/webp"
];

// ========================================
// FILE FILTER
// ========================================

const fileFilter = (req, file, cb) => {

if (!allowedTypes.includes(file.mimetype)) {

    return cb(
        new Error(
            "Only JPG, JPEG, PNG and WEBP images are allowed."
        )
    );

}

cb(null, true);

};

// ========================================
// UPLOAD CONFIGURATION
// ========================================

const upload = multer({

storage,

fileFilter,

limits: {

    fileSize: 5 * 1024 * 1024

}

});

// ========================================
// UPLOAD NEW ARTWORK
// ========================================

router.post(
"/upload",
requireAdmin,
upload.single("artworkImage"),
(req, res) => {

    try {

        const {
            title,
            artist,
            category,
            price
        } = req.body;


        // ====================================
        // CHECK REQUIRED INFORMATION
        // ====================================

        if (
            !title ||
            !artist ||
            !category ||
            !price
        ) {

            if (req.file) {

                fs.unlinkSync(
                    req.file.path
                );

            }

            return res.status(400).json({

                success: false,

                message:
                    "Please provide the artwork title, artist, category and price."

            });

        }


        // ====================================
        // CHECK IMAGE
        // ====================================

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message:
                    "Please upload an artwork image."

            });

        }


        // ====================================
        // VALIDATE PRICE
        // ====================================

        const artworkPrice =
            Number(price);


        if (
            !Number.isFinite(artworkPrice) ||
            artworkPrice <= 0
        ) {

            fs.unlinkSync(
                req.file.path
            );

            return res.status(400).json({

                success: false,

                message:
                    "Please enter a valid artwork price."

            });

        }


        // ====================================
        // CREATE ARTWORK ID
        // ====================================

        const artworkId =
            `art${Date.now()}`;


        // ====================================
        // IMAGE URL
        // ====================================

        const imageUrl =
            `/uploads/artworks/${req.file.filename}`;


        // ====================================
        // PREPARE ARTWORK INFORMATION
        // ====================================

        const newArtwork = {

            id: artworkId,

            title: title.trim(),

            artist: artist.trim(),

            category:
                category.trim().toLowerCase(),

            price: artworkPrice,

            image: imageUrl

        };


        // ====================================
        // LOAD CURRENT ARTWORK CATALOG
        // ====================================
        // Your actual file is:
        //
        // data/artwork.js

        const artworksFile =
            path.join(
                __dirname,
                "../data/artwork.js"
            );


        // Check that the catalog exists.

        if (!fs.existsSync(artworksFile)) {

            fs.unlinkSync(
                req.file.path
            );

            return res.status(500).json({

                success: false,

                message:
                    "Artwork catalog file was not found."

            });

        }


        // Clear the cached version so the
        // latest artwork list is loaded.

        delete require.cache[
            require.resolve(artworksFile)
        ];


        const artworks =
            require(artworksFile);


        // ====================================
        // CHECK FOR DUPLICATE TITLE
        // ====================================

        const existingArtwork =
            artworks.find(
                artwork =>
                    artwork.title.toLowerCase() ===
                    newArtwork.title.toLowerCase()
            );


        if (existingArtwork) {

            fs.unlinkSync(
                req.file.path
            );

            return res.status(409).json({

                success: false,

                message:
                    "An artwork with this title already exists."

            });

        }


        // ====================================
        // CREATE UPDATED CATALOG
        // ====================================

        const updatedArtworks = [
            ...artworks,
            newArtwork
        ];


        // ====================================
        // SAVE UPDATED CATALOG
        // ====================================

        const fileContent =

`const artworks = ${JSON.stringify(
updatedArtworks,
null,
4
)};

module.exports = artworks;
`;

        fs.writeFileSync(
            artworksFile,
            fileContent,
            "utf8"
        );


        // ====================================
        // SUCCESS
        // ====================================

        return res.status(201).json({

            success: true,

            message:
                "Artwork uploaded successfully.",

            artwork:
                newArtwork

        });


    } catch (error) {

        console.error(
            "Artwork upload error:",
            error
        );


        // Remove uploaded image if something
        // went wrong after uploading it.

        if (req.file) {

            try {

                if (fs.existsSync(req.file.path)) {

                    fs.unlinkSync(
                        req.file.path
                    );

                }

            } catch (deleteError) {

                console.error(
                    "Unable to remove uploaded image:",
                    deleteError
                );

            }

        }


        return res.status(500).json({

            success: false,

            message:
                "Unable to upload artwork."

        });

    }

}

);

module.exports = router;