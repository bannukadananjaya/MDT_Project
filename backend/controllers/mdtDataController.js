const asyncHandler =require('express-async-handler')
const FeatureCollection = require('../model/mdtDataModel.js')

//@desc Get data
//@route GET api/data
//@access Public
const getData = asyncHandler(async(req,res) => {
    const data =await FeatureCollection.find()
    res.status(200).json(data)
}
)


//@desc Set data
//@route SET api/data
//@access Public
const setData = asyncHandler(async (req, res) => {
    try {
        const inputData = req.body; // Assuming req.body contains the JSON data
        if (!inputData) {
            res.status(400).json({ error: 'No data provided' });
            console.log(inputData)
            return;
        }

        // Create a new document in the database using the input data
        const newData = await FeatureCollection.create(inputData);

        // Respond with the newly created data
        res.status(201).json(newData);
    } catch (error) {
        console.error('Error saving data to database:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}
)


module.exports = {
    getData,
    setData
}
