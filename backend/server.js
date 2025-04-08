import { app } from './app.js';
import connectDB from './src/db/index.js';


const PORT = process.env.PORT || 5000;

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    })
})
.catch(() => {
    console.error('Error connecting to the database');
    process.exit(1);
});
