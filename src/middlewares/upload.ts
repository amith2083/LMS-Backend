import multer from "multer"

const storage = multer.memoryStorage(); // Store file in memory (so you can use buffer)

export const upload = multer({ storage });