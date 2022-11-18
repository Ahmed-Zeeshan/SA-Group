const express = require('express')
const router = express.Router()

const {getTransactions,addTransaction,updateTransaction,deleteTransaction,getSingleTransaction,getTransactionsByProject,getTransactionsByUser,getTransactionsofUserInProject} = require('../controllers/transactionsController')

router.route('/')
// Get All Transactions
.get(getTransactions)
// Get all Transactions of Project
router.route('/project/:id')
.get(getTransactionsByProject)
//Get all Transactions of User
router.route('/user/:id')
.get(getTransactionsByUser)
//Get all Transactions of User in a project
router.route('/user/project/:user_id/:project_id')
.get(getTransactionsofUserInProject)

// Add a new Transaction
router.route('/')
.post(addTransaction)
// Get Single Transaction
router.route('/:id')
.get(getSingleTransaction)
// Update Single Transaction
router.route('/:id')
.put(updateTransaction)
// Delete Single Transaction
.delete(deleteTransaction)

module.exports = router