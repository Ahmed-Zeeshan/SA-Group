const transactionModel = require("../models/transactionModel.js");
const projectModel = require("../models/projectModel.js");
const mongoose = require("mongoose");
const { query } = require("express");
const {ObjectId} = require("mongodb");


// Get All Transactions
// Method = Get
// API = http://localhost:5000/api/transactions

exports.getTransactions = async (req, res, next) => {
  try {
    const transactions = await transactionModel.find().populate('project',{name:1}).populate('user',{name:1,email:1,contact:1});

    const sum = transactions.reduce((accumulator, object) => {
      return accumulator + object.amount;
    }, 0);


    if (transactions <= 0) {
      res.status(404).json({
        message: "No Record Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        count: transactions.length,
        Total:sum,
        data: transactions,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "server error",
    });
  }
};


//  get all the transaction of a project
// Method = Get
// API = http://localhost:5000/api/transactions/project/ some_id_here

exports.getTransactionsByProject = async (req, res, next) => {
    try {
        const { project, amount} = req.body
        const _id = ObjectId(req.params.id)
   

        const transaction = await transactionModel.find({project:_id }).populate('project',{name:1}).populate('user',{name:1,email:1,contact:1})
 

        // console.log(transaction)
        // console.log( {to:req.params.id})
    
        
        const sum = transaction.reduce((accumulator, object) => {
            return accumulator + object.amount;
          }, 0);
        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: "No Record Found"
            })
        }
        return res.status(200).json({
            success: true,
            Total_Records: transaction.length,
            total:sum,
            data: transaction
        })
       
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

//  get all the transaction of a user
// Method = Get
// API = http://localhost:5000/api/transactions/user/ some_id_here

exports.getTransactionsByUser = async (req, res, next) => {
    try {
        const { project,user} = req.body
   

        const transaction = await transactionModel.find({user:req.params.id}).populate('project',{name:1}).populate('user',{name:1,email:1,contact:1})
 

        console.log(transaction)
        console.log( {user:req.params.id})
    
        
        const sum = transaction.reduce((accumulator, object) => {
            return accumulator + object.amount;
          }, 0);
        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: "No Record Found"
            })
        }
        return res.status(200).json({
            success: true,
            Total_Records: transaction.length,
            total:sum,
            data: transaction
        })
       
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// All transaction of a user in a project
// Method = Get
// API = http://localhost:5000/api/transactions/user/project/ user_id/ project_id

exports.getTransactionsofUserInProject = async (req, res, next) => {
   
   try {
        const { project,user} = req.body
   

        const transaction = await transactionModel.find({user:req.params.user_id,project:req.params.project_id}).populate('project',{name:1}).populate('user',{name:1,email:1,contact:1})
 

        // console.log(transaction)
        // console.log( {project:req.params.id})
    
        
        const sum = transaction.reduce((accumulator, object) => {
            return accumulator + object.amount;
          }, 0);
        if (!transaction) {
            return res.status(404).json({
                success: false,
                error: "No Record Found"
            })
        }
        return res.status(200).json({
            success: true,
            Total_Records: transaction.length,
            total:sum,
            data: transaction
        })
       
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}



// Get single transaction
// Method = Get
// API = http://localhost:5000/api/transactions/ some_id_here

exports.getSingleTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionModel.findById(req.params.id).populate('project',{name:1}).populate('user',{name:1,email:1,contact:1});
    if (transaction <= 0) {
      res.status(404).json({
        message: "No Record Found",
      });
    } else {
      return res.status(200).json({
        success: true,
        count: transaction.length,
        data: transaction,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "server error",
    });
  }
};

// Add Transactions
// Method = post
// API = http://localhost:5000/api/transactions

exports.addTransaction = async (req, res, next) => {
  try {
    const { user, project, comments, amount } = req.body;

    if (amount <= 0) {
      res.status(400).json({
        success: false,
        error: "Amount should be greater than 0",
      });
    } else {
      const transaction = await transactionModel.create(req.body);

      return res.status(201).json({
        success: true,
        data: transaction,
      });
    }
  } catch (error) {
    if (error.name === "validationError") {
      const messages = Object.values(error.errors).map((val) => val.message);

      return res.status(400).json({
        success: false,
        error: messages,
      });
    } else {
      return res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  }
};

// Update Transactions...

// Method = put
// Api = http://localhost:5000/api/transactions/ some_id_here

exports.updateTransaction = async (req, res, next) => {
  try {
    const id = req.params.id;
    const updatedTransaction = req.body;
    const options = { new: true };

    const result = await transactionModel.findByIdAndUpdate(
      id,
      updatedTransaction,
      options
    );
    if (!result) {
      res.status(404).json({
        success: false,
        error: "Transaction Not found to update",
      });
    } else {
      res.status(201).json({
        success: true,
        data: result,
      });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Transactions
// Method = Delete
// API = http://localhost:5000/api/transactions/ some_id_here

exports.deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await transactionModel.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        error: "No Transaction Found",
      });
    }
    await transaction.remove();

    return res.status(200).json({
      success: true,
      data: {},
      message: "Record Successfully Deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "server error",
    });
  }
};
