package users

import (
	"database/sql"
)

type SQLStore struct {
	db *sql.DB
}

func (sq *SQLStore) GetByID(id int64) (*User, error) {
	q := "select * from Users where id=?"
	res, err := sq.db.Query(q, id)
	if err != nil {
		return nil, err
	}
	var newUser User
	for res.Next() {
		res.Scan(&newUser.ID, &newUser.Email, &newUser.PassHash, &newUser.UserName, &newUser.FirstName, &newUser.LastName, &newUser.PhotoURL)
	}
	return &newUser, err
}

func (sq *SQLStore) GetByEmail(email string) (*User, error) {
	q := "select * from Users where email=?"
	res, err := sq.db.Query(q, email)
	if err != nil {
		return nil, err
	}
	var newUser User
	for res.Next() {
		res.Scan(&newUser.ID, &newUser.Email, &newUser.PassHash, &newUser.UserName, &newUser.FirstName, &newUser.LastName, &newUser.PhotoURL)
	}
	return &newUser, err
}

func (sq *SQLStore) GetByUserName(username string) (*User, error) {
	q := "select * from Users where username=?"
	res, err := sq.db.Query(q, username)
	if err != nil {
		return nil, err
	}
	var newUser User
	for res.Next() {
		res.Scan(&newUser.ID, &newUser.Email, &newUser.PassHash, &newUser.UserName, &newUser.FirstName, &newUser.LastName, &newUser.PhotoURL)
	}
	return &newUser, err
}

func (sq *SQLStore) Insert(user *User) (*User, error) {
	q := "insert into Users(Email, PassHash, UserName, FirstName, LastName, PhotoURL) values (?,?,?,?,?,?)"
	res, err := sq.db.Exec(q, user.Email, user.PassHash, user.UserName, user.FirstName, user.LastName, user.PhotoURL)
	if err != nil {
		return nil, err
	}

	id, err2 := res.LastInsertId()
	if err2 != nil {
		return nil, err2
	}
	return sq.GetByID(id)
}

func (sq *SQLStore) Update(id int64, updates *Updates) (*User, error) {
	q := "update Users set FirstName=?, LastName=? where id=?"
	_, err := sq.db.Exec(q, updates.FirstName, updates.LastName, id)
	if err != nil {
		return nil, err
	}
	return sq.GetByID(id)
}

func (sq *SQLStore) Delete(id int64) error {
	q := "delete from Users where id=?"
	_, err := sq.db.Exec(q, id)
	if err != nil {
		return err
	}
	return nil
}