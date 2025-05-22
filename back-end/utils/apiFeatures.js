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

    paginate(resPerPage) {
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = (currentPage - 1) * resPerPage;
        
        // Apply limit and skip for proper pagination
        this.query = this.query.limit(resPerPage).skip(skip);
        return this;
    }
    
}

module.exports = ApiFeatures;
