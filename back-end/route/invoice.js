const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { sendInvoice } = require('../controller/sendInvoice');

// File upload setup using multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Ensure uploads/ folder exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// POST /api/send-invoice
// router.post('/send-invoice', upload.single('invoice'), sendInvoice);
router.route('/send-invoice').post( upload.single('invoice'),sendInvoice );

module.exports = router;
