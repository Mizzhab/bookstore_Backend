//import express
const  express = require('express')
const userController = require('./controllers/userController.js')
const bookController = require('./controllers/bookController.js')
const jobController = require('./controllers/jobController')
const appController = require('./controllers/appController')
const jwt  = require('./middleware/jwtMiddleware.js')//import  jwtMiddleware
const multerconfig = require('./middleware/multerMiddleware.js')
const pdfMulterconfig = require('./middleware/pdfMulterMiddleware.js')

//instance
const routes = new express.Router()

//Path to register the user
routes.post('/register', userController.registerController)

//path to login
routes.post('/login', userController.loginController)

//path to get all books
routes.get('/home-books', bookController.homeBookController)

//path to get all jobs
routes.get('/all-jobs',jwt, jobController.getAllJobsController)

//path to edit profile
routes.put('/edit-profile',jwt, multerconfig.single('profile'), userController.updateProfileController)


//path to google login
routes.post('/google-login', userController.googleLoginController)

//---------------------------------USER-----------------------------------

//path to add Books
routes.post('/add-book', jwt, multerconfig.array('uploadImages',3), bookController.addBookController)

//path to get all books - user
routes.get('/all-books-user', jwt, bookController.getAllBookUserController)

//path to view book
routes.get('/view-book/:id', bookController.viewBookController)

//path to get user added books
routes.get('/all-user-added-books', jwt, bookController.allUserAddedBooksController)

//path to get user brought books
routes.get('/all-user-brought-books', jwt, bookController.allUserBroughtBooksController)

//path to delete a book
routes.delete('/delete-book/:id', bookController.deleteABookController)
//path to add new application
routes.post('/add-application', jwt, pdfMulterconfig.single('resume'), appController.addApplicationController)

//path to make payment
routes.put('/make-payment', jwt, bookController.paymentController)

//--------------------------ADMIN------------------------------------
//path to get all books
routes.get('/all-books', bookController.allBooksController)

//path to approve book
routes.put('/approve-book/:id', bookController.approveBookController)

//path to get all user
routes.get('/all-users', userController.getAllUserController)

//path to add new job
routes.post('/add-job',jwt, jobController.addJobController)

//path to delete a job
routes.delete('/delete-job/:id', jobController.deleteJobController)

//path to get all applications
routes.get('/all-applications', appController.getAllApplicationController)

module.exports = routes
