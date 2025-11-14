const books = require('../model/bookModel')
const stripe = require('stripe')(process.env.STRIPESECRETKEY)

//add a book
exports.addBookController = async(req, res)=>{
    //logic
    const{title, author, publisher, language, noofpages, isbn, imageurl, category, price, dprice, abstract} = req.body

    try{
        const existingBook = await books.findOne({title, userMail: req.payload})
        if(existingBook){
            res.status(401).json('Book already exist')
        }else{
            const newBook = new books({
                title, author, publisher, language, noofpages, isbn, imageurl, category, price, dprice, abstract, uploadImages: req.files, userMail:req.payload
        })
        await newBook.save()
        res.status(200).json(newBook)
        }
    } catch (error){
        res.status(500).json(error)
    }
}

//get home books
exports.homeBookController = async(req, res)=>{
    try{
        const allHomeBooks = await books.find().sort({_id:-1}).limit(4)
        res.status(200).json(allHomeBooks)
    }catch(error){
        res.status(500).json(error)
    }
}

//get all book user side

exports.getAllBookUserController = async(req, res)=>{
    const {search} = req.query
    const userMail = req.payload
    try{

        const query ={
            title:{
                $regex: search, $options: "i"
            },
            userMail:{
                $ne: userMail
            }
        }

        const allBooksUser = await books.find(query)
        res.status(200).json(allBooksUser)
    }catch (error){
        res.status(500).json(error)
    }
}

//get a particular book

exports.viewBookController = async(req, res)=>{
    const {id} = req.params
    try{
        const viewBook = await books.findOne({_id:id})
        res.status(200).json(viewBook)
    }catch(error){
        res.status(500).json(error)
    }
}

//get all user added book
exports.allUserAddedBooksController = async(req, res)=>{
    const userMail = req.payload
    try{
        const allUserBooks = await books.find({userMail:userMail})
        res.status(200).json(allUserBooks)
    } catch(error){
        res.status(500).json(error)
    }
}

//get all user added book
 exports.allUserBroughtBooksController = async(req, res)=>{
    const userMail = req.payload
    try{
        const allUserBroughtBooks = await books.find({broughtBy:userMail})
        res.status(200).json(allUserBroughtBooks)
    } catch(error){
        res.status(500).json(error)
    }
}

//delete a particular book
 exports.deleteABookController = async(req, res)=>{
    const {id} = req.params
    console.log(id);
    
    try{
        await books.findByIdAndDelete(id)
        res.status(200).json('deleted')
    }catch(error){
        res.status(500).json(error)
    }
}

exports.paymentController = async(req,res)=>{
    const email = req.payload
    console.log(email);
    const {bookDetails} = req.body
    console.log(bookDetails);

    try {
        const existingBook = await books.findByIdAndUpdate({_id:bookDetails._id},{
            title:bookDetails.title,
            author:bookDetails.author,
            publisher:bookDetails.publisher,
            language:bookDetails.language,
            noofpages:bookDetails.noofpages,
            isbn:bookDetails.isbn,
            imageurl:bookDetails.imageurl,
            category:bookDetails.category,
            price:bookDetails.price,
            dprice:bookDetails.dprice*100,
            abstract:bookDetails.abstract,
            uploadImages:bookDetails.uploadImages.filename,
            userMail:bookDetails.userMail,
            status: 'sold',
            broughtBy: email
        },{new:true})
        console.log(existingBook);
        
        const line_item = [{
            price_data:{
                currency:'inr',
                product_data:{
                    name: bookDetails.title,
                    description:`${bookDetails.author} | ${bookDetails.publisher}`,
                    images:[bookDetails.imageurl],
                    metadata:{
                        title:bookDetails.title,
                        author:bookDetails.author,
                        publisher:bookDetails.publisher,
                        language:bookDetails.language,
                        noofpages:bookDetails.noofpages,
                        isbn:bookDetails.isbn,
                        imageurl:bookDetails.imageurl,
                        category:bookDetails.category,
                        price:`${bookDetails.price}`,
                        dprice:`${bookDetails.dprice}`,
                        abstract:bookDetails.abstract.slice(0,20),
                        // uploadImages:existingBook.uploadImages,
                        userMail:bookDetails.userMail,
                        status: 'sold',
                        broughtBy: email
                    }
                },
                unit_amount: bookDetails.dprice
            },
            quantity:1
        }]
        console.log(line_item);
        

        //create a checkout session for stripe
        const session = await stripe.checkout.sessions.create({
            //payment type
            payment_method_types:['card'],
            mode:'payment',
            line_items: line_item,
            success_url: 'https://bookstore-frontend-flax.vercel.app/payment-success',
            cancel_url:'https://bookstore-frontend-flax.vercel.app/payment-error'
        })

        console.log(session)
        res.status(200).json({sessionUrl:session.url})
    } catch (error) {
        res.status(500).json(error)
    }
}

//-----------------------------ADMIN------------------------------

//to get all books
exports.allBooksController=async(req, res)=>{
    try{
        const allBooks = await books.find({status:'pending'})
        res.status(200).json(allBooks)
    }catch(error){
        res.status(500).json(error)
    }
}

// to approve a book
exports.approveBookController=async(req, res)=>{

    const {id}= req.params
    try{
        const existingBook = await books.find({_id:id})

        const updatedBook = await books.findByIdAndUpdate({_id:id},{
            title:existingBook.title,
            author:existingBook.author,
            publisher:existingBook.publisher,
            language:existingBook.language,
            noofpages:existingBook.noofpages,
            isbn:existingBook.isbn,
            imageurl:existingBook.imageurl,
            category:existingBook.category,
            price:existingBook.price,
            dprice:existingBook.dprice,
            abstract:existingBook.abstract,
            uploadImages:existingBook.uploadImages,
            userMail:existingBook.userMail,
            status:'approved',
            broughtBy:existingBook.broughtBy
        },{new:true})
        res.status(200).json(updatedBook)
    }catch(error){
        res.status(500).json(error)
    }
}