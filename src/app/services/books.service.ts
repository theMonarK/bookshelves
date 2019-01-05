import { Injectable } from '@angular/core';
import {Book} from '../models/Book.model';
import {Subject} from 'rxjs';
import * as firebase from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class BooksService {

  books: Book[] = [];
  bookSubject = new Subject<Book[]>();

  constructor() { }

  emitBooks() {
    this.bookSubject.next(this.books);
  }

  saveBooks() {
    firebase.database().ref('/books').set(this.books);
  }

  getBooks() {
    firebase.database().ref('/books')
      .on('value', (data) => {
        if (data) {
          this.books = data.val();
        } else {
          this.books = [];
        }
        this.emitBooks();
      });
  }

  getSingleBook(id: number) {
    return new Promise(
      ((resolve, reject) => {
        firebase.database().ref('books/' + id).once('value').then(
          (data) => {
            resolve(data.val());
          }, (error) => {
            reject(error);
          }
        );
      })
    );
  }

  createNewBook(book: Book) {
    this.books.push(book);
    this.saveBooks();
    this.emitBooks();
  }

  removeBook(book: Book) {
    const bookIndex = this.books.findIndex(
      (bookElement) => {
        if (bookElement === book) {
          return true;
        }
      }
    );
    this.books.splice(bookIndex, 1);
    this.saveBooks();
    this.emitBooks();
  }
}
