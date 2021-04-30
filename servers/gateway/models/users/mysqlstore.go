package users

import (
	"database/sql"
	"fmt"
	"os"
)

type SQLStore struct {
	db *sql.DB
}

func NewSQLStore(DB *sql.DB) *SQLStore {
	return &SQLStore{db: DB}
}

func GetByID(id int64) (*User, error) {
	q := "select * from users where id = ?"
	rows, err := db.Query(q, id)
	defer rows.Close()
	if err != nil {
		return nil, err
	}
	var newUser User
	for res.Next() {
		res.Scan(&newUser.ID, &newUser.Email, &newUser.UserName, &newUser.PassHash, &newUser.FirstName, &newUser.LastName, &newUser.PhotoURL)
	}
	return &newUser, err
}

func GetByEmail(email string) (*User, error) {
	q := "select * from users where email = ?"
	rows, err := db.Query(q, email)
	if err != nil {
		return nil, err
	}
	var newUser User
	for res.Next() {
		res.Scan(&newUser.ID, &newUser.Email, &newUser.UserName, &newUser.PassHash, &newUser.FirstName, &newUser.LastName, &newUser.PhotoURL)
	}
	return &newUesr, err
}

func GetByUserName(username string) (*User, error) {
	q := "select * from users where username=?"
	res, err := db.Query(q, username)
	if err != nil {
		return nil, err
	}
	var newUser User
	for res.Next() {
		res.Scan(&newUser.ID, &newUser.Email, &newUser.UserName, &newUser.PassHash, &newUser.FirstName, &newUser.LastName, &newUser.PhotoURL)
	}
	return &newUser, err
}

func Insert(user *User) (*User, error) {
	q := "insert into users(Email, UserName, PassHash, FirstName, LastName, PhotoURL) values (?,?,?,?,?,?)"
	res, err := db.Exec(q, user.ID, user.Email, user.UserName, user.PassHash, user.FirstName, user.LastName, user.PhotoURL)
	if err != nil {
		fmt.Printf("error inserting new row: %v\n", err)
		return nil, err
	}
	//get the auto-assigned ID for the new row
	id, err2 := res.LastInsertId()
	if err2 != nil {
		fmt.Printf("error getting new ID: %v\n", id)
		return nil, err2
	}
	return GetByID(id)
}

func Update(id int64, updates *Updates) (*User, error) {
	q := "update users set FirstName = ?, LastName = ? where id = ?"
	_, err := db.Exec(q, updates.FirstName, updates.LastName, id)
	if err != nil {
		return nil, errors.New("error updating user")
	}
	return return GetByID(id)
}

func Delete(id int64) error {
	q := "delete from users where id = ?"
	_, err := db.Exec(q, id)
	if err != nil {
		return errors.New("unable to delete user")
	}
	return nil
}