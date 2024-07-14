import { withIronSessionApiRoute } from "iron-session/next";
import sessionOptions from "../../config/session"
import db from '../../db'

// this handler runs for /api/book with any request method (GET, POST, etc)
export default withIronSessionApiRoute(
  async function handler(req, res) {
// User info can be accessed with req.session
    const user = req.session?.user;
    if (!user){
  // No user info on the session means the user is not logged in
    return res.status(401);
    }
    switch(req.method){
//On a POST request, add a book using db.book.add with request body 
          case 'POST':
            try {
              const addedBook = await addBook(user.id, req.body);
              if (!addedBook){
              await req.session?.destroy();
                return res.status(401);  
              }
              return res.status(200).json(addedBook);
            } catch(err) {
              return res.status(400).json({error: err.message});
            }
            return 
//On a DELETE request, remove a book using db.book.remove with request body 
          case 'DELETE':
            try {
              const bookDeleted = await deleteBook(user.id, req.body.id);
              if (!bookDeleted){
                await req.session?.destroy();
                return res.status(401);  
              }
              return res.status(200).json(bookDeleted);
            } catch(err) {
              return res.status(400).json({error: err.message});
            }
    }
//Respond with 404 for all other requests
    return res.status(404).end()
  },
  sessionOptions
)

async function addBook(userId,book){
  return db.book.add(userId,book)
}

async function deleteBook(userId, bookId){
  return db.book.remove(userId, bookId)
}