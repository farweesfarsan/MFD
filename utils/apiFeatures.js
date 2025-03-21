class ApiFeatures {
    constructor(query, queryStr) {
        this.query = query; // MongoDB query object
        this.queryStr = queryStr; // Request query string
    }

    search() {
        const keyword = this.queryStr.keyword
            ? {
                  name: {
                      $regex: this.queryStr.keyword,
                      $options: "i", // Case-insensitive search
                  },
              }
            : {};

        this.query = this.query.find({ ...keyword }); // Correctly update the query object
        return this; // Return the instance for method chaining
    }

    filter(){
        const queryStrCopy = {...this.queryStr};

        const removeFields = ['keyword','limit','page'];
        removeFields.forEach(field => delete queryStrCopy[field]);

        let queryStr = JSON.stringify(queryStrCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)/g, match => `$${match}`)
      
        this.query.find(JSON.parse(queryStr));
        return this;
    }

    // filter() {
    //     const queryStrCopy = { ...this.queryStr };
    
    //     // Remove fields that shouldn't be used for filtering
    //     const removeFields = ["keyword", "limit", "page"];
    //     removeFields.forEach((field) => delete queryStrCopy[field]);
    
    //     // Convert query string to MongoDB operators
    //     let queryStr = JSON.stringify(queryStrCopy);
    //     queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, (match) => `$${match}`);
    
    //     this.query = this.query.find(JSON.parse(queryStr));
    
    //     // Handle price filtering
    //     if (this.queryStr.price) {
    //         const priceRange = JSON.parse(this.queryStr.price); // {gte: value, lte: value}
    //         this.query = this.query.find({
    //             price: { $gte: priceRange.gte || 0, $lte: priceRange.lte || 99999 },
    //         });
    //     }
    
    //     return this;
    // }
    

    // paginate(resPerPage){
    //     const currentPage = Number(this.queryStr.page) || 1;
    //     const skip = (currentPage - 1) * resPerPage; // Correct formula
    //     this.query = this.query.limit(resPerPage).skip(skip); // Correct chaining
    //     return this; 
    // }
    paginate(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = (currentPage - 1) * resPerPage;
        
        // Apply limit and skip for proper pagination
        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }
    
}

module.exports = ApiFeatures;
