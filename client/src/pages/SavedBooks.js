import React, { useState, useEffect } from 'react';
import { Jumbotron, Container, CardColumns, Card, Button } from 'react-bootstrap';
import { GET_ME } from '../utils/queries';
import { useQuery, useMutation } from '@apollo/client';
import Auth from '../utils/auth';
import { removeBookId } from '../utils/localStorage';
import { REMOVE_BOOK } from '../utils/mutations';

const SavedBooks = () => {
  const [userData, setUserData] = useState({});
  const { loading, data: meData } = useQuery(GET_ME);
  const [deleteBook] = useMutation(REMOVE_BOOK, {
    update(cache, { data: { deletedBook } }) {
      try {
        const { savedBooks } = cache.readQuery({ query: GET_ME })
        cache.writeQuery({
          query: GET_ME,
          data: { savedBooks: [...savedBooks] }
        });
      } catch (e) {
        console.log(e);
      }

    }
  });
  const user = meData?.me;
  const userDataLength = userData?.savedBooks?.length;
  
  useEffect(() => {
    const getUserData = async user => {
      const token = Auth.loggedIn() ? Auth.getToken() : null;

      if (!token) {
        return false;
      }
      try {
        const userData = await user;
        setUserData(userData);
      } catch (e) {
        console.log(e)
      }
    };
    getUserData(user);
  }, [user, userDataLength, loading]);

  if (loading) {
    return <h2>LOADING...</h2>;
  }

  // use this to determine if `useEffect()` hook needs to run again

  
  const removeBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;
    
    if (!token) {
      return false;
    }

    try {
      const updatedUser = await deleteBook({
        variables: { bookId: bookId }
      });
      setUserData(updatedUser)
      removeBookId(bookId);
    } catch(e) {
      console.log(e)
    }
  };

  return (
    <>
      <Jumbotron fluid className='text-light bg-dark'>
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </Jumbotron>
      <Container>
        <h2>
          {userData?.savedBooks?.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        <CardColumns>
          {userData?.savedBooks?.map((book) => {
            return (
              <Card key={book.bookId} border='dark'>
                {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                <Card.Body>
                  <Card.Title>{book.title}</Card.Title>
                  <p className='small'>Authors: {book.authors}</p>
                  <Card.Text>{book.description}</Card.Text>
                  <Button className='btn-block btn-danger' onClick={() => removeBook(book.bookId)}>
                    Delete this Book!
                  </Button>
                </Card.Body>
              </Card>
            );
          })}
        </CardColumns>
      </Container>
    </>
  );
};

export default SavedBooks;
