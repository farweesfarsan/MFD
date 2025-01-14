
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
        removeFields.forEach( field => delete queryStrCopy[field]);
      
        this.query.find(queryStrCopy);
        return this;
    }

    paginate(resPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resPerPage * currentPage - 1;
        this.query.limit(resPerPage).skip(skip);
        return this; 
    }
}

module.exports = ApiFeatures;
