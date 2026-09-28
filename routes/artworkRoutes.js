const express = require("express");

const requireLogin = require("../middleware/authMiddleware");

const router = express.Router();

// ========================================
// GET ALL ARTWORKS
// ========================================

router.get(
"/",
requireLogin,
(req, res) => {


    try {

        // Load the current artwork catalog.
        // The file is automatically updated
        // whenever an admin uploads artwork.

        const artworksFile =
            require.resolve("../data/artwork.js");

        // Remove cached version so newly uploaded
        // artworks appear immediately.

        delete require.cache[artworksFile];

        const artworks =
            require(artworksFile);


        // ====================================
        // CATEGORY FILTER
        // ====================================

        const { category } =
            req.query;

        let result =
            artworks;


        if (
            category &&
            category.toLowerCase() !== "all"
        ) {

            result =
                artworks.filter(
                    artwork =>
                        artwork.category.toLowerCase() ===
                        category.toLowerCase()
                );

        }


        // ====================================
        // SEND ARTWORKS
        // ====================================

        return res.status(200).json({

            success: true,

            artworks: result

        });


    } catch (error) {

        console.error(
            "Get artworks error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to load artworks."

        });

    }

}


);

// ========================================
// GET ONE ARTWORK
// ========================================

router.get(
"/:id",
requireLogin,
(req, res) => {


    try {

        // Load the latest artwork catalog.

        const artworksFile =
            require.resolve("../data/artwork.js");

        delete require.cache[artworksFile];

        const artworks =
            require(artworksFile);


        // Find artwork using its ID.

        const artwork =
            artworks.find(
                item =>
                    item.id === req.params.id
            );


        // ====================================
        // ARTWORK NOT FOUND
        // ====================================

        if (!artwork) {

            return res.status(404).json({

                success: false,

                message:
                    "Artwork not found."

            });

        }


        // ====================================
        // SEND ARTWORK
        // ====================================

        return res.status(200).json({

            success: true,

            artwork

        });


    } catch (error) {

        console.error(
            "Get single artwork error:",
            error
        );

        return res.status(500).json({

            success: false,

            message:
                "Unable to load artwork."

        });

    }

}


);

module.exports = router;
